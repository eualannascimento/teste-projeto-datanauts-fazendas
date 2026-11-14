/* AgroPulse NASA — Frontend Interativo para Leigos e Engenheiros de Dados */

(function () {
  "use strict";

  const fmtBRL = (v) =>
    v == null || Number.isNaN(v)
      ? "—"
      : Number(v).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const fmtNum = (v, dec = 1) =>
    v == null || Number.isNaN(v)
      ? "—"
      : Number(v).toLocaleString("pt-BR", { maximumFractionDigits: dec, minimumFractionDigits: dec });

  const esc = (s) =>
    String(s ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  const statusMeta = (status) => {
    switch (status) {
      case "ONLINE_OPEN":
        return { cls: "open", label: "Online • 100% Aberto" };
      case "ONLINE_DISCOVERY_ONLY":
        return { cls: "discovery", label: "Catálogo Aberto • Pixel c/ Token" };
      case "PARTIAL":
        return { cls: "partial", label: "Parcial / Limitação" };
      default:
        return { cls: "error", label: status || "Erro" };
    }
  };

  function natureCategory(natureStr) {
    const s = (natureStr || "").toLowerCase();
    if (s.includes("previs")) return { key: "fcst", cls: "nat-fcst", short: "Previsão (Forecasting)" };
    if (s.includes("simula") || s.includes("rean")) return { key: "sim", cls: "nat-sim", short: "Simulação / Modelo" };
    if (s.includes("regra") || s.includes("catál") || s.includes("boletim"))
      return { key: "rule", cls: "nat-rule", short: s.includes("regra") ? "Regra Normativa" : "Catálogo / Boletim" };
    return { key: "fact", cls: "nat-fact", short: "Dado Fatídico (Real)" };
  }

  function natureBadge(natureStr) {
    const m = natureCategory(natureStr);
    return `<span class="nature-pill ${m.cls}" title="${esc(natureStr)}">${esc(natureStr || m.short)}</span>`;
  }

  /* Gráficos SVG sem dependências externas */
  function renderLineSvg(points, opts = {}) {
    if (!points || points.length === 0) return "<p>Sem série numérica disponível.</p>";
    const W = 760;
    const H = opts.height || 220;
    const padL = 52;
    const padR = 16;
    const padT = 18;
    const padB = 28;
    const vals = points.map((p) => Number(p.y));
    let minY = opts.minY !== undefined ? opts.minY : Math.min(...vals);
    let maxY = opts.maxY !== undefined ? opts.maxY : Math.max(...vals);
    if (minY === maxY) {
      minY -= 1;
      maxY += 1;
    }
    const xScale = (i) => padL + (i / Math.max(1, points.length - 1)) * (W - padL - padR);
    const yScale = (v) => padT + ((maxY - v) / (maxY - minY)) * (H - padT - padB);

    const pathD = points
      .map((p, i) => `${i === 0 ? "M" : "L"} ${xScale(i).toFixed(1)} ${yScale(p.y).toFixed(1)}`)
      .join(" ");

    const thresholds = (opts.thresholds || [])
      .map((t) => {
        const y = yScale(t.val);
        if (y < padT || y > H - padB) return "";
        return `
          <line x1="${padL}" y1="${y}" x2="${W - padR}" y2="${y}" stroke="${t.color}" stroke-dasharray="4 4" stroke-width="1.2"/>
          <text x="${W - padR - 4}" y="${y - 4}" text-anchor="end" font-size="10" fill="${t.color}" font-family="var(--font-mono)">${esc(t.label)}</text>
        `;
      })
      .join("");

    const step = Math.max(1, Math.floor(points.length / 6));
    const xLabels = points
      .map((p, idx) => ({ p, idx }))
      .filter(({ idx }) => idx % step === 0 || idx === points.length - 1)
      .map(
        ({ p, idx }) =>
          `<text x="${xScale(idx)}" y="${H - 8}" text-anchor="middle" font-size="10" fill="#4b635a" font-family="var(--font-mono)">${esc(p.x)}</text>`
      )
      .join("");

    const yTicks = [minY, (minY + maxY) / 2, maxY]
      .map(
        (v) =>
          `<text x="${padL - 6}" y="${yScale(v) + 3}" text-anchor="end" font-size="10" fill="#4b635a" font-family="var(--font-mono)">${v.toFixed(1)}</text>`
      )
      .join("");

    return `
      <svg viewBox="0 0 ${W} ${H}" class="svg-chart">
        <rect x="${padL}" y="${padT}" width="${W - padL - padR}" height="${H - padT - padB}" fill="#f9fbfa" stroke="#d4dfd9" />
        ${thresholds}
        ${yTicks}
        ${xLabels}
        <path d="${pathD}" fill="none" stroke="${opts.color || "#1d4ed8"}" stroke-width="2.4" />
        ${points
          .map(
            (p, i) =>
              `<circle cx="${xScale(i)}" cy="${yScale(p.y)}" r="2.8" fill="${opts.color || "#1d4ed8"}"><title>${esc(p.x)}: ${p.y}</title></circle>`
          )
          .join("")}
      </svg>
    `;
  }

  function renderBarSvg(items, opts = {}) {
    if (!items || items.length === 0) return "<p>Sem barras para exibir.</p>";
    const W = 760;
    const H = opts.height || 210;
    const padL = 48;
    const padR = 16;
    const padT = 18;
    const padB = 30;
    const maxY = Math.max(1, ...items.map((d) => Number(d.y) || 0)) * 1.12;
    const plotW = W - padL - padR;
    const plotH = H - padT - padB;
    const barW = Math.max(4, plotW / items.length - 3);

    const bars = items
      .map((d, i) => {
        const val = Number(d.y) || 0;
        const h = (val / maxY) * plotH;
        const x = padL + i * (plotW / items.length) + 1.5;
        const y = padT + plotH - h;
        const fill = d.color || opts.color || "#1d4ed8";
        return `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${barW.toFixed(1)}" height="${h.toFixed(1)}" rx="2" fill="${fill}"><title>${esc(d.x)}: ${val} ${opts.unit || ""}</title></rect>`;
      })
      .join("");

    const step = Math.max(1, Math.floor(items.length / 8));
    const labels = items
      .map((d, i) => ({ d, i }))
      .filter(({ i }) => i % step === 0 || i === items.length - 1)
      .map(({ d, i }) => {
        const x = padL + i * (plotW / items.length) + barW / 2;
        return `<text x="${x}" y="${H - 8}" text-anchor="middle" font-size="10" fill="#4b635a" font-family="var(--font-mono)">${esc(d.x)}</text>`;
      })
      .join("");

    return `
      <svg viewBox="0 0 ${W} ${H}" class="svg-chart">
        <rect x="${padL}" y="${padT}" width="${plotW}" height="${plotH}" fill="#f9fbfa" stroke="#d4dfd9" />
        <text x="${padL - 6}" y="${padT + 8}" text-anchor="end" font-size="10" fill="#4b635a" font-family="var(--font-mono)">${maxY.toFixed(0)}</text>
        <text x="${padL - 6}" y="${padT + plotH}" text-anchor="end" font-size="10" fill="#4b635a" font-family="var(--font-mono)">0</text>
        ${bars}
        ${labels}
      </svg>
    `;
  }

  /* Renderizador visual de escala espacial: pixel satélite vs Fazenda 500ha (2.2km x 2.2km) */
  function renderSpatialFootprintSvg(srcId) {
    const specs = {
      cmr_gpm: { label: "Pixel GPM IMERG (10 km × 10 km)", sizePx: 140, desc: "1 pixel cobre ~20 fazendas juntas — ótimo para chuva regional.", color: "#1d4ed8" },
      cmr_smap: { label: "Pixel SMAP L4 (9 km × 9 km)", sizePx: 126, desc: "Mede umidade até 1m de profundidade no polígono da fazenda.", color: "#0f766e" },
      cmr_gldas: { label: "Pixel GLDAS Noah (27 km × 27 km)", sizePx: 185, desc: "Célula ampla (~73 mil ha) de balanço hídrico profundo.", color: "#6d28d9" },
      cmr_ecostress: { label: "Pixel ECOSTRESS (70 m × 70 m)", sizePx: 12, desc: "Cabem ~1.000 pixels separados dentro de 1 fazenda de 500 ha! Vê cada talhão.", color: "#dc2626" },
      cmr_hls: { label: "Pixel HLS Landsat/Sentinel (30 m × 30 m)", sizePx: 7, desc: "Cabem ~5.500 pixels dentro da fazenda de 500 ha! Enxerga falhas de plantio.", color: "#15803d" },
    };
    const sp = specs[srcId] || specs.cmr_gpm;
    const farmPx = 31; // 2.23 km proporcional a ~140px = 10km (14px = 1km)
    const isFine = sp.sizePx < farmPx;
    const boxSize = Math.min(185, sp.sizePx);
    return `
      <div style="background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:14px 16px;margin-bottom:14px">
        <div style="font-size:12.5px;font-weight:700;margin-bottom:6px">Comparação Visual: Tamanho do "Quadradinho" do Satélite vs. Nossa Fazenda (500 ha = 2,2 km × 2,2 km)</div>
        <div style="display:flex;align-items:center;gap:18px;flex-wrap:wrap">
          <svg width="210" height="196" viewBox="0 0 210 196" style="background:#fff;border:1px solid var(--border);border-radius:6px;flex-shrink:0">
            ${
              isFine
                ? `
                  <rect x="65" y="58" width="80" height="80" fill="#dcfce7" stroke="#15803d" stroke-width="2" />
                  <rect x="96" y="88" width="${Math.max(8, sp.sizePx)}" height="${Math.max(8, sp.sizePx)}" fill="${sp.color}" opacity="0.85" />
                  <text x="105" y="156" text-anchor="middle" font-size="10" fill="#15803d" font-weight="700">Fazenda 500 ha</text>
                  <text x="105" y="48" text-anchor="middle" font-size="9.5" fill="${sp.color}" font-weight="700">Múltiplos pixels por talhão</text>
                `
                : `
                  <rect x="${(210 - boxSize) / 2}" y="${(196 - boxSize) / 2}" width="${boxSize}" height="${boxSize}" fill="${sp.color}" fill-opacity="0.16" stroke="${sp.color}" stroke-width="2" stroke-dasharray="4 3" />
                  <rect x="${(210 - farmPx) / 2}" y="${(196 - farmPx) / 2}" width="${farmPx}" height="${farmPx}" fill="#15803d" stroke="#0f241d" stroke-width="1.5" />
                  <text x="105" y="186" text-anchor="middle" font-size="9.5" fill="#0f241d" font-weight="700">Verde = Fazenda 500 ha | Tracejado = 1 Pixel</text>
                `
            }
          </svg>
          <div style="flex:1;min-width:220px">
            <div style="font-size:14px;font-weight:700;color:${sp.color}">${esc(sp.label)}</div>
            <p style="margin:4px 0 10px;font-size:13px;color:var(--ink-muted)">${esc(sp.desc)}</p>
            <div class="pipeline-steps" style="margin:0">
              <div class="p-step"><strong>Passo 1: Busca CMR/STAC (Aberto)</strong><span>Confirma se o satélite passou sobre Rio Verde hoje sem exigir senha.</span></div>
              <div class="p-step"><strong>Passo 2: Download / AppEEARS</strong><span>Em produção, envia Token Earthdata gratuito para recortar só a fazenda.</span></div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /* Renderizadores específicos para TODAS as 21 fontes */
  const renderers = {
    oni_timeline(src) {
      const d = src.parsed_data || {};
      const pts = (d.series_36m || []).map((r) => ({ x: r.label, y: r.anomaly }));
      const anom = Number(d.latest?.anomaly || 0);
      const pctPos = Math.max(2, Math.min(98, ((anom + 2.6) / 5.2) * 100));
      return `
        <div class="viz-card">
          <h3>Termômetro Oficial El Niño / La Niña (Índice NOAA ONI)</h3>
          <div class="kpi-row">
            <div class="kpi-box"><div class="k-lbl">Fase Atual ENSO</div><div class="k-val" style="color:${anom >= 0.5 ? "var(--crimson)" : anom <= -0.5 ? "var(--cobalt)" : "var(--ink)"}">${esc(d.current_phase)}</div></div>
            <div class="kpi-box"><div class="k-lbl">Último Trimestre</div><div class="k-val">${esc(d.latest?.label)}</div></div>
            <div class="kpi-box"><div class="k-lbl">Anomalia Oceano Pacífico</div><div class="k-val">${anom > 0 ? "+" : ""}${anom} °C</div></div>
            <div class="kpi-box"><div class="k-lbl">Série Histórica Completa</div><div class="k-val">${d.total_records || 0} trim.</div></div>
          </div>

          <div style="margin:6px 0 16px">
            <div style="display:flex;justify-content:space-between;font-size:11.5px;font-weight:700;margin-bottom:4px">
              <span style="color:var(--cobalt)">◄ La Niña Forte (-2.5°C)</span>
              <span style="color:var(--ink-muted)">Neutro (0.0°C)</span>
              <span style="color:var(--crimson)">El Niño Forte (+2.5°C) ►</span>
            </div>
            <div style="position:relative;height:14px;border-radius:7px;background:linear-gradient(90deg,#1d4ed8 0%,#93c5fd 35%,#e2e8f0 50%,#fca5a5 65%,#b91c1c 100%);border:1px solid var(--border)">
              <div title="Posição atual: ${anom}°C" style="position:absolute;top:-4px;left:calc(${pctPos}% - 7px);width:14px;height:20px;background:#0f241d;border:2px solid #fff;border-radius:4px;box-shadow:0 1px 4px rgba(0,0,0,0.4)"></div>
            </div>
          </div>

          ${renderLineSvg(pts, {
            minY: -2.2,
            maxY: 2.7,
            color: "#0f241d",
            thresholds: [
              { val: 0.5, color: "#b91c1c", label: "Limiar El Niño (+0.5°C)" },
              { val: 0.0, color: "#64748b", label: "Neutro (0.0°C)" },
              { val: -0.5, color: "#1d4ed8", label: "Limiar La Niña (-0.5°C)" },
            ],
          })}
        </div>
      `;
    },

    nmme_seasonal(src) {
      const d = src.parsed_data || {};
      const renderTerciles = (rows, title) => {
        if (!rows || !rows.length) return "<p>Sem dados de grade extraídos.</p>";
        return `
          <h4 style="margin:14px 0 10px;font-size:14px">${esc(title)}</h4>
          ${rows
            .map(
              (r) => `
            <div class="tercile-row">
              <div class="num" style="font-size:12.5px;font-weight:700">${esc(r.season)}</div>
              <div class="tercile-bar" title="Abaixo: ${r.prob_below}% | Normal: ${r.prob_norm}% | Acima: ${r.prob_above}%">
                <div class="t-below" style="width:${r.prob_below || 0}%">${r.prob_below ? r.prob_below + "%" : ""}</div>
                <div class="t-norm" style="width:${r.prob_norm || 0}%">${r.prob_norm ? r.prob_norm + "%" : ""}</div>
                <div class="t-above" style="width:${r.prob_above || 0}%">${r.prob_above ? r.prob_above + "%" : ""}</div>
              </div>
            </div>
          `
            )
            .join("")}
        `;
      };
      return `
        <div class="viz-card">
          <h3>Previsão Probabilística Sazonal NMME (Inclui NASA GEOS-S2S) — Rio Verde/GO</h3>
          <p style="font-size:13px;color:var(--ink-muted);margin:0 0 12px">
            Como ler: Cada barra soma 100% e mostra a aposta combinada dos modelos climáticos da NASA e NOAA para os próximos trimestres.<br>
            Legenda: <strong style="color:#d97706">■ Abaixo da Média</strong> &nbsp;
            <strong style="color:#64748b">■ Dentro da Média</strong> &nbsp;
            <strong style="color:#1d4ed8">■ Acima da Média</strong>
          </p>
          ${renderTerciles(d.precipitation_terciles, "Chuva Prevista (Precipitação Trimestral)")}
          ${renderTerciles(d.temperature_terciles, "Calor Previsto (Temperatura a 2m)")}
        </div>
      `;
    },

    nasa_gmao(src) {
      const d = src.parsed_data || {};
      const cols = d.sample_collections || [];
      return `
        <div class="viz-card">
          <h3>Arquitetura NASA GMAO (GEOS-S2S) — Motor Climático da NASA</h3>
          <div class="kpi-row">
            <div class="kpi-box"><div class="k-lbl">Portal Científico NASA</div><div class="k-val" style="color:var(--emerald)">HTTP ${d.portal_status || 200}</div></div>
            <div class="kpi-box"><div class="k-lbl">Servidor OPeNDAP</div><div class="k-val" style="color:var(--emerald)">HTTP ${d.opendap_status || 200}</div></div>
            <div class="kpi-box"><div class="k-lbl">Coleções GEOS Listadas</div><div class="k-val">${cols.length}</div></div>
          </div>
          <div class="pipeline-steps">
            <div class="p-step"><strong>1. Supermodelo NASA GEOS</strong><span>Simula oceanos, gelo e atmosfera em escala global até +9 meses à frente.</span></div>
            <div class="p-step"><strong>2. OPeNDAP Bruto (Pesado)</strong><span>Exige leitura matricial multidimensional (GBs) direto do servidor NCCS.</span></div>
            <div class="p-step"><strong>3. Atalho Inteligente ETL</strong><span>Já é consolidado pronto e gratuito em NetCDF leve dentro do consórcio NMME.</span></div>
          </div>
          <div style="font-size:12.5px;color:var(--ink-muted);margin-top:8px">Diretórios descobertos no servidor oficial OPeNDAP:</div>
          <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:6px">
            ${cols.map((c) => `<span class="period-pill num">${esc(c)}</span>`).join("")}
          </div>
        </div>
      `;
    },

    weather_7d(src) {
      const d = src.parsed_data || {};
      const cards = (d.forecast || [])
        .map(
          (f) => `
        <div class="w-day">
          <div class="num" style="font-size:12px;font-weight:700">${esc(f.date)}</div>
          <div style="font-size:12px;color:var(--ink-muted);min-height:34px;margin-top:4px">${esc(f.condition)}</div>
          <div class="w-temp-bar"></div>
          <div style="display:flex;justify-content:space-between;font-size:12.5px" class="num">
            <span style="color:var(--cobalt)">${f.min_c}°</span>
            <strong style="color:var(--crimson)">${f.max_c}°C</strong>
          </div>
          <div style="margin-top:6px;font-size:11px;font-weight:700;color:${Number(f.uv) >= 11 ? "var(--crimson)" : "var(--amber)"}">
            Índice UV: ${f.uv}
          </div>
        </div>
      `
        )
        .join("");
      return `
        <div class="viz-card">
          <h3>Previsão Tática de 7 Dias — ${esc(d.city)}/${esc(d.uf)} (Atualizado: ${esc(d.updated)})</h3>
          <p style="font-size:13px;color:var(--ink-muted);margin:0 0 12px">
            Decisão operacional de curto prazo: ajuda o agrônomo a definir janelas de pulverização, adubação e entrada de máquinas nos próximos 7 dias.
          </p>
          <div class="weather-strip">${cards}</div>
        </div>
      `;
    },

    power_gdd(src) {
      const d = src.parsed_data || {};
      const gdd = Number(d.soy_cycle_gdd_oct15_feb15 || 0);
      const targetGdd = 2100;
      const pct = Math.min(100, Math.round((gdd / targetGdd) * 100));
      const bars = (d.monthly_summary || []).map((m) => ({
        x: m.month.slice(2),
        y: m.rain_mm,
        color: m.hot_days_35 >= 15 ? "#d97706" : "#1d4ed8",
      }));
      const rows = (d.monthly_summary || [])
        .map(
          (m) => `
        <tr>
          <td class="num">${esc(m.month)}</td>
          <td class="num">${m.rain_mm} mm</td>
          <td class="num">${m.tmin_avg} °C</td>
          <td class="num">${m.tmax_avg} °C</td>
          <td class="num" style="color:${m.hot_days_35 >= 12 ? "var(--crimson)" : "inherit"};font-weight:${m.hot_days_35 >= 12 ? "700" : "400"}">${m.hot_days_35} dias</td>
        </tr>
      `
        )
        .join("");
      return `
        <div class="viz-card">
          <h3>Agrometeorologia &amp; Soma Térmica NASA POWER (MERRA-2)</h3>
          <div class="kpi-row">
            <div class="kpi-box"><div class="k-lbl">Chuva Acumulada (13 meses)</div><div class="k-val">${d.total_rain_mm} mm</div></div>
            <div class="kpi-box"><div class="k-lbl">Calor Acumulado Soja (GDD)</div><div class="k-val">${gdd} °Cd</div></div>
            <div class="kpi-box"><div class="k-lbl">Dias Contínuos Sem Falhas</div><div class="k-val">${d.total_valid_days}</div></div>
          </div>

          <div style="margin:4px 0 16px">
            <div style="display:flex;justify-content:space-between;font-size:12.5px;font-weight:700">
              <span>Progresso de Maturação Térmica (Soja 120 dias: 15/Out → 15/Fev)</span>
              <span class="num">${gdd} / ${targetGdd} °Cd (${pct}%)</span>
            </div>
            <div class="progress-track">
              <div class="progress-fill" style="width:${pct}%">${pct}% da soma térmica ideal</div>
            </div>
          </div>

          <p style="font-size:12px;color:var(--ink-muted);margin:0 0 6px">Chuva mensal (azul = ameno, laranja = mês com ≥ 15 dias acima de 35°C):</p>
          ${renderBarSvg(bars, { unit: "mm" })}
          <table class="data-table" style="margin-top:14px">
            <thead><tr><th>Mês</th><th>Chuva Total</th><th>Temp. Mín Média</th><th>Temp. Máx Média</th><th>Dias ≥ 35°C (Estresse)</th></tr></thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      `;
    },

    climateserv_rain(src) {
      const d = src.parsed_data || {};
      const imergBars = (d.imerg_series || []).map((x) => ({ x: x.date.slice(5), y: x.avg_mm }));
      const chirpsBars = (d.chirps_series || []).map((x) => ({ x: x.date.slice(5), y: x.avg_mm }));
      return `
        <div class="viz-card">
          <h3>Precipitação por Satélite NASA IMERG V07 &amp; CHIRPS (Polígono da Fazenda)</h3>
          <div class="kpi-row">
            <div class="kpi-box"><div class="k-lbl">IMERG V07 (Out/2026)</div><div class="k-val" style="color:var(--emerald)">${d.imerg_oct2026_total_mm} mm</div></div>
            <div class="kpi-box"><div class="k-lbl">CHIRPS (Set/2026)</div><div class="k-val" style="color:var(--cobalt)">${d.chirps_sep2026_total_mm} mm</div></div>
            <div class="kpi-box"><div class="k-lbl">Sub-feed NMME no SERVIR</div><div class="k-val" style="font-size:13px;color:var(--amber)">Desligado (2025)</div></div>
          </div>
          <div class="pipeline-steps">
            <div class="p-step"><strong>1. Envia Polígono (GeoJSON)</strong><span>Sistema manda as 4 pontas da fazenda sem baixar nenhum mapa pesado.</span></div>
            <div class="p-step"><strong>2. Nuvem NASA Recorta</strong><span>Servidor do SERVIR calcula a média espacial em ~12 segundos.</span></div>
            <div class="p-step"><strong>3. Retorna Chuva Diária</strong><span>Série diária pronta para saber se já houve umidade para semear.</span></div>
          </div>
          <h4 style="margin:14px 0 6px;font-size:13.5px">Chuva Diária — NASA IMERG V07 (Outubro/2026)</h4>
          ${renderBarSvg(imergBars, { color: "#15803d", unit: "mm", height: 170 })}
          <h4 style="margin:14px 0 6px;font-size:13.5px">Chuva Diária — USGS/NASA CHIRPS (Setembro/2026)</h4>
          ${renderBarSvg(chirpsBars, { color: "#1d4ed8", unit: "mm", height: 160 })}
        </div>
      `;
    },

    cmr_granules(src) {
      const d = src.parsed_data || {};
      const rows = (d.granules || [])
        .map(
          (g) => `
        <tr>
          <td class="num" style="font-size:12px">${esc(g.id)}</td>
          <td class="num">${esc((g.start || "").slice(0, 16).replace("T", " "))}</td>
          <td class="num">${g.size_mb ? fmtNum(g.size_mb, 2) + " MB" : g.cloud_cover_pct != null ? g.cloud_cover_pct + "% nuvem" : "COG"}</td>
          <td>${g.download_url ? `<a href="${esc(g.download_url)}" target="_blank" rel="noopener">Arquivo NASA</a>` : "—"}</td>
        </tr>
      `
        )
        .join("");
      return `
        <div class="viz-card">
          <h3>Cobertura de Satélite Confirmada sobre Rio Verde/GO (${esc(d.collection)})</h3>
          ${renderSpatialFootprintSvg(src.id)}
          <table class="data-table">
            <thead><tr><th>ID da Cena / Grânulo</th><th>Data de Passagem</th><th>Tamanho / Nuvens</th><th>Download</th></tr></thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      `;
    },

    inmet_stations(src) {
      const d = src.parsed_data || {};
      const st = d.anchor_station || {};
      return `
        <div class="viz-card">
          <h3>Estação Meteorológica Oficial Mais Próxima — INMET A025</h3>
          <div class="kpi-row">
            <div class="kpi-box"><div class="k-lbl">Estação Âncora</div><div class="k-val">${esc(st.CD_ESTACAO || "A025")} — ${esc(st.DC_NOME || "RIO VERDE")}</div></div>
            <div class="kpi-box"><div class="k-lbl">Situação Operacional</div><div class="k-val" style="color:var(--emerald)">${esc(st.CD_SITUACAO || "Operante")}</div></div>
            <div class="kpi-box"><div class="k-lbl">Altitude / Tipo</div><div class="k-val">${st.VL_ALTITUDE ? Math.round(Number(st.VL_ALTITUDE)) + "m" : "780m"} • Automática</div></div>
            <div class="kpi-box"><div class="k-lbl">Rede Nacional BR</div><div class="k-val">${d.total_br_stations || 668} estações</div></div>
          </div>
          <div class="pipeline-steps">
            <div class="p-step"><strong>Coordenada Exata</strong><span>Lat ${esc(st.VL_LATITUDE || "-17.78")} / Lon ${esc(st.VL_LONGITUDE || "-50.96")} (WMO ${esc(st.CD_OSCAR)})</span></div>
            <div class="p-step"><strong>Função no AgroPulse</strong><span>Serve de "tira-teima" em solo para validar o satélite da NASA na região.</span></div>
            <div class="p-step"><strong>Acesso a Séries Horárias</strong><span>Catálogo é aberto; histórico horário exige Token gratuito INMET (Probe HTTP ${d.timeseries_probe_status}).</span></div>
          </div>
        </div>
      `;
    },

    soil_profile(src) {
      const d = src.parsed_data || {};
      const depthRows = Object.entries(d.depths || {})
        .map(([depth, vals]) => {
          const clay = vals.clay || 0;
          const sand = vals.sand || 0;
          const silt = vals.silt || Math.max(0, 100 - clay - sand);
          return `
            <div style="margin-bottom:14px">
              <div style="display:flex;justify-content:space-between;font-size:13px;font-weight:700">
                <span>Profundidade ${esc(depth)}</span>
                <span class="num" style="color:var(--ink-muted)">Argila ${clay}% • Silte ${silt.toFixed(1)}% • Areia ${sand}%</span>
              </div>
              <div class="soil-stack">
                <div style="width:${clay}%;background:#92400e;display:grid;place-items:center">Argila ${clay}%</div>
                <div style="width:${silt}%;background:#64748b;display:grid;place-items:center">Silte ${silt.toFixed(1)}%</div>
                <div style="width:${sand}%;background:#d97706;display:grid;place-items:center">Areia ${sand}%</div>
              </div>
            </div>
          `;
        })
        .join("");

      return `
        <div class="viz-card">
          <h3>Raio-X do Solo e Classificação Automática para Seguro Rural (ZARC)</h3>
          <div class="kpi-row">
            <div class="kpi-box"><div class="k-lbl">Classe ZARC Detectada Automaticamente</div><div class="k-val" style="font-size:16px;color:var(--emerald)">${esc(d.zarc_soil_classification)}</div></div>
          </div>
          ${depthRows}
          <p style="font-size:12.5px;color:var(--ink-muted);margin:4px 0 0">
            Regra Prática: Solos com ≥ 35% de argila (Tipo 3) retêm água por mais dias entre veranicos, reduzindo o risco de perda da lavoura e liberando a janela mais segura do seguro agrícola.
          </p>
        </div>
      `;
    },

    grace_fo(src) {
      const d = src.parsed_data || {};
      const links = d.discovered_links || [];
      return `
        <div class="viz-card">
          <h3>NASA GRACE-FO — Reserva Hídrica Profunda e Aquífero</h3>
          <div class="pipeline-steps">
            <div class="p-step"><strong>Como os 2 Satélites Funcionam</strong><span>Medem micro-variações na gravidade da Terra para "pesar" quanto de água existe no subsolo e aquífero.</span></div>
            <div class="p-step"><strong>Lavoura de Sequeiro (Chuva)</strong><span>Impacto menor na safra anual (depende dos primeiros 100cm do solo vistos pelo SMAP).</span></div>
            <div class="p-step"><strong>Fazenda com Pivô Central</strong><span>Alerta crítico de risco de escassez hídrica para outorga e bombeamento em secas plurianuais.</span></div>
          </div>
          ${
            links.length
              ? `<div style="font-size:12.5px;font-weight:700;margin:10px 0 6px">Feeds Públicos Descobertos (WMS / GeoTIFF):</div>
                 <div style="display:flex;gap:6px;flex-wrap:wrap">${links.map((l) => `<span class="period-pill num">${esc(l)}</span>`).join("")}</div>`
              : ""
          }
        </div>
      `;
    },

    appeears_products(src) {
      const d = src.parsed_data || {};
      const rows = (d.agro_recommended || [])
        .map(
          (p) => `
        <tr>
          <td class="num"><strong>${esc(p.product_id)}</strong></td>
          <td>${esc(p.description)}</td>
          <td class="num">${esc(p.resolution)}</td>
          <td class="num">${esc(p.temporal)}</td>
        </tr>
      `
        )
        .join("");
      return `
        <div class="viz-card">
          <h3>NASA AppEEARS — Central Unificada de Extração Pontual (${d.total_products} produtos)</h3>
          <div class="pipeline-steps">
            <div class="p-step"><strong>Sem AppEEARS</strong><span>Baixar cena MODIS/ECOSTRESS inteira (~500 MB por dia em HDF5/GeoTIFF).</span></div>
            <div class="p-step"><strong>O "Açougueiro" da NASA</strong><span>Você envia só Lat/Lon ou GeoJSON da fazenda e escolhe as bandas (NDVI, LST, ET).</span></div>
            <div class="p-step"><strong>Resultado Leve</strong><span>Entrega apenas ~10 KB em CSV ou GeoTIFF já recortado para a fazenda!</span></div>
          </div>
          <table class="data-table">
            <thead><tr><th>Produto</th><th>Descrição</th><th>Resolução</th><th>Frequência</th></tr></thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      `;
    },

    crop_monitor(src) {
      return `
        <div class="viz-card">
          <h3>NASA Harvest / GEOGLAM — Radar Macro da Safra Global</h3>
          <div class="pipeline-steps">
            <div class="p-step"><strong>Polos Brasileiros</strong><span>Monitora condição geral de Centro-Oeste, Sul e Matopiba em parceria direta com a CONAB.</span></div>
            <div class="p-step"><strong>Competidores Globais</strong><span>Cruza risco climático nos EUA e Argentina para antecipar choque de oferta na CBOT.</span></div>
            <div class="p-step"><strong>Uso na Decisão Local</strong><span>Não substitui o ZARC da fazenda, mas reforça se vale segurar soja para vender mais caro ou travar preço cedo.</span></div>
          </div>
        </div>
      `;
    },

    zarc_calendar(src) {
      const d = src.parsed_data || {};
      const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
      const matrices = (d.crops || [])
        .map((c) => {
          const cells = (c.decendios || [])
            .map((risk, idx) => {
              const cls = risk === 20 ? "dec-20" : risk === 30 ? "dec-30" : risk === 40 ? "dec-40" : "dec-0";
              return `<div class="dec-cell ${cls}" title="Decêndio ${idx + 1}: Risco ${risk === 0 ? "Fechado" : risk + "%"}">${risk || ""}</div>`;
            })
            .join("");
          return `
            <div class="zarc-row">
              <div class="zarc-row-head">
                <strong>${esc(c.crop)} <span style="font-weight:400;color:var(--ink-muted)">(${esc(c.manejo)} • Ciclo ${esc(c.ciclo_cod)} • Solo ${esc(c.solo_cod)})</span></strong>
                <span class="num" style="font-size:12px">Janela aberta: Dec ${c.first_open_dec} ao Dec ${c.last_open_dec} (${c.open_decendios_count} decêndios)</span>
              </div>
              <div class="dec-grid">${cells}</div>
              <div class="month-axis">${months.map((m) => `<span>${m}</span>`).join("")}</div>
            </div>
          `;
        })
        .join("");
      return `
        <div class="viz-card">
          <h3>Calendário Oficial ZARC Safra 2026/2027 — Rio Verde/GO (36 Decêndios)</h3>
          <p style="font-size:13px;color:var(--ink-muted);margin:0 0 12px">
            Cada quadradinho representa 10 dias do ano. Só quem planta nas datas coloridas tem direito ao crédito agrícola oficial (PROAGRO / PSR).<br>
            Legenda de Risco: <strong style="color:#15803d">■ 20% (Ideal)</strong> &nbsp;
            <strong style="color:#d97706">■ 30% (Moderado)</strong> &nbsp;
            <strong style="color:#dc2626">■ 40% (Limite)</strong> &nbsp;
            <strong style="color:#64748b">■ Fechado (Sem Seguro)</strong>
          </p>
          <div class="zarc-matrix">${matrices}</div>
        </div>
      `;
    },

    ibge_yields(src) {
      const records = src.parsed_data?.records || [];
      const crops = [...new Set(records.map((r) => r.crop))];
      const years = [...new Set(records.map((r) => r.year))].sort();
      const chartBlocks = crops
        .map((crop) => {
          const items = years.map((yr) => {
            const rec = records.find((r) => r.year === yr && r.crop === crop);
            return {
              x: yr + (yr === "2024" ? "*" : ""),
              y: rec?.yield_sc_ha || 0,
              color: yr === "2024" ? "#d97706" : crop.includes("Soja") ? "#15803d" : crop.includes("Milho") ? "#1d4ed8" : "#6d28d9",
            };
          });
          return `
            <div>
              <div style="font-size:13px;font-weight:700;margin-bottom:4px">${esc(crop)} (Sacas/ha)</div>
              ${renderBarSvg(items, { unit: "sc/ha", height: 150 })}
            </div>
          `;
        })
        .join("");

      const rows = records
        .map(
          (r) => `
        <tr>
          <td class="num"><strong>${esc(r.year)}</strong> ${r.year === "2024" ? '<span style="color:var(--amber);font-size:11px">(El Niño)</span>' : ""}</td>
          <td>${esc(r.crop)}</td>
          <td class="num">${r.yield_kg_ha != null ? r.yield_kg_ha.toLocaleString("pt-BR") + " kg/ha" : "—"}</td>
          <td class="num"><strong>${r.yield_sc_ha != null ? r.yield_sc_ha + " sc/ha" : "—"}</strong></td>
          <td class="num">${r.area_ha != null ? r.area_ha.toLocaleString("pt-BR") + " ha" : "—"}</td>
        </tr>
      `
        )
        .join("");
      return `
        <div class="viz-card">
          <h3>Produtividade Real Histórica — Rio Verde/GO (IBGE PAM)</h3>
          <p style="font-size:12.5px;color:var(--ink-muted);margin:0 0 12px">
            Em laranja (*2024): impacto real registrado do último El Niño sobre a produtividade municipal de Rio Verde.
          </p>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:14px;margin-bottom:16px">
            ${chartBlocks}
          </div>
          <table class="data-table">
            <thead><tr><th>Ano</th><th>Cultura</th><th>Rendimento (kg/ha)</th><th>Sacas 60kg / ha</th><th>Área Colhida</th></tr></thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      `;
    },

    conab_costs(src) {
      const crops = src.parsed_data?.crops || [];
      const stacks = crops
        .map((c) => {
          const tot = Math.max(1, Number(c.custo_operacional_ha || 1));
          const pSem = ((c.sementes_ha / tot) * 100).toFixed(1);
          const pFert = ((c.fertilizantes_ha / tot) * 100).toFixed(1);
          const pDef = ((c.agrotoxicos_ha / tot) * 100).toFixed(1);
          const pOutros = Math.max(0, 100 - Number(pSem) - Number(pFert) - Number(pDef)).toFixed(1);
          return `
            <div style="margin-bottom:14px">
              <div style="display:flex;justify-content:space-between;font-size:13px;font-weight:700">
                <span>${esc(c.crop)} — Custo Operacional: <span class="num">${fmtBRL(c.custo_operacional_ha)}/ha</span></span>
                <span class="num" style="color:var(--cobalt)">Empate (Break-Even): ${c.breakeven_operacional_sc} sc/ha</span>
              </div>
              <div class="soil-stack" style="height:28px">
                <div style="width:${pSem}%;background:#0f766e;display:grid;place-items:center" title="Sementes: ${fmtBRL(c.sementes_ha)}">Sem ${pSem}%</div>
                <div style="width:${pFert}%;background:#b45309;display:grid;place-items:center" title="Fertilizantes: ${fmtBRL(c.fertilizantes_ha)}">Fert ${pFert}%</div>
                <div style="width:${pDef}%;background:#be123c;display:grid;place-items:center" title="Defensivos: ${fmtBRL(c.agrotoxicos_ha)}">Def ${pDef}%</div>
                <div style="width:${pOutros}%;background:#475569;display:grid;place-items:center" title="Máquinas / Mão de Obra / Outros">Operac. ${pOutros}%</div>
              </div>
            </div>
          `;
        })
        .join("");

      const rows = crops
        .map(
          (c) => `
        <tr>
          <td><strong>${esc(c.crop)}</strong></td>
          <td class="num">${c.yield_sc_ha} sc/ha</td>
          <td class="num">${fmtBRL(c.sementes_ha)}</td>
          <td class="num">${fmtBRL(c.fertilizantes_ha)}</td>
          <td class="num">${fmtBRL(c.agrotoxicos_ha)}</td>
          <td class="num"><strong>${fmtBRL(c.custeio_ha)}</strong></td>
          <td class="num"><strong>${fmtBRL(c.custo_operacional_ha)}</strong></td>
          <td class="num">${c.breakeven_operacional_sc} sc/ha</td>
        </tr>
      `
        )
        .join("");
      return `
        <div class="viz-card">
          <h3>Estrutura Oficial de Custos de Produção CONAB — Rio Verde/GO (2026)</h3>
          <p style="font-size:12.5px;color:var(--ink-muted);margin:0 0 12px">
            Quanto dinheiro o produtor precisa colocar no chão por hectare e quantas sacas precisa colher só para pagar a conta:
          </p>
          ${stacks}
          <table class="data-table">
            <thead>
              <tr><th>Cultura</th><th>Produtiv. Ref.</th><th>Sementes</th><th>Fertiliz.</th><th>Defensivos</th><th>Custeio Direto</th><th>Custo Operac.</th><th>Break-Even</th></tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      `;
    },

    sicor_credit(src) {
      const prods = src.parsed_data?.top_products || [];
      const maxVal = Math.max(1, ...prods.map((p) => Number(p.vl_custeio) || 0));
      const bars = prods
        .map((p) => {
          const w = Math.max(4, Math.round((Number(p.vl_custeio) / maxVal) * 100));
          return `
            <div class="hbar-row">
              <strong style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${esc(p.product)}">${esc(p.product)}</strong>
              <div class="hbar-track"><div class="hbar-fill" style="width:${w}%"></div></div>
              <span class="num" style="text-align:right;font-weight:700">${fmtBRL(p.vl_custeio / 1e6).replace("R$", "R$")}M</span>
            </div>
          `;
        })
        .join("");
      const rows = prods
        .map(
          (p) => `
        <tr>
          <td><strong>${esc(p.product)}</strong></td>
          <td class="num">${fmtBRL(p.vl_custeio)}</td>
          <td class="num">${p.area_ha.toLocaleString("pt-BR")} ha</td>
          <td class="num">${p.contracts}</td>
        </tr>
      `
        )
        .join("");
      return `
        <div class="viz-card">
          <h3>Crédito Rural Oficial SICOR — Banco Central do Brasil</h3>
          <p style="font-size:12.5px;color:var(--ink-muted);margin:0 0 12px">
            Volume financeiro de custeio contratado na amostra oficial OData (em Milhões de R$):
          </p>
          <div style="margin-bottom:16px">${bars}</div>
          <table class="data-table">
            <thead><tr><th>Produto Financiado</th><th>Valor Total de Custeio (R$)</th><th>Área Financiada</th><th>Registros</th></tr></thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      `;
    },

    market_prices(src) {
      const d = src.parsed_data || {};
      const soyPts = (d.soy_history || []).map((x) => ({ x: x.date.slice(5), y: x.close }));
      const cornPts = (d.corn_history || []).map((x) => ({ x: x.date.slice(5), y: x.close }));
      return `
        <div class="viz-card">
          <h3>Cotações Internacionais &amp; Preço Estimado na Roça (Rio Verde/GO)</h3>
          <div class="kpi-row">
            <div class="kpi-box"><div class="k-lbl">Dólar Comercial (BRL=X)</div><div class="k-val">R$ ${fmtNum(d.usd_brl, 2)}</div></div>
            <div class="kpi-box"><div class="k-lbl">Soja Rio Verde Est.</div><div class="k-val" style="color:var(--emerald)">${fmtBRL(d.soy_brl_sc_rio_verde_est)}/sc</div></div>
            <div class="kpi-box"><div class="k-lbl">Milho Rio Verde Est.</div><div class="k-val" style="color:var(--cobalt)">${fmtBRL(d.corn_brl_sc_rio_verde_est)}/sc</div></div>
            <div class="kpi-box"><div class="k-lbl">Sorgo (~80% Milho)</div><div class="k-val" style="color:var(--purple)">${fmtBRL(d.sorghum_brl_sc_rio_verde_est)}/sc</div></div>
          </div>

          <div class="pipeline-steps">
            <div class="p-step"><strong>1. Bolsa Chicago (CBOT)</strong><span>Soja ${d.soy_cbot_cents_bu} ¢/bu • Milho ${d.corn_cbot_cents_bu} ¢/bu</span></div>
            <div class="p-step"><strong>2. Conversão Porto (Santos)</strong><span>Multiplica pelo Dólar (${fmtNum(d.usd_brl, 2)}) e converte bushel para saca de 60kg.</span></div>
            <div class="p-step"><strong>3. Desconto Frete (Interior)</strong><span>Desconta logística até Goiás para estimar quanto chega no bolso do produtor.</span></div>
          </div>

          <p style="font-size:12.5px;color:var(--ink-muted);margin:10px 0 6px">Histórico recente — Soja CBOT (cents/bushel):</p>
          ${renderLineSvg(soyPts, { color: "#15803d", height: 175 })}
          <p style="font-size:12.5px;color:var(--ink-muted);margin:12px 0 6px">Histórico recente — Milho CBOT (cents/bushel):</p>
          ${renderLineSvg(cornPts, { color: "#1d4ed8", height: 165 })}
        </div>
      `;
    },

    audit_summary(src) {
      const entries = Object.entries(src.parsed_data || {})
        .map(
          ([k, v]) =>
            `<tr><td class="num" style="width:220px"><strong>${esc(k)}</strong></td><td>${esc(typeof v === "object" ? JSON.stringify(v) : v)}</td></tr>`
        )
        .join("");
      return `
        <div class="viz-card">
          <h3>Metadados Extraídos da Fonte</h3>
          <table class="data-table"><tbody>${entries}</tbody></table>
        </div>
      `;
    },
  };

  /* Navegação programática entre telas */
  function switchView(mode) {
    document.querySelectorAll(".view-tab").forEach((t) => t.classList.toggle("active", t.dataset.view === mode));
    document.getElementById("homeView").classList.toggle("hidden", mode !== "home");
    document.getElementById("etlView").classList.toggle("hidden", mode !== "etl");
    document.getElementById("simulatorView").classList.toggle("hidden", mode !== "simulator");
    document.getElementById("rotareView").classList.toggle("hidden", mode !== "rotare");
  }

  /* 1. TELA INICIAL PARA LEIGOS */
  function renderHome(bundle, openSourceFn) {
    const s = bundle.summary || {};
    const syn = bundle.decision_synthesis || {};
    const sources = bundle.sources || [];
    const climateserv = sources.find((x) => x.id === "climateserv")?.parsed_data || {};
    const container = document.getElementById("homeView");

    const stepDescriptions = {
      "1. Macro-Clima & Sazonal": {
        num: 1,
        title: "Clima Global & Previsão do Tempo",
        plain: "Responde: Vai chover ou fazer seca forte por causa do El Niño / La Niña nos próximos 3 a 9 meses?",
      },
      "2. Agromet & Satélite": {
        num: 2,
        title: "Chuva & Calor na Fazenda (Satélite + Estação)",
        plain: "Responde: Quanto choveu exatamente em cima da fazenda e quantos dias de calor >35°C a lavoura sofreu?",
      },
      "3. Solo & Água": {
        num: 3,
        title: "Tipo de Solo & Água na Raiz",
        plain: "Responde: A terra segura água nos veranicos (Argilosa/Arenosa) e existe umidade na profundidade da raiz?",
      },
      "4. Fenologia & Talhão": {
        num: 4,
        title: "Saúde da Planta por Talhão (Até 30m)",
        plain: "Responde: Cada pedaço da lavoura está verde e crescendo bem ou passando sede/estresse térmico?",
      },
      "5. Regulação & Mercado BR": {
        num: 5,
        title: "Lei do Seguro, Custos & Lucro no Bolso",
        plain: "Responde: Qual janela libera crédito/seguro (ZARC), quanto custa plantar (CONAB) e qual cultura dá maior lucro?",
      },
    };

    const grouped = {};
    sources.forEach((src) => {
      grouped[src.layer] = grouped[src.layer] || [];
      grouped[src.layer].push(src);
    });

    const flowCardsHtml = Object.entries(stepDescriptions)
      .map(([layerKey, meta]) => {
        const items = grouped[layerKey] || [];
        return `
          <div class="flow-card">
            <div class="flow-card-head">
              <div class="step-num">${meta.num}</div>
              <h3>${esc(meta.title)}</h3>
            </div>
            <p style="margin:0;font-size:13px;color:var(--ink-muted)">${esc(meta.plain)}</p>
            <div class="flow-chips">
              ${items
                .map(
                  (src) => `
                <button class="flow-chip" data-open-source="${esc(src.id)}">
                  <div class="flow-chip-top">
                    <span>${esc(src.name.split("–")[0].trim())}</span>
                    ${natureBadge(src.data_nature)}
                  </div>
                  <div class="flow-chip-sub">
                    <strong>Período:</strong> ${esc(src.period_min || "—")} → ${esc(src.period_max || "—")}
                  </div>
                  <div class="flow-chip-sub" style="color:var(--ink)">${esc(src.plain_answer || src.fit_analysis)}</div>
                </button>
              `
                )
                .join("")}
            </div>
          </div>
        `;
      })
      .join("");

    let activeNatureFilter = "all";

    const renderInventoryTable = (filterKey) => {
      const filtered = sources.filter((src) => filterKey === "all" || natureCategory(src.data_nature).key === filterKey);
      return `
        <table class="data-table">
          <thead>
            <tr>
              <th>Base Oficial</th>
              <th>Tipo do Dado</th>
              <th>Período Mínimo</th>
              <th>Período Máximo</th>
              <th>O que traz na prática</th>
              <th>Ação</th>
            </tr>
          </thead>
          <tbody>
            ${filtered
              .map(
                (src) => `
              <tr>
                <td><strong>${esc(src.name.split("–")[0].trim())}</strong><br><span style="font-size:11.5px;color:var(--ink-muted)">${esc(src.provider)}</span></td>
                <td>${natureBadge(src.data_nature)}</td>
                <td class="num" style="font-size:12px">${esc(src.period_min || "—")}</td>
                <td class="num" style="font-size:12px">${esc(src.period_max || "—")}</td>
                <td style="font-size:12.5px">${esc(src.plain_answer || src.fit_analysis)}</td>
                <td><button class="filter-pill" data-open-source="${esc(src.id)}" style="white-space:nowrap">Ver Gráficos →</button></td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
      `;
    };

    container.innerHTML = `
      <div class="hero-card">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:16px;flex-wrap:wrap">
          <div>
            <h2>Como o AgroPulse NASA Transforma Satélites em Lucro e Segurança no Campo</h2>
            <p class="hero-lead">
              Em vez de mostrar tabelas técnicas complicadas, esta plataforma junta <strong>${s.total_sources} bases oficiais</strong> (NASA, NOAA, Embrapa, IBGE, CONAB e Banco Central) para responder três perguntas simples do produtor rural em <strong>Rio Verde/GO</strong>: <em>Quando plantar? Qual cultura plantar na 2ª safra? E quanto dinheiro sobra no bolso?</em>
            </p>
          </div>
          <div style="display:flex;gap:8px;flex-wrap:wrap">
            <button id="goRotareBtn" class="filter-pill active" style="padding:9px 16px;font-size:13px;background:var(--amber);border-color:var(--amber)">Caso de Uso: Rotare (El Niño) →</button>
            <button id="goSimBtn" class="filter-pill active" style="padding:9px 16px;font-size:13px">Abrir Simulador Econômico →</button>
          </div>
        </div>

        <div class="hero-highlights">
          <div class="highlight-box">
            <div class="h-tag">CLIMA GLOBAL AGORA (FATO)</div>
            <div class="h-val" style="color:var(--crimson)">${esc(syn.enso_status?.phase || "—")} (${syn.enso_status?.oni_anomaly ?? "—"}°C)</div>
            <div class="h-desc">Aquece e aumenta risco de veranico no Brasil.</div>
          </div>
          <div class="highlight-box">
            <div class="h-tag">PREVISÃO SAFRINHA (FORECASTING)</div>
            <div class="h-val" style="color:var(--amber)">${syn.nmme_safrinha_outlook?.prob_below ?? "—"}% chuva abaixo</div>
            <div class="h-desc">Trimestre ${esc(syn.nmme_safrinha_outlook?.season || "JFM 2027")} na NASA/NOAA.</div>
          </div>
          <div class="highlight-box">
            <div class="h-tag">SOLO DA FAZENDA &amp; CHUVA OUT/26</div>
            <div class="h-val" style="color:var(--emerald)">Tipo 3 Argiloso • ${climateserv.imerg_oct2026_total_mm ?? "—"} mm</div>
            <div class="h-desc">Retém mais água • Chuva NASA IMERG V07.</div>
          </div>
          <div class="highlight-box">
            <div class="h-tag">COBERTURA DO SISTEMA</div>
            <div class="h-val">${s.online_open}/${s.total_sources} Abertas</div>
            <div class="h-desc">${s.online_discovery_only} catálogos livres c/ download via Token.</div>
          </div>
        </div>
      </div>

      <h3 style="margin:0 0 12px;font-size:17px">Guia em 5 Etapas: Onde está cada informação e o que ela traz</h3>
      <div class="flow-grid">${flowCardsHtml}</div>

      <div class="viz-card">
        <h3>Mapa Completo das ${sources.length} Fontes: Dado Fatídico vs. Previsão vs. Simulação &amp; Janela Temporal</h3>
        <p style="font-size:13px;color:var(--ink-muted);margin:0 0 12px">
          Filtre abaixo para ver o <strong>período mínimo</strong>, o <strong>período máximo</strong> e se a base mede um <strong>fato real observado</strong>, uma <strong>previsão futura</strong> ou uma <strong>simulação física</strong>:
        </p>
        <div class="filter-pills" id="homeNatureFilters">
          <button class="filter-pill active" data-nfilter="all">Todas (${sources.length})</button>
          <button class="filter-pill" data-nfilter="fact">Dado Fatídico (Observado)</button>
          <button class="filter-pill" data-nfilter="fcst">Previsão (Forecasting)</button>
          <button class="filter-pill" data-nfilter="sim">Simulação / Reanálise</button>
          <button class="filter-pill" data-nfilter="rule">Regra / Catálogo</button>
        </div>
        <div id="homeInventoryTable">${renderInventoryTable(activeNatureFilter)}</div>
      </div>
    `;

    container.querySelector("#goSimBtn")?.addEventListener("click", () => switchView("simulator"));
    container.querySelector("#goRotareBtn")?.addEventListener("click", () => switchView("rotare"));

    const bindOpenButtons = () => {
      container.querySelectorAll("[data-open-source]").forEach((btn) => {
        btn.addEventListener("click", () => {
          openSourceFn(btn.dataset.openSource);
        });
      });
    };
    bindOpenButtons();

    container.querySelectorAll("#homeNatureFilters .filter-pill").forEach((pill) => {
      pill.addEventListener("click", () => {
        activeNatureFilter = pill.dataset.nfilter;
        container.querySelectorAll("#homeNatureFilters .filter-pill").forEach((p) => p.classList.remove("active"));
        pill.classList.add("active");
        container.querySelector("#homeInventoryTable").innerHTML = renderInventoryTable(activeNatureFilter);
        bindOpenButtons();
      });
    });
  }

  /* 2. ESTÁGIO DE DETALHE DE CADA API */
  function renderSourceStage(src) {
    const st = statusMeta(src.status);
    const renderer = renderers[src.id] || renderers[src.viz_type] || renderers.audit_summary;
    const html = `
      <div class="source-header">
        <div class="source-title-row">
          <div>
            <h2 class="source-title">${esc(src.name)}</h2>
            <p class="source-provider">${esc(src.provider)} • ${esc(src.layer)}</p>
          </div>
          <span class="status-badge ${st.cls}">${esc(st.label)}</span>
        </div>

        <div class="period-strip">
          ${natureBadge(src.data_nature)}
          <span class="period-pill"><strong>Período Mínimo:</strong> <span class="num">${esc(src.period_min || "—")}</span></span>
          <span class="period-pill"><strong>Período Máximo:</strong> <span class="num">${esc(src.period_max || "—")}</span></span>
          <span class="period-pill"><strong>Atualização:</strong> ${esc(src.temporal_resolution)}</span>
        </div>

        <div class="plain-box">
          <div class="plain-box-q">Em linguagem simples — ${esc(src.plain_question || "O que esta fonte entrega?")}</div>
          <p class="plain-box-a">${esc(src.plain_answer || src.fit_analysis)}</p>
        </div>

        <a class="source-url" href="${esc(src.url)}" target="_blank" rel="noopener">${esc(src.url)}</a>

        <div class="audit-grid">
          <div class="audit-cell">
            <div class="audit-label">1. Acesso &amp; Autenticação</div>
            <div class="audit-val">HTTP ${src.http_status ?? "ERR"} • ${src.latency_ms} ms</div>
            <div class="audit-sub">${esc(src.auth_required)}</div>
          </div>
          <div class="audit-cell">
            <div class="audit-label">2. Formato do Retorno</div>
            <div class="audit-val">${esc(src.actual_format)}</div>
            <div class="audit-sub">Esperado: ${esc(src.expected_format)}</div>
          </div>
          <div class="audit-cell">
            <div class="audit-label">3. Resolução &amp; Cobertura</div>
            <div class="audit-val">${esc(src.spatial_resolution)}</div>
            <div class="audit-sub">${esc(src.coverage)}</div>
          </div>
          <div class="audit-cell">
            <div class="audit-label">4. Fit para o Objetivo</div>
            <div class="audit-val">Nota ${src.fit_score} / 5</div>
            <div class="audit-sub">${esc(src.fit_analysis)}</div>
          </div>
        </div>

        ${src.audit_notes ? `<div class="note-banner"><strong>Achado Técnico ETL:</strong> ${esc(src.audit_notes)}</div>` : ""}
        ${src.error ? `<div class="note-banner" style="background:var(--crimson-soft);border-color:var(--crimson);color:var(--crimson)"><strong>Erro:</strong> ${esc(src.error)}</div>` : ""}
      </div>

      ${renderer(src)}

      <details class="raw-details">
        <summary>Inspetor Técnico (Engenharia): Ver Amostra Bruta Extraída (Camada Bronze)</summary>
        <pre class="raw-pre">${esc(src.raw_sample || JSON.stringify(src.parsed_data, null, 2))}</pre>
      </details>
    `;
    document.getElementById("sourceStage").innerHTML = html;
  }

  /* 3. SIMULADOR ECONÔMICO INTEGRADO */
  function renderSimulator(bundle) {
    const syn = bundle.decision_synthesis || {};
    const areaDefault = syn.anchor_farm?.area_ha || 500;
    const container = document.getElementById("simulatorView");

    const draw = (areaHa) => {
      const factor = areaHa / (syn.anchor_farm?.area_ha || 500);
      const scenarios = syn.scenarios_500ha || [];
      const bestId = scenarios.reduce((best, cur) => (cur.margin_ha > best.margin_ha ? cur : best), scenarios[0] || {}).id;
      const maxRev = Math.max(1, ...scenarios.map((s) => Math.max(s.revenue_ha, s.cost_ha)));

      const comparisonBars = scenarios
        .map((sc) => {
          const revW = Math.round((sc.revenue_ha / maxRev) * 100);
          const costW = Math.round((sc.cost_ha / maxRev) * 100);
          return `
            <div style="margin-bottom:12px">
              <div style="display:flex;justify-content:space-between;font-size:13px;font-weight:700;margin-bottom:4px">
                <span>${esc(sc.title)}</span>
                <span class="num" style="color:${sc.margin_ha >= 0 ? "var(--emerald)" : "var(--crimson)"}">
                  Margem: ${fmtBRL(sc.margin_ha)}/ha (${fmtBRL(sc.total_margin_farm * factor)} na fazenda)
                </span>
              </div>
              <div class="hbar-row" style="margin-bottom:4px">
                <span style="font-size:11.5px;color:var(--ink-muted)">Receita Bruta / ha</span>
                <div class="hbar-track"><div class="hbar-fill" style="width:${revW}%;background:var(--emerald)"></div></div>
                <span class="num" style="text-align:right">${fmtBRL(sc.revenue_ha)}</span>
              </div>
              <div class="hbar-row" style="margin-bottom:0">
                <span style="font-size:11.5px;color:var(--ink-muted)">Custo Operac. / ha</span>
                <div class="hbar-track"><div class="hbar-fill" style="width:${costW}%;background:var(--amber)"></div></div>
                <span class="num" style="text-align:right">${fmtBRL(sc.cost_ha)}</span>
              </div>
            </div>
          `;
        })
        .join("");

      container.innerHTML = `
        <div class="viz-card">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px">
            <div>
              <h2 style="margin:0;font-size:20px">Simulador Econômico &amp; Risco Climático — Rio Verde/GO</h2>
              <p style="margin:4px 0 0;font-size:13.5px;color:var(--ink-muted)">
                Cruza NOAA ONI (${esc(syn.enso_status?.phase)}), Previsão NMME, Solo (${esc(syn.soil_auto_zarc)}), Seguro ZARC 26/27, CONAB 2026 e CBOT/Dólar.
              </p>
            </div>
            <div style="min-width:260px">
              <label for="areaSlider" style="font-size:13px;font-weight:700;display:block">
                Tamanho da Fazenda: <span class="num" style="color:var(--cobalt)">${areaHa} hectares</span>
              </label>
              <input id="areaSlider" type="range" min="100" max="1500" step="50" value="${areaHa}" style="width:100%" />
            </div>
          </div>

          <div class="kpi-row" style="margin-top:16px;margin-bottom:0">
            <div class="kpi-box"><div class="k-lbl">ENSO Atual (Fato)</div><div class="k-val">${esc(syn.enso_status?.phase)} (${syn.enso_status?.oni_anomaly ?? "—"}°C)</div></div>
            <div class="kpi-box"><div class="k-lbl">Soja Est. Rio Verde</div><div class="k-val">${fmtBRL(syn.prices_used_rio_verde_brl_sc?.soja)}/sc</div></div>
            <div class="kpi-box"><div class="k-lbl">Milho Est. Rio Verde</div><div class="k-val">${fmtBRL(syn.prices_used_rio_verde_brl_sc?.milho)}/sc</div></div>
            <div class="kpi-box"><div class="k-lbl">Sorgo Est. Rio Verde</div><div class="k-val">${fmtBRL(syn.prices_used_rio_verde_brl_sc?.sorgo)}/sc</div></div>
          </div>
        </div>

        <div class="viz-card">
          <h3>Comparativo Visual: Receita vs. Custo por Hectare</h3>
          ${comparisonBars}
        </div>

        <div class="scenario-grid">
          ${scenarios
            .map((sc) => {
              const rec = sc.id === bestId;
              const totMargin = sc.total_margin_farm * factor;
              const totCusteio = sc.custeio_exposure_farm * factor;
              return `
              <div class="scenario-card ${rec ? "recommended" : ""}">
                <div style="display:flex;justify-content:space-between;align-items:center">
                  <span style="font-size:12px;font-weight:700;color:${rec ? "var(--emerald)" : "var(--ink-muted)"}">${rec ? "MELHOR RETORNO AJUSTADO" : "CENÁRIO ALTERNATIVO"}</span>
                </div>
                <h3 style="margin:0;font-size:16px">${esc(sc.title)}</h3>
                <div style="font-size:12.5px;color:var(--ink-muted)">${esc(sc.risk_level)}</div>
                <div style="border-top:1px solid var(--surface-alt);padding-top:10px;display:grid;gap:6px;font-size:13px">
                  <div style="display:flex;justify-content:space-between"><span>Receita / ha:</span><strong class="num">${fmtBRL(sc.revenue_ha)}</strong></div>
                  <div style="display:flex;justify-content:space-between"><span>Custo Operac. / ha:</span><strong class="num">${fmtBRL(sc.cost_ha)}</strong></div>
                  <div style="display:flex;justify-content:space-between"><span>Margem / ha:</span><strong class="num" style="color:${sc.margin_ha >= 0 ? "var(--emerald)" : "var(--crimson)"}">${fmtBRL(sc.margin_ha)}</strong></div>
                  <div style="display:flex;justify-content:space-between;border-top:1px dashed var(--border);padding-top:6px">
                    <span>Resultado (${areaHa} ha):</span>
                    <strong class="num" style="font-size:15px;color:${totMargin >= 0 ? "var(--emerald)" : "var(--crimson)"}">${fmtBRL(totMargin)}</strong>
                  </div>
                  <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--ink-muted)">
                    <span>Capital de Custeio em Risco:</span>
                    <span class="num">${fmtBRL(totCusteio)}</span>
                  </div>
                </div>
              </div>
            `;
            })
            .join("")}
        </div>
      `;

      document.getElementById("areaSlider").addEventListener("input", (e) => draw(Number(e.target.value)));
    };

    draw(areaDefault);
  }

  /* 4. CASO DE USO: ROTARE COM EL NIÑO */
  function renderRotareUseCase(bundle) {
    const container = document.getElementById("rotareView");
    const analogs = bundle.rotare_analogs || { seasons: [] };
    const syn = bundle.decision_synthesis || {};
    const soilSrc = (bundle.sources || []).find((x) => x.id === "soilgrids")?.parsed_data || {};
    const ibgeSrc = (bundle.sources || []).find((x) => x.id === "ibge_sidra")?.parsed_data || {};
    const conabSrc = (bundle.sources || []).find((x) => x.id === "conab_custos")?.parsed_data || {};

    const clay15 = soilSrc.depths?.["15-30cm"]?.clay ?? 38.5;
    const baseCadMm = Math.round(80 + clay15 * 0.85); // ~113 mm CAD para Latossolo argiloso Rio Verde

    const conabSoja = (conabSrc.crops || []).find((c) => c.crop === "Soja")?.custeio_ha || 3353.87;
    const conabMilho = (conabSrc.crops || []).find((c) => c.crop === "Milho 2ª Safra")?.custeio_ha || 3803.69;
    const conabSorgo = (conabSrc.crops || []).find((c) => c.crop === "Sorgo")?.custeio_ha || 2258.69;

    const state = {
      talhaoSelected: true,
      rotationConfirmed: true,
      elNinoMode: true,
      areaHa: 400,
      priority: "drought", // "drought" | "balanced" | "profit"
      irrigation: "dryland", // "dryland" | "irrigated"
      machinery: "soy_corn_only", // "soy_corn_only" | "flexible"
      plantingOffset: 0, // -7, 0, +7
      rainDeltaPct: 0, // 0, -20, etc.
      tempDeltaC: 0, // 0, +1, etc.
    };

    const parseSeasonWindow = (daily, startMmDd, durationDays) => {
      const idx = daily.findIndex((row) => row[0] >= startMmDd && row[0].slice(0, 2) === startMmDd.slice(0, 2));
      const startIdx = idx >= 0 ? idx : 110;
      return daily.slice(startIdx, startIdx + durationDays);
    };

    const simulateCropCycle = (daily, opts) => {
      const { startMmDd, durationDays, kc, cadMm, evapMult, rainMult, tempAdd, irrigated } = opts;
      const win = parseSeasonWindow(daily, startMmDd, durationDays);
      if (!win.length) return { stressDays: 0, hotDays: 0, frostDays: 0, deficitMm: 0 };

      let storage = cadMm * 0.85; // solo úmido na transição soja -> safrinha
      let stressDays = 0;
      let hotDays = 0;
      let frostDays = 0;
      let deficitMm = 0;

      win.forEach((row, dayIdx) => {
        const rain = (Number(row[1]) || 0) * rainMult;
        const tmax = (Number(row[2]) || 30) + tempAdd;
        const tmin = (Number(row[3]) || 18) + tempAdd;
        const rad = Number(row[4]) || 18;
        const tmean = (tmax + tmin) / 2;

        // Evapotranspiração por radiação solar NASA POWER (Jensen-Haise simplificado)
        const eto = Math.max(1.8, 0.0135 * (tmean + 17.8) * (rad / 2.45));
        const etc = eto * kc * evapMult;

        storage = Math.min(cadMm, storage + rain);
        if (irrigated && storage < cadMm * 0.55) {
          storage = cadMm * 0.90;
        }
        storage -= etc;
        if (storage < 0) {
          deficitMm += Math.abs(storage);
          storage = 0;
        }

        // Janela crítica (florescimento/enchimento: dias 40 a 90)
        if (dayIdx >= 35 && dayIdx <= Math.min(95, win.length - 1)) {
          if (storage < cadMm * 0.30) stressDays += 1;
          if (tmax >= 34.0) hotDays += 1;
        }
        if (tmin <= 4.0) frostDays += 1;
      });

      return { stressDays, hotDays, frostDays, deficitMm: Math.round(deficitMm) };
    };

    const dateByOffset = (baseDayOfJan, offsetDays) => {
      const d = new Date(Date.UTC(2026, 0, baseDayOfJan + offsetDays));
      const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
      const dd = String(d.getUTCDate()).padStart(2, "0");
      return `${mm}-${dd}`;
    };

    const draw = () => {
      const allSeasons = analogs.seasons || [];
      const activeSeasons = state.elNinoMode
        ? allSeasons.filter((s) => s.type === "analog")
        : allSeasons.filter((s) => s.type === "reference");
      const rainMult = 1 + state.rainDeltaPct / 100;
      const irrigated = state.irrigation === "irrigated";

      const strategySpecs = [
        {
          id: "A",
          name: "Estratégia A (Atual): Soja + Milho 2ª Safra Tradicional",
          subtitle: "Mantém a rotação habitual sem antecipar nem trocar cultura",
          baseJanDay: 25, // 25/Jan (pode ir até 01/Fev se atrasar +7d)
          durationDays: 120,
          kc: 1.05,
          cadBonus: 0,
          evapMult: 1.0,
          custeioSafrinha: conabMilho,
          zarcBase: "Decêndio 3–4 (Fecha em 10/Fev — Risco 40%)",
          machineryFit: "100% compatível com maquinário Soja/Milho",
          machineryPenalty: 0,
          soilNotes: {
            nutrientes: "Alta extração de N e K pelo milho; exige adubação pesada de cobertura.",
            pragas: "Risco alto de cigarrinha-do-milho e nematóides em sucessão contínua.",
            erosao: "Boa palhada se fechar bem; risco de solo descoberto se secar cedo.",
          },
          blocks: {
            why: "É o padrão que Seu Carlos já opera há anos e para o qual tem colheitadeira, plantadeira e compradores prontos.",
            benefits: "Se a chuva não cortar em março/abril, entrega o maior volume de receita bruta por hectare entre as opções.",
            risks: "Nos anos análogos de El Niño, o enchimento de grãos coincide com corte de chuva e ondas >34°C; após 10/Fev perde o seguro ZARC.",
            unknown: "Não sabemos o dia exato do último evento de chuva no talhão nem a pressão real de cigarrinha na região na safra.",
          },
        },
        {
          id: "B",
          name: "Estratégia B: Milho Mais Cedo (-7d) + Cobertura Vegetal (Braquiária)",
          subtitle: "Antecipa milho nos primeiros talhões e põe cobertura no milho tardio",
          baseJanDay: 18, // 18/Jan (-7 dias) + consórcio braquiária
          durationDays: 110,
          kc: 0.96,
          cadBonus: 16, // palhada + raiz profunda retêm mais umidade
          evapMult: 0.86, // menor evaporação do solo coberto
          custeioSafrinha: Math.round(conabMilho * 0.65 + 480 * 0.35), // ~65% milho precoce + 35% área tardia em cobertura
          zarcBase: "Decêndios 2–5 (Milho + Braquiária seguro até 20/Fev)",
          machineryFit: state.machinery === "soy_corn_only"
            ? "Usa seu mesmo maquinário Soja/Milho (semeio a lanço ou caixa de miúdas)"
            : "100% compatível com plantio conservacionista",
          machineryPenalty: 0,
          soilNotes: {
            nutrientes: "Ciclagem forte de K e matéria orgânica; reduz lixiviação.",
            pragas: "Cobertura viva reduz pressão de plantas daninhas e nematoides.",
            erosao: "Nota máxima: palhada protege 100% o solo contra chuvas intensas de verão.",
          },
          blocks: {
            why: "Corta o risco justamente na ponta mais perigosa (talhões tardios) sem abandonar o milho nem exigir outra colheitadeira.",
            benefits: "Reduz capital exposto na área tardia, estende janela ZARC em +10 dias (consórcio até 20/Fev) e melhora retenção de água no solo.",
            risks: "Reduz receita potencial na fração que vira só cobertura (sem colheita de grão naquele talhão) e exige ajuste de dessecação antes da próxima soja.",
            unknown: "Não temos API química do talhão (fósforo/cálcio/alumínio 20–40cm exigidos pelo ZarcNM) nem estoque de sementes de cobertura local.",
          },
        },
        {
          id: "C",
          name: "Estratégia C: Soja + Cultura de Menor Demanda Hídrica (Sorgo 2ª Safra)",
          subtitle: "Substitui o milho de risco por Sorgo Granífero tolerante à seca",
          baseJanDay: 28,
          durationDays: 100,
          kc: 0.72,
          cadBonus: 8,
          evapMult: 0.92,
          custeioSafrinha: conabSorgo,
          zarcBase: "Decêndios 1–8 (Aberto com seguro até 20/Mar)",
          machineryFit: state.machinery === "soy_corn_only"
            ? "Alerta de Maquinário: exige ajuste de plataforma/peneira e logística de venda"
            : "Compatível com operação adaptada para Sorgo",
          machineryPenalty: state.machinery === "soy_corn_only" ? 18 : 0,
          soilNotes: {
            nutrientes: "Menor exigência de nitrogênio em cobertura que o milho (custeio 40,6% menor).",
            pragas: "Quebra o ciclo da cigarrinha-do-milho, mas pede atenção a pulgão-do-sorgo.",
            erosao: "Boa biomassa residual mantendo cobertura do solo na entressafra.",
          },
          blocks: {
            why: "O Sorgo consome ~30% menos água que o milho, custa R$ 1.545/ha a menos no custeio e mantém seguro rural aberto até 20 de março.",
            benefits: "Menor risco de estresse hídrico severo em El Niño extremo (-20% chuva / +1°C) e preservação de R$ 618 mil de custeio em 400 ha.",
            risks: "Liquidez regional e preço por saca (~80% do milho) são menores; se o maquinário for travado só em soja/milho exige regulagem ou terceirização.",
            unknown: "Não temos API com o preço spot do comprador local de sorgo na porta da fazenda de Seu Carlos nem a disponibilidade imediata de plataforma.",
          },
        },
      ];

      const evalOffset = (spec, offsetDays) => {
        const startMmDd = dateByOffset(spec.baseJanDay, offsetDays);
        const perSeason = activeSeasons.map((sea) =>
          simulateCropCycle(sea.daily, {
            startMmDd,
            durationDays: spec.durationDays,
            kc: spec.kc,
            cadMm: baseCadMm + spec.cadBonus,
            evapMult: spec.evapMult,
            rainMult,
            tempAdd: state.tempDeltaC,
            irrigated,
          })
        );
        const n = Math.max(1, perSeason.length);
        const avgStress = perSeason.reduce((a, b) => a + b.stressDays, 0) / n;
        const avgHot = perSeason.reduce((a, b) => a + b.hotDays, 0) / n;
        const avgFrost = perSeason.reduce((a, b) => a + b.frostDays, 0) / n;
        const avgDeficit = perSeason.reduce((a, b) => a + b.deficitMm, 0) / n;

        const droughtRisk = Math.min(98, Math.round((avgStress / 28) * 100));
        const heatRisk = Math.min(95, Math.round((avgHot / 18) * 100));
        const frostRisk = Math.round(Math.min(40, avgFrost * 12));

        // Pontuação de adequação combinando risco climático + prioridade + maquinário
        let riskPenalty = droughtRisk * 0.72 + heatRisk * 0.25 + frostRisk * 0.1;
        if (state.priority === "balanced") riskPenalty *= 0.75;
        if (state.priority === "profit") riskPenalty *= 0.45;

        const custeioPenalty = ((spec.custeioSafrinha - conabSorgo) / 1550) * (state.priority === "profit" ? -18 : 14);
        const totalScore = 100 - riskPenalty - custeioPenalty - spec.machineryPenalty;

        return {
          startMmDd,
          avgStress: Number(avgStress.toFixed(1)),
          avgHot: Number(avgHot.toFixed(1)),
          avgFrost: Number(avgFrost.toFixed(1)),
          avgDeficit: Math.round(avgDeficit),
          droughtRisk,
          heatRisk,
          frostRisk,
          totalScore: Number(totalScore.toFixed(1)),
        };
      };

      const evaluated = strategySpecs.map((spec) => {
        const early = evalOffset(spec, -7);
        const base = evalOffset(spec, 0);
        const late = evalOffset(spec, 7);
        const current = state.plantingOffset === -7 ? early : state.plantingOffset === 7 ? late : base;
        return { spec, early, base, late, current };
      });

      evaluated.sort((x, y) => y.current.totalScore - x.current.totalScore);

      const analogCards = allSeasons
        .map((sea) => {
          const isRef = sea.type === "reference";
          const simA = simulateCropCycle(sea.daily, {
            startMmDd: dateByOffset(25, state.plantingOffset),
            durationDays: 120,
            kc: 1.05,
            cadMm: baseCadMm,
            evapMult: 1.0,
            rainMult,
            tempAdd: state.tempDeltaC,
            irrigated,
          });
          return `
            <div class="kpi-box" style="${isRef ? "border-style:dashed;opacity:0.9" : "border-color:#fca5a5"}">
              <div class="k-lbl">${esc(sea.label)}</div>
              <div class="k-val" style="font-size:15px;color:${isRef ? "var(--emerald)" : "var(--crimson)"}">
                ${simA.stressDays} dias secos (Milho)
              </div>
              <div style="font-size:11.5px;color:var(--ink-muted);margin-top:4px">
                Chuva OND: <strong>${sea.summary.ond_rain_mm} mm</strong> | Safrinha: <strong>${sea.summary.safrinha_rain_mm} mm</strong><br>
                Calor ≥34°C Safrinha: <strong>${sea.summary.safrinha_hot_days_34c} dias</strong> | Déficit: <strong>${simA.deficitMm} mm</strong>
              </div>
            </div>
          `;
        })
        .join("");

      const stratCards = evaluated
        .map((item, idx) => {
          const rank = idx + 1;
          const rankCls = rank === 1 ? "rank-1" : rank === 2 ? "rank-2" : "rank-3";
          const s = item.spec;
          const c = item.current;
          const custTotalFarm = (conabSoja + s.custeioSafrinha) * state.areaHa;

          return `
            <div class="scenario-card ${rank === 1 ? "recommended" : ""}">
              <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap">
                <span class="rank-badge ${rankCls}">${rank}º Lugar no Cenário Atual</span>
                <span class="num" style="font-size:11.5px;color:var(--ink-muted)">Score ${c.totalScore}</span>
              </div>

              <div>
                <h3 style="margin:0;font-size:15.5px">${esc(s.name)}</h3>
                <p style="margin:3px 0 0;font-size:12px;color:var(--ink-muted)">${esc(s.subtitle)}</p>
              </div>

              <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;text-align:center">
                <div class="kpi-box" style="padding:8px">
                  <div class="k-lbl" style="font-size:11px">Risco Seca</div>
                  <div class="k-val" style="font-size:16px;color:${c.droughtRisk >= 45 ? "var(--crimson)" : c.droughtRisk >= 25 ? "var(--amber)" : "var(--emerald)"}">${c.droughtRisk}%</div>
                </div>
                <div class="kpi-box" style="padding:8px">
                  <div class="k-lbl" style="font-size:11px">Risco Calor</div>
                  <div class="k-val" style="font-size:16px;color:${c.heatRisk >= 40 ? "var(--crimson)" : "var(--amber)"}">${c.heatRisk}%</div>
                </div>
                <div class="kpi-box" style="padding:8px">
                  <div class="k-lbl" style="font-size:11px">Risco Geada</div>
                  <div class="k-val" style="font-size:16px;color:var(--cobalt)">${c.frostRisk}%</div>
                </div>
              </div>

              <div style="background:var(--surface-alt);border-radius:6px;padding:8px 10px;font-size:12px">
                <strong>Sensibilidade por Data de Plantio (Dias em déficit crítico):</strong>
                <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-top:5px;text-align:center" class="num">
                  <div style="background:${state.plantingOffset === -7 ? "#fff" : "transparent"};padding:4px;border-radius:4px;border:${state.plantingOffset === -7 ? "1px solid var(--cobalt)" : "none"}">
                    <div style="font-size:10.5px;color:var(--ink-muted)">-1 sem (${item.early.startMmDd})</div>
                    <strong>${item.early.avgStress} dias</strong>
                  </div>
                  <div style="background:${state.plantingOffset === 0 ? "#fff" : "transparent"};padding:4px;border-radius:4px;border:${state.plantingOffset === 0 ? "1px solid var(--cobalt)" : "none"}">
                    <div style="font-size:10.5px;color:var(--ink-muted)">Base (${item.base.startMmDd})</div>
                    <strong>${item.base.avgStress} dias</strong>
                  </div>
                  <div style="background:${state.plantingOffset === 7 ? "#fff" : "transparent"};padding:4px;border-radius:4px;border:${state.plantingOffset === 7 ? "1px solid var(--cobalt)" : "none"}">
                    <div style="font-size:10.5px;color:var(--ink-muted)">+1 sem (${item.late.startMmDd})</div>
                    <strong>${item.late.avgStress} dias</strong>
                  </div>
                </div>
              </div>

              <div style="font-size:12px;display:grid;gap:3px">
                <div><strong>ZARC 26/27:</strong> ${esc(s.zarcBase)}</div>
                <div><strong>Maquinário:</strong> ${esc(s.machineryFit)}</div>
                <div><strong>Custeio Exposto (${state.areaHa} ha):</strong> <span class="num">${fmtBRL(custTotalFarm)}</span></div>
              </div>

              <div class="soil-notes-row">
                <div><strong>Nutrientes:</strong> ${esc(s.soilNotes.nutrientes)}</div>
                <div><strong>Pragas:</strong> ${esc(s.soilNotes.pragas)}</div>
                <div><strong>Erosão:</strong> ${esc(s.soilNotes.erosao)}</div>
              </div>

              <div class="four-blocks">
                <div class="block-item block-why"><strong>Por quê</strong>${esc(s.blocks.why)}</div>
                <div class="block-item block-pro"><strong>Benefícios</strong>${esc(s.blocks.benefits)}</div>
                <div class="block-item block-risk"><strong>Riscos</strong>${esc(s.blocks.risks)}</div>
                <div class="block-item block-unknown"><strong>O que não sabemos</strong>${esc(s.blocks.unknown)}</div>
              </div>
            </div>
          `;
        })
        .join("");

      container.innerHTML = `
        <div class="rotare-disclaimer">
          <strong>Aviso Fixo de Segurança Agronômica:</strong> Esta ferramenta é de <strong>apoio à decisão</strong> e <strong>não substitui</strong> a vistoria técnica nem a recomendação formal do Engenheiro Agrônomo e do consultor de crédito/seguro da propriedade.
        </div>

        <div class="el-nino-banner">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:16px;flex-wrap:wrap">
            <div>
              <h2 style="margin:0 0 6px;font-size:21px">Caso de Uso: Rotare com El Niño — Backtest com Dados Reais da NASA</h2>
              <p style="margin:0;font-size:13.5px;color:var(--ink)">
                A NOAA indica sinal forte de El Niño (<strong>${esc(syn.enso_status?.phase || "El Niño Forte")}</strong>, anomalia <strong>${syn.enso_status?.oni_anomaly ?? "—"}°C</strong> em ${esc(syn.enso_status?.oni_season || "ASO 2026")}). Recalculamos abaixo o risco da rotação usando os <strong>3 análogos reais de El Niño forte</strong> da NASA POWER (<strong>1997/98, 2015/16 e 2023/24</strong>) sobre o solo real de Rio Verde/GO (SoilGrids Tipo 3 • CAD ~${baseCadMm} mm).
              </p>
            </div>
            <button id="rotareToggleElNino" class="filter-pill ${state.elNinoMode ? "active" : ""}" style="padding:9px 14px;background:${state.elNinoMode ? "var(--crimson)" : "var(--surface)"};color:${state.elNinoMode ? "#fff" : "var(--ink)"};border-color:var(--crimson)">
              Modo El Niño: ${state.elNinoMode ? "LIGADO (Análogos 97/98, 15/16, 23/24)" : "DESLIGADO (Safra Ref. 2022/23)"}
            </button>
          </div>
        </div>

        <!-- Passo 1 & 2: Talhão + 3 Perguntas + Card Rotação Atual -->
        <div class="rotare-setup-grid">
          <div class="talhao-card">
            <div style="font-size:12px;font-weight:700;color:var(--ink-muted)">PASSO 1 • CLIQUE NO TALHÃO</div>
            <div id="rotareTalhaoBtn" class="talhao-polygon ${state.talhaoSelected ? "selected" : ""}">
              <div style="font-weight:700;font-size:14px;color:var(--emerald)">Talhão Piloto — Seu Carlos (${state.areaHa} ha)</div>
              <div class="num" style="font-size:11.5px;color:var(--ink-muted);margin-top:4px">Rio Verde/GO • -17.84°, -51.02°</div>
              <div style="font-size:11.5px;margin-top:6px;font-weight:600">${state.talhaoSelected ? "✓ Talhão Selecionado (Solo Tipo 3 • 38,5% argila)" : "Clique para selecionar talhão"}</div>
            </div>

            <div style="background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:11px;font-size:12.5px">
              <div style="font-weight:700;margin-bottom:4px">Card: Sua Rotação Atual</div>
              <div>Detectada: <strong>Soja (Out–Jan) → Milho 2ª Safra</strong></div>
              <div style="font-size:11.5px;color:var(--ink-muted);margin-top:4px">
                <em>Como sabemos (Transparência ETL):</em> O censo IBGE PAM de Rio Verde comprova dupla safra Soja (428,5 mil ha) + Milho 2ª Safra (352 mil ha), com queda da soja de 70→61,7 sc/ha no El Niño de 2024. O download automático de 10 anos de NDVI por pixel via NASA AppEEARS (MOD13Q1) está catalogado e aguarda Earthdata Token gratuito.
              </div>
              <button id="confirmRotBtn" class="filter-pill ${state.rotationConfirmed ? "active" : ""}" style="margin-top:8px;width:100%">
                ${state.rotationConfirmed ? "✓ Rotação Atual Confirmada" : "Confirmar Rotação Soja + Milho"}
              </button>
            </div>
          </div>

          <div class="viz-card" style="margin-bottom:0">
            <h3 style="margin-bottom:4px">Perfil da Propriedade (3 Perguntas) &amp; Cobertura das APIs Reais</h3>
            <p style="margin:0 0 10px;font-size:12.5px;color:var(--ink-muted)">
              Ajuste o perfil de Seu Carlos abaixo — os riscos, datas e recomendações recalculam em tempo real sobre as séries diárias NASA POWER:
            </p>
            <div class="rotare-form-grid">
              <div class="rotare-field">
                <label for="rotarePriority">1. Qual a prioridade?</label>
                <select id="rotarePriority">
                  <option value="drought" ${state.priority === "drought" ? "selected" : ""}>Menos risco de seca</option>
                  <option value="balanced" ${state.priority === "balanced" ? "selected" : ""}>Equilíbrio risco × retorno</option>
                  <option value="profit" ${state.priority === "profit" ? "selected" : ""}>Máximo retorno bruto</option>
                </select>
              </div>
              <div class="rotare-field">
                <label for="rotareIrrigation">2. Sistema hídrico</label>
                <select id="rotareIrrigation">
                  <option value="dryland" ${state.irrigation === "dryland" ? "selected" : ""}>Sem irrigação (Sequeiro)</option>
                  <option value="irrigated" ${state.irrigation === "irrigated" ? "selected" : ""}>Com irrigação (Pivô Central)</option>
                </select>
              </div>
              <div class="rotare-field">
                <label for="rotareMachinery">3. Maquinário disponível</label>
                <select id="rotareMachinery">
                  <option value="soy_corn_only" ${state.machinery === "soy_corn_only" ? "selected" : ""}>Só para Soja e Milho</option>
                  <option value="flexible" ${state.machinery === "flexible" ? "selected" : ""}>Aceita Sorgo e Cobertura</option>
                </select>
              </div>
            </div>

            <div class="kpi-row" style="margin-top:14px;margin-bottom:0">${analogCards}</div>
          </div>
        </div>

        <!-- Passo 3: Simulação de Estresse Climático (-20% chuva / +1°C) e Data de Plantio -->
        <div class="stress-toolbar">
          <div style="display:flex;gap:18px;flex-wrap:wrap;align-items:center">
            <div>
              <div style="font-size:12px;font-weight:700">Redução de Chuva Simulada: <span class="num" style="color:var(--crimson)">${state.rainDeltaPct}%</span></div>
              <input id="rotareRainSlider" type="range" min="-30" max="0" step="5" value="${state.rainDeltaPct}" />
            </div>
            <div>
              <div style="font-size:12px;font-weight:700">Aumento de Temperatura: <span class="num" style="color:var(--crimson)">+${state.tempDeltaC} °C</span></div>
              <input id="rotareTempSlider" type="range" min="0" max="2" step="0.5" value="${state.tempDeltaC}" />
            </div>
            <div>
              <div style="font-size:12px;font-weight:700">Janela de Plantio:</div>
              <div class="filter-pills" style="margin:4px 0 0">
                <button class="filter-pill ${state.plantingOffset === -7 ? "active" : ""}" data-offset="-7">-1 semana</button>
                <button class="filter-pill ${state.plantingOffset === 0 ? "active" : ""}" data-offset="0">Padrão</button>
                <button class="filter-pill ${state.plantingOffset === 7 ? "active" : ""}" data-offset="7">+1 semana</button>
              </div>
            </div>
          </div>

          <div style="display:flex;gap:8px;flex-wrap:wrap">
            <button id="rotareStressPreset" class="filter-pill active" style="background:var(--crimson);border-color:var(--crimson)">Testar Choque: -20% Chuva e +1°C</button>
            <button id="rotareStressReset" class="filter-pill">Zerar Choque</button>
          </div>
        </div>

        <!-- Passo 4: As 3 Estratégias Lado a Lado -->
        <h3 style="margin:0 0 4px;font-size:17px">Comparação das 3 Estratégias Lado a Lado (Ranking recalculado pelos dados NASA POWER)</h3>
        <p style="margin:0 0 12px;font-size:13px;color:var(--ink-muted)">
          Mude a prioridade, ative <strong>-20% Chuva / +1°C</strong> ou compare <strong>-1 semana vs +1 semana</strong> para ver como o ranking muda na tela:
        </p>
        <div class="scenario-grid" style="margin-top:0">${stratCards}</div>
      `;

      container.querySelector("#rotareToggleElNino")?.addEventListener("click", () => {
        state.elNinoMode = !state.elNinoMode;
        draw();
      });
      container.querySelector("#rotareTalhaoBtn")?.addEventListener("click", () => {
        state.talhaoSelected = !state.talhaoSelected;
        draw();
      });
      container.querySelector("#confirmRotBtn")?.addEventListener("click", () => {
        state.rotationConfirmed = true;
        draw();
      });
      container.querySelector("#rotarePriority")?.addEventListener("change", (e) => {
        state.priority = e.target.value;
        draw();
      });
      container.querySelector("#rotareIrrigation")?.addEventListener("change", (e) => {
        state.irrigation = e.target.value;
        draw();
      });
      container.querySelector("#rotareMachinery")?.addEventListener("change", (e) => {
        state.machinery = e.target.value;
        draw();
      });
      container.querySelector("#rotareRainSlider")?.addEventListener("input", (e) => {
        state.rainDeltaPct = Number(e.target.value);
        draw();
      });
      container.querySelector("#rotareTempSlider")?.addEventListener("input", (e) => {
        state.tempDeltaC = Number(e.target.value);
        draw();
      });
      container.querySelectorAll("[data-offset]").forEach((btn) => {
        btn.addEventListener("click", () => {
          state.plantingOffset = Number(btn.dataset.offset);
          draw();
        });
      });
      container.querySelector("#rotareStressPreset")?.addEventListener("click", () => {
        state.elNinoMode = true;
        state.rainDeltaPct = -20;
        state.tempDeltaC = 1;
        draw();
      });
      container.querySelector("#rotareStressReset")?.addEventListener("click", () => {
        state.rainDeltaPct = 0;
        state.tempDeltaC = 0;
        state.plantingOffset = 0;
        draw();
      });
    };

    draw();
  }

  function initApp(bundle) {
    if (!bundle || !bundle.sources) {
      document.getElementById("homeView").innerHTML =
        '<div class="viz-card">Bundle ETL não encontrado. Execute <code>.venv/bin/python etl/run_pipeline.py</code> primeiro.</div>';
      return;
    }

    const s = bundle.summary || {};
    document.getElementById("telemetryStrip").innerHTML = `
      <div class="telemetry-pill">Fontes: <strong>${s.total_sources}</strong></div>
      <div class="telemetry-pill">Abertas: <strong style="color:var(--emerald)">${s.online_open}</strong></div>
      <div class="telemetry-pill">Catálogos Token: <strong style="color:var(--cobalt)">${s.online_discovery_only}</strong></div>
      <div class="telemetry-pill">Latência Média: <strong>${s.avg_latency_ms} ms</strong></div>
    `;

    const sources = bundle.sources;
    let activeId = sources[0]?.id;

    function buildSidebar(query = "") {
      const q = query.trim().toLowerCase();
      const filtered = sources.filter(
        (src) =>
          !q ||
          src.name.toLowerCase().includes(q) ||
          src.provider.toLowerCase().includes(q) ||
          src.layer.toLowerCase().includes(q) ||
          (src.data_nature || "").toLowerCase().includes(q)
      );

      const groups = {};
      filtered.forEach((src) => {
        groups[src.layer] = groups[src.layer] || [];
        groups[src.layer].push(src);
      });

      const listEl = document.getElementById("sourceList");
      listEl.innerHTML = Object.entries(groups)
        .map(
          ([layer, items]) => `
        <div class="layer-group">
          <h4 class="layer-heading">${esc(layer)} (${items.length})</h4>
          ${items
            .map((src) => {
              const st = statusMeta(src.status);
              return `
              <button class="source-btn ${src.id === activeId ? "active" : ""}" data-id="${esc(src.id)}">
                <div class="source-btn-top">
                  <span class="source-btn-name">${esc(src.name)}</span>
                  <span class="dot ${st.cls}" title="${esc(st.label)}"></span>
                </div>
                <div class="source-btn-meta">
                  <span>${esc(natureCategory(src.data_nature).short)}</span>
                  <span class="num">${src.latency_ms}ms • Fit ${src.fit_score}/5</span>
                </div>
              </button>
            `;
            })
            .join("")}
        </div>
      `
        )
        .join("");

      listEl.querySelectorAll(".source-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          activeId = btn.dataset.id;
          const target = sources.find((x) => x.id === activeId);
          if (target) renderSourceStage(target);
          buildSidebar(document.getElementById("sourceFilter").value);
        });
      });
    }

    function openSourceById(sourceId) {
      const target = sources.find((x) => x.id === sourceId);
      if (!target) return;
      activeId = target.id;
      switchView("etl");
      renderSourceStage(target);
      buildSidebar(document.getElementById("sourceFilter").value);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    renderHome(bundle, openSourceById);
    buildSidebar();
    if (sources[0]) renderSourceStage(sources[0]);
    renderSimulator(bundle);
    renderRotareUseCase(bundle);

    document.getElementById("sourceFilter").addEventListener("input", (e) => buildSidebar(e.target.value));

    document.querySelectorAll(".view-tab").forEach((tab) => {
      tab.addEventListener("click", () => switchView(tab.dataset.view));
    });
  }

  if (window.AGROPULSE_BUNDLE) {
    initApp(window.AGROPULSE_BUNDLE);
  } else {
    fetch("bundle.js")
      .then(() => initApp(window.AGROPULSE_BUNDLE || null))
      .catch(() =>
        fetch("../data/gold/dashboard_bundle.json")
          .then((r) => r.json())
          .then(initApp)
          .catch(() => initApp(null))
      );
  }
})();
