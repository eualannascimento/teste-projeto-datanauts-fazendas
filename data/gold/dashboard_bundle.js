window.AGROPULSE_BUNDLE = {
  "generated_at": "2026-11-14T15:36:08.174478+00:00",
  "anchor_farm": {
    "name": "Fazenda Piloto Rio Verde – Zona Rural (Cenário Âncora)",
    "municipality": "Rio Verde",
    "uf": "GO",
    "ibge_code": "5218805",
    "lat": -17.84,
    "lon": -51.02,
    "area_ha": 500,
    "cptec_city_id": "4420",
    "inmet_station_id": "A025",
    "bbox": [
      -51.12,
      -17.94,
      -50.92,
      -17.74
    ],
    "polygon_coords": [
      [
        [
          -51.12,
          -17.94
        ],
        [
          -50.92,
          -17.94
        ],
        [
          -50.92,
          -17.74
        ],
        [
          -51.12,
          -17.74
        ],
        [
          -51.12,
          -17.94
        ]
      ]
    ]
  },
  "summary": {
    "total_sources": 21,
    "online_open": 15,
    "online_discovery_only": 6,
    "partial_or_error": 0,
    "avg_latency_ms": 2684
  },
  "decision_synthesis": {
    "anchor_farm": {
      "name": "Fazenda Piloto Rio Verde – Zona Rural (Cenário Âncora)",
      "municipality": "Rio Verde",
      "uf": "GO",
      "ibge_code": "5218805",
      "lat": -17.84,
      "lon": -51.02,
      "area_ha": 500,
      "cptec_city_id": "4420",
      "inmet_station_id": "A025",
      "bbox": [
        -51.12,
        -17.94,
        -50.92,
        -17.74
      ],
      "polygon_coords": [
        [
          [
            -51.12,
            -17.94
          ],
          [
            -50.92,
            -17.94
          ],
          [
            -50.92,
            -17.74
          ],
          [
            -51.12,
            -17.74
          ],
          [
            -51.12,
            -17.94
          ]
        ]
      ]
    },
    "enso_status": {
      "phase": "El Niño Forte",
      "oni_anomaly": 2.46,
      "oni_season": "ASO 2026"
    },
    "nmme_safrinha_outlook": {
      "season": "JFM 2027",
      "grid_lat": -18.0,
      "grid_lon": -51.0,
      "prob_below": 44.6,
      "prob_norm": 30.4,
      "prob_above": 25.0
    },
    "soil_auto_zarc": "Tipo 3 (Argiloso ≥ 35% argila — Alta retenção hídrica)",
    "zarc_windows_summary": [
      {
        "crop": "Soja",
        "open_decendios": 11,
        "first_dec": 1,
        "last_dec": 36
      },
      {
        "crop": "Milho 2ª Safra",
        "open_decendios": 4,
        "first_dec": 1,
        "last_dec": 4
      },
      {
        "crop": "Sorgo Granífero 2ª Safra",
        "open_decendios": 8,
        "first_dec": 1,
        "last_dec": 8
      },
      {
        "crop": "Milho 2ª Safra consorciado com Braquiária",
        "open_decendios": 5,
        "first_dec": 1,
        "last_dec": 5
      }
    ],
    "prices_used_rio_verde_brl_sc": {
      "soja": 133.2,
      "milho": 51.14,
      "sorgo": 40.91
    },
    "scenarios_500ha": [
      {
        "id": "A",
        "title": "Cenário A: Soja Normal + Arriscar Milho 2ª Safra",
        "risk_level": "ALTO RISCO (Quebra / Fora ZARC se atrasar)",
        "revenue_ha": 12493.5,
        "cost_ha": 11040.73,
        "margin_ha": 1452.77,
        "total_margin_farm": 726385.0,
        "custeio_exposure_farm": 3578780.0
      },
      {
        "id": "B",
        "title": "Cenário B: Soja Precoce + Sorgo Granífero 2ª Safra (Pivot)",
        "risk_level": "RISCO CONTROLADO (Tolerante à seca + Janela ZARC maior)",
        "revenue_ha": 10730.13,
        "cost_ha": 8958.4,
        "margin_ha": 1771.73,
        "total_margin_farm": 885865.0,
        "custeio_exposure_farm": 2806280.0
      },
      {
        "id": "C",
        "title": "Cenário C: Soja Safra Única + Cobertura de Solo (Braquiária)",
        "risk_level": "BAIXO RISCO (Preservação de capital e umidade)",
        "revenue_ha": 8658.0,
        "cost_ha": 5601.64,
        "margin_ha": 3056.36,
        "total_margin_farm": 1528180.0,
        "custeio_exposure_farm": 1901935.0
      }
    ]
  },
  "sources": [
    {
      "id": "noaa_oni",
      "name": "NOAA CPC – Oceanic Niño Index (ONI)",
      "provider": "NOAA Climate Prediction Center (Parceiro NASA)",
      "layer": "1. Macro-Clima & Sazonal",
      "url": "https://www.cpc.ncep.noaa.gov/data/indices/oni.ascii.txt",
      "auth_required": "Nenhum (100% Aberto)",
      "expected_format": "ASCII Text (Tabular)",
      "actual_format": "text/plain (ASCII colunar)",
      "spatial_resolution": "Região Niño 3.4 (5°N–5°S, 120°–170°W)",
      "temporal_resolution": "Trimestral Móvel (1950–2026)",
      "coverage": "Pacífico Equatorial (Global Teleconnection)",
      "data_nature": "Dado Fatídico (Observado)",
      "period_min": "DJF 1950",
      "period_max": "ASO 2026",
      "plain_question": "O fenômeno El Niño está ativo hoje e qual é a sua força?",
      "plain_answer": "Estamos em fase 'El Niño Forte' com anomalia de +2.46°C no Pacífico (ASO 2026), sinalizando alerta máximo de atraso ou irregularidade de chuvas no Centro-Oeste.",
      "fit_score": 5,
      "fit_analysis": "Essencial como gatilho macro do motor: identifica oficialmente fases de El Niño (ONI ≥ +0.5°C) e La Niña (ONI ≤ -0.5°C), permitindo selecionar anos análogos históricos como 2015/16 e 2023/24.",
      "viz_type": "oni_timeline",
      "status": "ONLINE_OPEN",
      "http_status": 200,
      "latency_ms": 853,
      "audit_notes": "",
      "error": null,
      "extracted_at": "2026-11-14T15:35:02.467222+00:00",
      "raw_sample": "SEAS  YR   TOTAL   ANOM\nDJF 1950  25.01  -1.32\nJFM 1950  25.36  -1.20\nFMA 1950  25.88  -1.12\n...\nMAM 2026  28.09   0.46\nAMJ 2026  28.74   0.95\nMJJ 2026  29.02   1.39\nJJA 2026  29.09   1.80\nJAS 2026  29.12   2.16\nASO 2026  29.23   2.46",
      "parsed_data": {
        "latest": {
          "season": "ASO",
          "year": 2026,
          "label": "ASO 2026",
          "total_sst": 29.23,
          "anomaly": 2.46
        },
        "current_phase": "El Niño Forte",
        "total_records": 921,
        "series_36m": [
          {
            "season": "SON",
            "year": 2023,
            "label": "SON 2023",
            "total_sst": 28.45,
            "anomaly": 1.74
          },
          {
            "season": "OND",
            "year": 2023,
            "label": "OND 2023",
            "total_sst": 28.55,
            "anomaly": 1.9
          },
          {
            "season": "NDJ",
            "year": 2023,
            "label": "NDJ 2023",
            "total_sst": 28.55,
            "anomaly": 1.99
          },
          {
            "season": "DJF",
            "year": 2024,
            "label": "DJF 2024",
            "total_sst": 28.38,
            "anomaly": 1.84
          },
          {
            "season": "JFM",
            "year": 2024,
            "label": "JFM 2024",
            "total_sst": 28.3,
            "anomaly": 1.53
          },
          {
            "season": "FMA",
            "year": 2024,
            "label": "FMA 2024",
            "total_sst": 28.4,
            "anomaly": 1.18
          },
          {
            "season": "MAM",
            "year": 2024,
            "label": "MAM 2024",
            "total_sst": 28.4,
            "anomaly": 0.77
          },
          {
            "season": "AMJ",
            "year": 2024,
            "label": "AMJ 2024",
            "total_sst": 28.23,
            "anomaly": 0.43
          },
          {
            "season": "MJJ",
            "year": 2024,
            "label": "MJJ 2024",
            "total_sst": 27.8,
            "anomaly": 0.18
          },
          {
            "season": "JJA",
            "year": 2024,
            "label": "JJA 2024",
            "total_sst": 27.35,
            "anomaly": 0.06
          },
          {
            "season": "JAS",
            "year": 2024,
            "label": "JAS 2024",
            "total_sst": 26.92,
            "anomaly": -0.04
          },
          {
            "season": "ASO",
            "year": 2024,
            "label": "ASO 2024",
            "total_sst": 26.64,
            "anomaly": -0.12
          },
          {
            "season": "SON",
            "year": 2024,
            "label": "SON 2024",
            "total_sst": 26.52,
            "anomaly": -0.19
          },
          {
            "season": "OND",
            "year": 2024,
            "label": "OND 2024",
            "total_sst": 26.35,
            "anomaly": -0.29
          },
          {
            "season": "NDJ",
            "year": 2024,
            "label": "NDJ 2024",
            "total_sst": 26.13,
            "anomaly": -0.43
          },
          {
            "season": "DJF",
            "year": 2025,
            "label": "DJF 2025",
            "total_sst": 26.09,
            "anomaly": -0.46
          },
          {
            "season": "JFM",
            "year": 2025,
            "label": "JFM 2025",
            "total_sst": 26.56,
            "anomaly": -0.22
          },
          {
            "season": "FMA",
            "year": 2025,
            "label": "FMA 2025",
            "total_sst": 27.15,
            "anomaly": -0.08
          },
          {
            "season": "MAM",
            "year": 2025,
            "label": "MAM 2025",
            "total_sst": 27.65,
            "anomaly": 0.02
          },
          {
            "season": "AMJ",
            "year": 2025,
            "label": "AMJ 2025",
            "total_sst": 27.76,
            "anomaly": -0.04
          },
          {
            "season": "MJJ",
            "year": 2025,
            "label": "MJJ 2025",
            "total_sst": 27.61,
            "anomaly": -0.02
          },
          {
            "season": "JJA",
            "year": 2025,
            "label": "JJA 2025",
            "total_sst": 27.18,
            "anomaly": -0.11
          },
          {
            "season": "JAS",
            "year": 2025,
            "label": "JAS 2025",
            "total_sst": 26.7,
            "anomaly": -0.26
          },
          {
            "season": "ASO",
            "year": 2025,
            "label": "ASO 2025",
            "total_sst": 26.33,
            "anomaly": -0.43
          },
          {
            "season": "SON",
            "year": 2025,
            "label": "SON 2025",
            "total_sst": 26.14,
            "anomaly": -0.57
          },
          {
            "season": "OND",
            "year": 2025,
            "label": "OND 2025",
            "total_sst": 26.04,
            "anomaly": -0.61
          },
          {
            "season": "NDJ",
            "year": 2025,
            "label": "NDJ 2025",
            "total_sst": 25.96,
            "anomaly": -0.6
          },
          {
            "season": "DJF",
            "year": 2026,
            "label": "DJF 2026",
            "total_sst": 26.15,
            "anomaly": -0.39
          },
          {
            "season": "JFM",
            "year": 2026,
            "label": "JFM 2026",
            "total_sst": 26.57,
            "anomaly": -0.21
          },
          {
            "season": "FMA",
            "year": 2026,
            "label": "FMA 2026",
            "total_sst": 27.34,
            "anomaly": 0.11
          },
          {
            "season": "MAM",
            "year": 2026,
            "label": "MAM 2026",
            "total_sst": 28.09,
            "anomaly": 0.46
          },
          {
            "season": "AMJ",
            "year": 2026,
            "label": "AMJ 2026",
            "total_sst": 28.74,
            "anomaly": 0.95
          },
          {
            "season": "MJJ",
            "year": 2026,
            "label": "MJJ 2026",
            "total_sst": 29.02,
            "anomaly": 1.39
          },
          {
            "season": "JJA",
            "year": 2026,
            "label": "JJA 2026",
            "total_sst": 29.09,
            "anomaly": 1.8
          },
          {
            "season": "JAS",
            "year": 2026,
            "label": "JAS 2026",
            "total_sst": 29.12,
            "anomaly": 2.16
          },
          {
            "season": "ASO",
            "year": 2026,
            "label": "ASO 2026",
            "total_sst": 29.23,
            "anomaly": 2.46
          }
        ]
      }
    },
    {
      "id": "nmme_seasonal",
      "name": "NMME – Previsão Sazonal Probabilística (NASA GEOS + NOAA)",
      "provider": "Consórcio NMME (NASA GMAO, NOAA CPC, NCAR, IRI)",
      "layer": "1. Macro-Clima & Sazonal",
      "url": "https://ftp.cpc.ncep.noaa.gov/NMME/prob/netcdf/",
      "auth_required": "Nenhum (100% Aberto via HTTPS/FTP)",
      "expected_format": "NetCDF4 / NetCDF3 (Matricial)",
      "actual_format": "NetCDF (application/x-netcdf)",
      "spatial_resolution": "1.0° x 1.0° (~110 km) — célula sobre Rio Verde/GO",
      "temporal_resolution": "Trimestres sazonais até 7 meses à frente",
      "coverage": "Global (Recorte extraído para -17.79°, -50.92°)",
      "data_nature": "Previsão (Forecasting)",
      "period_min": "OND 2026",
      "period_max": "AMJ 2027",
      "plain_question": "Vai faltar chuva ou fazer mais calor na fazenda durante a próxima safra e safrinha?",
      "plain_answer": "Para Rio Verde/GO (OND 2026), o consenso multi-modelo aponta 52.2% de chance de chuva abaixo da média e 100.0% de calor acima da média.",
      "fit_score": 5,
      "fit_analysis": "Ouro para antecipação do próximo ano: entrega a probabilidade multi-modelo (incluindo o NASA GEOS-S2S) de chuva e temperatura ficarem abaixo, normal ou acima da média nos próximos 7 trimestres.",
      "viz_type": "nmme_terciles",
      "status": "ONLINE_OPEN",
      "http_status": 200,
      "latency_ms": 13535,
      "audit_notes": "Arquivos sazonais mais recentes detectados: prate.202611.prob.seas.nc e tmp2m.202611.prob.seas.nc (5348 KB cada).",
      "error": null,
      "extracted_at": "2026-11-14T15:35:03.328550+00:00",
      "raw_sample": "NetCDF Variables: ['lon', 'lat', 'target', 'initial_time', 'prob_above', 'prob_norm', 'prob_below']\nArquivo Precipitação: prate.202611.prob.seas.nc\nArquivo Temperatura: tmp2m.202611.prob.seas.nc\nCélula extraída para Rio Verde/GO: {'season': 'OND 2026', 'grid_lat': -18.0, 'grid_lon': -51.0, 'prob_below': 52.2, 'prob_norm': 26.1, 'prob_above': 21.7}",
      "parsed_data": {
        "prate_file": "prate.202611.prob.seas.nc",
        "tmp2m_file": "tmp2m.202611.prob.seas.nc",
        "precipitation_terciles": [
          {
            "season": "OND 2026",
            "grid_lat": -18.0,
            "grid_lon": -51.0,
            "prob_below": 52.2,
            "prob_norm": 26.1,
            "prob_above": 21.7
          },
          {
            "season": "NDJ 2026",
            "grid_lat": -18.0,
            "grid_lon": -51.0,
            "prob_below": 45.7,
            "prob_norm": 33.7,
            "prob_above": 20.7
          },
          {
            "season": "DJF 2027",
            "grid_lat": -18.0,
            "grid_lon": -51.0,
            "prob_below": 52.2,
            "prob_norm": 21.7,
            "prob_above": 26.1
          },
          {
            "season": "JFM 2027",
            "grid_lat": -18.0,
            "grid_lon": -51.0,
            "prob_below": 44.6,
            "prob_norm": 30.4,
            "prob_above": 25.0
          },
          {
            "season": "FMA 2027",
            "grid_lat": -18.0,
            "grid_lon": -51.0,
            "prob_below": 42.4,
            "prob_norm": 21.7,
            "prob_above": 35.9
          },
          {
            "season": "MAM 2027",
            "grid_lat": -18.0,
            "grid_lon": -51.0,
            "prob_below": 31.5,
            "prob_norm": 26.1,
            "prob_above": 42.4
          },
          {
            "season": "AMJ 2027",
            "grid_lat": -18.0,
            "grid_lon": -51.0,
            "prob_below": 51.1,
            "prob_norm": 25.0,
            "prob_above": 23.9
          }
        ],
        "temperature_terciles": [
          {
            "season": "OND 2026",
            "grid_lat": -18.0,
            "grid_lon": -51.0,
            "prob_below": 0.0,
            "prob_norm": 0.0,
            "prob_above": 100.0
          },
          {
            "season": "NDJ 2026",
            "grid_lat": -18.0,
            "grid_lon": -51.0,
            "prob_below": 0.0,
            "prob_norm": 0.0,
            "prob_above": 100.0
          },
          {
            "season": "DJF 2027",
            "grid_lat": -18.0,
            "grid_lon": -51.0,
            "prob_below": 0.0,
            "prob_norm": 0.0,
            "prob_above": 100.0
          },
          {
            "season": "JFM 2027",
            "grid_lat": -18.0,
            "grid_lon": -51.0,
            "prob_below": 0.0,
            "prob_norm": 0.0,
            "prob_above": 100.0
          },
          {
            "season": "FMA 2027",
            "grid_lat": -18.0,
            "grid_lon": -51.0,
            "prob_below": 0.0,
            "prob_norm": 0.0,
            "prob_above": 100.0
          },
          {
            "season": "MAM 2027",
            "grid_lat": -18.0,
            "grid_lon": -51.0,
            "prob_below": 1.1,
            "prob_norm": 4.3,
            "prob_above": 94.6
          },
          {
            "season": "AMJ 2027",
            "grid_lat": -18.0,
            "grid_lon": -51.0,
            "prob_below": 10.9,
            "prob_norm": 9.8,
            "prob_above": 79.3
          }
        ]
      }
    },
    {
      "id": "nasa_gmao",
      "name": "NASA GMAO – GEOS-S2S (Portal & OPeNDAP)",
      "provider": "NASA Global Modeling and Assimilation Office",
      "layer": "1. Macro-Clima & Sazonal",
      "url": "https://gmao.gsfc.nasa.gov/weather_prediction/",
      "auth_required": "Nenhum (Portal e OPeNDAP públicos)",
      "expected_format": "HTML / OPeNDAP GrADS",
      "actual_format": "text/html + OPeNDAP Directory",
      "spatial_resolution": "0.5° x 0.5° (~50 km)",
      "temporal_resolution": "Mensal / Sub-sazonal (1 a 9 meses)",
      "coverage": "Global (Modelo acoplado oceano-atmosfera da NASA)",
      "data_nature": "Previsão (Forecasting)",
      "period_min": "Mês Atual (Inicialização)",
      "period_max": "Horizonte de +9 meses",
      "plain_question": "Qual é o motor físico da NASA por trás das previsões globais do El Niño?",
      "plain_answer": "É o supermodelo climático da NASA que simula oceanos e atmosfera. Na prática, seus resultados já são entregues mastigados dentro do consórcio NMME acima.",
      "fit_score": 4,
      "fit_analysis": "Modelo físico oficial da NASA por trás das previsões de El Niño. O acesso direto bruto via OPeNDAP exige clientes GrADS/xarray pesados; na prática de engenharia, consumir o GEOS consolidado dentro do NMME (NetCDF acima) reduz latência e complexidade em 90%.",
      "viz_type": "audit_summary",
      "status": "ONLINE_OPEN",
      "http_status": 200,
      "latency_ms": 1640,
      "audit_notes": "Portal GMAO e servidor OPeNDAP NCCS respondendo normalmente. Recomendado consumo via ensemble NMME.",
      "error": null,
      "extracted_at": "2026-11-14T15:35:16.883290+00:00",
      "raw_sample": "OPeNDAP NCCS Status: 200\nDiretórios detectados: ['http://opendap.nccs.nasa.gov:80/dods/GEOS-5', 'http://opendap.nccs.nasa.gov:80/dods/gmao']",
      "parsed_data": {
        "portal_status": 200,
        "opendap_status": 200,
        "opendap_url": "https://opendap.nccs.nasa.gov/dods/",
        "sample_collections": [
          "http://opendap.nccs.nasa.gov:80/dods/GEOS-5",
          "http://opendap.nccs.nasa.gov:80/dods/gmao"
        ]
      }
    },
    {
      "id": "cptec_inpe",
      "name": "CPTEC/INPE – Previsão Regional Oficial (Brasil)",
      "provider": "INPE / MCTI (Brasil)",
      "layer": "1. Macro-Clima & Sazonal",
      "url": "http://servicos.cptec.inpe.br/XML/cidade/7dias/4420/previsao.xml",
      "auth_required": "Nenhum (100% Aberto)",
      "expected_format": "XML (ISO-8859-1)",
      "actual_format": "text/xml (ISO-8859-1)",
      "spatial_resolution": "Municipal (Rio Verde/GO – ID 4420)",
      "temporal_resolution": "Diária (Horizonte de 7 dias)",
      "coverage": "Território Nacional Brasileiro",
      "data_nature": "Previsão (Forecasting)",
      "period_min": "2026-11-14",
      "period_max": "2026-11-20",
      "plain_question": "Vai chover nesta semana ou posso entrar com trator e pulverizador no campo?",
      "plain_answer": "Previsão oficial para os próximos 7 dias em Rio Verde/GO: ajuda a decidir o dia exato da operação de campo nesta semana.",
      "fit_score": 4,
      "fit_analysis": "Complemento tático de curto prazo: não prevê o próximo ano, mas orienta a janela operacional imediata da semana (entrada de plantadeira, pulverização e colheitadeira).",
      "viz_type": "weather_7d",
      "status": "ONLINE_OPEN",
      "http_status": 200,
      "latency_ms": 130,
      "audit_notes": "",
      "error": null,
      "extracted_at": "2026-11-14T15:35:18.529058+00:00",
      "raw_sample": "<?xml version='1.0' encoding='ISO-8859-1'?><cidade><nome>Rio Verde</nome><uf>GO</uf><atualizacao>2026-11-14</atualizacao><previsao><dia>2026-11-14</dia><tempo>pn</tempo><maxima>34</maxima><minima>21</minima><iuv>0.0</iuv></previsao><previsao><dia>2026-11-15</dia><tempo>c</tempo><maxima>34</maxima><minima>18</minima><iuv>0.0</iuv></previsao><previsao><dia>2026-11-16</dia><tempo>c</tempo><maxima>29</maxima><minima>21</minima><iuv>0.0</iuv></previsao><previsao><dia>2026-11-17</dia><tempo>c</tempo><maxima>28</maxima><minima>18</minima><iuv>0.0</iuv></previsao><previsao><dia>2026-11-18</dia><tempo>c</tempo><maxima>28</maxima><minima>17</minima><iuv>0.0</iuv></previsao><previsao><dia>2026-11-19</dia><tempo>c</tempo><maxima>29</maxima><minima>17</minima><iuv>0.0</iuv></previsao><previsao><dia>2026-11-20</dia><tempo>ci</tempo><maxima>29</maxima><minima>20</minima><iuv>0.0</iuv></previsao></cidade>",
      "parsed_data": {
        "city": "Rio Verde",
        "uf": "GO",
        "updated": "2026-11-14",
        "forecast": [
          {
            "date": "2026-11-14",
            "condition": "pn",
            "min_c": 21,
            "max_c": 34,
            "uv": 0.0
          },
          {
            "date": "2026-11-15",
            "condition": "c",
            "min_c": 18,
            "max_c": 34,
            "uv": 0.0
          },
          {
            "date": "2026-11-16",
            "condition": "c",
            "min_c": 21,
            "max_c": 29,
            "uv": 0.0
          },
          {
            "date": "2026-11-17",
            "condition": "c",
            "min_c": 18,
            "max_c": 28,
            "uv": 0.0
          },
          {
            "date": "2026-11-18",
            "condition": "c",
            "min_c": 17,
            "max_c": 28,
            "uv": 0.0
          },
          {
            "date": "2026-11-19",
            "condition": "c",
            "min_c": 17,
            "max_c": 29,
            "uv": 0.0
          },
          {
            "date": "2026-11-20",
            "condition": "ci",
            "min_c": 20,
            "max_c": 29,
            "uv": 0.0
          }
        ]
      }
    },
    {
      "id": "nasa_power",
      "name": "NASA POWER – Agroclimatology (MERRA-2)",
      "provider": "NASA Langley Research Center (LaRC)",
      "layer": "2. Agromet & Satélite",
      "url": "https://power.larc.nasa.gov/api/temporal/daily/point",
      "auth_required": "Nenhum (100% Aberto)",
      "expected_format": "JSON / CSV",
      "actual_format": "application/json (NASA POWER v2)",
      "spatial_resolution": "0.5° x 0.625° (~55 km)",
      "temporal_resolution": "Diária (1981 até D-5)",
      "coverage": "Global (Ponto Rio Verde/GO)",
      "data_nature": "Simulação / Reanálise (MERRA-2)",
      "period_min": "2025-10-01",
      "period_max": "2026-10-31",
      "plain_question": "Quantos graus de calor acumulados faltam para a soja amadurecer e qual o histórico de chuva?",
      "plain_answer": "Acumulou 789.6 mm de chuva em 396 dias e somou 2085.5 Graus-Dia (GDD) entre 15/Out e 15/Fev — temperatura e energia suficientes para fechar o ciclo da soja.",
      "fit_score": 5,
      "fit_analysis": "Base perfeita para linha de base histórica (normal climatológica) e cálculo de Graus-Dia de Crescimento (GDD). Permite prever em quantos dias a soja atinge a maturação para liberar a área para o milho safrinha ou sorgo.",
      "viz_type": "power_gdd",
      "status": "ONLINE_OPEN",
      "http_status": 200,
      "latency_ms": 929,
      "audit_notes": "",
      "error": null,
      "extracted_at": "2026-11-14T15:35:18.662829+00:00",
      "raw_sample": "{\n  \"header\": {\n    \"title\": \"NASA/POWER Source Native Resolution Daily Data\",\n    \"api\": {\n      \"version\": \"v2.10.3\",\n      \"name\": \"POWER Daily API\"\n    },\n    \"sources\": [\n      \"MERRA2\",\n      \"GEOSIT\",\n      \"SYN1DEG\",\n      \"FLASHFLUX\",\n      \"POWER\"\n    ],\n    \"fill_value\": -999.0,\n    \"time_standard\": \"LST\",\n    \"start\": \"20251001\",\n    \"end\": \"20261031\"\n  },\n  \"sample_days\": [\n    {\n      \"date\": \"2026-10-27\",\n      \"t2m\": 27.5,\n      \"tmax\": 36.5,\n      \"tmin\": 18.8,\n      \"rain_mm\": 0.1,\n      \"rad_mj\": 19.1,\n      \"rh_pct\": 41.5,\n      \"gdd_day\": 17.7\n    },\n    {\n      \"date\": \"2026-10-28\",\n      \"t2m\": 27.4,\n      \"tmax\": 35.9,\n      \"tmin\": 21.4,\n      \"rain_mm\": 6.5,\n      \"rad_mj\": 7.7,\n      \"rh_pct\": 49.9,\n      \"gdd_day\": 18.6\n    },\n    {\n      \"date\": \"2026-10-29\",\n      \"t2m\": 24.0,\n      \"tmax\": 28.5,\n      \"tmin\": 20.5,\n      \"rain_mm\": 3.4,\n      \"rad_mj\": 14.0,\n      \"rh_pct\": 72.3,\n      \"gdd_day\": 14.5\n    },\n    {\n      \"date\": \"2026-10-30\",\n      \"t2m\": 25.7,\n      \"tmax\": 31.6,\n      \"tmin\": 20.3,\n      \"rain_mm\": 4.3,\n      \"rad_mj\": 23.6,\n      \"rh_pct\": 67.7,\n      \"gdd_day\": 15.9\n    },\n    {\n      \"date\": \"2026-10-31\",\n      \"t2m\": 26.1,\n      \"tmax\": 32.4,\n      \"tmin\": 21.9,\n      \"rain_mm\": 8.2,\n      \"rad_mj\": 3.3,\n      \"rh_pct\": 69.7,\n      \"gdd_day\": 17.1\n    }\n  ]\n}",
      "parsed_data": {
        "total_valid_days": 396,
        "total_rain_mm": 789.6,
        "soy_cycle_gdd_oct15_feb15": 2085.5,
        "monthly_summary": [
          {
            "month": "2025-10",
            "rain_mm": 34.5,
            "tmax_avg": 35.7,
            "tmin_avg": 21.2,
            "hot_days_35": 24
          },
          {
            "month": "2025-11",
            "rain_mm": 45.6,
            "tmax_avg": 35.2,
            "tmin_avg": 20.5,
            "hot_days_35": 17
          },
          {
            "month": "2025-12",
            "rain_mm": 145.9,
            "tmax_avg": 31.8,
            "tmin_avg": 21.1,
            "hot_days_35": 7
          },
          {
            "month": "2026-01",
            "rain_mm": 108.2,
            "tmax_avg": 33.1,
            "tmin_avg": 20.8,
            "hot_days_35": 5
          },
          {
            "month": "2026-02",
            "rain_mm": 129.6,
            "tmax_avg": 30.3,
            "tmin_avg": 20.4,
            "hot_days_35": 0
          },
          {
            "month": "2026-03",
            "rain_mm": 115.9,
            "tmax_avg": 30.7,
            "tmin_avg": 19.6,
            "hot_days_35": 2
          },
          {
            "month": "2026-04",
            "rain_mm": 28.0,
            "tmax_avg": 33.2,
            "tmin_avg": 19.6,
            "hot_days_35": 0
          },
          {
            "month": "2026-05",
            "rain_mm": 3.7,
            "tmax_avg": 31.6,
            "tmin_avg": 17.7,
            "hot_days_35": 0
          },
          {
            "month": "2026-06",
            "rain_mm": 21.3,
            "tmax_avg": 29.8,
            "tmin_avg": 15.4,
            "hot_days_35": 0
          },
          {
            "month": "2026-07",
            "rain_mm": 5.7,
            "tmax_avg": 31.4,
            "tmin_avg": 15.7,
            "hot_days_35": 0
          },
          {
            "month": "2026-08",
            "rain_mm": 4.4,
            "tmax_avg": 34.7,
            "tmin_avg": 19.1,
            "hot_days_35": 14
          },
          {
            "month": "2026-09",
            "rain_mm": 69.9,
            "tmax_avg": 35.1,
            "tmin_avg": 20.5,
            "hot_days_35": 18
          },
          {
            "month": "2026-10",
            "rain_mm": 76.7,
            "tmax_avg": 34.4,
            "tmin_avg": 21.0,
            "hot_days_35": 15
          }
        ],
        "recent_30d": [
          {
            "date": "2026-10-02",
            "t2m": 21.1,
            "tmax": 22.9,
            "tmin": 19.7,
            "rain_mm": 8.8,
            "rad_mj": 12.5,
            "rh_pct": 82.5,
            "gdd_day": 11.3
          },
          {
            "date": "2026-10-03",
            "t2m": 24.2,
            "tmax": 30.4,
            "tmin": 18.2,
            "rain_mm": 3.0,
            "rad_mj": 21.6,
            "rh_pct": 68.8,
            "gdd_day": 14.3
          },
          {
            "date": "2026-10-04",
            "t2m": 26.1,
            "tmax": 33.3,
            "tmin": 19.3,
            "rain_mm": 3.8,
            "rad_mj": 17.9,
            "rh_pct": 62.4,
            "gdd_day": 16.3
          },
          {
            "date": "2026-10-05",
            "t2m": 25.4,
            "tmax": 32.5,
            "tmin": 20.9,
            "rain_mm": 6.0,
            "rad_mj": 6.3,
            "rh_pct": 65.2,
            "gdd_day": 16.7
          },
          {
            "date": "2026-10-06",
            "t2m": 25.1,
            "tmax": 31.3,
            "tmin": 20.1,
            "rain_mm": 1.5,
            "rad_mj": 12.0,
            "rh_pct": 68.2,
            "gdd_day": 15.7
          },
          {
            "date": "2026-10-07",
            "t2m": 27.5,
            "tmax": 35.2,
            "tmin": 20.2,
            "rain_mm": 1.0,
            "rad_mj": 14.3,
            "rh_pct": 56.7,
            "gdd_day": 17.7
          },
          {
            "date": "2026-10-08",
            "t2m": 29.5,
            "tmax": 38.2,
            "tmin": 21.4,
            "rain_mm": 0.0,
            "rad_mj": 24.3,
            "rh_pct": 44.0,
            "gdd_day": 19.8
          },
          {
            "date": "2026-10-09",
            "t2m": 31.2,
            "tmax": 39.3,
            "tmin": 24.0,
            "rain_mm": 0.0,
            "rad_mj": 21.4,
            "rh_pct": 34.1,
            "gdd_day": 21.6
          },
          {
            "date": "2026-10-10",
            "t2m": 29.8,
            "tmax": 37.3,
            "tmin": 24.6,
            "rain_mm": 0.4,
            "rad_mj": 18.9,
            "rh_pct": 37.9,
            "gdd_day": 20.9
          },
          {
            "date": "2026-10-11",
            "t2m": 27.0,
            "tmax": 33.9,
            "tmin": 22.0,
            "rain_mm": 0.4,
            "rad_mj": 19.1,
            "rh_pct": 48.8,
            "gdd_day": 18.0
          },
          {
            "date": "2026-10-12",
            "t2m": 28.4,
            "tmax": 37.1,
            "tmin": 20.1,
            "rain_mm": 0.6,
            "rad_mj": 14.5,
            "rh_pct": 45.2,
            "gdd_day": 18.6
          },
          {
            "date": "2026-10-13",
            "t2m": 30.6,
            "tmax": 38.4,
            "tmin": 22.3,
            "rain_mm": 0.1,
            "rad_mj": 21.7,
            "rh_pct": 38.3,
            "gdd_day": 20.3
          },
          {
            "date": "2026-10-14",
            "t2m": 31.6,
            "tmax": 40.2,
            "tmin": 24.4,
            "rain_mm": 0.2,
            "rad_mj": 16.6,
            "rh_pct": 33.7,
            "gdd_day": 22.3
          },
          {
            "date": "2026-10-15",
            "t2m": 28.2,
            "tmax": 33.6,
            "tmin": 23.5,
            "rain_mm": 1.2,
            "rad_mj": 14.2,
            "rh_pct": 48.1,
            "gdd_day": 18.6
          },
          {
            "date": "2026-10-16",
            "t2m": 26.3,
            "tmax": 33.1,
            "tmin": 21.4,
            "rain_mm": 7.2,
            "rad_mj": 18.9,
            "rh_pct": 62.2,
            "gdd_day": 17.2
          },
          {
            "date": "2026-10-17",
            "t2m": 24.1,
            "tmax": 32.1,
            "tmin": 17.9,
            "rain_mm": 1.3,
            "rad_mj": 19.1,
            "rh_pct": 61.9,
            "gdd_day": 15.0
          },
          {
            "date": "2026-10-18",
            "t2m": 23.8,
            "tmax": 32.4,
            "tmin": 18.9,
            "rain_mm": 0.0,
            "rad_mj": 23.6,
            "rh_pct": 52.4,
            "gdd_day": 15.6
          },
          {
            "date": "2026-10-19",
            "t2m": 25.1,
            "tmax": 33.2,
            "tmin": 16.9,
            "rain_mm": 0.0,
            "rad_mj": 26.5,
            "rh_pct": 47.5,
            "gdd_day": 15.0
          },
          {
            "date": "2026-10-20",
            "t2m": 27.6,
            "tmax": 37.1,
            "tmin": 18.4,
            "rain_mm": 0.0,
            "rad_mj": 25.0,
            "rh_pct": 36.8,
            "gdd_day": 17.7
          },
          {
            "date": "2026-10-21",
            "t2m": 29.6,
            "tmax": 38.6,
            "tmin": 20.8,
            "rain_mm": 0.0,
            "rad_mj": 23.3,
            "rh_pct": 36.0,
            "gdd_day": 19.7
          },
          {
            "date": "2026-10-22",
            "t2m": 30.5,
            "tmax": 38.5,
            "tmin": 24.0,
            "rain_mm": 4.5,
            "rad_mj": 9.7,
            "rh_pct": 43.2,
            "gdd_day": 21.2
          },
          {
            "date": "2026-10-23",
            "t2m": 29.0,
            "tmax": 36.7,
            "tmin": 22.6,
            "rain_mm": 3.7,
            "rad_mj": 15.7,
            "rh_pct": 55.5,
            "gdd_day": 19.6
          },
          {
            "date": "2026-10-24",
            "t2m": 30.0,
            "tmax": 38.6,
            "tmin": 21.8,
            "rain_mm": 0.1,
            "rad_mj": 22.4,
            "rh_pct": 46.3,
            "gdd_day": 20.2
          },
          {
            "date": "2026-10-25",
            "t2m": 29.7,
            "tmax": 38.1,
            "tmin": 22.6,
            "rain_mm": 8.0,
            "rad_mj": 21.3,
            "rh_pct": 46.3,
            "gdd_day": 20.3
          },
          {
            "date": "2026-10-26",
            "t2m": 25.9,
            "tmax": 33.0,
            "tmin": 20.6,
            "rain_mm": 0.0,
            "rad_mj": 19.0,
            "rh_pct": 55.7,
            "gdd_day": 16.8
          },
          {
            "date": "2026-10-27",
            "t2m": 27.5,
            "tmax": 36.5,
            "tmin": 18.8,
            "rain_mm": 0.1,
            "rad_mj": 19.1,
            "rh_pct": 41.5,
            "gdd_day": 17.7
          },
          {
            "date": "2026-10-28",
            "t2m": 27.4,
            "tmax": 35.9,
            "tmin": 21.4,
            "rain_mm": 6.5,
            "rad_mj": 7.7,
            "rh_pct": 49.9,
            "gdd_day": 18.6
          },
          {
            "date": "2026-10-29",
            "t2m": 24.0,
            "tmax": 28.5,
            "tmin": 20.5,
            "rain_mm": 3.4,
            "rad_mj": 14.0,
            "rh_pct": 72.3,
            "gdd_day": 14.5
          },
          {
            "date": "2026-10-30",
            "t2m": 25.7,
            "tmax": 31.6,
            "tmin": 20.3,
            "rain_mm": 4.3,
            "rad_mj": 23.6,
            "rh_pct": 67.7,
            "gdd_day": 15.9
          },
          {
            "date": "2026-10-31",
            "t2m": 26.1,
            "tmax": 32.4,
            "tmin": 21.9,
            "rain_mm": 8.2,
            "rad_mj": 3.3,
            "rh_pct": 69.7,
            "gdd_day": 17.1
          }
        ]
      }
    },
    {
      "id": "climateserv",
      "name": "NASA SERVIR ClimateSERV – IMERG V07 & CHIRPS",
      "provider": "NASA + USAID (SERVIR Global)",
      "layer": "2. Agromet & Satélite",
      "url": "https://climateserv.servirglobal.net/api/submitDataRequest/",
      "auth_required": "Nenhum (API REST Assíncrona sem Token)",
      "expected_format": "JSON (Polling Assíncrono)",
      "actual_format": "application/json (Async Job Queue)",
      "spatial_resolution": "CHIRPS: 0.05° (~5,5 km) | IMERG V07: 0.1° (~10 km)",
      "temporal_resolution": "Diária (Observação Quase Tempo Real)",
      "coverage": "Global (Polígono 0.2° x 0.2° sobre Rio Verde/GO)",
      "data_nature": "Dado Fatídico (Observado por Satélite)",
      "period_min": "CHIRPS: 1981 | IMERG: 2000",
      "period_max": "30/10/2026 (IMERG V07)",
      "plain_question": "Quanto choveu exatamente em cima da minha fazenda nos últimos dias, mesmo sem pluviômetro?",
      "plain_answer": "O satélite IMERG V07 mediu 228.2 mm de chuva em Out/2026 sobre o polígono da fazenda (e CHIRPS registrou 92.6 mm em Set/2026).",
      "fit_score": 4,
      "fit_analysis": "Excelente para precipitação observada em alta resolução (5–10 km) sem login Earthdata. ACHADO DE AUDITORIA: A camada de previsão sazonal NMME dentro do ClimateSERV está com status 'layer-off' (parada em Nov/2025). Para previsão 2026/27, o pipeline redireciona para o NetCDF oficial do NOAA NMME.",
      "viz_type": "climateserv_rain",
      "status": "ONLINE_OPEN",
      "http_status": 200,
      "latency_ms": 15930,
      "audit_notes": "IMERG V07 Late (dt=226) operacional até Out/2026 e CHIRPS (dt=0) até Set/2026. Camada NMME dentro do ClimateSERV marcada como layer-off/desatualizada em 2025-11-28.",
      "error": null,
      "extracted_at": "2026-11-14T15:35:19.599743+00:00",
      "raw_sample": "{\n  \"imerg_v07_sample\": [\n    {\n      \"date\": \"2026-10-26\",\n      \"avg_mm\": 1.23\n    },\n    {\n      \"date\": \"2026-10-27\",\n      \"avg_mm\": 2.72\n    },\n    {\n      \"date\": \"2026-10-28\",\n      \"avg_mm\": 14.23\n    },\n    {\n      \"date\": \"2026-10-29\",\n      \"avg_mm\": 5.2\n    },\n    {\n      \"date\": \"2026-10-30\",\n      \"avg_mm\": 4.53\n    }\n  ],\n  \"chirps_sample\": [\n    {\n      \"date\": \"2026-09-26\",\n      \"avg_mm\": 0.0\n    },\n    {\n      \"date\": \"2026-09-27\",\n      \"avg_mm\": 14.78\n    },\n    {\n      \"date\": \"2026-09-28\",\n      \"avg_mm\": 1.88\n    },\n    {\n      \"date\": \"2026-09-29\",\n      \"avg_mm\": 32.71\n    },\n    {\n      \"date\": \"2026-09-30\",\n      \"avg_mm\": 0.0\n    }\n  ]\n}",
      "parsed_data": {
        "imerg_oct2026_days": 30,
        "imerg_oct2026_total_mm": 228.2,
        "chirps_sep2026_days": 30,
        "chirps_sep2026_total_mm": 92.6,
        "imerg_series": [
          {
            "date": "2026-10-01",
            "avg_mm": 25.35
          },
          {
            "date": "2026-10-02",
            "avg_mm": 27.73
          },
          {
            "date": "2026-10-03",
            "avg_mm": 4.45
          },
          {
            "date": "2026-10-04",
            "avg_mm": 14.65
          },
          {
            "date": "2026-10-05",
            "avg_mm": 17.55
          },
          {
            "date": "2026-10-06",
            "avg_mm": 9.65
          },
          {
            "date": "2026-10-07",
            "avg_mm": 2.88
          },
          {
            "date": "2026-10-08",
            "avg_mm": 0.0
          },
          {
            "date": "2026-10-09",
            "avg_mm": 0.03
          },
          {
            "date": "2026-10-10",
            "avg_mm": 0.05
          },
          {
            "date": "2026-10-11",
            "avg_mm": 6.23
          },
          {
            "date": "2026-10-12",
            "avg_mm": 8.73
          },
          {
            "date": "2026-10-13",
            "avg_mm": 5.53
          },
          {
            "date": "2026-10-14",
            "avg_mm": 15.4
          },
          {
            "date": "2026-10-15",
            "avg_mm": 3.95
          },
          {
            "date": "2026-10-16",
            "avg_mm": 1.3
          },
          {
            "date": "2026-10-17",
            "avg_mm": 0.3
          },
          {
            "date": "2026-10-18",
            "avg_mm": 0.0
          },
          {
            "date": "2026-10-19",
            "avg_mm": 0.0
          },
          {
            "date": "2026-10-20",
            "avg_mm": 0.0
          },
          {
            "date": "2026-10-21",
            "avg_mm": 0.0
          },
          {
            "date": "2026-10-22",
            "avg_mm": 27.45
          },
          {
            "date": "2026-10-23",
            "avg_mm": 15.9
          },
          {
            "date": "2026-10-24",
            "avg_mm": 5.38
          },
          {
            "date": "2026-10-25",
            "avg_mm": 7.82
          },
          {
            "date": "2026-10-26",
            "avg_mm": 1.23
          },
          {
            "date": "2026-10-27",
            "avg_mm": 2.72
          },
          {
            "date": "2026-10-28",
            "avg_mm": 14.23
          },
          {
            "date": "2026-10-29",
            "avg_mm": 5.2
          },
          {
            "date": "2026-10-30",
            "avg_mm": 4.53
          }
        ],
        "chirps_series": [
          {
            "date": "2026-09-01",
            "avg_mm": 0.0
          },
          {
            "date": "2026-09-02",
            "avg_mm": 0.0
          },
          {
            "date": "2026-09-03",
            "avg_mm": 0.0
          },
          {
            "date": "2026-09-04",
            "avg_mm": 0.0
          },
          {
            "date": "2026-09-05",
            "avg_mm": 0.0
          },
          {
            "date": "2026-09-06",
            "avg_mm": 0.0
          },
          {
            "date": "2026-09-07",
            "avg_mm": 0.0
          },
          {
            "date": "2026-09-08",
            "avg_mm": 0.0
          },
          {
            "date": "2026-09-09",
            "avg_mm": 0.0
          },
          {
            "date": "2026-09-10",
            "avg_mm": 0.0
          },
          {
            "date": "2026-09-11",
            "avg_mm": 0.0
          },
          {
            "date": "2026-09-12",
            "avg_mm": 0.0
          },
          {
            "date": "2026-09-13",
            "avg_mm": 0.0
          },
          {
            "date": "2026-09-14",
            "avg_mm": 0.0
          },
          {
            "date": "2026-09-15",
            "avg_mm": 0.0
          },
          {
            "date": "2026-09-16",
            "avg_mm": 0.0
          },
          {
            "date": "2026-09-17",
            "avg_mm": 0.0
          },
          {
            "date": "2026-09-18",
            "avg_mm": 0.0
          },
          {
            "date": "2026-09-19",
            "avg_mm": 0.0
          },
          {
            "date": "2026-09-20",
            "avg_mm": 0.0
          },
          {
            "date": "2026-09-21",
            "avg_mm": 0.0
          },
          {
            "date": "2026-09-22",
            "avg_mm": 13.52
          },
          {
            "date": "2026-09-23",
            "avg_mm": 0.0
          },
          {
            "date": "2026-09-24",
            "avg_mm": 15.31
          },
          {
            "date": "2026-09-25",
            "avg_mm": 14.42
          },
          {
            "date": "2026-09-26",
            "avg_mm": 0.0
          },
          {
            "date": "2026-09-27",
            "avg_mm": 14.78
          },
          {
            "date": "2026-09-28",
            "avg_mm": 1.88
          },
          {
            "date": "2026-09-29",
            "avg_mm": 32.71
          },
          {
            "date": "2026-09-30",
            "avg_mm": 0.0
          }
        ],
        "nmme_subfeed_status": "INATIVO (layer-off desde 2025-11-28) -> mitigado via NOAA NMME"
      }
    },
    {
      "id": "cmr_gpm",
      "name": "NASA GPM IMERG – Catálogo CMR (GPM_3IMERGDF)",
      "provider": "NASA GES DISC / Goddard Space Flight Center",
      "layer": "2. Agromet & Satélite",
      "url": "https://cmr.earthdata.nasa.gov/search/granules.json",
      "auth_required": "Descoberta CMR Aberta | Download HDF5/NetCDF exige Earthdata Login (Gratuito)",
      "expected_format": "JSON (Metadados) -> HDF5/NetCDF4 (Pixels)",
      "actual_format": "application/json (CMR) -> HDF5 (.HDF5)",
      "spatial_resolution": "0.1° x 0.1° (~10 km)",
      "temporal_resolution": "Diária / 30 min",
      "coverage": "Global (60°N–60°S)",
      "data_nature": "Dado Fatídico (Observado) — Catálogo",
      "period_min": "Jun/2000",
      "period_max": "Tempo Quase Real (2026)",
      "plain_question": "Onde ficam os arquivos originais de chuva da NASA com calibração científica máxima?",
      "plain_answer": "Catálogo aberto confirmando passagens diárias da constelação GPM sobre a fazenda em Nov/2026.",
      "fit_score": 5,
      "fit_analysis": "Fonte primária oficial da NASA para precipitação calibrada por satélite. Na fase de produção com Earthdata Token, alimenta alertas locais de chuva acumulada na fazenda.",
      "viz_type": "cmr_granules",
      "status": "ONLINE_DISCOVERY_ONLY",
      "http_status": 200,
      "latency_ms": 708,
      "audit_notes": "Busca de grânulos 100% aberta; download direto do HDF5 no GES DISC requer Earthdata Bearer Token.",
      "error": null,
      "extracted_at": "2026-11-14T15:35:38.064225+00:00",
      "raw_sample": "[\n  {\n    \"id\": \"GPM_3IMERGDF.07:3B-DAY.MS.MRG.3IMERG.20250930-S000000-E235959.V07B.nc4\",\n    \"start\": \"2025-09-30T00:00:00.000Z\",\n    \"end\": \"2025-09-30T23:59:59.999Z\",\n    \"size_mb\": \"30.9714450836182\",\n    \"download_url\": \"https://data.gesdisc.earthdata.nasa.gov/data/GPM_L3/GPM_3IMERGDF.07/2025/09/3B-DAY.MS.MRG.3IMERG.20250930-S000000-E235959.V07B.nc4\"\n  },\n  {\n    \"id\": \"GPM_3IMERGDF.07:3B-DAY.MS.MRG.3IMERG.20250929-S000000-E235959.V07B.nc4\",\n    \"start\": \"2025-09-29T00:00:00.000Z\",\n    \"end\": \"2025-09-29T23:59:59.999Z\",\n    \"size_mb\": \"30.6221685409546\",\n    \"download_url\": \"https://data.gesdisc.earthdata.nasa.gov/data/GPM_L3/GPM_3IMERGDF.07/2025/09/3B-DAY.MS.MRG.3IMERG.20250929-S000000-E235959.V07B.nc4\"\n  }\n]",
      "parsed_data": {
        "collection": "GPM_3IMERGDF v07",
        "granules_found": 5,
        "granules": [
          {
            "id": "GPM_3IMERGDF.07:3B-DAY.MS.MRG.3IMERG.20250930-S000000-E235959.V07B.nc4",
            "start": "2025-09-30T00:00:00.000Z",
            "end": "2025-09-30T23:59:59.999Z",
            "size_mb": "30.9714450836182",
            "download_url": "https://data.gesdisc.earthdata.nasa.gov/data/GPM_L3/GPM_3IMERGDF.07/2025/09/3B-DAY.MS.MRG.3IMERG.20250930-S000000-E235959.V07B.nc4"
          },
          {
            "id": "GPM_3IMERGDF.07:3B-DAY.MS.MRG.3IMERG.20250929-S000000-E235959.V07B.nc4",
            "start": "2025-09-29T00:00:00.000Z",
            "end": "2025-09-29T23:59:59.999Z",
            "size_mb": "30.6221685409546",
            "download_url": "https://data.gesdisc.earthdata.nasa.gov/data/GPM_L3/GPM_3IMERGDF.07/2025/09/3B-DAY.MS.MRG.3IMERG.20250929-S000000-E235959.V07B.nc4"
          },
          {
            "id": "GPM_3IMERGDF.07:3B-DAY.MS.MRG.3IMERG.20250928-S000000-E235959.V07B.nc4",
            "start": "2025-09-28T00:00:00.000Z",
            "end": "2025-09-28T23:59:59.999Z",
            "size_mb": "31.0935640335083",
            "download_url": "https://data.gesdisc.earthdata.nasa.gov/data/GPM_L3/GPM_3IMERGDF.07/2025/09/3B-DAY.MS.MRG.3IMERG.20250928-S000000-E235959.V07B.nc4"
          },
          {
            "id": "GPM_3IMERGDF.07:3B-DAY.MS.MRG.3IMERG.20250927-S000000-E235959.V07B.nc4",
            "start": "2025-09-27T00:00:00.000Z",
            "end": "2025-09-27T23:59:59.999Z",
            "size_mb": "31.0801982879639",
            "download_url": "https://data.gesdisc.earthdata.nasa.gov/data/GPM_L3/GPM_3IMERGDF.07/2025/09/3B-DAY.MS.MRG.3IMERG.20250927-S000000-E235959.V07B.nc4"
          },
          {
            "id": "GPM_3IMERGDF.07:3B-DAY.MS.MRG.3IMERG.20250926-S000000-E235959.V07B.nc4",
            "start": "2025-09-26T00:00:00.000Z",
            "end": "2025-09-26T23:59:59.999Z",
            "size_mb": "31.0895795822144",
            "download_url": "https://data.gesdisc.earthdata.nasa.gov/data/GPM_L3/GPM_3IMERGDF.07/2025/09/3B-DAY.MS.MRG.3IMERG.20250926-S000000-E235959.V07B.nc4"
          }
        ]
      }
    },
    {
      "id": "inmet_stations",
      "name": "INMET – Estação Automática Rio Verde (A025)",
      "provider": "Instituto Nacional de Meteorologia (MAPA – Brasil)",
      "layer": "2. Agromet & Satélite",
      "url": "https://apitempo.inmet.gov.br/estacoes/T",
      "auth_required": "Catálogo Aberto | Séries Horárias (/estacao) exigem Token INMET",
      "expected_format": "JSON",
      "actual_format": "application/json",
      "spatial_resolution": "Pontual (Estação A025: -17.785°, -50.965°, Alt. 780m)",
      "temporal_resolution": "Horária / Diária",
      "coverage": "Rede Nacional do Brasil",
      "data_nature": "Dado Fatídico (Estação em Solo)",
      "period_min": "16/05/2007 (A025)",
      "period_max": "Hoje (Requer Token)",
      "plain_question": "Existe estação meteorológica física oficial perto da fazenda para conferir os satélites?",
      "plain_answer": "Sim! A estação automática A025 em Rio Verde (780m) está operante desde 2007, mas exige Token para baixar séries.",
      "fit_score": 3,
      "fit_analysis": "Útil como verdade de campo (ground-truth) para calibrar os pixels da NASA onde houver estação próxima. Por exigir cadastro de token para séries históricas e ter lacunas em regiões remotas, o NASA POWER + IMERG permanecem como fonte primária escalável.",
      "viz_type": "audit_summary",
      "status": "ONLINE_DISCOVERY_ONLY",
      "http_status": 200,
      "latency_ms": 416,
      "audit_notes": "Catálogo ativo (668 estações). Consulta de série temporal sem token retornou HTTP 204.",
      "error": null,
      "extracted_at": "2026-11-14T15:35:38.779988+00:00",
      "raw_sample": "[\n  {\n    \"CD_OSCAR\": \"0-2000-0-86753\",\n    \"DC_NOME\": \"RIO VERDE\",\n    \"FL_CAPITAL\": \"N\",\n    \"DT_FIM_OPERACAO\": null,\n    \"CD_SITUACAO\": \"Operante\",\n    \"TP_ESTACAO\": \"Automatica\",\n    \"VL_LATITUDE\": \"-17.78527777\",\n    \"CD_WSI\": \"0-76-0-5218805000000184\",\n    \"CD_DISTRITO\": \" 10\",\n    \"VL_ALTITUDE\": \"780.11\",\n    \"SG_ESTADO\": \"GO\",\n    \"SG_ENTIDADE\": \"INMET\",\n    \"CD_ESTACAO\": \"A025\",\n    \"VL_LONGITUDE\": \"-50.965\",\n    \"DT_INICIO_OPERACAO\": \"2007-05-16T21:00:00.000-03:00\"\n  }\n]",
      "parsed_data": {
        "total_br_stations": 668,
        "anchor_station": {
          "CD_OSCAR": "0-2000-0-86753",
          "DC_NOME": "RIO VERDE",
          "FL_CAPITAL": "N",
          "DT_FIM_OPERACAO": null,
          "CD_SITUACAO": "Operante",
          "TP_ESTACAO": "Automatica",
          "VL_LATITUDE": "-17.78527777",
          "CD_WSI": "0-76-0-5218805000000184",
          "CD_DISTRITO": " 10",
          "VL_ALTITUDE": "780.11",
          "SG_ESTADO": "GO",
          "SG_ENTIDADE": "INMET",
          "CD_ESTACAO": "A025",
          "VL_LONGITUDE": "-50.965",
          "DT_INICIO_OPERACAO": "2007-05-16T21:00:00.000-03:00"
        },
        "timeseries_probe_status": 204
      }
    },
    {
      "id": "soilgrids",
      "name": "ISRIC SoilGrids 2.0 – Textura e Classificação de Solo",
      "provider": "ISRIC World Soil Information (Parceiro Global / FAO)",
      "layer": "3. Solo & Água",
      "url": "https://rest.isric.org/soilgrids/v2.0/properties/query",
      "auth_required": "Nenhum (100% Aberto)",
      "expected_format": "JSON (GeoJSON Feature)",
      "actual_format": "application/json (GeoJSON)",
      "spatial_resolution": "250 metros (Escala de Talhão)",
      "temporal_resolution": "Estático (Propriedades Físicas do Solo)",
      "coverage": "Global (Consultado na Zona Rural Rio Verde/GO)",
      "data_nature": "Dado Fatídico (Mapeamento Físico)",
      "period_min": "Estático (Perfil permanente)",
      "period_max": "Estático (Válido para qualquer safra)",
      "plain_question": "O solo da fazenda é arenoso ou argiloso (retém água bem)? Qual a classe no ZARC?",
      "plain_answer": "Detectado solo com 38.5% de argila na camada 15–30cm -> classificado automaticamente como Tipo 3 (Argiloso ≥ 35% argila — Alta retenção hídrica).",
      "fit_score": 5,
      "fit_analysis": "Resolve um grande gargalo de UX: descobre automaticamente pela coordenada GPS se o solo da fazenda é Arenoso (Tipo 1), Médio (Tipo 2) ou Argiloso (Tipo 3) para consultar as regras corretas de janela de seguro do ZARC (Embrapa).",
      "viz_type": "soil_profile",
      "status": "ONLINE_OPEN",
      "http_status": 200,
      "latency_ms": 11655,
      "audit_notes": "",
      "error": null,
      "extracted_at": "2026-11-14T15:35:39.204197+00:00",
      "raw_sample": "{\n  \"type\": \"Feature\",\n  \"geometry\": {\n    \"type\": \"Point\",\n    \"coordinates\": [\n      -51.02,\n      -17.84\n    ]\n  },\n  \"properties\": {\n    \"layers\": [\n      {\n        \"name\": \"clay\",\n        \"unit_measure\": {\n          \"d_factor\": 10,\n          \"mapped_units\": \"g/kg\",\n          \"target_units\": \"%\",\n          \"uncertainty_unit\": \"\"\n        },\n        \"depths\": [\n          {\n            \"range\": {\n              \"top_depth\": 0,\n              \"bottom_depth\": 5,\n              \"unit_depth\": \"cm\"\n            },\n            \"label\": \"0-5cm\",\n            \"values\": {\n              \"mean\": 340\n            }\n          },\n          {\n            \"range\": {\n              \"top_depth\": 15,\n              \"bottom_depth\": 30,\n              \"unit_depth\": \"cm\"\n            },\n            \"label\": \"15-30cm\",\n            \"values\": {\n              \"mean\": 385\n            }\n          }\n        ]\n      },\n      {\n        \"name\": \"sand\",\n        \"unit_measure\": {\n          \"d_factor\": 10,\n          \"mapped_units\": \"g/kg\",\n          \"target_units\": \"%\",\n          \"uncertainty_unit\": \"\"\n        },\n        \"depths\": [\n          {\n            \"range\": {\n              \"top_depth\": 0,\n              \"bottom_depth\": 5,\n              \"unit_depth\": \"cm\"\n            },\n            \"label\": \"0-5cm\",\n            \"values\": {\n              \"mean\": 470\n            }\n          },\n          {\n            \"range\": {\n              \"top_depth\": 15,\n              \"bottom_depth\": 30,\n              \"unit_depth\": \"cm\"\n            },\n            \"label\": \"15-30cm\",\n            \"values\": {\n              \"mean\": 445\n          ",
      "parsed_data": {
        "depths": {
          "0-5cm": {
            "clay": 34.0,
            "sand": 47.0,
            "silt": 19.0
          },
          "15-30cm": {
            "clay": 38.5,
            "sand": 44.5,
            "silt": 17.0
          }
        },
        "zarc_soil_code": 3,
        "zarc_soil_classification": "Tipo 3 (Argiloso ≥ 35% argila — Alta retenção hídrica)"
      }
    },
    {
      "id": "cmr_smap",
      "name": "NASA SMAP L4 – Umidade na Zona de Raízes (SPL4SMGP)",
      "provider": "NASA JPL / NSIDC DAAC",
      "layer": "3. Solo & Água",
      "url": "https://cmr.earthdata.nasa.gov/search/granules.json",
      "auth_required": "Descoberta CMR Aberta | Download HDF5/AppEEARS exige Earthdata Login",
      "expected_format": "JSON (CMR) -> HDF5 / GeoTIFF",
      "actual_format": "application/json (CMR) -> HDF5 (.h5)",
      "spatial_resolution": "9 km (Superfície 0–5cm e Zona de Raiz 0–100cm)",
      "temporal_resolution": "A cada 3 horas (Latência operacional ~2,5 dias)",
      "coverage": "Global",
      "data_nature": "Dado Fatídico + Assimilação (Observado)",
      "period_min": "Mar/2015 (Lançamento SMAP)",
      "period_max": "D-3 dias (Tempo Quase Real)",
      "plain_question": "Já há água suficiente na profundidade da raiz para a semente germinar hoje?",
      "plain_answer": "Cobertura contínua de 9 km confirmada sobre Rio Verde em Nov/2026; pixels disponíveis via Earthdata Token.",
      "fit_score": 5,
      "fit_analysis": "Sensor vital para o 'Semáforo de Plantio': mede diretamente a umidade na zona radicular para impedir que o produtor semeie no pó antes da consolidação das chuvas de El Niño.",
      "viz_type": "cmr_granules",
      "status": "ONLINE_DISCOVERY_ONLY",
      "http_status": 200,
      "latency_ms": 687,
      "audit_notes": "Grânulos ativos em 2026 confirmados sobre Rio Verde/GO. Em produção, extrair série via NASA AppEEARS API com Earthdata Bearer Token.",
      "error": null,
      "extracted_at": "2026-11-14T15:35:50.862043+00:00",
      "raw_sample": "[\n  {\n    \"id\": \"SMAP_L4_SM_gph_20261110T223000_Vv8013_001.h5_u9loH5HD\",\n    \"start\": \"2026-11-10T21:00:00.000Z\",\n    \"end\": \"2026-11-11T00:00:00.000Z\",\n    \"size_mb\": \"142.94359493255615\",\n    \"download_url\": \"https://data.nsidc.earthdatacloud.nasa.gov/nsidc-cumulus-prod-protected/SMAP/SPL4SMGP/008/2026/11/10/SMAP_L4_SM_gph_20261110T223000_Vv8013_001.h5\"\n  },\n  {\n    \"id\": \"SMAP_L4_SM_gph_20261110T193000_Vv8013_001.h5_u9loH5HD\",\n    \"start\": \"2026-11-10T18:00:00.000Z\",\n    \"end\": \"2026-11-10T21:00:00.000Z\",\n    \"size_mb\": \"143.29909610748285\",\n    \"download_url\": \"https://data.nsidc.earthdatacloud.nasa.gov/nsidc-cumulus-prod-protected/SMAP/SPL4SMGP/008/2026/11/10/SMAP_L4_SM_gph_20261110T193000_Vv8013_001.h5\"\n  }\n]",
      "parsed_data": {
        "collection": "SPL4SMGP v007/v008",
        "granules_found": 5,
        "granules": [
          {
            "id": "SMAP_L4_SM_gph_20261110T223000_Vv8013_001.h5_u9loH5HD",
            "start": "2026-11-10T21:00:00.000Z",
            "end": "2026-11-11T00:00:00.000Z",
            "size_mb": "142.94359493255615",
            "download_url": "https://data.nsidc.earthdatacloud.nasa.gov/nsidc-cumulus-prod-protected/SMAP/SPL4SMGP/008/2026/11/10/SMAP_L4_SM_gph_20261110T223000_Vv8013_001.h5"
          },
          {
            "id": "SMAP_L4_SM_gph_20261110T193000_Vv8013_001.h5_u9loH5HD",
            "start": "2026-11-10T18:00:00.000Z",
            "end": "2026-11-10T21:00:00.000Z",
            "size_mb": "143.29909610748285",
            "download_url": "https://data.nsidc.earthdatacloud.nasa.gov/nsidc-cumulus-prod-protected/SMAP/SPL4SMGP/008/2026/11/10/SMAP_L4_SM_gph_20261110T193000_Vv8013_001.h5"
          },
          {
            "id": "SMAP_L4_SM_gph_20261110T163000_Vv8013_001.h5_u9loH5HD",
            "start": "2026-11-10T15:00:00.000Z",
            "end": "2026-11-10T18:00:00.000Z",
            "size_mb": "144.31050109863276",
            "download_url": "https://data.nsidc.earthdatacloud.nasa.gov/nsidc-cumulus-prod-protected/SMAP/SPL4SMGP/008/2026/11/10/SMAP_L4_SM_gph_20261110T163000_Vv8013_001.h5"
          },
          {
            "id": "SMAP_L4_SM_gph_20261110T133000_Vv8013_001.h5_u9loH5HD",
            "start": "2026-11-10T12:00:00.000Z",
            "end": "2026-11-10T15:00:00.000Z",
            "size_mb": "143.86407279968267",
            "download_url": "https://data.nsidc.earthdatacloud.nasa.gov/nsidc-cumulus-prod-protected/SMAP/SPL4SMGP/008/2026/11/10/SMAP_L4_SM_gph_20261110T133000_Vv8013_001.h5"
          },
          {
            "id": "SMAP_L4_SM_gph_20261110T103000_Vv8013_001.h5_u9loH5HD",
            "start": "2026-11-10T09:00:00.000Z",
            "end": "2026-11-10T12:00:00.000Z",
            "size_mb": "146.37244129180905",
            "download_url": "https://data.nsidc.earthdatacloud.nasa.gov/nsidc-cumulus-prod-protected/SMAP/SPL4SMGP/008/2026/11/10/SMAP_L4_SM_gph_20261110T103000_Vv8013_001.h5"
          }
        ]
      }
    },
    {
      "id": "cmr_gldas",
      "name": "NASA GLDAS – Hidrologia Estratificada (0–200 cm)",
      "provider": "NASA GSFC Hydrological Sciences Lab",
      "layer": "3. Solo & Água",
      "url": "https://cmr.earthdata.nasa.gov/search/granules.json",
      "auth_required": "Descoberta CMR Aberta | Download NetCDF exige Earthdata Login",
      "expected_format": "JSON (CMR) -> NetCDF4",
      "actual_format": "application/json (CMR) -> NetCDF4 (.nc4)",
      "spatial_resolution": "0.25° x 0.25° (~27 km)",
      "temporal_resolution": "3 horas / Mensal",
      "coverage": "Global (4 camadas: 0–10, 10–40, 40–100, 100–200 cm)",
      "data_nature": "Simulação Hidrológica (Modelo Noah)",
      "period_min": "Jan/2000",
      "period_max": "Tempo Quase Real (2026)",
      "plain_question": "Existe água guardada nas camadas profundas (até 2m) para sustentar Sorgo ou Algodão?",
      "plain_answer": "Modelo estratificado até 2 metros de profundidade confirmado para Rio Verde no catálogo CMR.",
      "fit_score": 4,
      "fit_analysis": "Diferencia a disponibilidade hídrica em profundidade para comparar milho (raiz mais rasa) contra sorgo e algodão (que exploram reserva até 1,5–2,0 metros).",
      "viz_type": "cmr_granules",
      "status": "ONLINE_DISCOVERY_ONLY",
      "http_status": 200,
      "latency_ms": 590,
      "audit_notes": "Cobertura contínua confirmada via CMR. Download no GES DISC requer Earthdata Token.",
      "error": null,
      "extracted_at": "2026-11-14T15:35:51.553373+00:00",
      "raw_sample": "[\n  {\n    \"id\": \"GLDAS_NOAH025_3H.2.1:GLDAS_NOAH025_3H.A20260731.2100.021.nc4\",\n    \"start\": \"2026-07-31T21:00:00.000Z\",\n    \"end\": \"2026-07-31T21:00:00.000Z\",\n    \"size_mb\": \"21.2247314453125\",\n    \"download_url\": \"https://data.gesdisc.earthdata.nasa.gov/data/GLDAS/GLDAS_NOAH025_3H.2.1/2026/212/GLDAS_NOAH025_3H.A20260731.2100.021.nc4\"\n  },\n  {\n    \"id\": \"GLDAS_NOAH025_3H.2.1:GLDAS_NOAH025_3H.A20260731.1800.021.nc4\",\n    \"start\": \"2026-07-31T18:00:00.000Z\",\n    \"end\": \"2026-07-31T18:00:00.000Z\",\n    \"size_mb\": \"21.3994283676147\",\n    \"download_url\": \"https://data.gesdisc.earthdata.nasa.gov/data/GLDAS/GLDAS_NOAH025_3H.2.1/2026/212/GLDAS_NOAH025_3H.A20260731.1800.021.nc4\"\n  }\n]",
      "parsed_data": {
        "collection": "GLDAS_NOAH025_3H v2.1",
        "granules_found": 5,
        "granules": [
          {
            "id": "GLDAS_NOAH025_3H.2.1:GLDAS_NOAH025_3H.A20260731.2100.021.nc4",
            "start": "2026-07-31T21:00:00.000Z",
            "end": "2026-07-31T21:00:00.000Z",
            "size_mb": "21.2247314453125",
            "download_url": "https://data.gesdisc.earthdata.nasa.gov/data/GLDAS/GLDAS_NOAH025_3H.2.1/2026/212/GLDAS_NOAH025_3H.A20260731.2100.021.nc4"
          },
          {
            "id": "GLDAS_NOAH025_3H.2.1:GLDAS_NOAH025_3H.A20260731.1800.021.nc4",
            "start": "2026-07-31T18:00:00.000Z",
            "end": "2026-07-31T18:00:00.000Z",
            "size_mb": "21.3994283676147",
            "download_url": "https://data.gesdisc.earthdata.nasa.gov/data/GLDAS/GLDAS_NOAH025_3H.2.1/2026/212/GLDAS_NOAH025_3H.A20260731.1800.021.nc4"
          },
          {
            "id": "GLDAS_NOAH025_3H.2.1:GLDAS_NOAH025_3H.A20260731.1500.021.nc4",
            "start": "2026-07-31T15:00:00.000Z",
            "end": "2026-07-31T15:00:00.000Z",
            "size_mb": "21.5870695114136",
            "download_url": "https://data.gesdisc.earthdata.nasa.gov/data/GLDAS/GLDAS_NOAH025_3H.2.1/2026/212/GLDAS_NOAH025_3H.A20260731.1500.021.nc4"
          },
          {
            "id": "GLDAS_NOAH025_3H.2.1:GLDAS_NOAH025_3H.A20260731.1200.021.nc4",
            "start": "2026-07-31T12:00:00.000Z",
            "end": "2026-07-31T12:00:00.000Z",
            "size_mb": "21.7043170928955",
            "download_url": "https://data.gesdisc.earthdata.nasa.gov/data/GLDAS/GLDAS_NOAH025_3H.2.1/2026/212/GLDAS_NOAH025_3H.A20260731.1200.021.nc4"
          },
          {
            "id": "GLDAS_NOAH025_3H.2.1:GLDAS_NOAH025_3H.A20260731.0900.021.nc4",
            "start": "2026-07-31T09:00:00.000Z",
            "end": "2026-07-31T09:00:00.000Z",
            "size_mb": "21.486780166626",
            "download_url": "https://data.gesdisc.earthdata.nasa.gov/data/GLDAS/GLDAS_NOAH025_3H.2.1/2026/212/GLDAS_NOAH025_3H.A20260731.0900.021.nc4"
          }
        ]
      }
    },
    {
      "id": "grace_fo",
      "name": "NASA GRACE-FO – Indicadores de Aquífero e Seca Profunda",
      "provider": "NASA JPL & National Drought Mitigation Center (UNL)",
      "layer": "3. Solo & Água",
      "url": "https://nasagrace.unl.edu/",
      "auth_required": "Nenhum (Portal, WMS e GeoTIFFs semanais públicos)",
      "expected_format": "HTML / WMS / GeoTIFF",
      "actual_format": "text/html + GeoTIFF/WMS",
      "spatial_resolution": "0.25° x 0.25° (~27 km)",
      "temporal_resolution": "Semanal",
      "coverage": "Global",
      "data_nature": "Dado Fatídico (Gravimetria Orbital)",
      "period_min": "Abr/2002",
      "period_max": "Semanal (2026)",
      "plain_question": "O lençol freático da região está secando (risco para pivôs de irrigação)?",
      "plain_answer": "Portal público ativo com mapas semanais de água subterrânea; útil apenas se a fazenda usar irrigação.",
      "fit_score": 3,
      "fit_analysis": "Mais relevante para fazendas com pivô central de irrigação (monitoramento de recarga do lençol freático em secas severas). Menos determinante para agricultura 100% de sequeiro.",
      "viz_type": "audit_summary",
      "status": "ONLINE_OPEN",
      "http_status": 200,
      "latency_ms": 986,
      "audit_notes": "Portal operacional. Para ingestão automatizada, recomenda-se consumir o GeoTIFF semanal de Root Zone/Groundwater.",
      "error": null,
      "extracted_at": "2026-11-14T15:35:52.147154+00:00",
      "raw_sample": "Title: Home | NASA Grace\nLinks: ['/ConusData.aspx', '/GlobalData.aspx', 'https://drought.unl.edu']",
      "parsed_data": {
        "portal_title": "Home | NASA Grace",
        "discovered_links": [
          "/ConusData.aspx",
          "/GlobalData.aspx",
          "https://drought.unl.edu"
        ]
      }
    },
    {
      "id": "cmr_ecostress",
      "name": "NASA ECOSTRESS – Evapotranspiração e Estresse Térmico (70m)",
      "provider": "NASA JPL / LP DAAC (A bordo da ISS)",
      "layer": "4. Fenologia & Talhão",
      "url": "https://cmr.earthdata.nasa.gov/search/granules.json",
      "auth_required": "Descoberta CMR Aberta | Download HDF5/GeoTIFF exige Earthdata Login",
      "expected_format": "JSON (CMR) -> HDF5 / GeoTIFF",
      "actual_format": "application/json (CMR) -> GeoTIFF/HDF5",
      "spatial_resolution": "70 metros x 70 metros (Escala intra-talhão)",
      "temporal_resolution": "Revisita variável de 1 a 5 dias",
      "coverage": "Global (±52° Latitude — cobre 100% do Brasil)",
      "data_nature": "Dado Fatídico (Térmico / ISS)",
      "period_min": "Jul/2018",
      "period_max": "Tempo Quase Real (2026)",
      "plain_question": "As plantas do talhão já estão sentindo sede/calor antes mesmo da folha amarelar?",
      "plain_answer": "Passagens térmicas de 70m sobre Rio Verde confirmadas em 2026 no CMR; permite alerta precoce de veranico.",
      "fit_score": 5,
      "fit_analysis": "Resolução de 70m permite enxergar talhões individuais em fazendas de 100–1.500 ha e detectar estresse hídrico na floração (veranico de El Niño) até 14 dias antes do NDVI.",
      "viz_type": "cmr_granules",
      "status": "ONLINE_DISCOVERY_ONLY",
      "http_status": 200,
      "latency_ms": 692,
      "audit_notes": "Cenas recentes de 70m sobre Rio Verde/GO confirmadas no CMR. Pixel extraction via AppEEARS requer Earthdata Token.",
      "error": null,
      "extracted_at": "2026-11-14T15:35:53.141345+00:00",
      "raw_sample": "[\n  {\n    \"id\": \"ECOv002_L3T_JET_46942_017_22KEF_20261015T190255_0713_01\",\n    \"start\": \"2026-10-15T19:02:55.287Z\",\n    \"end\": \"2026-10-15T19:03:47.257Z\",\n    \"size_mb\": \"3.45\",\n    \"download_url\": \"https://data.lpdaac.earthdatacloud.nasa.gov/lp-prod-protected/ECO_L3T_JET.002/ECOv002_L3T_JET_46942_017_22KEF_20261015T190255_0713_01/ECOv002_L3T_JET_46942_017_22KEF_20261015T190255_0713_01_STICinst.tif\"\n  },\n  {\n    \"id\": \"ECOv003_L3T_JET_46942_017_22KEF_20261015T190255_01\",\n    \"start\": \"2026-10-15T19:02:55.287Z\",\n    \"end\": \"2026-10-15T19:03:47.257Z\",\n    \"size_mb\": \"9.05\",\n    \"download_url\": \"https://data.lpdaac.earthdatacloud.nasa.gov/lp-prod-protected/ECO_L3T_JET.003/ECOv003_L3T_JET_46942_017_22KEF_20261015T190255_01/ECOv003_L3T_JET_46942_017_22KEF_20261015T190255_01_PTJPLSMinst.tif\"\n  }\n]",
      "parsed_data": {
        "collection": "ECO_L3T_JET v002",
        "granules_found": 5,
        "granules": [
          {
            "id": "ECOv002_L3T_JET_46942_017_22KEF_20261015T190255_0713_01",
            "start": "2026-10-15T19:02:55.287Z",
            "end": "2026-10-15T19:03:47.257Z",
            "size_mb": "3.45",
            "download_url": "https://data.lpdaac.earthdatacloud.nasa.gov/lp-prod-protected/ECO_L3T_JET.002/ECOv002_L3T_JET_46942_017_22KEF_20261015T190255_0713_01/ECOv002_L3T_JET_46942_017_22KEF_20261015T190255_0713_01_STICinst.tif"
          },
          {
            "id": "ECOv003_L3T_JET_46942_017_22KEF_20261015T190255_01",
            "start": "2026-10-15T19:02:55.287Z",
            "end": "2026-10-15T19:03:47.257Z",
            "size_mb": "9.05",
            "download_url": "https://data.lpdaac.earthdatacloud.nasa.gov/lp-prod-protected/ECO_L3T_JET.003/ECOv003_L3T_JET_46942_017_22KEF_20261015T190255_01/ECOv003_L3T_JET_46942_017_22KEF_20261015T190255_01_PTJPLSMinst.tif"
          },
          {
            "id": "ECOv003_L3T_JET_46881_017_22KEF_20261011T203527_01",
            "start": "2026-10-11T20:35:27.504Z",
            "end": "2026-10-11T20:36:19.474Z",
            "size_mb": "69.76",
            "download_url": "https://data.lpdaac.earthdatacloud.nasa.gov/lp-prod-protected/ECO_L3T_JET.003/ECOv003_L3T_JET_46881_017_22KEF_20261011T203527_01/ECOv003_L3T_JET_46881_017_22KEF_20261011T203527_01_PTJPLSMinst.tif"
          },
          {
            "id": "ECOv002_L3T_JET_46764_032_22KEF_20261004T093225_0713_01",
            "start": "2026-10-04T09:32:25.084Z",
            "end": "2026-10-04T09:33:17.054Z",
            "size_mb": "0.39",
            "download_url": "https://data.lpdaac.earthdatacloud.nasa.gov/lp-prod-protected/ECO_L3T_JET.002/ECOv002_L3T_JET_46764_032_22KEF_20261004T093225_0713_01/ECOv002_L3T_JET_46764_032_22KEF_20261004T093225_0713_01_STICinst.tif"
          },
          {
            "id": "ECOv002_L3T_JET_46764_031_22KEF_20261004T093133_0713_01",
            "start": "2026-10-04T09:31:33.114Z",
            "end": "2026-10-04T09:32:25.084Z",
            "size_mb": "43.55",
            "download_url": "https://data.lpdaac.earthdatacloud.nasa.gov/lp-prod-protected/ECO_L3T_JET.002/ECOv002_L3T_JET_46764_031_22KEF_20261004T093133_0713_01/ECOv002_L3T_JET_46764_031_22KEF_20261004T093133_0713_01_STICinst.tif"
          }
        ]
      }
    },
    {
      "id": "cmr_hls",
      "name": "NASA HLS – Harmonized Landsat Sentinel-2 (STAC 30m)",
      "provider": "NASA GSFC / LPCLOUD (Parceria USGS + ESA)",
      "layer": "4. Fenologia & Talhão",
      "url": "https://cmr.earthdata.nasa.gov/stac/LPCLOUD/search",
      "auth_required": "Busca STAC 100% Aberta | Bandas COG GeoTIFF exigem Earthdata Login",
      "expected_format": "STAC GeoJSON -> Cloud-Optimized GeoTIFF (COG)",
      "actual_format": "application/geo+json (STAC) -> COG GeoTIFF",
      "spatial_resolution": "30 metros (Escala de Talhão)",
      "temporal_resolution": "2 a 3 dias (Landsat 8/9 + Sentinel-2A/B)",
      "coverage": "Global",
      "data_nature": "Dado Fatídico (Imagem Óptica 30m)",
      "period_min": "2013 (Landsat 8) / 2015 (Sentinel)",
      "period_max": "Nov/2026 (2 a 3 dias)",
      "plain_question": "Como está o verdor (NDVI) e desenvolvimento de cada talhão dentro da fazenda?",
      "plain_answer": "API STAC retornou 5 cenas recentes (Set–Nov/2026) de 30m exatamente sobre os limites da fazenda.",
      "fit_score": 4,
      "fit_analysis": "Ideal para desenhar os polígonos da fazenda (100–1.500 ha) e acompanhar o vigor vegetativo (NDVI/EVI) durante a safra com alta frequência livre de nuvens.",
      "viz_type": "cmr_granules",
      "status": "ONLINE_DISCOVERY_ONLY",
      "http_status": 200,
      "latency_ms": 974,
      "audit_notes": "API STAC retornou 5 cenas recentes (Set–Nov/2026) sobre Rio Verde/GO.",
      "error": null,
      "extracted_at": "2026-11-14T15:35:53.840735+00:00",
      "raw_sample": "[\n  {\n    \"id\": \"HLS.S30.T22KEF.2026244T133831.v2.0\",\n    \"start\": \"2026-09-01T13:47:12.957Z\",\n    \"cloud_cover_pct\": 81,\n    \"download_url\": \"https://data.lpdaac.earthdatacloud.nasa.gov/lp-prod-protected/HLSS30.020/HLS.S30.T22KEF.2026244T133831.v2.0/HLS.S30.T22KEF.2026244T133831.v2.0.B04.tif\"\n  },\n  {\n    \"id\": \"HLS.S30.T22KDF.2026244T133831.v2.0\",\n    \"start\": \"2026-09-01T13:47:16.561Z\",\n    \"cloud_cover_pct\": 64,\n    \"download_url\": \"https://data.lpdaac.earthdatacloud.nasa.gov/lp-prod-protected/HLSS30.020/HLS.S30.T22KDF.2026244T133831.v2.0/HLS.S30.T22KDF.2026244T133831.v2.0.B04.tif\"\n  }\n]",
      "parsed_data": {
        "collection": "HLSS30_2.0",
        "granules_found": 5,
        "granules": [
          {
            "id": "HLS.S30.T22KEF.2026244T133831.v2.0",
            "start": "2026-09-01T13:47:12.957Z",
            "cloud_cover_pct": 81,
            "download_url": "https://data.lpdaac.earthdatacloud.nasa.gov/lp-prod-protected/HLSS30.020/HLS.S30.T22KEF.2026244T133831.v2.0/HLS.S30.T22KEF.2026244T133831.v2.0.B04.tif"
          },
          {
            "id": "HLS.S30.T22KDF.2026244T133831.v2.0",
            "start": "2026-09-01T13:47:16.561Z",
            "cloud_cover_pct": 64,
            "download_url": "https://data.lpdaac.earthdatacloud.nasa.gov/lp-prod-protected/HLSS30.020/HLS.S30.T22KDF.2026244T133831.v2.0/HLS.S30.T22KDF.2026244T133831.v2.0.B04.tif"
          },
          {
            "id": "HLS.S30.T22KEF.2026246T133139.v2.0",
            "start": "2026-09-03T13:37:17.323Z",
            "cloud_cover_pct": 0,
            "download_url": "https://data.lpdaac.earthdatacloud.nasa.gov/lp-prod-protected/HLSS30.020/HLS.S30.T22KEF.2026246T133139.v2.0/HLS.S30.T22KEF.2026246T133139.v2.0.B04.tif"
          },
          {
            "id": "HLS.S30.T22KDF.2026246T133139.v2.0",
            "start": "2026-09-03T13:37:23.801Z",
            "cloud_cover_pct": 1,
            "download_url": "https://data.lpdaac.earthdatacloud.nasa.gov/lp-prod-protected/HLSS30.020/HLS.S30.T22KDF.2026246T133139.v2.0/HLS.S30.T22KDF.2026246T133139.v2.0.B04.tif"
          },
          {
            "id": "HLS.S30.T22KEF.2026246T134221.v2.0",
            "start": "2026-09-03T13:47:30.026Z",
            "cloud_cover_pct": 0,
            "download_url": "https://data.lpdaac.earthdatacloud.nasa.gov/lp-prod-protected/HLSS30.020/HLS.S30.T22KEF.2026246T134221.v2.0/HLS.S30.T22KEF.2026246T134221.v2.0.B04.tif"
          }
        ]
      }
    },
    {
      "id": "appeears_catalog",
      "name": "NASA AppEEARS – Catálogo Unificado de Extração Pontual",
      "provider": "NASA LP DAAC / Earthdata Cloud",
      "layer": "4. Fenologia & Talhão",
      "url": "https://appeears.earthdatacloud.nasa.gov/api/product",
      "auth_required": "Catálogo Aberto | Submissão de Tarefa (/task) exige Earthdata Token",
      "expected_format": "JSON (Catálogo) -> CSV / GeoTIFF (Assíncrono)",
      "actual_format": "application/json",
      "spatial_resolution": "Multi-escala (30m a 9 km dependendo do produto)",
      "temporal_resolution": "Diária / 8 dias / 16 dias / Anual",
      "coverage": "194 produtos oficiais da NASA (MODIS, VIIRS, SMAP, ECOSTRESS)",
      "data_nature": "Catálogo / Extrator Unificado",
      "period_min": "2000 (MODIS)",
      "period_max": "Tempo Quase Real (2026)",
      "plain_question": "Como extrair só a série CSV da fazenda sem precisar baixar gigabytes de imagens da NASA?",
      "plain_answer": "O catálogo ativo lista 193 produtos prontos para recorte pontual por coordenada via API (com Token Earthdata).",
      "fit_score": 5,
      "fit_analysis": "O 'atalho de ouro' da engenharia de dados NASA: em vez de baixar arquivos HDF5 de 500 MB, o AppEEARS extrai somente o CSV da coordenada exata da fazenda para MODIS Phenology (MCD12Q2), NDVI (MOD13Q1), SMAP e ECOSTRESS.",
      "viz_type": "appeears_products",
      "status": "ONLINE_OPEN",
      "http_status": 200,
      "latency_ms": 710,
      "audit_notes": "Catálogo ativo com 193 produtos oficiais disponíveis via API REST.",
      "error": null,
      "extracted_at": "2026-11-14T15:35:54.822146+00:00",
      "raw_sample": "[\n  {\n    \"product_id\": \"MCD12Q2.061\",\n    \"description\": \"Land Cover Dynamics\",\n    \"resolution\": \"500m\",\n    \"temporal\": \"Yearly\",\n    \"platform\": \"Combined MODIS\"\n  },\n  {\n    \"product_id\": \"MOD13Q1.061\",\n    \"description\": \"Vegetation Indices (NDVI & EVI)\",\n    \"resolution\": \"250m\",\n    \"temporal\": \"16 day\",\n    \"platform\": \"Terra MODIS\"\n  },\n  {\n    \"product_id\": \"SPL4SMGP.008\",\n    \"description\": \"Surface and Root Zone Soil Moisture\",\n    \"resolution\": \"9000m\",\n    \"temporal\": \"Daily\",\n    \"platform\": \"SMAP\"\n  }\n]",
      "parsed_data": {
        "total_products": 193,
        "agro_recommended": [
          {
            "product_id": "MCD12Q2.061",
            "description": "Land Cover Dynamics",
            "resolution": "500m",
            "temporal": "Yearly",
            "platform": "Combined MODIS"
          },
          {
            "product_id": "MOD13Q1.061",
            "description": "Vegetation Indices (NDVI & EVI)",
            "resolution": "250m",
            "temporal": "16 day",
            "platform": "Terra MODIS"
          },
          {
            "product_id": "SPL4SMGP.008",
            "description": "Surface and Root Zone Soil Moisture",
            "resolution": "9000m",
            "temporal": "Daily",
            "platform": "SMAP"
          },
          {
            "product_id": "ECO_L3T_JET.002",
            "description": "Tiled Evapotranspiration Instantaneous and Daytime L3 Global",
            "resolution": "70m",
            "temporal": "ISS-dependent",
            "platform": "ECOSTRESS"
          },
          {
            "product_id": "VNP13A1.002",
            "description": "Vegetation Indices (NDVI & EVI)",
            "resolution": "500m",
            "temporal": "16 day",
            "platform": "Suomi NPP VIIRS"
          }
        ]
      }
    },
    {
      "id": "crop_monitor",
      "name": "NASA Harvest / GEOGLAM – Crop Monitor Global",
      "provider": "NASA Harvest Consortium & G20 GEOGLAM (Parceiro CONAB)",
      "layer": "4. Fenologia & Talhão",
      "url": "https://cropmonitor.org/",
      "auth_required": "Nenhum (Portal Público)",
      "expected_format": "HTML / Boletins Mensais PDF / Mapas",
      "actual_format": "text/html",
      "spatial_resolution": "Macrorregional (Grandes Regiões Agrícolas)",
      "temporal_resolution": "Mensal",
      "coverage": "Global (Inclui Brasil: Centro-Oeste, Sul, Matopiba)",
      "data_nature": "Boletim de Monitoramento Global",
      "period_min": "2013",
      "period_max": "Mensal (2026)",
      "plain_question": "Como está a condição geral da safra nos grandes polos do Brasil e competidores (EUA/Argentina)?",
      "plain_answer": "Portal público ativo; fornece contexto macro de oferta global, sem API pontual por fazenda.",
      "fit_score": 3,
      "fit_analysis": "Ótimo para contexto macroeconômico e validação de calendários agrícolas globais, mas não possui API granular por município ou fazenda.",
      "viz_type": "audit_summary",
      "status": "ONLINE_OPEN",
      "http_status": 200,
      "latency_ms": 1849,
      "audit_notes": "Portal oficial ativo. Sem endpoint REST granular para coordenadas individuais.",
      "error": null,
      "extracted_at": "2026-11-14T15:35:55.540788+00:00",
      "raw_sample": "Title: GEOGLAM Crop Monitor",
      "parsed_data": {
        "portal_title": "GEOGLAM Crop Monitor"
      }
    },
    {
      "id": "zarc_mapa",
      "name": "ZARC 2026/2027 – Tábua de Risco Climático (MAPA/Embrapa)",
      "provider": "Ministério da Agricultura e Pecuária (MAPA) & Embrapa",
      "layer": "5. Regulação & Mercado BR",
      "url": "https://dados.agricultura.gov.br/api/3/action/package_show?id=tabua-de-risco-zoneamento-agricola-de-risco-climatico",
      "auth_required": "Nenhum (Dados Abertos CKAN + CSV)",
      "expected_format": "JSON (CKAN) -> CSV (1,1M+ linhas, 55 colunas)",
      "actual_format": "text/csv (UTF-8, delimitador ';')",
      "spatial_resolution": "Municipal (Geocódigo IBGE 5218805 – Rio Verde/GO)",
      "temporal_resolution": "Decêndios (36 períodos de 10 dias/ano) – Safra 2026/2027",
      "coverage": "Todo o Brasil",
      "data_nature": "Regra Normativa / Seguro Rural",
      "period_min": "Safra 2016/2017 (Série CKAN)",
      "period_max": "Safra 2026/2027 (Vigente)",
      "plain_question": "Em quais dias exatos posso plantar Soja, Milho ou Sorgo sem perder o Seguro Rural?",
      "plain_answer": "Em Rio Verde/GO, a janela de Milho 2ª Safra fecha rápido (Decêndio 4 — início de Fev), enquanto o Sorgo Granífero fica aberto com seguro até o Decêndio 8 (meados de Março).",
      "fit_score": 5,
      "fit_analysis": "Trava jurídico-financeira obrigatória no Brasil: define as datas exatas em que Soja, Milho 2ª Safra e Sorgo têm direito a Seguro Rural (Proagro/PSR) e financiamento do Plano Safra.",
      "viz_type": "zarc_calendar",
      "status": "ONLINE_OPEN",
      "http_status": 200,
      "latency_ms": 407,
      "audit_notes": "Streaming de 1,130,193 linhas em memória; extraídas 251 regras específicas para Rio Verde/GO (Safra 2026/2027).",
      "error": null,
      "extracted_at": "2026-11-14T15:35:57.395566+00:00",
      "raw_sample": "[\n  {\n    \"Nome_cultura\": \"Cevada Grãos\",\n    \"SafraIni\": \"2026\",\n    \"SafraFin\": \"2027\",\n    \"Cod_Cultura\": \"12012320000031\",\n    \"Cod_Ciclo\": \"21\",\n    \"Cod_Solo\": \"13\",\n    \"geocodigo\": \"5218805\",\n    \"UF\": \"GO\",\n    \"municipio\": \"Rio Verde\",\n    \"Cod_Clima\": \"0\",\n    \"Nome_Clima\": \"Não se aplica\",\n    \"Cod_Outros_Manejos\": \"2\",\n    \"Nome_Outros_Manejos\": \"Irrigado\",\n    \"Produtividade\": \"\",\n    \"Cod_NM\": \"\",\n    \"Cod_Munic\": \"029579\",\n    \"Cod_Meso\": \"05\",\n    \"Cod_Micro\": \"013\",\n    \"Portaria\": \"Port.397_de_11-11-2026\",\n    \"dec1\": \"0\",\n    \"dec2\": \"0\",\n    \"dec3\": \"0\",\n    \"dec4\": \"0\",\n    \"dec5\": \"0\",\n    \"dec6\": \"0\",\n    \"dec7\": \"0\",\n    \"dec8\": \"0\",\n    \"dec9\": \"0\",\n    \"dec10\": \"0\",\n    \"dec11\": \"20\",\n    \"dec12\": \"20\",\n    \"dec13\": \"20\",\n    \"dec14\": \"20\",\n    \"dec15\": \"20\",\n    \"dec16\": \"20\",\n    \"dec17\": \"0\",\n    \"dec18\": \"0\",\n    \"dec19\": \"0\",\n    \"dec20\": \"0\",\n    \"dec21\": \"0\",\n    \"dec22\": \"0\",\n    \"dec23\": \"0\",\n    \"dec24\": \"0\",\n    \"dec25\": \"0\",\n    \"dec26\": \"0\",\n    \"dec27\": \"0\",\n    \"dec28\": \"0\",\n    \"dec29\": \"0\",\n    \"dec30\": \"0\",\n    \"dec31\": \"0\",\n    \"dec32\": \"0\",\n    \"dec33\": \"0\",\n    \"dec34\": \"0\",\n    \"dec35\": \"0\",\n    \"dec36\": \"0\"\n  },\n  {\n    \"Nome_cultura\": \"Cevada Grãos\",\n    \"SafraIni\": \"2026\",\n    \"SafraFin\": \"2027\",\n    \"Cod_Cultura\": \"12012320000031\",\n    \"Cod_Ciclo\": \"20\",\n    \"Cod_Solo\": \"13\",\n    \"geocodigo\": \"5218805\",\n    \"UF\": \"GO\",\n    \"municipio\": \"Rio Verde\",\n    \"Cod_Clima\": \"0\",\n    \"Nome_Clima\": \"Não se aplica\",\n    \"Cod_Outros_Manejos\": \"2\",\n    \"Nome_Outros_Manejos\": \"Irrigado\",\n    \"Produtividade\": \"\",\n    \"Cod_NM\": \"\",\n    \"Cod_Munic\": \"029579\",\n    \"Cod_Meso\": \"05\",\n    \"Cod_Micro\": \"013\",\n    \"Portaria\": \"Port.397_de_11-11-2026\",\n    \"dec1\": \"0\",\n    \"dec2\": \"0\",\n    \"dec3\": \"0\",\n    \"dec4\": \"0\",\n    \"dec5\": \"0\",\n    \"dec6\": \"0\",\n    \"dec7\": \"0\",\n    \"dec8\": \"0\",\n    \"dec9\": \"0\",\n    \"dec10\": \"0\",\n    \"dec11\": \"20\",\n    \"dec12\": \"20\",\n    \"dec13\": \"20\",\n    \"dec14\": \"20\",\n    \"dec15\": \"20\",\n    \"dec16\": \"20\",\n    \"dec17\": \"0\",\n    \"dec18\": \"0\",\n    \"dec19\": \"0\",\n    \"dec20\": \"0\",\n    \"dec21\": \"0\",\n    \"dec22\": \"0\",\n    \"dec23\": \"0\",\n    \"dec24\": \"0\",\n    \"dec25\": \"0\",\n    \"dec26\": \"0\",\n    \"dec27\": \"0\",\n    \"dec28\": \"0\",\n    \"dec29\": \"0\",\n    \"dec30\": \"0\",\n    \"dec31\": \"0\",\n    \"dec32\": \"0\",\n    \"dec33\": \"0\",\n    \"dec34\": \"0\",\n    \"dec35\": \"0\",\n    \"dec36\": \"0\"\n  }\n]",
      "parsed_data": {
        "safra": "2026/2027",
        "csv_url": "https://dados.agricultura.gov.br/dataset/6d3d141c-885e-41a4-ab7f-dc8ff323b96f/resource/139e5a60-1f43-4cc8-aeab-a35dbbf816c0/download/dados-abertos-tabua-de-risco-safra-2026-2027.csv",
        "total_national_rows": 1130193,
        "rio_verde_rows": 251,
        "crops": [
          {
            "crop": "Soja",
            "ciclo_cod": "21",
            "solo_cod": "16",
            "manejo": "Sequeiro",
            "portaria": "Port.198_de_03-07-2026",
            "decendios": [
              20,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              40,
              20,
              20,
              20,
              20,
              20,
              20,
              20,
              20,
              20
            ],
            "open_decendios_count": 11,
            "first_open_dec": 1,
            "last_open_dec": 36,
            "variants_in_municipality": 18
          },
          {
            "crop": "Milho 2ª Safra",
            "ciclo_cod": "20",
            "solo_cod": "11",
            "manejo": "Sequeiro",
            "portaria": "Port.322_de_30-07-2026",
            "decendios": [
              20,
              20,
              20,
              40,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0
            ],
            "open_decendios_count": 4,
            "first_open_dec": 1,
            "last_open_dec": 4,
            "variants_in_municipality": 12
          },
          {
            "crop": "Sorgo Granífero 2ª Safra",
            "ciclo_cod": "21",
            "solo_cod": "3",
            "manejo": "Sequeiro",
            "portaria": "Port.273_de_22-07-2026",
            "decendios": [
              20,
              20,
              20,
              20,
              20,
              20,
              20,
              40,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0
            ],
            "open_decendios_count": 8,
            "first_open_dec": 1,
            "last_open_dec": 8,
            "variants_in_municipality": 9
          },
          {
            "crop": "Milho 2ª Safra consorciado com Braquiária",
            "ciclo_cod": "21",
            "solo_cod": "16",
            "manejo": "Sequeiro",
            "portaria": "Port.337_de_06-08-2026",
            "decendios": [
              20,
              20,
              20,
              30,
              40,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0
            ],
            "open_decendios_count": 5,
            "first_open_dec": 1,
            "last_open_dec": 5,
            "variants_in_municipality": 12
          }
        ]
      }
    },
    {
      "id": "ibge_sidra",
      "name": "IBGE SIDRA – PAM (Produtividade Municipal Rio Verde)",
      "provider": "Instituto Brasileiro de Geografia e Estatística (IBGE)",
      "layer": "5. Regulação & Mercado BR",
      "url": "https://apisidra.ibge.gov.br/values/t/5457/n6/5218805/v/112,216/p/last%205/c782/40122,40124,40125?formato=json",
      "auth_required": "Nenhum (100% Aberto)",
      "expected_format": "JSON",
      "actual_format": "application/json",
      "spatial_resolution": "Municipal (IBGE 5218805 – Rio Verde/GO)",
      "temporal_resolution": "Anual (Últimos 5 anos consolidados)",
      "coverage": "Todos os 5.570 municípios brasileiros",
      "data_nature": "Dado Fatídico (Censo / Pesquisa Oficial)",
      "period_min": "1974 (Série PAM) / 2021 na amostra",
      "period_max": "2025 (Último consolidado)",
      "plain_question": "Quanto a fazenda realmente colhe em média no município, e quanto caiu no último El Niño?",
      "plain_answer": "Em Rio Verde/GO, a produtividade da soja caiu de 70,0 sc/ha (2023) para 61,7 sc/ha no El Niño de 2024, recuperando para 65,0 sc/ha em 2025.",
      "fit_score": 5,
      "fit_analysis": "Fornece a verdade histórica de produtividade real (kg/ha -> sacas/ha) e área colhida no município, comprovando inclusive a queda de rendimento ocorrida durante o El Niño de 2024.",
      "viz_type": "ibge_yields",
      "status": "ONLINE_OPEN",
      "http_status": 200,
      "latency_ms": 145,
      "audit_notes": "",
      "error": null,
      "extracted_at": "2026-11-14T15:36:04.049137+00:00",
      "raw_sample": "[\n  {\n    \"NC\": \"6\",\n    \"NN\": \"Município\",\n    \"MC\": \"33\",\n    \"MN\": \"Quilogramas por Hectare\",\n    \"V\": \"7222\",\n    \"D1C\": \"5218805\",\n    \"D1N\": \"Rio Verde (GO)\",\n    \"D2C\": \"112\",\n    \"D2N\": \"Rendimento médio da produção\",\n    \"D3C\": \"2021\",\n    \"D3N\": \"2021\",\n    \"D4C\": \"40122\",\n    \"D4N\": \"Milho (em grão)\"\n  },\n  {\n    \"NC\": \"6\",\n    \"NN\": \"Município\",\n    \"MC\": \"33\",\n    \"MN\": \"Quilogramas por Hectare\",\n    \"V\": \"3600\",\n    \"D1C\": \"5218805\",\n    \"D1N\": \"Rio Verde (GO)\",\n    \"D2C\": \"112\",\n    \"D2N\": \"Rendimento médio da produção\",\n    \"D3C\": \"2021\",\n    \"D3N\": \"2021\",\n    \"D4C\": \"40124\",\n    \"D4N\": \"Soja (em grão)\"\n  },\n  {\n    \"NC\": \"6\",\n    \"NN\": \"Município\",\n    \"MC\": \"33\",\n    \"MN\": \"Quilogramas por Hectare\",\n    \"V\": \"3900\",\n    \"D1C\": \"5218805\",\n    \"D1N\": \"Rio Verde (GO)\",\n    \"D2C\": \"112\",\n    \"D2N\": \"Rendimento médio da produção\",\n    \"D3C\": \"2021\",\n    \"D3N\": \"2021\",\n    \"D4C\": \"40125\",\n    \"D4N\": \"Sorgo (em grão)\"\n  },\n  {\n    \"NC\": \"6\",\n    \"NN\": \"Município\",\n    \"MC\": \"33\",\n    \"MN\": \"Quilogramas por Hectare\",\n    \"V\": \"5135\",\n    \"D1C\": \"5218805\",\n    \"D1N\": \"Rio Verde (GO)\",\n    \"D2C\": \"112\",\n    \"D2N\": \"Rendimento médio da produção\",\n    \"D3C\": \"2022\",\n    \"D3N\": \"2022\",\n    \"D4C\": \"40122\",\n    \"D4N\": \"Milho (em grão)\"\n  },\n  {\n    \"NC\": \"6\",\n    \"NN\": \"Município\",\n    \"MC\": \"33\",\n    \"MN\": \"Quilogramas por Hectare\",\n    \"V\": \"3900\",\n    \"D1C\": \"5218805\",\n    \"D1N\": \"Rio Verde (GO)\",\n    \"D2C\": \"112\",\n    \"D2N\": \"Rendimento médio da produção\",\n    \"D3C\": \"2022\",\n    \"D3N\": \"2022\",\n    \"D4C\": \"40124\",\n    \"D4N\": \"Soja (em grão)\"\n  }\n]",
      "parsed_data": {
        "records": [
          {
            "year": "2021",
            "crop": "Milho (em grão)",
            "yield_kg_ha": 7222.0,
            "yield_sc_ha": 120.4,
            "area_ha": 342500.0
          },
          {
            "year": "2021",
            "crop": "Soja (em grão)",
            "yield_kg_ha": 3600.0,
            "yield_sc_ha": 60.0,
            "area_ha": 410000.0
          },
          {
            "year": "2021",
            "crop": "Sorgo (em grão)",
            "yield_kg_ha": 3900.0,
            "yield_sc_ha": 65.0,
            "area_ha": 45000.0
          },
          {
            "year": "2022",
            "crop": "Milho (em grão)",
            "yield_kg_ha": 5135.0,
            "yield_sc_ha": 85.6,
            "area_ha": 359500.0
          },
          {
            "year": "2022",
            "crop": "Soja (em grão)",
            "yield_kg_ha": 3900.0,
            "yield_sc_ha": 65.0,
            "area_ha": 420000.0
          },
          {
            "year": "2022",
            "crop": "Sorgo (em grão)",
            "yield_kg_ha": 3800.0,
            "yield_sc_ha": 63.3,
            "area_ha": 45000.0
          },
          {
            "year": "2023",
            "crop": "Milho (em grão)",
            "yield_kg_ha": 7025.0,
            "yield_sc_ha": 117.1,
            "area_ha": 359900.0
          },
          {
            "year": "2023",
            "crop": "Soja (em grão)",
            "yield_kg_ha": 4200.0,
            "yield_sc_ha": 70.0,
            "area_ha": 421500.0
          },
          {
            "year": "2023",
            "crop": "Sorgo (em grão)",
            "yield_kg_ha": 4500.0,
            "yield_sc_ha": 75.0,
            "area_ha": 43000.0
          },
          {
            "year": "2024",
            "crop": "Milho (em grão)",
            "yield_kg_ha": 6728.0,
            "yield_sc_ha": 112.1,
            "area_ha": 334300.0
          },
          {
            "year": "2024",
            "crop": "Soja (em grão)",
            "yield_kg_ha": 3700.0,
            "yield_sc_ha": 61.7,
            "area_ha": 425000.0
          },
          {
            "year": "2024",
            "crop": "Sorgo (em grão)",
            "yield_kg_ha": 3800.0,
            "yield_sc_ha": 63.3,
            "area_ha": 53000.0
          },
          {
            "year": "2025",
            "crop": "Milho (em grão)",
            "yield_kg_ha": 7583.0,
            "yield_sc_ha": 126.4,
            "area_ha": 352000.0
          },
          {
            "year": "2025",
            "crop": "Soja (em grão)",
            "yield_kg_ha": 3900.0,
            "yield_sc_ha": 65.0,
            "area_ha": 428500.0
          },
          {
            "year": "2025",
            "crop": "Sorgo (em grão)",
            "yield_kg_ha": 3850.0,
            "yield_sc_ha": 64.2,
            "area_ha": 34000.0
          }
        ]
      }
    },
    {
      "id": "conab_custos",
      "name": "CONAB – Custos de Produção Agrícolas (Rio Verde/GO 2026)",
      "provider": "Companhia Nacional de Abastecimento (CONAB)",
      "layer": "5. Regulação & Mercado BR",
      "url": "https://www.gov.br/conab/pt-br/atuacao/informacoes-agropecuarias/custos-de-producao/planilhas-de-custos-de-producao/copy_of_agricolas",
      "auth_required": "Nenhum (Download direto exige header Referer padrão de navegador)",
      "expected_format": "XLS / XLSX (Planilhas Excel Multi-Abas)",
      "actual_format": "application/vnd.ms-excel (.xls)",
      "spatial_resolution": "Polo Produtivo Municipal (Aba oficial 'Rio Verde-GO-2026')",
      "temporal_resolution": "Anual por Safra (Séries até 2026)",
      "coverage": "Principais polos agrícolas do Brasil",
      "data_nature": "Dado Fatídico / Levantamento Oficial",
      "period_min": "1997 (Soja) / 2005 (Milho) / 2013 (Sorgo)",
      "period_max": "Safra 2026 (Atualizado)",
      "plain_question": "Quanto custa plantar 1 hectare de Soja, Milho 2ª Safra e Sorgo em Rio Verde?",
      "plain_answer": "Em 2026, o custeio do Milho 2ª Safra é de R$ 3.803,69/ha contra apenas R$ 2.258,69/ha do Sorgo (uma redução de 40,6% no capital exposto ao risco climático).",
      "fit_score": 5,
      "fit_analysis": "Base financeira insubstituível: traz o Custo de Custeio, Operacional e Total em R$/ha exatamente para Rio Verde/GO em 2026, permitindo calcular o lucro líquido e o ponto de equilíbrio.",
      "viz_type": "conab_costs",
      "status": "ONLINE_OPEN",
      "http_status": 200,
      "latency_ms": 1979,
      "audit_notes": "Download direto das 3 planilhas oficiais com extração exata da aba 'Rio Verde-GO-2026'. Requer header Referer para passar pelo WAF gov.br.",
      "error": null,
      "extracted_at": "2026-11-14T15:36:04.199199+00:00",
      "raw_sample": "[\n  {\n    \"crop\": \"Soja\",\n    \"sheet_name\": \"Rio Verde-GO-2026\",\n    \"yield_kg_ha\": 3900.0,\n    \"yield_sc_ha\": 65.0,\n    \"sementes_ha\": 840.0,\n    \"fertilizantes_ha\": 1401.6,\n    \"agrotoxicos_ha\": 853.6,\n    \"custeio_ha\": 3353.87,\n    \"custo_operacional_ha\": 5151.64,\n    \"custo_total_ha\": 6128.77,\n    \"breakeven_operacional_sc\": 79.26,\n    \"breakeven_custeio_sc\": 51.6\n  },\n  {\n    \"crop\": \"Milho 2ª Safra\",\n    \"sheet_name\": \"Rio Verde-GO-2026\",\n    \"yield_kg_ha\": 6000.0,\n    \"yield_sc_ha\": 100.0,\n    \"sementes_ha\": 900.0,\n    \"fertilizantes_ha\": 2170.58,\n    \"agrotoxicos_ha\": 447.28,\n    \"custeio_ha\": 3803.69,\n    \"custo_operacional_ha\": 5889.09,\n    \"custo_total_ha\": 6886.16,\n    \"breakeven_operacional_sc\": 58.89,\n    \"breakeven_custeio_sc\": 38.04\n  },\n  {\n    \"crop\": \"Sorgo\",\n    \"sheet_name\": \"Rio Verde-GO-2026\",\n    \"yield_kg_ha\": 3600.0,\n    \"yield_sc_ha\": 60.0,\n    \"sementes_ha\": 360.0,\n    \"fertilizantes_ha\": 1275.8,\n    \"agrotoxicos_ha\": 356.1,\n    \"custeio_ha\": 2258.69,\n    \"custo_operacional_ha\": 3806.76,\n    \"custo_total_ha\": 4788.11,\n    \"breakeven_operacional_sc\": 63.45,\n    \"breakeven_custeio_sc\": 37.64\n  }\n]",
      "parsed_data": {
        "crops": [
          {
            "crop": "Soja",
            "sheet_name": "Rio Verde-GO-2026",
            "yield_kg_ha": 3900.0,
            "yield_sc_ha": 65.0,
            "sementes_ha": 840.0,
            "fertilizantes_ha": 1401.6,
            "agrotoxicos_ha": 853.6,
            "custeio_ha": 3353.87,
            "custo_operacional_ha": 5151.64,
            "custo_total_ha": 6128.77,
            "breakeven_operacional_sc": 79.26,
            "breakeven_custeio_sc": 51.6
          },
          {
            "crop": "Milho 2ª Safra",
            "sheet_name": "Rio Verde-GO-2026",
            "yield_kg_ha": 6000.0,
            "yield_sc_ha": 100.0,
            "sementes_ha": 900.0,
            "fertilizantes_ha": 2170.58,
            "agrotoxicos_ha": 447.28,
            "custeio_ha": 3803.69,
            "custo_operacional_ha": 5889.09,
            "custo_total_ha": 6886.16,
            "breakeven_operacional_sc": 58.89,
            "breakeven_custeio_sc": 38.04
          },
          {
            "crop": "Sorgo",
            "sheet_name": "Rio Verde-GO-2026",
            "yield_kg_ha": 3600.0,
            "yield_sc_ha": 60.0,
            "sementes_ha": 360.0,
            "fertilizantes_ha": 1275.8,
            "agrotoxicos_ha": 356.1,
            "custeio_ha": 2258.69,
            "custo_operacional_ha": 3806.76,
            "custo_total_ha": 4788.11,
            "breakeven_operacional_sc": 63.45,
            "breakeven_custeio_sc": 37.64
          }
        ]
      }
    },
    {
      "id": "bcb_sicor",
      "name": "Banco Central (BCB) – SICOR Crédito Rural (OData)",
      "provider": "Banco Central do Brasil (Olinda Open Data)",
      "layer": "5. Regulação & Mercado BR",
      "url": "https://olinda.bcb.gov.br/olinda/servico/SICOR/versao/v2/odata/CusteioRegiaoUFProduto",
      "auth_required": "Nenhum (API OData Pública)",
      "expected_format": "JSON / XML (OData v2)",
      "actual_format": "application/json (OData v2)",
      "spatial_resolution": "Estadual (GO / Centro-Oeste) e Municipal (lento sem índice)",
      "temporal_resolution": "Mensal / Anual (Safra 2026)",
      "coverage": "Todo o Crédito Rural Oficial do Brasil",
      "data_nature": "Dado Fatídico (Contratos Oficiais BCB)",
      "period_min": "Jan/2013 (SICOR)",
      "period_max": "2026 (Contratos vigentes)",
      "plain_question": "Qual é o volume real de crédito rural e custeio financiado pelos bancos para as culturas?",
      "plain_answer": "API oficial OData do Banco Central confirmando valores financiados e área coberta por cultura em 2026.",
      "fit_score": 4,
      "fit_analysis": "Excelente para dimensionar o apetite de crédito e seguro na região. ACHADO DE ENGENHARIA: o endpoint granular municipal (CusteioMunicipioProduto) sofre timeout (>15s) em filtros sem índice por codIbge; o endpoint agregado CusteioRegiaoUFProduto responde rapidamente.",
      "viz_type": "sicor_credit",
      "status": "ONLINE_OPEN",
      "http_status": 200,
      "latency_ms": 198,
      "audit_notes": "Endpoint agregado respondeu normalmente. Endpoint municipal CusteioMunicipioProduto exige carga batch noturna devido a ausência de índice SQL para filtro por codIbge.",
      "error": null,
      "extracted_at": "2026-11-14T15:36:06.597064+00:00",
      "raw_sample": "[\n  {\n    \"nomeProduto\": \"\\\"UVA\\\"\",\n    \"nomeRegiao\": \"NORDESTE\",\n    \"nomeUF\": \"CE\",\n    \"MesEmissao\": \"09\",\n    \"AnoEmissao\": \"2014\",\n    \"cdPrograma\": \"0001\",\n    \"cdSubPrograma\": \"0\",\n    \"cdFonteRecurso\": \"0300\",\n    \"cdTipoSeguro\": \"2\",\n    \"QtdCusteio\": 1,\n    \"VlCusteio\": 18162.85,\n    \"Atividade\": \"1\",\n    \"cdModalidade\": \"01\",\n    \"AreaCusteio\": null\n  },\n  {\n    \"nomeProduto\": \"\\\"SOJA\\\"\",\n    \"nomeRegiao\": \"CENTRO-OESTE\",\n    \"nomeUF\": \"MT\",\n    \"MesEmissao\": \"05\",\n    \"AnoEmissao\": \"2019\",\n    \"cdPrograma\": \"0001\",\n    \"cdSubPrograma\": \"1\",\n    \"cdFonteRecurso\": \"0201\",\n    \"cdTipoSeguro\": \"2\",\n    \"QtdCusteio\": 1,\n    \"VlCusteio\": 147080.0,\n    \"Atividade\": \"1\",\n    \"cdModalidade\": \"01\",\n    \"AreaCusteio\": null\n  },\n  {\n    \"nomeProduto\": \"\\\"BOVINOS\\\"\",\n    \"nomeRegiao\": \"NORDESTE\",\n    \"nomeUF\": \"SE\",\n    \"MesEmissao\": \"02\",\n    \"AnoEmissao\": \"2016\",\n    \"cdPrograma\": \"0999\",\n    \"cdSubPrograma\": \"0\",\n    \"cdFonteRecurso\": \"0300\",\n    \"cdTipoSeguro\": \"9\",\n    \"QtdCusteio\": 4,\n    \"VlCusteio\": 137419.68,\n    \"Atividade\": \"2\",\n    \"cdModalidade\": \"26\",\n    \"AreaCusteio\": null\n  }\n]",
      "parsed_data": {
        "sample_rows": 120,
        "top_products": [
          {
            "product": "CAFÉ",
            "vl_custeio": 66705917.77,
            "area_ha": 0.0,
            "contracts": 3
          },
          {
            "product": "SOJA",
            "vl_custeio": 66044447.19,
            "area_ha": 0.0,
            "contracts": 11
          },
          {
            "product": "BOVINOS",
            "vl_custeio": 27149309.56,
            "area_ha": 0.0,
            "contracts": 20
          },
          {
            "product": "ARROZ",
            "vl_custeio": 17065797.91,
            "area_ha": 0.0,
            "contracts": 3
          },
          {
            "product": "MILHO",
            "vl_custeio": 13530637.43,
            "area_ha": 0.0,
            "contracts": 7
          },
          {
            "product": "CANA-DE-AÇUCAR",
            "vl_custeio": 8094297.35,
            "area_ha": 0.0,
            "contracts": 2
          },
          {
            "product": "TOMATE",
            "vl_custeio": 4450597.9,
            "area_ha": 0.0,
            "contracts": 3
          },
          {
            "product": "LEITE",
            "vl_custeio": 3150320.26,
            "area_ha": 0.0,
            "contracts": 2
          }
        ]
      }
    },
    {
      "id": "market_commodities",
      "name": "Mercado Futuro Commodities (CBOT/B3 Proxy + Auditoria CEPEA)",
      "provider": "CME Group / Yahoo Finance & CEPEA/ESALQ (USP)",
      "layer": "5. Regulação & Mercado BR",
      "url": "https://query1.finance.yahoo.com/v8/finance/chart/ZS=F",
      "auth_required": "CBOT/FX Aberto (JSON) | CEPEA bloqueia bots com WAF HTTP 403",
      "expected_format": "JSON (Séries Diárias) vs. HTML Protegido (CEPEA)",
      "actual_format": "application/json (CBOT + BCB PTAX) | CEPEA: HTTP 200",
      "spatial_resolution": "Referência Global (CBOT) convertida para Paridade Brasil (R$/saca 60kg)",
      "temporal_resolution": "Diária (Últimos 90 dias)",
      "coverage": "Soja (ZS=F), Milho (ZC=F), Dólar (BRL=X)",
      "data_nature": "Dado Fatídico (Mercado em Tempo Real)",
      "period_min": "90 dias atrás (Histórico diário)",
      "period_max": "Hoje (Fechamento mais recente)",
      "plain_question": "Por quanto vou conseguir vender a saca de Soja, Milho e Sorgo em Reais na colheita?",
      "plain_answer": "Com o Dólar PTAX a R$ 5.65, a paridade estimada em Rio Verde/GO fica em R$ 133.20/sc (Soja), R$ 51.14/sc (Milho) e R$ 40.91/sc (Sorgo).",
      "fit_score": 4,
      "fit_analysis": "ACHADO CRÍTICO: O site do CEPEA/ESALQ retorna HTTP 403 para coletores automatizados. Mitigamos usando cotações abertas CBOT + Dólar (BRL=X) convertidas para R$/saca de 60kg com ajuste de base logística (basis Rio Verde/GO).",
      "viz_type": "market_prices",
      "status": "ONLINE_OPEN",
      "http_status": 200,
      "latency_ms": 1359,
      "audit_notes": "CBOT (ZS=F, ZC=F) e Dólar Oficial Banco Central PTAX (R$ 5.65) operacionais (200 OK). CEPEA/ESALQ respondeu HTTP 200 com headers de navegador (HTML tabular).",
      "error": null,
      "extracted_at": "2026-11-14T15:36:06.800192+00:00",
      "raw_sample": "{\n  \"ZS=F_last\": {\n    \"date\": \"2026-11-13\",\n    \"close\": 1243.0\n  },\n  \"ZC=F_last\": {\n    \"date\": \"2026-11-13\",\n    \"close\": 445.5\n  },\n  \"BCB_PTAX_USD_BRL\": 5.6518,\n  \"cepea_probe_http\": 200\n}",
      "parsed_data": {
        "usd_brl": 5.65,
        "soy_cbot_cents_bu": 1243.0,
        "corn_cbot_cents_bu": 445.5,
        "soy_brl_sc_parity": 154.88,
        "soy_brl_sc_rio_verde_est": 133.2,
        "corn_brl_sc_parity": 59.47,
        "corn_brl_sc_rio_verde_est": 51.14,
        "sorghum_brl_sc_rio_verde_est": 40.91,
        "cepea_http_status": 200,
        "soy_history": [
          {
            "date": "2026-09-14",
            "close": 1285.25
          },
          {
            "date": "2026-09-15",
            "close": 1318.75
          },
          {
            "date": "2026-09-16",
            "close": 1320.5
          },
          {
            "date": "2026-09-17",
            "close": 1319.75
          },
          {
            "date": "2026-09-18",
            "close": 1303.5
          },
          {
            "date": "2026-09-21",
            "close": 1328.0
          },
          {
            "date": "2026-09-22",
            "close": 1325.5
          },
          {
            "date": "2026-09-23",
            "close": 1318.0
          },
          {
            "date": "2026-09-24",
            "close": 1317.5
          },
          {
            "date": "2026-09-25",
            "close": 1319.0
          },
          {
            "date": "2026-09-28",
            "close": 1288.25
          },
          {
            "date": "2026-09-29",
            "close": 1297.75
          },
          {
            "date": "2026-09-30",
            "close": 1293.0
          },
          {
            "date": "2026-10-01",
            "close": 1284.0
          },
          {
            "date": "2026-10-02",
            "close": 1278.25
          },
          {
            "date": "2026-10-05",
            "close": 1280.75
          },
          {
            "date": "2026-10-06",
            "close": 1303.0
          },
          {
            "date": "2026-10-07",
            "close": 1297.5
          },
          {
            "date": "2026-10-08",
            "close": 1287.5
          },
          {
            "date": "2026-10-09",
            "close": 1292.0
          },
          {
            "date": "2026-10-12",
            "close": 1287.75
          },
          {
            "date": "2026-10-13",
            "close": 1283.75
          },
          {
            "date": "2026-10-14",
            "close": 1277.25
          },
          {
            "date": "2026-10-15",
            "close": 1263.0
          },
          {
            "date": "2026-10-16",
            "close": 1261.25
          },
          {
            "date": "2026-10-19",
            "close": 1253.5
          },
          {
            "date": "2026-10-20",
            "close": 1248.25
          },
          {
            "date": "2026-10-21",
            "close": 1245.25
          },
          {
            "date": "2026-10-22",
            "close": 1253.0
          },
          {
            "date": "2026-10-23",
            "close": 1256.5
          },
          {
            "date": "2026-10-26",
            "close": 1241.25
          },
          {
            "date": "2026-10-27",
            "close": 1229.25
          },
          {
            "date": "2026-10-28",
            "close": 1224.5
          },
          {
            "date": "2026-10-29",
            "close": 1219.75
          },
          {
            "date": "2026-10-30",
            "close": 1222.25
          },
          {
            "date": "2026-11-02",
            "close": 1204.75
          },
          {
            "date": "2026-11-03",
            "close": 1203.0
          },
          {
            "date": "2026-11-04",
            "close": 1193.25
          },
          {
            "date": "2026-11-05",
            "close": 1181.0
          },
          {
            "date": "2026-11-06",
            "close": 1189.0
          },
          {
            "date": "2026-11-09",
            "close": 1182.25
          },
          {
            "date": "2026-11-10",
            "close": 1224.5
          },
          {
            "date": "2026-11-11",
            "close": 1229.0
          },
          {
            "date": "2026-11-12",
            "close": 1227.0
          },
          {
            "date": "2026-11-13",
            "close": 1243.0
          }
        ],
        "corn_history": [
          {
            "date": "2026-09-14",
            "close": 512.0
          },
          {
            "date": "2026-09-15",
            "close": 535.75
          },
          {
            "date": "2026-09-16",
            "close": 534.25
          },
          {
            "date": "2026-09-17",
            "close": 530.5
          },
          {
            "date": "2026-09-18",
            "close": 527.5
          },
          {
            "date": "2026-09-21",
            "close": 543.0
          },
          {
            "date": "2026-09-22",
            "close": 536.75
          },
          {
            "date": "2026-09-23",
            "close": 529.0
          },
          {
            "date": "2026-09-24",
            "close": 527.5
          },
          {
            "date": "2026-09-25",
            "close": 528.25
          },
          {
            "date": "2026-09-28",
            "close": 523.0
          },
          {
            "date": "2026-09-29",
            "close": 522.0
          },
          {
            "date": "2026-09-30",
            "close": 500.75
          },
          {
            "date": "2026-10-01",
            "close": 502.25
          },
          {
            "date": "2026-10-02",
            "close": 497.75
          },
          {
            "date": "2026-10-05",
            "close": 497.25
          },
          {
            "date": "2026-10-06",
            "close": 508.0
          },
          {
            "date": "2026-10-07",
            "close": 502.0
          },
          {
            "date": "2026-10-08",
            "close": 500.25
          },
          {
            "date": "2026-10-09",
            "close": 479.75
          },
          {
            "date": "2026-10-12",
            "close": 483.0
          },
          {
            "date": "2026-10-13",
            "close": 482.75
          },
          {
            "date": "2026-10-14",
            "close": 480.75
          },
          {
            "date": "2026-10-15",
            "close": 478.0
          },
          {
            "date": "2026-10-16",
            "close": 474.25
          },
          {
            "date": "2026-10-19",
            "close": 467.0
          },
          {
            "date": "2026-10-20",
            "close": 462.0
          },
          {
            "date": "2026-10-21",
            "close": 463.25
          },
          {
            "date": "2026-10-22",
            "close": 460.5
          },
          {
            "date": "2026-10-23",
            "close": 456.0
          },
          {
            "date": "2026-10-26",
            "close": 455.0
          },
          {
            "date": "2026-10-27",
            "close": 448.75
          },
          {
            "date": "2026-10-28",
            "close": 451.75
          },
          {
            "date": "2026-10-29",
            "close": 451.25
          },
          {
            "date": "2026-10-30",
            "close": 447.75
          },
          {
            "date": "2026-11-02",
            "close": 448.25
          },
          {
            "date": "2026-11-03",
            "close": 442.5
          },
          {
            "date": "2026-11-04",
            "close": 444.25
          },
          {
            "date": "2026-11-05",
            "close": 440.0
          },
          {
            "date": "2026-11-06",
            "close": 441.5
          },
          {
            "date": "2026-11-09",
            "close": 439.25
          },
          {
            "date": "2026-11-10",
            "close": 449.0
          },
          {
            "date": "2026-11-11",
            "close": 448.0
          },
          {
            "date": "2026-11-12",
            "close": 442.5
          },
          {
            "date": "2026-11-13",
            "close": 445.5
          }
        ]
      }
    }
  ]
};
