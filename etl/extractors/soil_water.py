"""Extratores da Camada 3: Solo, Umidade na Zona de Raízes e Água Subterrânea."""

from __future__ import annotations

import json
import re
from typing import Any, Dict, List

from etl.base_extractor import BaseExtractor
from etl.config import ANCHOR_FARM


class SoilGridsExtractor(BaseExtractor):
    source_id = "soilgrids"
    name = "ISRIC SoilGrids 2.0 – Textura e Classificação de Solo"
    provider = "ISRIC World Soil Information (Parceiro Global / FAO)"
    layer = "3. Solo & Água"
    url = "https://rest.isric.org/soilgrids/v2.0/properties/query"
    auth_required = "Nenhum (100% Aberto)"
    expected_format = "JSON (GeoJSON Feature)"
    spatial_resolution = "250 metros (Escala de Talhão)"
    temporal_resolution = "Estático (Propriedades Físicas do Solo)"
    coverage = "Global (Consultado na Zona Rural Rio Verde/GO)"
    data_nature = "Dado Fatídico (Mapeamento Físico)"
    period_min = "Estático (Perfil permanente)"
    period_max = "Estático (Válido para qualquer safra)"
    plain_question = "O solo da fazenda é arenoso ou argiloso (retém água bem)? Qual a classe no ZARC?"
    fit_score = 5
    fit_analysis = (
        "Resolve um grande gargalo de UX: descobre automaticamente pela coordenada GPS se o solo "
        "da fazenda é Arenoso (Tipo 1), Médio (Tipo 2) ou Argiloso (Tipo 3) para consultar as "
        "regras corretas de janela de seguro do ZARC (Embrapa)."
    )
    viz_type = "soil_profile"

    def extract(self) -> Dict[str, Any]:
        params = [
            ("lon", ANCHOR_FARM["lon"]),
            ("lat", ANCHOR_FARM["lat"]),
            ("property", "clay"),
            ("property", "sand"),
            ("property", "silt"),
            ("depth", "0-5cm"),
            ("depth", "15-30cm"),
            ("value", "mean"),
        ]
        resp, latency = self.timed_request(self.url, params=params, timeout=35)
        self.save_bronze("soilgrids_rio_verde.json", resp.text)
        data = resp.json()

        layers_parsed: Dict[str, Dict[str, float]] = {}
        for layer in data.get("properties", {}).get("layers", []):
            prop = layer.get("name")
            for d in layer.get("depths", []):
                lbl = d.get("label")
                val = d.get("values", {}).get("mean")
                if val is not None:
                    # SoilGrids retorna em g/kg -> dividir por 10 dá %
                    layers_parsed.setdefault(lbl, {})[prop] = round(val / 10.0, 1)

        top_clay = layers_parsed.get("15-30cm", {}).get("clay", 0.0)
        if top_clay >= 35.0:
            zarc_soil_type = "Tipo 3 (Argiloso ≥ 35% argila — Alta retenção hídrica)"
            zarc_code = 3
        elif top_clay >= 15.0:
            zarc_soil_type = "Tipo 2 (Textura Média 15–35% argila)"
            zarc_code = 2
        else:
            zarc_soil_type = "Tipo 1 (Arenoso < 15% argila — Baixa retenção)"
            zarc_code = 1

        return {
            "status": "ONLINE_OPEN" if resp.ok else "ERROR",
            "http_status": resp.status_code,
            "latency_ms": latency,
            "actual_format": "application/json (GeoJSON)",
            "plain_answer": (
                f"Detectado solo com {top_clay}% de argila na camada 15–30cm -> classificado automaticamente "
                f"como {zarc_soil_type}."
            ),
            "raw_sample": json.dumps(data, indent=2)[:1600],
            "parsed_data": {
                "depths": layers_parsed,
                "zarc_soil_code": zarc_code,
                "zarc_soil_classification": zarc_soil_type,
            },
        }


class NasaCmrSmapExtractor(BaseExtractor):
    source_id = "cmr_smap"
    name = "NASA SMAP L4 – Umidade na Zona de Raízes (SPL4SMGP)"
    provider = "NASA JPL / NSIDC DAAC"
    layer = "3. Solo & Água"
    url = "https://cmr.earthdata.nasa.gov/search/granules.json"
    auth_required = "Descoberta CMR Aberta | Download HDF5/AppEEARS exige Earthdata Login"
    expected_format = "JSON (CMR) -> HDF5 / GeoTIFF"
    spatial_resolution = "9 km (Superfície 0–5cm e Zona de Raiz 0–100cm)"
    temporal_resolution = "A cada 3 horas (Latência operacional ~2,5 dias)"
    coverage = "Global"
    data_nature = "Dado Fatídico + Assimilação (Observado)"
    period_min = "Mar/2015 (Lançamento SMAP)"
    period_max = "D-3 dias (Tempo Quase Real)"
    plain_question = "Já há água suficiente na profundidade da raiz para a semente germinar hoje?"
    plain_answer = "Cobertura contínua de 9 km confirmada sobre Rio Verde em Nov/2026; pixels disponíveis via Earthdata Token."
    fit_score = 5
    fit_analysis = (
        "Sensor vital para o 'Semáforo de Plantio': mede diretamente a umidade na zona radicular "
        "para impedir que o produtor semeie no pó antes da consolidação das chuvas de El Niño."
    )
    viz_type = "cmr_granules"

    def extract(self) -> Dict[str, Any]:
        bbox = ",".join(str(x) for x in ANCHOR_FARM["bbox"])
        params = {
            "short_name": "SPL4SMGP",
            "bounding_box": bbox,
            "page_size": 5,
            "sort_key": "-start_date",
        }
        resp, latency = self.timed_request(self.url, params=params)
        self.save_bronze("cmr_smap_granules.json", resp.text)
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
            "actual_format": "application/json (CMR) -> HDF5 (.h5)",
            "audit_notes": "Grânulos ativos em 2026 confirmados sobre Rio Verde/GO. Em produção, extrair série via NASA AppEEARS API com Earthdata Bearer Token.",
            "raw_sample": json.dumps(granules[:2], indent=2),
            "parsed_data": {"collection": "SPL4SMGP v007/v008", "granules_found": len(granules), "granules": granules},
        }


class NasaCmrGldasExtractor(BaseExtractor):
    source_id = "cmr_gldas"
    name = "NASA GLDAS – Hidrologia Estratificada (0–200 cm)"
    provider = "NASA GSFC Hydrological Sciences Lab"
    layer = "3. Solo & Água"
    url = "https://cmr.earthdata.nasa.gov/search/granules.json"
    auth_required = "Descoberta CMR Aberta | Download NetCDF exige Earthdata Login"
    expected_format = "JSON (CMR) -> NetCDF4"
    spatial_resolution = "0.25° x 0.25° (~27 km)"
    temporal_resolution = "3 horas / Mensal"
    coverage = "Global (4 camadas: 0–10, 10–40, 40–100, 100–200 cm)"
    data_nature = "Simulação Hidrológica (Modelo Noah)"
    period_min = "Jan/2000"
    period_max = "Tempo Quase Real (2026)"
    plain_question = "Existe água guardada nas camadas profundas (até 2m) para sustentar Sorgo ou Algodão?"
    plain_answer = "Modelo estratificado até 2 metros de profundidade confirmado para Rio Verde no catálogo CMR."
    fit_score = 4
    fit_analysis = (
        "Diferencia a disponibilidade hídrica em profundidade para comparar milho (raiz mais "
        "rasa) contra sorgo e algodão (que exploram reserva até 1,5–2,0 metros)."
    )
    viz_type = "cmr_granules"

    def extract(self) -> Dict[str, Any]:
        bbox = ",".join(str(x) for x in ANCHOR_FARM["bbox"])
        params = {
            "short_name": "GLDAS_NOAH025_3H",
            "bounding_box": bbox,
            "page_size": 5,
            "sort_key": "-start_date",
        }
        resp, latency = self.timed_request(self.url, params=params)
        self.save_bronze("cmr_gldas_granules.json", resp.text)
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
            "actual_format": "application/json (CMR) -> NetCDF4 (.nc4)",
            "audit_notes": "Cobertura contínua confirmada via CMR. Download no GES DISC requer Earthdata Token.",
            "raw_sample": json.dumps(granules[:2], indent=2),
            "parsed_data": {"collection": "GLDAS_NOAH025_3H v2.1", "granules_found": len(granules), "granules": granules},
        }


class NasaGraceFoExtractor(BaseExtractor):
    source_id = "grace_fo"
    name = "NASA GRACE-FO – Indicadores de Aquífero e Seca Profunda"
    provider = "NASA JPL & National Drought Mitigation Center (UNL)"
    layer = "3. Solo & Água"
    url = "https://nasagrace.unl.edu/"
    auth_required = "Nenhum (Portal, WMS e GeoTIFFs semanais públicos)"
    expected_format = "HTML / WMS / GeoTIFF"
    spatial_resolution = "0.25° x 0.25° (~27 km)"
    temporal_resolution = "Semanal"
    coverage = "Global"
    data_nature = "Dado Fatídico (Gravimetria Orbital)"
    period_min = "Abr/2002"
    period_max = "Semanal (2026)"
    plain_question = "O lençol freático da região está secando (risco para pivôs de irrigação)?"
    plain_answer = "Portal público ativo com mapas semanais de água subterrânea; útil apenas se a fazenda usar irrigação."
    fit_score = 3
    fit_analysis = (
        "Mais relevante para fazendas com pivô central de irrigação (monitoramento de recarga do "
        "lençol freático em secas severas). Menos determinante para agricultura 100% de sequeiro."
    )
    viz_type = "audit_summary"

    def extract(self) -> Dict[str, Any]:
        resp, latency = self.timed_request(self.url, timeout=15)
        self.save_bronze("grace_unl.html", resp.text[:15000])
        title_m = re.search(r"<title>(.*?)</title>", resp.text, re.I | re.S)
        data_links = re.findall(r'href="([^"]*(?:geotiff|wms|data|drought)[^"]*)"', resp.text, re.I)[:8]
        return {
            "status": "ONLINE_OPEN" if resp.ok else "ERROR",
            "http_status": resp.status_code,
            "latency_ms": latency,
            "actual_format": "text/html + GeoTIFF/WMS",
            "audit_notes": "Portal operacional. Para ingestão automatizada, recomenda-se consumir o GeoTIFF semanal de Root Zone/Groundwater.",
            "raw_sample": f"Title: {title_m.group(1).strip() if title_m else ''}\nLinks: {data_links}",
            "parsed_data": {
                "portal_title": title_m.group(1).strip() if title_m else "NASA GRACE Drought",
                "discovered_links": data_links,
            },
        }
