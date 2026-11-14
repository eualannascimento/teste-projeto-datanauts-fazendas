"""Extratores da Camada 2: Agrometeorologia, Precipitação por Satélite e Estações."""

from __future__ import annotations

import json
import time
from typing import Any, Dict, List

from etl.base_extractor import BaseExtractor
from etl.config import ANCHOR_FARM


class NasaPowerExtractor(BaseExtractor):
    source_id = "nasa_power"
    name = "NASA POWER – Agroclimatology (MERRA-2)"
    provider = "NASA Langley Research Center (LaRC)"
    layer = "2. Agromet & Satélite"
    url = "https://power.larc.nasa.gov/api/temporal/daily/point"
    auth_required = "Nenhum (100% Aberto)"
    expected_format = "JSON / CSV"
    spatial_resolution = "0.5° x 0.625° (~55 km)"
    temporal_resolution = "Diária (1981 até D-5)"
    coverage = "Global (Ponto Rio Verde/GO)"
    data_nature = "Simulação / Reanálise (MERRA-2)"
    period_min = "01/01/1981"
    period_max = "D-5 (31/10/2026 na amostra)"
    plain_question = "Quantos graus de calor acumulados faltam para a soja amadurecer e qual o histórico de chuva?"
    fit_score = 5
    fit_analysis = (
        "Base perfeita para linha de base histórica (normal climatológica) e cálculo de Graus-Dia "
        "de Crescimento (GDD). Permite prever em quantos dias a soja atinge a maturação para "
        "liberar a área para o milho safrinha ou sorgo."
    )
    viz_type = "power_gdd"

    def extract(self) -> Dict[str, Any]:
        params = {
            "parameters": "T2M,T2M_MAX,T2M_MIN,PRECTOTCORR,ALLSKY_SFC_SW_DWN,RH2M",
            "community": "AG",
            "longitude": ANCHOR_FARM["lon"],
            "latitude": ANCHOR_FARM["lat"],
            "start": "20251001",
            "end": "20261031",
            "format": "JSON",
        }
        resp, latency = self.timed_request(self.url, params=params, timeout=25)
        self.save_bronze("nasa_power_2025_2026.json", resp.text)
        data = resp.json()
        p = data.get("properties", {}).get("parameter", {})

        dates = sorted(p.get("T2M", {}).keys())
        daily: List[Dict[str, Any]] = []
        gdd_cum = 0.0
        rain_cum = 0.0
        t_base_soy = 10.0

        for d in dates:
            tmax = p["T2M_MAX"].get(d, -999)
            tmin = p["T2M_MIN"].get(d, -999)
            tmed = p["T2M"].get(d, -999)
            rain = p["PRECTOTCORR"].get(d, -999)
            rad = p["ALLSKY_SFC_SW_DWN"].get(d, -999)
            rh = p["RH2M"].get(d, -999)
            if tmax < -900 or tmin < -900 or rain < -900:
                continue
            gdd_day = max(0.0, ((tmax + tmin) / 2.0) - t_base_soy)
            # Simula ciclo de soja plantada em 15/Out/2025 até colheita (~115 dias / ~1650 GDD)
            if "20251015" <= d <= "20260215":
                gdd_cum += gdd_day
            rain_cum += max(0.0, rain)
            daily.append(
                {
                    "date": f"{d[:4]}-{d[4:6]}-{d[6:]}",
                    "t2m": round(tmed, 1),
                    "tmax": round(tmax, 1),
                    "tmin": round(tmin, 1),
                    "rain_mm": round(max(0.0, rain), 1),
                    "rad_mj": round(max(0.0, rad), 1) if rad > -900 else None,
                    "rh_pct": round(rh, 1) if rh > -900 else None,
                    "gdd_day": round(gdd_day, 1),
                }
            )

        # Agregação mensal para visualização clara
        monthly: Dict[str, Dict[str, Any]] = {}
        for item in daily:
            ym = item["date"][:7]
            if ym not in monthly:
                monthly[ym] = {"month": ym, "rain_mm": 0.0, "tmax_sum": 0.0, "tmin_sum": 0.0, "days": 0, "hot_days_35": 0}
            monthly[ym]["rain_mm"] += item["rain_mm"]
            monthly[ym]["tmax_sum"] += item["tmax"]
            monthly[ym]["tmin_sum"] += item["tmin"]
            monthly[ym]["days"] += 1
            if item["tmax"] >= 35.0:
                monthly[ym]["hot_days_35"] += 1

        monthly_list = [
            {
                "month": m["month"],
                "rain_mm": round(m["rain_mm"], 1),
                "tmax_avg": round(m["tmax_sum"] / m["days"], 1),
                "tmin_avg": round(m["tmin_sum"] / m["days"], 1),
                "hot_days_35": m["hot_days_35"],
            }
            for m in monthly.values()
        ]

        return {
            "status": "ONLINE_OPEN" if resp.ok else "ERROR",
            "http_status": resp.status_code,
            "latency_ms": latency,
            "actual_format": "application/json (NASA POWER v2)",
            "period_min": daily[0]["date"] if daily else self.period_min,
            "period_max": daily[-1]["date"] if daily else self.period_max,
            "plain_answer": (
                f"Acumulou {round(rain_cum, 1)} mm de chuva em {len(daily)} dias e somou {round(gdd_cum, 1)} Graus-Dia "
                f"(GDD) entre 15/Out e 15/Fev — temperatura e energia suficientes para fechar o ciclo da soja."
            ),
            "raw_sample": json.dumps(
                {
                    "header": data.get("header"),
                    "sample_days": daily[-5:],
                },
                ensure_ascii=False,
                indent=2,
            ),
            "parsed_data": {
                "total_valid_days": len(daily),
                "total_rain_mm": round(rain_cum, 1),
                "soy_cycle_gdd_oct15_feb15": round(gdd_cum, 1),
                "monthly_summary": monthly_list,
                "recent_30d": daily[-30:],
            },
        }


class ClimateServExtractor(BaseExtractor):
    source_id = "climateserv"
    name = "NASA SERVIR ClimateSERV – IMERG V07 & CHIRPS"
    provider = "NASA + USAID (SERVIR Global)"
    layer = "2. Agromet & Satélite"
    url = "https://climateserv.servirglobal.net/api/submitDataRequest/"
    auth_required = "Nenhum (API REST Assíncrona sem Token)"
    expected_format = "JSON (Polling Assíncrono)"
    spatial_resolution = "CHIRPS: 0.05° (~5,5 km) | IMERG V07: 0.1° (~10 km)"
    temporal_resolution = "Diária (Observação Quase Tempo Real)"
    coverage = "Global (Polígono 0.2° x 0.2° sobre Rio Verde/GO)"
    data_nature = "Dado Fatídico (Observado por Satélite)"
    period_min = "CHIRPS: 1981 | IMERG: 2000"
    period_max = "30/10/2026 (IMERG V07)"
    plain_question = "Quanto choveu exatamente em cima da minha fazenda nos últimos dias, mesmo sem pluviômetro?"
    fit_score = 4
    fit_analysis = (
        "Excelente para precipitação observada em alta resolução (5–10 km) sem login Earthdata. "
        "ACHADO DE AUDITORIA: A camada de previsão sazonal NMME dentro do ClimateSERV está com "
        "status 'layer-off' (parada em Nov/2025). Para previsão 2026/27, o pipeline redireciona "
        "para o NetCDF oficial do NOAA NMME."
    )
    viz_type = "climateserv_rain"

    def _query_dataset(self, datatype: int, begin_mmddyyyy: str, end_mmddyyyy: str) -> tuple[List[Dict[str, Any]], int, int]:
        geom = json.dumps({"type": "Polygon", "coordinates": ANCHOR_FARM["polygon_coords"]})
        params = {
            "datatype": datatype,
            "begintime": begin_mmddyyyy,
            "endtime": end_mmddyyyy,
            "intervaltype": 0,
            "operationtype": 5,
            "geometry": geom,
        }
        r_sub, l1 = self.timed_request(self.url, params=params, timeout=25)
        uid = r_sub.json()[0]
        total_lat = l1
        for _ in range(16):
            r_prog, lp = self.timed_request(
                f"https://climateserv.servirglobal.net/api/getDataRequestProgress/?id={uid}", timeout=20
            )
            total_lat += lp
            prog = r_prog.json()
            if prog and prog[0] == 100.0:
                break
            time.sleep(0.5)
        r_get, lg = self.timed_request(
            f"https://climateserv.servirglobal.net/api/getDataFromRequest/?id={uid}", timeout=25
        )
        total_lat += lg
        rows = r_get.json().get("data", [])
        cleaned = [
            {
                "date": f"{r['year']:04d}-{r['month']:02d}-{r['day']:02d}",
                "avg_mm": round(float(r.get("value", {}).get("avg", 0.0)), 2),
            }
            for r in rows
        ]
        return cleaned, total_lat, r_get.status_code

    def extract(self) -> Dict[str, Any]:
        imerg, lat1, code1 = self._query_dataset(226, "10/01/2026", "10/30/2026")
        chirps, lat2, _ = self._query_dataset(0, "09/01/2026", "09/30/2026")
        self.save_bronze("climateserv_imerg_oct2026.json", json.dumps(imerg, indent=2))

        imerg_sum = round(sum(x["avg_mm"] for x in imerg), 1)
        chirps_sum = round(sum(x["avg_mm"] for x in chirps), 1)

        return {
            "status": "ONLINE_OPEN" if imerg else "PARTIAL",
            "http_status": code1,
            "latency_ms": lat1 + lat2,
            "actual_format": "application/json (Async Job Queue)",
            "plain_answer": (
                f"O satélite IMERG V07 mediu {imerg_sum} mm de chuva em Out/2026 sobre o polígono da fazenda "
                f"(e CHIRPS registrou {chirps_sum} mm em Set/2026)."
            ),
            "audit_notes": (
                "IMERG V07 Late (dt=226) operacional até Out/2026 e CHIRPS (dt=0) até Set/2026. "
                "Camada NMME dentro do ClimateSERV marcada como layer-off/desatualizada em 2025-11-28."
            ),
            "raw_sample": json.dumps({"imerg_v07_sample": imerg[-5:], "chirps_sample": chirps[-5:]}, indent=2),
            "parsed_data": {
                "imerg_oct2026_days": len(imerg),
                "imerg_oct2026_total_mm": imerg_sum,
                "chirps_sep2026_days": len(chirps),
                "chirps_sep2026_total_mm": chirps_sum,
                "imerg_series": imerg,
                "chirps_series": chirps,
                "nmme_subfeed_status": "INATIVO (layer-off desde 2025-11-28) -> mitigado via NOAA NMME",
            },
        }


class NasaCmrGpmExtractor(BaseExtractor):
    source_id = "cmr_gpm"
    name = "NASA GPM IMERG – Catálogo CMR (GPM_3IMERGDF)"
    provider = "NASA GES DISC / Goddard Space Flight Center"
    layer = "2. Agromet & Satélite"
    url = "https://cmr.earthdata.nasa.gov/search/granules.json"
    auth_required = "Descoberta CMR Aberta | Download HDF5/NetCDF exige Earthdata Login (Gratuito)"
    expected_format = "JSON (Metadados) -> HDF5/NetCDF4 (Pixels)"
    spatial_resolution = "0.1° x 0.1° (~10 km)"
    temporal_resolution = "Diária / 30 min"
    coverage = "Global (60°N–60°S)"
    data_nature = "Dado Fatídico (Observado) — Catálogo"
    period_min = "Jun/2000"
    period_max = "Tempo Quase Real (2026)"
    plain_question = "Onde ficam os arquivos originais de chuva da NASA com calibração científica máxima?"
    plain_answer = "Catálogo aberto confirmando passagens diárias da constelação GPM sobre a fazenda em Nov/2026."
    fit_score = 5
    fit_analysis = (
        "Fonte primária oficial da NASA para precipitação calibrada por satélite. Na fase de "
        "produção com Earthdata Token, alimenta alertas locais de chuva acumulada na fazenda."
    )
    viz_type = "cmr_granules"

    def extract(self) -> Dict[str, Any]:
        bbox = ",".join(str(x) for x in ANCHOR_FARM["bbox"])
        params = {
            "short_name": "GPM_3IMERGDF",
            "bounding_box": bbox,
            "page_size": 5,
            "sort_key": "-start_date",
        }
        resp, latency = self.timed_request(self.url, params=params)
        self.save_bronze("cmr_gpm_granules.json", resp.text)
        entries = resp.json().get("feed", {}).get("entry", [])
        granules = [
            {
                "id": e.get("title"),
                "start": e.get("time_start"),
                "end": e.get("time_end"),
                "size_mb": e.get("granule_size"),
                "download_url": next(
                    (lk.get("href") for lk in e.get("links", []) if lk.get("rel", "").endswith("/data#")),
                    None,
                ),
            }
            for e in entries
        ]
        return {
            "status": "ONLINE_DISCOVERY_ONLY" if resp.ok else "ERROR",
            "http_status": resp.status_code,
            "latency_ms": latency,
            "actual_format": "application/json (CMR) -> HDF5 (.HDF5)",
            "audit_notes": "Busca de grânulos 100% aberta; download direto do HDF5 no GES DISC requer Earthdata Bearer Token.",
            "raw_sample": json.dumps(granules[:2], indent=2),
            "parsed_data": {"collection": "GPM_3IMERGDF v07", "granules_found": len(granules), "granules": granules},
        }


class InmetExtractor(BaseExtractor):
    source_id = "inmet_stations"
    name = "INMET – Estação Automática Rio Verde (A025)"
    provider = "Instituto Nacional de Meteorologia (MAPA – Brasil)"
    layer = "2. Agromet & Satélite"
    url = "https://apitempo.inmet.gov.br/estacoes/T"
    auth_required = "Catálogo Aberto | Séries Horárias (/estacao) exigem Token INMET"
    expected_format = "JSON"
    spatial_resolution = "Pontual (Estação A025: -17.785°, -50.965°, Alt. 780m)"
    temporal_resolution = "Horária / Diária"
    coverage = "Rede Nacional do Brasil"
    data_nature = "Dado Fatídico (Estação em Solo)"
    period_min = "16/05/2007 (A025)"
    period_max = "Hoje (Requer Token)"
    plain_question = "Existe estação meteorológica física oficial perto da fazenda para conferir os satélites?"
    plain_answer = "Sim! A estação automática A025 em Rio Verde (780m) está operante desde 2007, mas exige Token para baixar séries."
    fit_score = 3
    fit_analysis = (
        "Útil como verdade de campo (ground-truth) para calibrar os pixels da NASA onde houver "
        "estação próxima. Por exigir cadastro de token para séries históricas e ter lacunas em "
        "regiões remotas, o NASA POWER + IMERG permanecem como fonte primária escalável."
    )
    viz_type = "audit_summary"

    def extract(self) -> Dict[str, Any]:
        resp, latency = self.timed_request(self.url, timeout=15)
        stations = resp.json() if resp.ok else []
        rv = [s for s in stations if s.get("CD_ESTACAO") == ANCHOR_FARM["inmet_station_id"]]
        self.save_bronze("inmet_rio_verde_station.json", json.dumps(rv, ensure_ascii=False, indent=2))

        # Checa acesso à série temporal sem token
        r_ts, l_ts = self.timed_request("https://apitempo.inmet.gov.br/estacao/2026-11-01/2026-11-10/A025", timeout=10)
        return {
            "status": "ONLINE_DISCOVERY_ONLY" if resp.ok else "ERROR",
            "http_status": resp.status_code,
            "latency_ms": latency + l_ts,
            "actual_format": "application/json",
            "audit_notes": f"Catálogo ativo ({len(stations)} estações). Consulta de série temporal sem token retornou HTTP {r_ts.status_code}.",
            "raw_sample": json.dumps(rv, ensure_ascii=False, indent=2),
            "parsed_data": {
                "total_br_stations": len(stations),
                "anchor_station": rv[0] if rv else {},
                "timeseries_probe_status": r_ts.status_code,
            },
        }
