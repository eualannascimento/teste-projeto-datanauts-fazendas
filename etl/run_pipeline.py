"""Orquestrador principal do pipeline ETL (Bronze -> Silver -> Gold)."""

from __future__ import annotations

import json
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List

# Garante importação relativa a partir da raiz do projeto
ROOT = Path(__file__).resolve().parent.parent
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from etl.config import ANCHOR_FARM, GOLD_DIR
from etl.extractors.agromet_sat import (
    ClimateServExtractor,
    InmetExtractor,
    NasaCmrGpmExtractor,
    NasaPowerExtractor,
)
from etl.extractors.brazil_local import (
    BcbSicorExtractor,
    ConabCustosExtractor,
    IbgeSidraExtractor,
    MarketCommoditiesExtractor,
    ZarcMapaExtractor,
)
from etl.extractors.climate_macro import (
    CptecInpeExtractor,
    NasaGmaoExtractor,
    NmmeSeasonalExtractor,
    NoaaOniExtractor,
)
from etl.extractors.crop_phenology import (
    NasaAppEEARSCatalogExtractor,
    NasaCmrEcostressExtractor,
    NasaHarvestCropMonitorExtractor,
    NasaHlsStacExtractor,
)
from etl.extractors.soil_water import (
    NasaCmrGldasExtractor,
    NasaCmrSmapExtractor,
    NasaGraceFoExtractor,
    SoilGridsExtractor,
)


def build_decision_synthesis(records_by_id: Dict[str, Dict[str, Any]]) -> Dict[str, Any]:
    """Cruza os dados Silver para gerar a matriz de decisão econômica da Fazenda Piloto (500 ha)."""
    area_ha = ANCHOR_FARM["area_ha"]

    oni_data = records_by_id.get("noaa_oni", {}).get("parsed_data", {})
    nmme_data = records_by_id.get("nmme_seasonal", {}).get("parsed_data", {})
    soil_data = records_by_id.get("soilgrids", {}).get("parsed_data", {})
    conab_crops = records_by_id.get("conab_custos", {}).get("parsed_data", {}).get("crops", [])
    mkt = records_by_id.get("market_commodities", {}).get("parsed_data", {})
    zarc_crops = records_by_id.get("zarc_mapa", {}).get("parsed_data", {}).get("crops", [])

    def find_conab(name: str) -> Dict[str, Any]:
        return next((c for c in conab_crops if c.get("crop") == name), {})

    c_soja = find_conab("Soja")
    c_milho = find_conab("Milho 2ª Safra")
    c_sorgo = find_conab("Sorgo")

    p_soja = mkt.get("soy_brl_sc_rio_verde_est", 120.0)
    p_milho = mkt.get("corn_brl_sc_rio_verde_est", 58.0)
    p_sorgo = mkt.get("sorghum_brl_sc_rio_verde_est", 46.0)

    y_soja = c_soja.get("yield_sc_ha") or 65.0
    y_milho = c_milho.get("yield_sc_ha") or 100.0
    y_sorgo = c_sorgo.get("yield_sc_ha") or 60.0

    cost_soja = c_soja.get("custo_operacional_ha") or 5151.64
    cost_milho = c_milho.get("custo_operacional_ha") or 5889.09
    cost_sorgo = c_sorgo.get("custo_operacional_ha") or 3806.76

    # Cenário A: Soja Normal + Milho 2ª Safra com estresse de El Niño (-25% produtividade esperada por corte de chuva)
    rev_a_ha = (y_soja * p_soja) + (y_milho * 0.75 * p_milho)
    cost_a_ha = cost_soja + cost_milho
    margin_a_ha = rev_a_ha - cost_a_ha

    # Cenário B: Soja Precoce (-3% teto produtivo) + Sorgo 2ª Safra (tolerante à seca: 95% do teto)
    rev_b_ha = (y_soja * 0.97 * p_soja) + (y_sorgo * 0.95 * p_sorgo)
    cost_b_ha = cost_soja + cost_sorgo
    margin_b_ha = rev_b_ha - cost_b_ha

    # Cenário C: Soja Cheia + Planta de Cobertura (Braquiária/Crotalária R$ 450/ha)
    rev_c_ha = y_soja * p_soja
    cost_c_ha = cost_soja + 450.0
    margin_c_ha = rev_c_ha - cost_c_ha

    # Pega primeiro trimestre safrinha do NMME (ex: MAM ou FMA)
    nmme_prate = nmme_data.get("precipitation_terciles", [])
    safrinha_fcst = nmme_prate[3] if len(nmme_prate) > 3 else (nmme_prate[0] if nmme_prate else {})

    return {
        "anchor_farm": ANCHOR_FARM,
        "enso_status": {
            "phase": oni_data.get("current_phase", "Indisponível"),
            "oni_anomaly": oni_data.get("latest", {}).get("anomaly"),
            "oni_season": oni_data.get("latest", {}).get("label"),
        },
        "nmme_safrinha_outlook": safrinha_fcst,
        "soil_auto_zarc": soil_data.get("zarc_soil_classification", "Indisponível"),
        "zarc_windows_summary": [
            {
                "crop": z["crop"],
                "open_decendios": z["open_decendios_count"],
                "first_dec": z["first_open_dec"],
                "last_dec": z["last_open_dec"],
            }
            for z in zarc_crops
        ],
        "prices_used_rio_verde_brl_sc": {
            "soja": p_soja,
            "milho": p_milho,
            "sorgo": p_sorgo,
        },
        "scenarios_500ha": [
            {
                "id": "A",
                "title": "Cenário A: Soja Normal + Arriscar Milho 2ª Safra",
                "risk_level": "ALTO RISCO (Quebra / Fora ZARC se atrasar)",
                "revenue_ha": round(rev_a_ha, 2),
                "cost_ha": round(cost_a_ha, 2),
                "margin_ha": round(margin_a_ha, 2),
                "total_margin_farm": round(margin_a_ha * area_ha, 2),
                "custeio_exposure_farm": round((c_soja.get("custeio_ha", 3354) + c_milho.get("custeio_ha", 3804)) * area_ha, 2),
            },
            {
                "id": "B",
                "title": "Cenário B: Soja Precoce + Sorgo Granífero 2ª Safra (Pivot)",
                "risk_level": "RISCO CONTROLADO (Tolerante à seca + Janela ZARC maior)",
                "revenue_ha": round(rev_b_ha, 2),
                "cost_ha": round(cost_b_ha, 2),
                "margin_ha": round(margin_b_ha, 2),
                "total_margin_farm": round(margin_b_ha * area_ha, 2),
                "custeio_exposure_farm": round((c_soja.get("custeio_ha", 3354) + c_sorgo.get("custeio_ha", 2259)) * area_ha, 2),
            },
            {
                "id": "C",
                "title": "Cenário C: Soja Safra Única + Cobertura de Solo (Braquiária)",
                "risk_level": "BAIXO RISCO (Preservação de capital e umidade)",
                "revenue_ha": round(rev_c_ha, 2),
                "cost_ha": round(cost_c_ha, 2),
                "margin_ha": round(margin_c_ha, 2),
                "total_margin_farm": round(margin_c_ha * area_ha, 2),
                "custeio_exposure_farm": round((c_soja.get("custeio_ha", 3354) + 450.0) * area_ha, 2),
            },
        ],
    }


def main() -> None:
    extractors = [
        # 1. Macro-Clima & Sazonal
        NoaaOniExtractor(),
        NmmeSeasonalExtractor(),
        NasaGmaoExtractor(),
        CptecInpeExtractor(),
        # 2. Agromet & Satélite
        NasaPowerExtractor(),
        ClimateServExtractor(),
        NasaCmrGpmExtractor(),
        InmetExtractor(),
        # 3. Solo & Água
        SoilGridsExtractor(),
        NasaCmrSmapExtractor(),
        NasaCmrGldasExtractor(),
        NasaGraceFoExtractor(),
        # 4. Fenologia & Talhão
        NasaCmrEcostressExtractor(),
        NasaHlsStacExtractor(),
        NasaAppEEARSCatalogExtractor(),
        NasaHarvestCropMonitorExtractor(),
        # 5. Regulação & Mercado BR
        ZarcMapaExtractor(),
        IbgeSidraExtractor(),
        ConabCustosExtractor(),
        BcbSicorExtractor(),
        MarketCommoditiesExtractor(),
    ]

    print(f"Iniciando Pipeline ETL para {ANCHOR_FARM['name']} ({len(extractors)} fontes)...\n")
    records: List[Dict[str, Any]] = []
    for ext in extractors:
        print(f"  -> [{ext.layer}] {ext.name} ... ", end="", flush=True)
        rec = ext.run()
        records.append(rec)
        print(f"{rec['status']} | HTTP {rec['http_status']} | {rec['latency_ms']}ms | Fit {rec['fit_score']}/5")

    records_by_id = {r["id"]: r for r in records}
    synthesis = build_decision_synthesis(records_by_id)

    GOLD_DIR.mkdir(parents=True, exist_ok=True)
    generated_at = datetime.now(timezone.utc).isoformat()

    summary = {
        "total_sources": len(records),
        "online_open": sum(1 for r in records if r["status"] == "ONLINE_OPEN"),
        "online_discovery_only": sum(1 for r in records if r["status"] == "ONLINE_DISCOVERY_ONLY"),
        "partial_or_error": sum(1 for r in records if r["status"] not in ("ONLINE_OPEN", "ONLINE_DISCOVERY_ONLY")),
        "avg_latency_ms": int(sum(r["latency_ms"] for r in records) / max(1, len(records))),
    }

    bundle = {
        "generated_at": generated_at,
        "anchor_farm": ANCHOR_FARM,
        "summary": summary,
        "decision_synthesis": synthesis,
        "sources": records,
    }

    audit_path = GOLD_DIR / "audit_report.json"
    bundle_json_path = GOLD_DIR / "dashboard_bundle.json"
    bundle_js_path = GOLD_DIR / "dashboard_bundle.js"

    audit_only = {
        "generated_at": generated_at,
        "anchor_farm": ANCHOR_FARM,
        "summary": summary,
        "audit": [
            {k: r[k] for k in ("id", "name", "provider", "layer", "status", "http_status", "latency_ms", "auth_required", "actual_format", "spatial_resolution", "temporal_resolution", "fit_score", "fit_analysis", "audit_notes", "error")}
            for r in records
        ],
    }

    audit_path.write_text(json.dumps(audit_only, ensure_ascii=False, indent=2), encoding="utf-8")
    bundle_json_text = json.dumps(bundle, ensure_ascii=False, indent=2)
    bundle_json_path.write_text(bundle_json_text, encoding="utf-8")
    bundle_js_text = f"window.AGROPULSE_BUNDLE = {bundle_json_text};\n"
    bundle_js_path.write_text(bundle_js_text, encoding="utf-8")
    (ROOT / "frontend" / "bundle.js").write_text(bundle_js_text, encoding="utf-8")

    print("\nPipeline concluído!")
    print(f"  Resumo: {summary}")
    print(f"  Gold Bundle: {bundle_json_path}")


if __name__ == "__main__":
    main()
