"""Extrator dos anos análogos de El Niño Forte (1997/98, 2015/16, 2023/24) e referência neutra via NASA POWER."""

import json
import os
from typing import Dict, Any, List
import requests

from etl.config import ANCHOR_FARM, SILVER_DIR


ANALOG_SEASONS = [
    {
        "id": "el_nino_1997_98",
        "label": "El Niño 1997/98 (Muito Forte)",
        "start": "19971001",
        "end": "19980715",
        "oni_peak": 2.40,
        "type": "analog",
    },
    {
        "id": "el_nino_2015_16",
        "label": "El Niño 2015/16 (Muito Forte)",
        "start": "20151001",
        "end": "20160715",
        "oni_peak": 2.64,
        "type": "analog",
    },
    {
        "id": "el_nino_2023_24",
        "label": "El Niño 2023/24 (Forte)",
        "start": "20231001",
        "end": "20240715",
        "oni_peak": 1.95,
        "type": "analog",
    },
    {
        "id": "neutro_2022_23",
        "label": "Safra Referência 2022/23 (Recorde IBGE)",
        "start": "20221001",
        "end": "20230715",
        "oni_peak": -0.95,
        "type": "reference",
    },
]


def _clean(val: float, default: float = 0.0) -> float:
    return default if val is None or val <= -900 else round(float(val), 2)


def fetch_rotare_analogs() -> Dict[str, Any]:
    """Busca séries diárias reais da NASA POWER (1997/98, 2015/16, 2023/24, 2022/23) para o backtest Rotare."""
    lat = ANCHOR_FARM["lat"]
    lon = ANCHOR_FARM["lon"]
    url = "https://power.larc.nasa.gov/api/temporal/daily/point"
    seasons_out: List[Dict[str, Any]] = []

    for season in ANALOG_SEASONS:
        params = {
            "parameters": "PRECTOTCORR,T2M_MAX,T2M_MIN,ALLSKY_SFC_SW_DWN",
            "community": "AG",
            "latitude": lat,
            "longitude": lon,
            "start": season["start"],
            "end": season["end"],
            "format": "JSON",
        }
        resp = requests.get(url, params=params, timeout=30)
        resp.raise_for_status()
        p = resp.json()["properties"]["parameter"]
        dates = sorted(p["PRECTOTCORR"].keys())

        # Formato compacto [MM-DD, rain_mm, tmax_c, tmin_c, rad_mj] para manter bundle leve e rápido
        daily = []
        ond_rain = 0.0
        safrinha_rain = 0.0
        ond_hot = 0
        safrinha_hot = 0
        frost_days = 0

        for d in dates:
            rain = _clean(p["PRECTOTCORR"].get(d), 0.0)
            tmax = _clean(p["T2M_MAX"].get(d), 30.0)
            tmin = _clean(p["T2M_MIN"].get(d), 18.0)
            rad = _clean(p["ALLSKY_SFC_SW_DWN"].get(d), 18.0)
            mm = d[4:6]
            mm_dd = f"{d[4:6]}-{d[6:8]}"
            daily.append([mm_dd, rain, tmax, tmin, rad])

            if mm in ("10", "11", "12"):
                ond_rain += rain
                if tmax >= 35.0:
                    ond_hot += 1
            if mm in ("02", "03", "04", "05", "06"):
                safrinha_rain += rain
                if tmax >= 34.0:
                    safrinha_hot += 1
            if mm in ("05", "06", "07") and tmin <= 4.0:
                frost_days += 1

        seasons_out.append(
            {
                "id": season["id"],
                "label": season["label"],
                "type": season["type"],
                "oni_peak": season["oni_peak"],
                "period": f"{season['start'][:4]}/{season['end'][2:4]}",
                "summary": {
                    "ond_rain_mm": round(ond_rain, 1),
                    "safrinha_rain_mm": round(safrinha_rain, 1),
                    "ond_hot_days_35c": ond_hot,
                    "safrinha_hot_days_34c": safrinha_hot,
                    "frost_days_4c": frost_days,
                },
                "daily": daily,
            }
        )

    payload = {
        "source": "NASA POWER MERRA-2 Daily (100% Open)",
        "lat": lat,
        "lon": lon,
        "seasons": seasons_out,
    }
    os.makedirs(SILVER_DIR, exist_ok=True)
    with open(os.path.join(SILVER_DIR, "rotare_analogs.json"), "w", encoding="utf-8") as fh:
        json.dump(payload, fh, ensure_ascii=False)
    return payload
