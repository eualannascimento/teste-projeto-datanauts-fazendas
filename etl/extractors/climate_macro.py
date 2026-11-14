"""Extratores da Camada 1: Macro-Clima, El Niño (ENSO) e Previsão Sazonal."""

from __future__ import annotations

import html
import re
import xml.etree.ElementTree as ET
from typing import Any, Dict, List

import netCDF4
import numpy as np

from etl.base_extractor import BaseExtractor
from etl.config import ANCHOR_FARM

MONTH_ABBR = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"]


def _season_from_months_since_1960(m: float) -> str:
    total_months = int(round(m))
    year = 1960 + total_months // 12
    month_idx = total_months % 12  # 0=Jan..11=Dez (centro do trimestre)
    m_prev = MONTH_ABBR[(month_idx - 1) % 12][0]
    m_curr = MONTH_ABBR[month_idx][0]
    m_next = MONTH_ABBR[(month_idx + 1) % 12][0]
    return f"{m_prev}{m_curr}{m_next} {year}"


class NoaaOniExtractor(BaseExtractor):
    source_id = "noaa_oni"
    name = "NOAA CPC – Oceanic Niño Index (ONI)"
    provider = "NOAA Climate Prediction Center (Parceiro NASA)"
    layer = "1. Macro-Clima & Sazonal"
    url = "https://www.cpc.ncep.noaa.gov/data/indices/oni.ascii.txt"
    auth_required = "Nenhum (100% Aberto)"
    expected_format = "ASCII Text (Tabular)"
    spatial_resolution = "Região Niño 3.4 (5°N–5°S, 120°–170°W)"
    temporal_resolution = "Trimestral Móvel (1950–2026)"
    coverage = "Pacífico Equatorial (Global Teleconnection)"
    data_nature = "Dado Fatídico (Observado)"
    period_min = "Jan-Fev-Mar 1950"
    period_max = "Ago-Set-Out 2026 (Atualizado)"
    plain_question = "O fenômeno El Niño está ativo hoje e qual é a sua força?"
    fit_score = 5
    fit_analysis = (
        "Essencial como gatilho macro do motor: identifica oficialmente fases de El Niño "
        "(ONI ≥ +0.5°C) e La Niña (ONI ≤ -0.5°C), permitindo selecionar anos análogos históricos "
        "como 2015/16 e 2023/24."
    )
    viz_type = "oni_timeline"

    def extract(self) -> Dict[str, Any]:
        resp, latency = self.timed_request(self.url)
        self.save_bronze("noaa_oni.txt", resp.text)
        lines = [ln.strip() for ln in resp.text.splitlines() if ln.strip()]
        records: List[Dict[str, Any]] = []
        for ln in lines[1:]:
            parts = ln.split()
            if len(parts) >= 4:
                seas, yr, total, anom = parts[0], int(parts[1]), float(parts[2]), float(parts[3])
                records.append(
                    {
                        "season": seas,
                        "year": yr,
                        "label": f"{seas} {yr}",
                        "total_sst": total,
                        "anomaly": anom,
                    }
                )

        recent = records[-36:]  # últimos 3 anos (36 trimestres móveis)
        latest = recent[-1] if recent else {}
        anom_val = latest.get("anomaly", 0.0)
        if anom_val >= 1.5:
            phase = "El Niño Forte"
        elif anom_val >= 0.5:
            phase = "El Niño"
        elif anom_val <= -1.5:
            phase = "La Niña Forte"
        elif anom_val <= -0.5:
            phase = "La Niña"
        else:
            phase = "Neutro"

        # Complementa com o boletim oficial mensal ENSO Diagnostic Discussion (100% aberto)
        advisory_url = "https://www.cpc.ncep.noaa.gov/products/analysis_monitoring/enso_advisory/ensodisc.shtml"
        alert_status = ""
        discussion_date = ""
        synopsis = ""
        forecast_prob_pct = None
        try:
            adv_resp, _ = self.timed_request(advisory_url, timeout=15)
            if adv_resp.ok:
                self.save_bronze("noaa_ensodisc.html", adv_resp.text)
                clean_txt = html.unescape(re.sub(r"<[^>]+>", " ", adv_resp.text))
                clean_txt = re.sub(r"\s+", " ", clean_txt)
                m_status = re.search(r"ENSO Alert System Status:\s*(.+?)(?=\s*Synopsis:|\s*The recent)", clean_txt, re.I)
                m_date = re.search(r"issued by.*?\s+(\d{1,2}\s+[A-Za-z]+\s+\d{4})", clean_txt, re.I)
                m_syn = re.search(r"Synopsis:\s*(.+?\.)(?=\s|$)", clean_txt, re.I)
                if m_status:
                    alert_status = m_status.group(1).strip(" .")
                if m_date:
                    discussion_date = m_date.group(1).strip()
                if m_syn:
                    synopsis = m_syn.group(1).strip()
                    m_pct = re.search(r"(\d{2,3})%\s*chance", synopsis, re.I)
                    if m_pct:
                        forecast_prob_pct = int(m_pct.group(1))
        except Exception:
            pass

        adv_note = f" Boletim CPC ({discussion_date or 'atual'}): {alert_status}." if alert_status else ""
        if forecast_prob_pct is not None:
            adv_note += f" Probabilidade oficial citada: >{forecast_prob_pct}%."

        return {
            "status": "ONLINE_OPEN" if resp.ok else "ERROR",
            "http_status": resp.status_code,
            "latency_ms": latency,
            "actual_format": "text/plain (ONI ASCII) + text/html (Boletim CPC)",
            "period_min": records[0]["label"] if records else self.period_min,
            "period_max": latest.get("label", self.period_max),
            "plain_answer": (
                f"Estamos em fase '{phase}' com anomalia de {anom_val:+.2f}°C no Pacífico ({latest.get('label', '')}), "
                f"sinalizando alerta máximo de atraso ou irregularidade de chuvas no Centro-Oeste.{adv_note}"
            ),
            "raw_sample": "\n".join(lines[:4] + ["..."] + lines[-6:]),
            "parsed_data": {
                "latest": latest,
                "current_phase": phase,
                "total_records": len(records),
                "series_36m": recent,
                "alert_status": alert_status or f"{phase} Monitoring",
                "discussion_date": discussion_date,
                "forecast_synopsis": synopsis,
                "forecast_prob_pct": forecast_prob_pct,
                "advisory_url": advisory_url,
            },
        }


class NmmeSeasonalExtractor(BaseExtractor):
    source_id = "nmme_seasonal"
    name = "NMME – Previsão Sazonal Probabilística (NASA GEOS + NOAA)"
    provider = "Consórcio NMME (NASA GMAO, NOAA CPC, NCAR, IRI)"
    layer = "1. Macro-Clima & Sazonal"
    url = "https://ftp.cpc.ncep.noaa.gov/NMME/prob/netcdf/"
    auth_required = "Nenhum (100% Aberto via HTTPS/FTP)"
    expected_format = "NetCDF4 / NetCDF3 (Matricial)"
    spatial_resolution = "1.0° x 1.0° (~110 km) — célula sobre Rio Verde/GO"
    temporal_resolution = "Trimestres sazonais até 7 meses à frente"
    coverage = "Global (Recorte extraído para -17.79°, -50.92°)"
    data_nature = "Previsão (Forecasting)"
    period_min = "OND 2026 (Início da previsão)"
    period_max = "AMJ 2027 (+7 meses à frente)"
    plain_question = "Vai faltar chuva ou fazer mais calor na fazenda durante a próxima safra e safrinha?"
    fit_score = 5
    fit_analysis = (
        "Ouro para antecipação do próximo ano: entrega a probabilidade multi-modelo (incluindo "
        "o NASA GEOS-S2S) de chuva e temperatura ficarem abaixo, normal ou acima da média nos "
        "próximos 7 trimestres."
    )
    viz_type = "nmme_terciles"

    def _extract_nc_point(self, content: bytes, filename: str) -> List[Dict[str, Any]]:
        self.save_bronze(filename, content)
        ds = netCDF4.Dataset(filename, memory=content)
        try:
            lons = np.asarray(ds.variables["lon"][:])
            lats = np.asarray(ds.variables["lat"][:])
            targets = np.asarray(ds.variables["target"][:])

            target_lon = ANCHOR_FARM["lon"] % 360.0  # -50.92 -> 309.08
            lon_idx = int(np.argmin(np.abs(lons - target_lon)))
            lat_idx = int(np.argmin(np.abs(lats - ANCHOR_FARM["lat"])))

            p_above = ds.variables["prob_above"][:, lat_idx, lon_idx]
            p_norm = ds.variables["prob_norm"][:, lat_idx, lon_idx]
            p_below = ds.variables["prob_below"][:, lat_idx, lon_idx]

            out = []
            for i, t in enumerate(targets):
                ab = float(p_above[i]) if not np.ma.is_masked(p_above[i]) else None
                nm = float(p_norm[i]) if not np.ma.is_masked(p_norm[i]) else None
                bl = float(p_below[i]) if not np.ma.is_masked(p_below[i]) else None
                to_pct = lambda v: round(v * 100.0 if v <= 1.0 else v, 1) if v is not None else None
                out.append(
                    {
                        "season": _season_from_months_since_1960(float(t)),
                        "grid_lat": float(lats[lat_idx]),
                        "grid_lon": float(lons[lon_idx]) - 360.0 if lons[lon_idx] > 180 else float(lons[lon_idx]),
                        "prob_below": to_pct(bl),
                        "prob_norm": to_pct(nm),
                        "prob_above": to_pct(ab),
                    }
                )
            return out
        finally:
            ds.close()

    def extract(self) -> Dict[str, Any]:
        # Descobre o arquivo mais recente dinamicamente no índice HTTP
        idx_resp, lat_idx = self.timed_request(self.url)
        prate_files = sorted(re.findall(r'href="(prate\.\d{6}\.prob\.seas\.nc)"', idx_resp.text))
        tmp_files = sorted(re.findall(r'href="(tmp2m\.\d{6}\.prob\.seas\.nc)"', idx_resp.text))

        prate_file = prate_files[-1] if prate_files else "prate.202611.prob.seas.nc"
        tmp_file = tmp_files[-1] if tmp_files else "tmp2m.202611.prob.seas.nc"

        r_pr, lat_pr = self.timed_request(self.url + prate_file, timeout=30)
        r_tm, lat_tm = self.timed_request(self.url + tmp_file, timeout=30)

        precip_fcst = self._extract_nc_point(r_pr.content, prate_file) if r_pr.ok else []
        temp_fcst = self._extract_nc_point(r_tm.content, tmp_file) if r_tm.ok else []

        p0 = precip_fcst[0] if precip_fcst else {}
        t0 = temp_fcst[0] if temp_fcst else {}
        return {
            "status": "ONLINE_OPEN" if (r_pr.ok and r_tm.ok) else "PARTIAL",
            "http_status": r_pr.status_code,
            "latency_ms": lat_idx + lat_pr + lat_tm,
            "actual_format": "NetCDF (application/x-netcdf)",
            "period_min": precip_fcst[0]["season"] if precip_fcst else self.period_min,
            "period_max": precip_fcst[-1]["season"] if precip_fcst else self.period_max,
            "plain_answer": (
                f"Para Rio Verde/GO ({p0.get('season', '')}), o consenso multi-modelo aponta "
                f"{p0.get('prob_below', '—')}% de chance de chuva abaixo da média e {t0.get('prob_above', '—')}% "
                f"de calor acima da média."
            ),
            "audit_notes": f"Arquivos sazonais mais recentes detectados: {prate_file} e {tmp_file} ({len(r_pr.content)//1024} KB cada).",
            "raw_sample": (
                f"NetCDF Variables: ['lon', 'lat', 'target', 'initial_time', 'prob_above', 'prob_norm', 'prob_below']\n"
                f"Arquivo Precipitação: {prate_file}\n"
                f"Arquivo Temperatura: {tmp_file}\n"
                f"Célula extraída para Rio Verde/GO: {precip_fcst[0] if precip_fcst else {}}"
            ),
            "parsed_data": {
                "prate_file": prate_file,
                "tmp2m_file": tmp_file,
                "precipitation_terciles": precip_fcst,
                "temperature_terciles": temp_fcst,
            },
        }


class NasaGmaoExtractor(BaseExtractor):
    source_id = "nasa_gmao"
    name = "NASA GMAO – GEOS-S2S (Portal & OPeNDAP)"
    provider = "NASA Global Modeling and Assimilation Office"
    layer = "1. Macro-Clima & Sazonal"
    url = "https://gmao.gsfc.nasa.gov/weather_prediction/"
    auth_required = "Nenhum (Portal e OPeNDAP públicos)"
    expected_format = "HTML / OPeNDAP GrADS"
    spatial_resolution = "0.5° x 0.5° (~50 km)"
    temporal_resolution = "Mensal / Sub-sazonal (1 a 9 meses)"
    coverage = "Global (Modelo acoplado oceano-atmosfera da NASA)"
    data_nature = "Previsão (Forecasting)"
    period_min = "Mês Atual (Inicialização)"
    period_max = "Horizonte de +9 meses"
    plain_question = "Qual é o motor físico da NASA por trás das previsões globais do El Niño?"
    plain_answer = (
        "É o supermodelo climático da NASA que simula oceanos e atmosfera. Na prática, seus "
        "resultados já são entregues mastigados dentro do consórcio NMME acima."
    )
    fit_score = 4
    fit_analysis = (
        "Modelo físico oficial da NASA por trás das previsões de El Niño. O acesso direto bruto "
        "via OPeNDAP exige clientes GrADS/xarray pesados; na prática de engenharia, consumir o "
        "GEOS consolidado dentro do NMME (NetCDF acima) reduz latência e complexidade em 90%."
    )
    viz_type = "audit_summary"

    def extract(self) -> Dict[str, Any]:
        r_portal, l1 = self.timed_request(self.url)
        r_odap, l2 = self.timed_request("https://opendap.nccs.nasa.gov/dods/")
        datasets = re.findall(r'href="([^"]+)"', r_odap.text) if r_odap.ok else []
        geos_dirs = [d for d in datasets if "geos" in d.lower() or "gmao" in d.lower()][:12]
        self.save_bronze("nasa_gmao_opendap.html", r_odap.text[:15000])

        return {
            "status": "ONLINE_OPEN" if (r_portal.ok and r_odap.ok) else "PARTIAL",
            "http_status": r_portal.status_code,
            "latency_ms": l1 + l2,
            "actual_format": "text/html + OPeNDAP Directory",
            "audit_notes": "Portal GMAO e servidor OPeNDAP NCCS respondendo normalmente. Recomendado consumo via ensemble NMME.",
            "raw_sample": f"OPeNDAP NCCS Status: {r_odap.status_code}\nDiretórios detectados: {geos_dirs}",
            "parsed_data": {
                "portal_status": r_portal.status_code,
                "opendap_status": r_odap.status_code,
                "opendap_url": "https://opendap.nccs.nasa.gov/dods/",
                "sample_collections": geos_dirs,
            },
        }


class CptecInpeExtractor(BaseExtractor):
    source_id = "cptec_inpe"
    name = "CPTEC/INPE – Previsão Regional Oficial (Brasil)"
    provider = "INPE / MCTI (Brasil)"
    layer = "1. Macro-Clima & Sazonal"
    url = f"http://servicos.cptec.inpe.br/XML/cidade/7dias/{ANCHOR_FARM['cptec_city_id']}/previsao.xml"
    auth_required = "Nenhum (100% Aberto)"
    expected_format = "XML (ISO-8859-1)"
    spatial_resolution = f"Municipal (Rio Verde/GO – ID {ANCHOR_FARM['cptec_city_id']})"
    temporal_resolution = "Diária (Horizonte de 7 dias)"
    coverage = "Território Nacional Brasileiro"
    data_nature = "Previsão (Forecasting)"
    period_min = "Hoje (D+1)"
    period_max = "D+7 dias"
    plain_question = "Vai chover nesta semana ou posso entrar com trator e pulverizador no campo?"
    fit_score = 4
    fit_analysis = (
        "Complemento tático de curto prazo: não prevê o próximo ano, mas orienta a janela "
        "operacional imediata da semana (entrada de plantadeira, pulverização e colheitadeira)."
    )
    viz_type = "weather_7d"

    def extract(self) -> Dict[str, Any]:
        resp, latency = self.timed_request(self.url)
        text = resp.content.decode("iso-8859-1", errors="replace")
        self.save_bronze("cptec_rio_verde.xml", text)
        root = ET.fromstring(text)
        days = []
        for prev in root.findall("previsao"):
            days.append(
                {
                    "date": prev.findtext("dia"),
                    "condition": prev.findtext("tempo"),
                    "min_c": int(prev.findtext("minima") or 0),
                    "max_c": int(prev.findtext("maxima") or 0),
                    "uv": float(prev.findtext("iuv") or 0),
                }
            )
        return {
            "status": "ONLINE_OPEN" if resp.ok else "ERROR",
            "http_status": resp.status_code,
            "latency_ms": latency,
            "actual_format": "text/xml (ISO-8859-1)",
            "period_min": days[0]["date"] if days else self.period_min,
            "period_max": days[-1]["date"] if days else self.period_max,
            "plain_answer": (
                f"Previsão oficial para os próximos {len(days)} dias em {root.findtext('nome')}/{root.findtext('uf')}: "
                f"ajuda a decidir o dia exato da operação de campo nesta semana."
            ),
            "raw_sample": text[:1200],
            "parsed_data": {
                "city": root.findtext("nome"),
                "uf": root.findtext("uf"),
                "updated": root.findtext("atualizacao"),
                "forecast": days,
            },
        }
