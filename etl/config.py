"""Configurações do cenário âncora e constantes compartilhadas do pipeline ETL."""

from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = ROOT_DIR / "data"
BRONZE_DIR = DATA_DIR / "bronze"
SILVER_DIR = DATA_DIR / "silver"
GOLD_DIR = DATA_DIR / "gold"

ANCHOR_FARM = {
    "name": "Fazenda Piloto Rio Verde – Zona Rural (Cenário Âncora)",
    "municipality": "Rio Verde",
    "uf": "GO",
    "ibge_code": "5218805",
    "lat": -17.84,
    "lon": -51.02,
    "area_ha": 500,
    "cptec_city_id": "4420",
    "inmet_station_id": "A025",
    "bbox": [-51.12, -17.94, -50.92, -17.74],
    "polygon_coords": [[[-51.12, -17.94], [-50.92, -17.94], [-50.92, -17.74], [-51.12, -17.74], [-51.12, -17.94]]],
}

DEFAULT_HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
        "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    ),
    "Accept": "application/json,text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
}
