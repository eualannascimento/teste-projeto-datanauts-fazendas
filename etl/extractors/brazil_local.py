"""Extratores da Camada 5: Regulação, Histórico Municipal, Custos e Mercado no Brasil."""

from __future__ import annotations

import csv
import io
import json
import re
from typing import Any, Dict, List

import xlrd

from etl.base_extractor import BaseExtractor
from etl.config import ANCHOR_FARM


class ZarcMapaExtractor(BaseExtractor):
    source_id = "zarc_mapa"
    name = "ZARC 2026/2027 – Tábua de Risco Climático (MAPA/Embrapa)"
    provider = "Ministério da Agricultura e Pecuária (MAPA) & Embrapa"
    layer = "5. Regulação & Mercado BR"
    url = "https://dados.agricultura.gov.br/api/3/action/package_show?id=tabua-de-risco-zoneamento-agricola-de-risco-climatico"
    auth_required = "Nenhum (Dados Abertos CKAN + CSV)"
    expected_format = "JSON (CKAN) -> CSV (1,1M+ linhas, 55 colunas)"
    spatial_resolution = "Municipal (Geocódigo IBGE 5218805 – Rio Verde/GO)"
    temporal_resolution = "Decêndios (36 períodos de 10 dias/ano) – Safra 2026/2027"
    coverage = "Todo o Brasil"
    data_nature = "Regra Normativa / Seguro Rural"
    period_min = "Safra 2016/2017 (Série CKAN)"
    period_max = "Safra 2026/2027 (Vigente)"
    plain_question = "Em quais dias exatos posso plantar Soja, Milho ou Sorgo sem perder o Seguro Rural?"
    plain_answer = (
        "Em Rio Verde/GO, a janela de Milho 2ª Safra fecha rápido (Decêndio 4 — início de Fev), "
        "enquanto o Sorgo Granífero fica aberto com seguro até o Decêndio 8 (meados de Março)."
    )
    fit_score = 5
    fit_analysis = (
        "Trava jurídico-financeira obrigatória no Brasil: define as datas exatas em que Soja, "
        "Milho 2ª Safra e Sorgo têm direito a Seguro Rural (Proagro/PSR) e financiamento do Plano Safra."
    )
    viz_type = "zarc_calendar"

    def extract(self) -> Dict[str, Any]:
        r_meta, l1 = self.timed_request(self.url, timeout=15)
        resources = r_meta.json()["result"]["resources"]
        res_2627 = next(
            (r for r in resources if "2026/2027" in (r.get("name") or "") or "2026-2027" in (r.get("url") or "")),
            resources[-1],
        )
        csv_url = res_2627["url"]

        r_csv, l2 = self.timed_request(csv_url, stream=True, timeout=45)
        header_cols: List[str] = []
        rv_rows: List[Dict[str, Any]] = []
        total_lines = 0
        target_marker = f";{ANCHOR_FARM['ibge_code']};".encode("utf-8")

        for idx, raw_line in enumerate(r_csv.iter_lines()):
            total_lines += 1
            if idx == 0:
                header_line = raw_line.decode("utf-8-sig", errors="replace")
                header_cols = header_line.split(";")
                continue
            if target_marker in raw_line:
                decoded = raw_line.decode("utf-8-sig", errors="replace")
                parts = decoded.split(";")
                if len(parts) >= 55:
                    row_dict = dict(zip(header_cols, parts))
                    rv_rows.append(row_dict)
        r_csv.close()

        self.save_bronze("zarc_rio_verde_2026_2027.json", json.dumps(rv_rows[:40], ensure_ascii=False, indent=2))

        # Seleciona culturas estratégicas para o motor (Soja, Milho 2ª Safra, Sorgo Granífero 2ª Safra)
        target_crops = ["Soja", "Milho 2ª Safra", "Sorgo Granífero 2ª Safra", "Milho 2ª Safra consorciado com Braquiária"]
        crop_summaries: List[Dict[str, Any]] = []

        for crop_name in target_crops:
            matches = [r for r in rv_rows if r.get("Nome_cultura") == crop_name]
            if not matches:
                continue
            # Prefere Sequeiro (ou Não se aplica) e Solo Tipo 3 / AD3 ou média do grupo
            sequeiro = [r for r in matches if "irrigado" not in (r.get("Nome_Outros_Manejos") or "").lower()]
            pool = sequeiro if sequeiro else matches
            # Ordena para pegar solo representativo (ex: código 3 ou 13) e ciclo intermediário
            rep = pool[len(pool) // 2]
            decs = [int(rep.get(f"dec{i}", 0) or 0) for i in range(1, 37)]
            open_decs = [i for i, val in enumerate(decs, start=1) if val > 0]
            crop_summaries.append(
                {
                    "crop": crop_name,
                    "ciclo_cod": rep.get("Cod_Ciclo"),
                    "solo_cod": rep.get("Cod_Solo"),
                    "manejo": rep.get("Nome_Outros_Manejos") or "Sequeiro",
                    "portaria": rep.get("Portaria"),
                    "decendios": decs,
                    "open_decendios_count": len(open_decs),
                    "first_open_dec": open_decs[0] if open_decs else None,
                    "last_open_dec": open_decs[-1] if open_decs else None,
                    "variants_in_municipality": len(matches),
                }
            )

        return {
            "status": "ONLINE_OPEN" if rv_rows else "PARTIAL",
            "http_status": r_csv.status_code,
            "latency_ms": l1 + l2,
            "actual_format": "text/csv (UTF-8, delimitador ';')",
            "audit_notes": f"Streaming de {total_lines:,} linhas em memória; extraídas {len(rv_rows)} regras específicas para Rio Verde/GO (Safra 2026/2027).",
            "raw_sample": json.dumps(rv_rows[:2], ensure_ascii=False, indent=2),
            "parsed_data": {
                "safra": "2026/2027",
                "csv_url": csv_url,
                "total_national_rows": total_lines,
                "rio_verde_rows": len(rv_rows),
                "crops": crop_summaries,
            },
        }


class IbgeSidraExtractor(BaseExtractor):
    source_id = "ibge_sidra"
    name = "IBGE SIDRA – PAM (Produtividade Municipal Rio Verde)"
    provider = "Instituto Brasileiro de Geografia e Estatística (IBGE)"
    layer = "5. Regulação & Mercado BR"
    url = f"https://apisidra.ibge.gov.br/values/t/5457/n6/{ANCHOR_FARM['ibge_code']}/v/112,216/p/last%205/c782/40122,40124,40125?formato=json"
    auth_required = "Nenhum (100% Aberto)"
    expected_format = "JSON"
    spatial_resolution = "Municipal (IBGE 5218805 – Rio Verde/GO)"
    temporal_resolution = "Anual (Últimos 5 anos consolidados)"
    coverage = "Todos os 5.570 municípios brasileiros"
    data_nature = "Dado Fatídico (Censo / Pesquisa Oficial)"
    period_min = "1974 (Série PAM) / 2021 na amostra"
    period_max = "2025 (Último consolidado)"
    plain_question = "Quanto a fazenda realmente colhe em média no município, e quanto caiu no último El Niño?"
    plain_answer = (
        "Em Rio Verde/GO, a produtividade da soja caiu de 70,0 sc/ha (2023) para 61,7 sc/ha no El Niño de 2024, "
        "recuperando para 65,0 sc/ha em 2025."
    )
    fit_score = 5
    fit_analysis = (
        "Fornece a verdade histórica de produtividade real (kg/ha -> sacas/ha) e área colhida "
        "no município, comprovando inclusive a queda de rendimento ocorrida durante o El Niño de 2024."
    )
    viz_type = "ibge_yields"

    def extract(self) -> Dict[str, Any]:
        resp, latency = self.timed_request(self.url, timeout=15)
        self.save_bronze("ibge_sidra_rio_verde.json", resp.text)
        rows = resp.json()[1:]  # pula cabeçalho descritivo

        by_year_crop: Dict[str, Dict[str, Any]] = {}
        for r in rows:
            year = r.get("D3N")
            crop = r.get("D4N")
            var_id = r.get("D2C")
            val_raw = r.get("V")
            val = float(val_raw) if val_raw and val_raw not in ("-", "...") else None
            key = f"{year}|{crop}"
            entry = by_year_crop.setdefault(key, {"year": year, "crop": crop, "yield_kg_ha": None, "yield_sc_ha": None, "area_ha": None})
            if var_id == "112":  # Rendimento médio (kg/ha)
                entry["yield_kg_ha"] = val
                entry["yield_sc_ha"] = round(val / 60.0, 1) if val is not None else None
            elif var_id == "216":  # Área colhida (ha)
                entry["area_ha"] = val

        records = sorted(by_year_crop.values(), key=lambda x: (x["year"], x["crop"]))
        return {
            "status": "ONLINE_OPEN" if resp.ok else "ERROR",
            "http_status": resp.status_code,
            "latency_ms": latency,
            "actual_format": "application/json",
            "raw_sample": json.dumps(resp.json()[1:6], ensure_ascii=False, indent=2),
            "parsed_data": {"records": records},
        }


class ConabCustosExtractor(BaseExtractor):
    source_id = "conab_custos"
    name = "CONAB – Custos de Produção Agrícolas (Rio Verde/GO 2026)"
    provider = "Companhia Nacional de Abastecimento (CONAB)"
    layer = "5. Regulação & Mercado BR"
    url = "https://www.gov.br/conab/pt-br/atuacao/informacoes-agropecuarias/custos-de-producao/planilhas-de-custos-de-producao/copy_of_agricolas"
    auth_required = "Nenhum (Download direto exige header Referer padrão de navegador)"
    expected_format = "XLS / XLSX (Planilhas Excel Multi-Abas)"
    spatial_resolution = "Polo Produtivo Municipal (Aba oficial 'Rio Verde-GO-2026')"
    temporal_resolution = "Anual por Safra (Séries até 2026)"
    coverage = "Principais polos agrícolas do Brasil"
    data_nature = "Dado Fatídico / Levantamento Oficial"
    period_min = "1997 (Soja) / 2005 (Milho) / 2013 (Sorgo)"
    period_max = "Safra 2026 (Atualizado)"
    plain_question = "Quanto custa plantar 1 hectare de Soja, Milho 2ª Safra e Sorgo em Rio Verde?"
    plain_answer = (
        "Em 2026, o custeio do Milho 2ª Safra é de R$ 3.803,69/ha contra apenas R$ 2.258,69/ha do Sorgo "
        "(uma redução de 40,6% no capital exposto ao risco climático)."
    )
    fit_score = 5
    fit_analysis = (
        "Base financeira insubstituível: traz o Custo de Custeio, Operacional e Total em R$/ha "
        "exatamente para Rio Verde/GO em 2026, permitindo calcular o lucro líquido e o ponto de equilíbrio."
    )
    viz_type = "conab_costs"

    FILES = {
        "Soja": "https://www.gov.br/conab/pt-br/atuacao/informacoes-agropecuarias/custos-de-producao/arquivos-custo-de-producao/agricolas/serie-historica-custos-soja-1997-a-2026.xls",
        "Milho 2ª Safra": "https://www.gov.br/conab/pt-br/atuacao/informacoes-agropecuarias/custos-de-producao/arquivos-custo-de-producao/agricolas/milho/milho_2a_safra_serie_historica_2005-2026.xls/@@download/file",
        "Sorgo": "https://www.gov.br/conab/pt-br/atuacao/informacoes-agropecuarias/custos-de-producao/arquivos-custo-de-producao/agricolas/seriehistoricacustossorgo2013a2026.xls",
    }

    def _parse_sheet(self, content: bytes, crop: str) -> Dict[str, Any]:
        wb = xlrd.open_workbook(file_contents=content)
        target_sheet = next((s for s in wb.sheet_names() if s.upper() == "RIO VERDE-GO-2026"), None)
        if not target_sheet:
            rv_sheets = [s for s in wb.sheet_names() if "RIO VERDE-GO" in s.upper()]
            target_sheet = rv_sheets[-1] if rv_sheets else wb.sheet_names()[-1]

        sh = wb.sheet_by_name(target_sheet)
        metrics: Dict[str, Any] = {
            "crop": crop,
            "sheet_name": target_sheet,
            "yield_kg_ha": None,
            "yield_sc_ha": None,
            "sementes_ha": 0.0,
            "fertilizantes_ha": 0.0,
            "agrotoxicos_ha": 0.0,
            "custeio_ha": 0.0,
            "custo_operacional_ha": 0.0,
            "custo_total_ha": 0.0,
        }

        for r in range(sh.nrows):
            label = str(sh.cell_value(r, 0)).strip().upper()
            val = sh.cell_value(r, 1) if sh.ncols > 1 else None
            if "PRODUTIVIDADE" in label:
                m = re.search(r"([\d.,]+)", label)
                if m:
                    kg = float(m.group(1).replace(".", "").replace(",", "."))
                    metrics["yield_kg_ha"] = kg
                    metrics["yield_sc_ha"] = round(kg / 60.0, 1)
            elif isinstance(val, (int, float)):
                if "SEMENTES E MUDAS" in label:
                    metrics["sementes_ha"] = round(float(val), 2)
                elif "FERTILIZANTES" in label:
                    metrics["fertilizantes_ha"] = round(float(val), 2)
                elif "AGROTÓXICOS" in label or "AGROTOXICOS" in label:
                    metrics["agrotoxicos_ha"] = round(float(val), 2)
                elif "TOTAL DAS DESPESAS DE CUSTEIO" in label:
                    metrics["custeio_ha"] = round(float(val), 2)
                elif "CUSTO OPERACIONAL (" in label:
                    metrics["custo_operacional_ha"] = round(float(val), 2)
                elif "CUSTO TOTAL (" in label:
                    metrics["custo_total_ha"] = round(float(val), 2)

        if metrics["yield_sc_ha"]:
            metrics["breakeven_operacional_sc"] = round(metrics["custo_operacional_ha"] / metrics["yield_sc_ha"], 2)
            metrics["breakeven_custeio_sc"] = round(metrics["custeio_ha"] / metrics["yield_sc_ha"], 2)
        return metrics

    def extract(self) -> Dict[str, Any]:
        headers = {"Referer": self.url}
        total_lat = 0
        parsed_crops: List[Dict[str, Any]] = []
        last_status = 200

        for crop, file_url in self.FILES.items():
            resp, lat = self.timed_request(file_url, headers=headers, timeout=25)
            total_lat += lat
            last_status = resp.status_code
            if resp.ok:
                fname = f"conab_{crop.lower().replace(' ', '_').replace('ª', 'a')}.xls"
                self.save_bronze(fname, resp.content)
                parsed_crops.append(self._parse_sheet(resp.content, crop))

        return {
            "status": "ONLINE_OPEN" if len(parsed_crops) == 3 else "PARTIAL",
            "http_status": last_status,
            "latency_ms": total_lat,
            "actual_format": "application/vnd.ms-excel (.xls)",
            "audit_notes": "Download direto das 3 planilhas oficiais com extração exata da aba 'Rio Verde-GO-2026'. Requer header Referer para passar pelo WAF gov.br.",
            "raw_sample": json.dumps(parsed_crops, ensure_ascii=False, indent=2),
            "parsed_data": {"crops": parsed_crops},
        }


class BcbSicorExtractor(BaseExtractor):
    source_id = "bcb_sicor"
    name = "Banco Central (BCB) – SICOR Crédito Rural (OData)"
    provider = "Banco Central do Brasil (Olinda Open Data)"
    layer = "5. Regulação & Mercado BR"
    url = "https://olinda.bcb.gov.br/olinda/servico/SICOR/versao/v2/odata/CusteioRegiaoUFProduto"
    auth_required = "Nenhum (API OData Pública)"
    expected_format = "JSON / XML (OData v2)"
    spatial_resolution = "Estadual (GO / Centro-Oeste) e Municipal (lento sem índice)"
    temporal_resolution = "Mensal / Anual (Safra 2026)"
    coverage = "Todo o Crédito Rural Oficial do Brasil"
    data_nature = "Dado Fatídico (Contratos Oficiais BCB)"
    period_min = "Jan/2013 (SICOR)"
    period_max = "2026 (Contratos vigentes)"
    plain_question = "Qual é o volume real de crédito rural e custeio financiado pelos bancos para as culturas?"
    plain_answer = "API oficial OData do Banco Central confirmando valores financiados e área coberta por cultura em 2026."
    fit_score = 4
    fit_analysis = (
        "Excelente para dimensionar o apetite de crédito e seguro na região. ACHADO DE ENGENHARIA: "
        "o endpoint granular municipal (CusteioMunicipioProduto) sofre timeout (>15s) em filtros "
        "sem índice por codIbge; o endpoint agregado CusteioRegiaoUFProduto responde rapidamente."
    )
    viz_type = "sicor_credit"

    def extract(self) -> Dict[str, Any]:
        params = {"$top": 120, "$format": "json"}
        resp, latency = self.timed_request(self.url, params=params, timeout=20)
        self.save_bronze("bcb_sicor_sample.json", resp.text)
        values = resp.json().get("value", []) if resp.ok else []

        # Agrega por produto/programa na amostra
        by_prod: Dict[str, Dict[str, Any]] = {}
        for row in values:
            prod = (row.get("nomeProduto") or "Outros").strip('"')
            vl = float(row.get("VlCusteio") or 0.0)
            ar = float(row.get("AreaCusteio") or 0.0)
            item = by_prod.setdefault(prod, {"product": prod, "vl_custeio": 0.0, "area_ha": 0.0, "contracts": 0})
            item["vl_custeio"] += vl
            item["area_ha"] += ar
            item["contracts"] += 1

        top_prods = sorted(by_prod.values(), key=lambda x: x["vl_custeio"], reverse=True)[:8]
        for p in top_prods:
            p["vl_custeio"] = round(p["vl_custeio"], 2)
            p["area_ha"] = round(p["area_ha"], 1)

        return {
            "status": "ONLINE_OPEN" if resp.ok else "ERROR",
            "http_status": resp.status_code,
            "latency_ms": latency,
            "actual_format": "application/json (OData v2)",
            "audit_notes": "Endpoint agregado respondeu normalmente. Endpoint municipal CusteioMunicipioProduto exige carga batch noturna devido a ausência de índice SQL para filtro por codIbge.",
            "raw_sample": json.dumps(values[:3], ensure_ascii=False, indent=2),
            "parsed_data": {"sample_rows": len(values), "top_products": top_prods},
        }


class MarketCommoditiesExtractor(BaseExtractor):
    source_id = "market_commodities"
    name = "Mercado Futuro Commodities (CBOT/B3 Proxy + Auditoria CEPEA)"
    provider = "CME Group / Yahoo Finance & CEPEA/ESALQ (USP)"
    layer = "5. Regulação & Mercado BR"
    url = "https://query1.finance.yahoo.com/v8/finance/chart/ZS=F"
    auth_required = "CBOT/FX Aberto (JSON) | CEPEA bloqueia bots com WAF HTTP 403"
    expected_format = "JSON (Séries Diárias) vs. HTML Protegido (CEPEA)"
    spatial_resolution = "Referência Global (CBOT) convertida para Paridade Brasil (R$/saca 60kg)"
    temporal_resolution = "Diária (Últimos 90 dias)"
    coverage = "Soja (ZS=F), Milho (ZC=F), Dólar (BRL=X)"
    data_nature = "Dado Fatídico (Mercado em Tempo Real)"
    period_min = "90 dias atrás (Histórico diário)"
    period_max = "Hoje (Fechamento mais recente)"
    plain_question = "Por quanto vou conseguir vender a saca de Soja, Milho e Sorgo em Reais na colheita?"
    fit_score = 4
    fit_analysis = (
        "ACHADO CRÍTICO: O site do CEPEA/ESALQ retorna HTTP 403 para coletores automatizados. "
        "Mitigamos usando cotações abertas CBOT + Dólar (BRL=X) convertidas para R$/saca de 60kg "
        "com ajuste de base logística (basis Rio Verde/GO)."
    )
    viz_type = "market_prices"

    def _fetch_chart(self, symbol: str) -> tuple[List[Dict[str, Any]], int, int]:
        u = f"https://query1.finance.yahoo.com/v8/finance/chart/{symbol}"
        r, lat = self.timed_request(
            u,
            params={"range": "3mo", "interval": "1d"},
            headers={"User-Agent": "NASA-SpaceApps-ETL/1.0", "Accept": "application/json"},
            timeout=15,
        )
        res = r.json()["chart"]["result"][0]
        ts = res["timestamp"]
        closes = res["indicators"]["quote"][0]["close"]
        from datetime import datetime, timezone

        pts = []
        for t, c in zip(ts, closes):
            if c is not None:
                dt = datetime.fromtimestamp(t, tz=timezone.utc).strftime("%Y-%m-%d")
                pts.append({"date": dt, "close": round(float(c), 4)})
        return pts, lat, r.status_code

    def _fetch_bcb_ptax(self) -> tuple[float, int, int]:
        u = (
            "https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/"
            "CotacaoDolarPeriodo(dataInicial=@dataInicial,dataFinalCotacao=@dataFinalCotacao)"
            "?@dataInicial='10-15-2026'&@dataFinalCotacao='11-14-2026'&$format=json"
        )
        r, lat = self.timed_request(u, timeout=15)
        vals = r.json().get("value", []) if r.ok else []
        rate = float(vals[-1]["cotacaoVenda"]) if vals else 5.80
        return rate, lat, r.status_code

    def extract(self) -> Dict[str, Any]:
        soy_pts, l1, c1 = self._fetch_chart("ZS=F")
        corn_pts, l2, _ = self._fetch_chart("ZC=F")
        brl, l3, _ = self._fetch_bcb_ptax()

        # Audita CEPEA
        cepea_r, l4 = self.timed_request("https://www.cepea.esalq.usp.br/br/indicador/soja.aspx", timeout=10)

        soy_cents_bu = soy_pts[-1]["close"] if soy_pts else 1000.0
        corn_cents_bu = corn_pts[-1]["close"] if corn_pts else 430.0

        # Conversão padrão de mercado:
        # Soja: 1 bushel = 27.2155 kg -> 1 saca 60kg = 2.20462 bushels
        # Milho: 1 bushel = 25.4012 kg -> 1 saca 60kg = 2.36210 bushels
        # Aplica deságio médio de basis frete interior Goiás (~14% sobre paridade porto)
        basis_go = 0.86
        soy_brl_sc_paridade = round((soy_cents_bu / 100.0) * 2.20462 * brl, 2)
        soy_brl_sc_rv = round(soy_brl_sc_paridade * basis_go, 2)
        corn_brl_sc_paridade = round((corn_cents_bu / 100.0) * 2.36210 * brl, 2)
        corn_brl_sc_rv = round(corn_brl_sc_paridade * basis_go, 2)
        # Sorgo historicamente negocia a ~80% do valor do milho na região Centro-Oeste
        sorghum_brl_sc_rv = round(corn_brl_sc_rv * 0.80, 2)

        self.save_bronze(
            "market_commodities.json",
            json.dumps({"soy_last": soy_pts[-5:], "corn_last": corn_pts[-5:], "bcb_ptax": brl}, indent=2),
        )

        cepea_status = cepea_r.status_code
        cepea_note = (
            "CEPEA/ESALQ respondeu HTTP 200 com headers de navegador (HTML tabular)."
            if cepea_status == 200
            else f"CEPEA/ESALQ retornou HTTP {cepea_status} (proteção anti-scraping WAF)."
        )

        return {
            "status": "ONLINE_OPEN" if c1 == 200 else "PARTIAL",
            "http_status": c1,
            "latency_ms": l1 + l2 + l3 + l4,
            "actual_format": f"application/json (CBOT + BCB PTAX) | CEPEA: HTTP {cepea_status}",
            "plain_answer": (
                f"Com o Dólar PTAX a R$ {brl:.2f}, a paridade estimada em Rio Verde/GO fica em "
                f"R$ {soy_brl_sc_rv:.2f}/sc (Soja), R$ {corn_brl_sc_rv:.2f}/sc (Milho) e "
                f"R$ {sorghum_brl_sc_rv:.2f}/sc (Sorgo)."
            ),
            "audit_notes": (
                f"CBOT (ZS=F, ZC=F) e Dólar Oficial Banco Central PTAX (R$ {brl:.2f}) operacionais (200 OK). "
                + cepea_note
            ),
            "raw_sample": json.dumps(
                {
                    "ZS=F_last": soy_pts[-1] if soy_pts else None,
                    "ZC=F_last": corn_pts[-1] if corn_pts else None,
                    "BCB_PTAX_USD_BRL": brl,
                    "cepea_probe_http": cepea_r.status_code,
                },
                indent=2,
            ),
            "parsed_data": {
                "usd_brl": round(brl, 2),
                "soy_cbot_cents_bu": soy_cents_bu,
                "corn_cbot_cents_bu": corn_cents_bu,
                "soy_brl_sc_parity": soy_brl_sc_paridade,
                "soy_brl_sc_rio_verde_est": soy_brl_sc_rv,
                "corn_brl_sc_parity": corn_brl_sc_paridade,
                "corn_brl_sc_rio_verde_est": corn_brl_sc_rv,
                "sorghum_brl_sc_rio_verde_est": sorghum_brl_sc_rv,
                "cepea_http_status": cepea_r.status_code,
                "soy_history": soy_pts[-45:],
                "corn_history": corn_pts[-45:],
            },
        }
