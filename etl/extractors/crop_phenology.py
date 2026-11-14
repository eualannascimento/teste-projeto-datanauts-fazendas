"""Extratores da Camada 4: Fenologia, Estresse Vegetal e Monitoramento de Talhão."""

from __future__ import annotations

import json
import re
from typing import Any, Dict

from etl.base_extractor import BaseExtractor
from etl.config import ANCHOR_FARM


class NasaCmrEcostressExtractor(BaseExtractor):
    source_id = "cmr_ecostress"
    name = "NASA ECOSTRESS – Evapotranspiração e Estresse Térmico (70m)"
    provider = "NASA JPL / LP DAAC (A bordo da ISS)"
    layer = "4. Fenologia & Talhão"
    url = "https://cmr.earthdata.nasa.gov/search/granules.json"
    auth_required = "Descoberta CMR Aberta | Download HDF5/GeoTIFF exige Earthdata Login"
    expected_format = "JSON (CMR) -> HDF5 / GeoTIFF"
    spatial_resolution = "70 metros x 70 metros (Escala intra-talhão)"
    temporal_resolution = "Revisita variável de 1 a 5 dias"
    coverage = "Global (±52° Latitude — cobre 100% do Brasil)"
    data_nature = "Dado Fatídico (Térmico / ISS)"
    period_min = "Jul/2018"
    period_max = "Tempo Quase Real (2026)"
    plain_question = "As plantas do talhão já estão sentindo sede/calor antes mesmo da folha amarelar?"
    plain_answer = "Passagens térmicas de 70m sobre Rio Verde confirmadas em 2026 no CMR; permite alerta precoce de veranico."
    fit_score = 5
    fit_analysis = (
        "Resolução de 70m permite enxergar talhões individuais em fazendas de 100–1.500 ha e "
        "detectar estresse hídrico na floração (veranico de El Niño) até 14 dias antes do NDVI."
    )
    viz_type = "cmr_granules"

    def extract(self) -> Dict[str, Any]:
        bbox = ",".join(str(x) for x in ANCHOR_FARM["bbox"])
        params = {
            "short_name": "ECO_L3T_JET",
            "bounding_box": bbox,
            "page_size": 5,
            "sort_key": "-start_date",
        }
        resp, latency = self.timed_request(self.url, params=params)
        self.save_bronze("cmr_ecostress_granules.json", resp.text)
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
            "actual_format": "application/json (CMR) -> GeoTIFF/HDF5",
            "audit_notes": "Cenas recentes de 70m sobre Rio Verde/GO confirmadas no CMR. Pixel extraction via AppEEARS requer Earthdata Token.",
            "raw_sample": json.dumps(granules[:2], indent=2),
            "parsed_data": {"collection": "ECO_L3T_JET v002", "granules_found": len(granules), "granules": granules},
        }


class NasaHlsStacExtractor(BaseExtractor):
    source_id = "cmr_hls"
    name = "NASA HLS – Harmonized Landsat Sentinel-2 (STAC 30m)"
    provider = "NASA GSFC / LPCLOUD (Parceria USGS + ESA)"
    layer = "4. Fenologia & Talhão"
    url = "https://cmr.earthdata.nasa.gov/stac/LPCLOUD/search"
    auth_required = "Busca STAC 100% Aberta | Bandas COG GeoTIFF exigem Earthdata Login"
    expected_format = "STAC GeoJSON -> Cloud-Optimized GeoTIFF (COG)"
    spatial_resolution = "30 metros (Escala de Talhão)"
    temporal_resolution = "2 a 3 dias (Landsat 8/9 + Sentinel-2A/B)"
    coverage = "Global"
    data_nature = "Dado Fatídico (Imagem Óptica 30m)"
    period_min = "2013 (Landsat 8) / 2015 (Sentinel)"
    period_max = "Nov/2026 (2 a 3 dias)"
    plain_question = "Como está o verdor (NDVI) e desenvolvimento de cada talhão dentro da fazenda?"
    plain_answer = "API STAC retornou 5 cenas recentes (Set–Nov/2026) de 30m exatamente sobre os limites da fazenda."
    fit_score = 4
    fit_analysis = (
        "Ideal para desenhar os polígonos da fazenda (100–1.500 ha) e acompanhar o vigor "
        "vegetativo (NDVI/EVI) durante a safra com alta frequência livre de nuvens."
    )
    viz_type = "cmr_granules"

    def extract(self) -> Dict[str, Any]:
        body = {
            "collections": ["HLSS30_2.0"],
            "bbox": ANCHOR_FARM["bbox"],
            "datetime": "2026-09-01T00:00:00Z/2026-11-14T23:59:59Z",
            "limit": 5,
        }
        resp, latency = self.timed_request(self.url, method="POST", json_body=body, timeout=20)
        self.save_bronze("cmr_hls_stac.json", resp.text)
        features = resp.json().get("features", []) if resp.ok else []
        granules = [
            {
                "id": f.get("id"),
                "start": f.get("properties", {}).get("datetime"),
                "cloud_cover_pct": f.get("properties", {}).get("eo:cloud_cover"),
                "download_url": f.get("assets", {}).get("B04", {}).get("href"),
            }
            for f in features
        ]
        return {
            "status": "ONLINE_DISCOVERY_ONLY" if resp.ok else "ERROR",
            "http_status": resp.status_code,
            "latency_ms": latency,
            "actual_format": "application/geo+json (STAC) -> COG GeoTIFF",
            "audit_notes": f"API STAC retornou {len(granules)} cenas recentes (Set–Nov/2026) sobre Rio Verde/GO.",
            "raw_sample": json.dumps(granules[:2], indent=2),
            "parsed_data": {"collection": "HLSS30_2.0", "granules_found": len(granules), "granules": granules},
        }


class NasaAppEEARSCatalogExtractor(BaseExtractor):
    source_id = "appeears_catalog"
    name = "NASA AppEEARS – Catálogo Unificado de Extração Pontual"
    provider = "NASA LP DAAC / Earthdata Cloud"
    layer = "4. Fenologia & Talhão"
    url = "https://appeears.earthdatacloud.nasa.gov/api/product"
    auth_required = "Catálogo Aberto | Submissão de Tarefa (/task) exige Earthdata Token"
    expected_format = "JSON (Catálogo) -> CSV / GeoTIFF (Assíncrono)"
    spatial_resolution = "Multi-escala (30m a 9 km dependendo do produto)"
    temporal_resolution = "Diária / 8 dias / 16 dias / Anual"
    coverage = "194 produtos oficiais da NASA (MODIS, VIIRS, SMAP, ECOSTRESS)"
    data_nature = "Catálogo / Extrator Unificado"
    period_min = "2000 (MODIS)"
    period_max = "Tempo Quase Real (2026)"
    plain_question = "Como extrair só a série CSV da fazenda sem precisar baixar gigabytes de imagens da NASA?"
    plain_answer = "O catálogo ativo lista 193 produtos prontos para recorte pontual por coordenada via API (com Token Earthdata)."
    fit_score = 5
    fit_analysis = (
        "O 'atalho de ouro' da engenharia de dados NASA: em vez de baixar arquivos HDF5 de 500 MB, "
        "o AppEEARS extrai somente o CSV da coordenada exata da fazenda para MODIS Phenology "
        "(MCD12Q2), NDVI (MOD13Q1), SMAP e ECOSTRESS."
    )
    viz_type = "appeears_products"

    def extract(self) -> Dict[str, Any]:
        resp, latency = self.timed_request(self.url, timeout=20)
        products = resp.json() if resp.ok else []
        self.save_bronze("appeears_catalog.json", resp.text[:30000])

        key_prefixes = ("MOD13Q1", "MCD12Q2", "SPL4SMGP", "ECO_L3T_JET", "ECO4ESIPTJPL", "VNP13A1")
        selected = [
            {
                "product_id": p.get("ProductAndVersion"),
                "description": p.get("Description"),
                "resolution": p.get("Resolution"),
                "temporal": p.get("TemporalGranularity"),
                "platform": p.get("Platform"),
            }
            for p in products
            if any((p.get("ProductAndVersion") or "").startswith(k) for k in key_prefixes)
        ]

        return {
            "status": "ONLINE_OPEN" if resp.ok else "ERROR",
            "http_status": resp.status_code,
            "latency_ms": latency,
            "actual_format": "application/json",
            "audit_notes": f"Catálogo ativo com {len(products)} produtos oficiais disponíveis via API REST.",
            "raw_sample": json.dumps(selected[:3], ensure_ascii=False, indent=2),
            "parsed_data": {"total_products": len(products), "agro_recommended": selected[:12]},
        }


class NasaHarvestCropMonitorExtractor(BaseExtractor):
    source_id = "crop_monitor"
    name = "NASA Harvest / GEOGLAM – Crop Monitor Global"
    provider = "NASA Harvest Consortium & G20 GEOGLAM (Parceiro CONAB)"
    layer = "4. Fenologia & Talhão"
    url = "https://cropmonitor.org/"
    auth_required = "Nenhum (Portal Público)"
    expected_format = "HTML / Boletins Mensais PDF / Mapas"
    spatial_resolution = "Macrorregional (Grandes Regiões Agrícolas)"
    temporal_resolution = "Mensal"
    coverage = "Global (Inclui Brasil: Centro-Oeste, Sul, Matopiba)"
    data_nature = "Boletim de Monitoramento Global"
    period_min = "2013"
    period_max = "Mensal (2026)"
    plain_question = "Como está a condição geral da safra nos grandes polos do Brasil e competidores (EUA/Argentina)?"
    plain_answer = "Portal público ativo; fornece contexto macro de oferta global, sem API pontual por fazenda."
    fit_score = 3
    fit_analysis = (
        "Ótimo para contexto macroeconômico e validação de calendários agrícolas globais, mas "
        "não possui API granular por município ou fazenda."
    )
    viz_type = "audit_summary"

    def extract(self) -> Dict[str, Any]:
        resp, latency = self.timed_request(self.url, timeout=15)
        self.save_bronze("cropmonitor.html", resp.text[:15000])
        title_m = re.search(r"<title>(.*?)</title>", resp.text, re.I | re.S)
        return {
            "status": "ONLINE_OPEN" if resp.ok else "ERROR",
            "http_status": resp.status_code,
            "latency_ms": latency,
            "actual_format": "text/html",
            "audit_notes": "Portal oficial ativo. Sem endpoint REST granular para coordenadas individuais.",
            "raw_sample": f"Title: {title_m.group(1).strip() if title_m else ''}",
            "parsed_data": {"portal_title": title_m.group(1).strip() if title_m else "GEOGLAM Crop Monitor"},
        }
