# AgroPulse NASA — Pipeline ETL & Observatório de Decisão Agrícola

Protótipo de engenharia de dados desenvolvido para o desafio **Field Shift: Adapting Farms with NASA Data (NASA Space Apps 2026)**, focado em fazendas de grãos de médio porte (100 a 1.500 ha) no Brasil.

**Demo Online (GitHub Pages):** https://eualannascimento.github.io/teste-projeto-datanauts-fazendas/

## Cenário Âncora de Teste
- **Município:** Rio Verde – Goiás (`IBGE 5218805`, Zona Rural)
- **Coordenadas:** `-17.84° S, -51.02° W`
- **Área Piloto:** `500 hectares` (Rotação Soja + Milho 2ª Safra / Sorgo Granífero)

## Estrutura da Interface Web (`frontend/`)
1. **Início: Entenda o Sistema:** Guia visual em 5 etapas traduzindo o que cada API responde em linguagem simples, com classificação de natureza (**Dado Fatídico**, **Previsão/Forecasting**, **Simulação/Reanálise**, **Regra/Catálogo**) e **Período Mínimo / Máximo**.
2. **Explorar Todas as 22 APIs (ETL):** Visualizações dedicadas para todas as 22 fontes (termômetro ENSO + boletim CPC, tercís NMME, previsão 7 dias CPTEC, GDD NASA POWER, série 10m NDVI Sentinel-2 INPE WTSS, escala de pixel vs. fazenda nos catálogos CMR/STAC, perfil físico-hídrico e químico SoilGrids + ZARC, histórico IBGE PAM, estrutura de custos CONAB, crédito SICOR/BCB e paridade CBOT/Dólar).
3. **Simulador Econômico (Fazenda):** Comparativo visual Risco × Retorno e slider de área de `100` a `1.500 ha`.
4. **Caso de Uso: Rotare com El Niño:** Backtest interativo nos anos análogos reais de El Niño forte (`1997/98`, `2015/16`, `2023/24` via NASA POWER + INPE BDC Sentinel-2 NDVI + SoilGrids físico-hídrico), simulação `-20%` chuva / `+1°C`, sensibilidade de plantio (`-1 sem / Base / +1 sem`), notas de solo e blocos transparentes (`Por quê`, `Benefícios`, `Riscos`, `O que não sabemos`).

## Arquitetura Medallion (ETL)
1. **Bronze (`data/bronze/`):** Respostas brutas originais preservadas localmente para auditoria (ignoradas no Git para manter o repositório leve).
2. **Silver (`data/silver/`):** Registros padronizados por fonte contendo telemetria real (status HTTP, latência em ms, exigência de autenticação, formato, resolução espacial/temporal, período min/máx, natureza do dado, nota de Fit e amostra parseada).
3. **Gold (`data/gold/` e `frontend/bundle.js`):**
   - `audit_report.json`: Relatório completo de auditoria técnica das **22 fontes**.
   - `dashboard_bundle.json` / `frontend/bundle.js`: Dados consolidados e síntese econômica para o front-end estático.

## GitHub Actions & CI/CD
- **[`.github/workflows/pages.yml`](.github/workflows/pages.yml):** Valida a sintaxe JS/Python e publica automaticamente o observatório no **GitHub Pages** a cada push na `main`.
- **[`.github/workflows/etl-audit.yml`](.github/workflows/etl-audit.yml):** Workflow agendado/manual para reexecutar todas as 22 APIs na nuvem e gerar o resumo de auditoria + artefatos atualizados.

## Como Executar Localmente
```bash
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
.venv/bin/python etl/run_pipeline.py
open frontend/index.html
```
