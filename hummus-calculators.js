/**
 * EVCalc.io - Interactive EV Calculators
 * 3 calculators: Home Charging ROI, EV vs Gas TCO, Quick Savings
 * Vanilla JS, Chart.js for charts, localStorage persistence
 */

(function () {
  'use strict';

  // ─── Constants ───────────────────────────────────────────────────────
  const GAS_AVG_MPG = 27;
  const GAS_MAINTENANCE_PER_MILE = 0.09;
  const EV_MAINTENANCE_PER_MILE = 0.04;
  const STORAGE_KEY = 'evcalc_inputs';
  const MONTHS_IN_YEAR = 12;
  const YEARS_TCO = 5;

  const AFFILIATE_LINKS = [
    { name: 'ChargePoint Home Flex (Level 2)', url: 'https://www.amazon.com/dp/B07WXCR3DG?tag=evcalcio-20', price: '$699' },
    { name: 'Grizzl-E Classic (Level 2, 40A)', url: 'https://www.amazon.com/dp/B08GSNK7PK?tag=evcalcio-20', price: '$459' },
    { name: 'Lectron V-BOX 48A', url: 'https://www.amazon.com/dp/B09YDBTHVL?tag=evcalcio-20', price: '$379' },
    { name: 'Tesla Wall Connector', url: 'https://www.amazon.com/dp/B0C5DFN2JK?tag=evcalcio-20', price: '$475' },
  ];

  // ─── Utility ─────────────────────────────────────────────────────────
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
  const fmt = (n, decimals = 2) => '$' + Number(n).toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  const fmtNum = (n, d = 1) => Number(n).toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });

  function saveInputs() {
    const data = {};
    $$('input[data-persist]').forEach(el => { data[el.id] = el.value; });
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch (_) { }
  }

  function loadInputs() {
    try {
      const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      Object.entries(data).forEach(([id, val]) => {
        const el = document.getElementById(id);
        if (el) el.value = val;
      });
    } catch (_) { }
  }

  function validate(form) {
    let valid = true;
    $$('input[required]', form).forEach(input => {
      const v = parseFloat(input.value);
      const errEl = input.nextElementSibling;
      if (isNaN(v) || v < 0) {
        input.classList.add('evc-error');
        if (errEl?.classList.contains('evc-err-msg')) errEl.textContent = input.value === '' ? 'This field is required' : 'Please enter a valid positive number';
        valid = false;
      } else {
        input.classList.remove('evc-error');
        if (errEl?.classList.contains('evc-err-msg')) errEl.textContent = '';
      }
    });
    return valid;
  }

  function revealResults(container) {
    container.style.display = 'block';
    container.style.opacity = '0';
    container.style.transform = 'translateY(20px)';
    requestAnimationFrame(() => {
      container.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      container.style.opacity = '1';
      container.style.transform = 'translateY(0)';
    });
  }

  function affiliateHTML() {
    return `<div class="evc-affiliate"><h4>⚡ Recommended Home Chargers</h4><ul>${AFFILIATE_LINKS.map(l =>
      `<li><a href="${l.url}" target="_blank" rel="noopener sponsored">${l.name}</a> — ${l.price}</li>`
    ).join('')}</ul><p class="evc-disclaimer">As an Amazon Associate, EVCalc.io earns from qualifying purchases.</p></div>`;
  }

  // ─── Styles ──────────────────────────────────────────────────────────
  function injectStyles() {
    if ($('#evc-styles')) return;
    const style = document.createElement('style');
    style.id = 'evc-styles';
    style.textContent = `
      :root { --evc-primary: #10b981; --evc-primary-dark: #059669; --evc-bg: #f8fafc; --evc-card: #fff; --evc-text: #1e293b; --evc-muted: #64748b; --evc-border: #e2e8f0; --evc-error-color: #ef4444; --evc-radius: 12px; }
      .evc-calc { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 720px; margin: 2rem auto; background: var(--evc-card); border-radius: var(--evc-radius); box-shadow: 0 4px 24px rgba(0,0,0,.08); padding: 2rem; color: var(--evc-text); }
      .evc-calc h2 { margin: 0 0 .25rem; font-size: 1.5rem; }
      .evc-calc .evc-subtitle { color: var(--evc-muted); margin-bottom: 1.5rem; font-size: .95rem; }
      .evc-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
      @media (max-width: 540px) { .evc-grid { grid-template-columns: 1fr; } }
      .evc-field { display: flex; flex-direction: column; }
      .evc-field label { font-size: .85rem; font-weight: 600; margin-bottom: .3rem; }
      .evc-field input { padding: .6rem .75rem; border: 1.5px solid var(--evc-border); border-radius: 8px; font-size: 1rem; transition: border .2s; }
      .evc-field input:focus { outline: none; border-color: var(--evc-primary); box-shadow: 0 0 0 3px rgba(16,185,129,.15); }
      .evc-field input.evc-error { border-color: var(--evc-error-color); }
      .evc-err-msg { color: var(--evc-error-color); font-size: .78rem; min-height: 1.1rem; }
      .evc-btn { display: inline-flex; align-items: center; gap: .5rem; padding: .7rem 1.5rem; background: var(--evc-primary); color: #fff; border: none; border-radius: 8px; font-size: 1rem; font-weight: 600; cursor: pointer; transition: background .2s, transform .1s; margin-top: 1rem; }
      .evc-btn:hover { background: var(--evc-primary-dark); }
      .evc-btn:active { transform: scale(.97); }
      .evc-btn-secondary { background: transparent; color: var(--evc-primary); border: 1.5px solid var(--evc-primary); }
      .evc-btn-secondary:hover { background: rgba(16,185,129,.08); }
      .evc-results { display: none; margin-top: 1.5rem; }
      .evc-results-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; margin-bottom: 1.5rem; }
      .evc-stat { background: var(--evc-bg); border-radius: 10px; padding: 1rem; text-align: center; }
      .evc-stat .evc-val { font-size: 1.6rem; font-weight: 700; color: var(--evc-primary); }
      .evc-stat .evc-label { font-size: .8rem; color: var(--evc-muted); margin-top: .25rem; }
      .evc-chart-wrap { position: relative; width: 100%; max-height: 320px; margin: 1rem 0; }
      .evc-affiliate { background: #fffbeb; border: 1px solid #fde68a; border-radius: 10px; padding: 1rem 1.25rem; margin-top: 1.5rem; }
      .evc-affiliate h4 { margin: 0 0 .5rem; }
      .evc-affiliate ul { padding-left: 1.2rem; margin: 0; }
      .evc-affiliate li { margin: .3rem 0; }
      .evc-affiliate a { color: var(--evc-primary-dark); font-weight: 600; }
      .evc-disclaimer { font-size: .72rem; color: var(--evc-muted); margin: .5rem 0 0; }
      .evc-actions { display: flex; gap: .75rem; flex-wrap: wrap; margin-top: 1rem; }
      .evc-tco-bars { display: flex; gap: 2rem; align-items: flex-end; justify-content: center; margin: 1.5rem 0; }
      .evc-bar-group { text-align: center; }
      .evc-bar-stack { width: 100px; display: flex; flex-direction: column-reverse; border-radius: 8px 8px 0 0; overflow: hidden; min-height: 30px; }
      .evc-bar-seg { display: flex; align-items: center; justify-content: center; font-size: .7rem; color: #fff; font-weight: 600; min-height: 22px; transition: height .6s ease; }
      .evc-bar-label { margin-top: .5rem; font-weight: 600; font-size: .9rem; }
      .evc-bar-total { font-size: 1.1rem; font-weight: 700; margin-top: .25rem; }
      .evc-legend { display: flex; flex-wrap: wrap; gap: .75rem; justify-content: center; margin-top: .75rem; }
      .evc-legend-item { display: flex; align-items: center; gap: .3rem; font-size: .78rem; }
      .evc-legend-swatch { width: 12px; height: 12px; border-radius: 3px; }
      @media print { .evc-btn, .evc-actions { display: none !important; } .evc-results { display: block !important; opacity: 1 !important; transform: none !important; } .evc-calc { box-shadow: none; border: 1px solid #ccc; } }
    `;
    document.head.appendChild(style);
  }

  // ─── Chart.js Loader ─────────────────────────────────────────────────
  let chartJsLoaded = false;
  function ensureChartJs() {
    if (chartJsLoaded || window.Chart) { chartJsLoaded = true; return Promise.resolve(); }
    return new Promise((res, rej) => {
      const s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/chart.js@4/dist/chart.umd.min.js';
      s.onload = () => { chartJsLoaded = true; res(); };
      s.onerror = rej;
      document.head.appendChild(s);
    });
  }

  // ─── 1. Home Charging ROI Calculator ─────────────────────────────────
  function initROICalculator(containerSelector) {
    const root = $(containerSelector);
    if (!root) return console.warn('EVCalc: container not found:', containerSelector);
    root.innerHTML = `
      <div class="evc-calc" id="evc-roi">
        <h2>🔌 Home Charging ROI Calculator</h2>
        <p class="evc-subtitle">See how much you'll save by charging at home vs. paying for gas.</p>
        <div class="evc-grid">
          <div class="evc-field"><label for="roi-miles">Daily Miles Driven</label><input id="roi-miles" type="number" min="0" step="1" value="37" required data-persist><span class="evc-err-msg"></span></div>
          <div class="evc-field"><label for="roi-elec">Electricity Rate ($/kWh)</label><input id="roi-elec" type="number" min="0" step="0.01" value="0.13" required data-persist><span class="evc-err-msg"></span></div>
          <div class="evc-field"><label for="roi-eff">Vehicle Efficiency (mi/kWh)</label><input id="roi-eff" type="number" min="0.1" step="0.1" value="3.5" required data-persist><span class="evc-err-msg"></span></div>
          <div class="evc-field"><label for="roi-gas">Gas Price ($/gal)</label><input id="roi-gas" type="number" min="0" step="0.01" value="3.50" required data-persist><span class="evc-err-msg"></span></div>
          <div class="evc-field"><label for="roi-charger">Charger Cost ($)</label><input id="roi-charger" type="number" min="0" step="1" value="500" required data-persist><span class="evc-err-msg"></span></div>
          <div class="evc-field"><label for="roi-install">Installation Cost ($)</label><input id="roi-install" type="number" min="0" step="1" value="800" required data-persist><span class="evc-err-msg"></span></div>
        </div>
        <button class="evc-btn" id="roi-calc-btn">⚡ Calculate Savings</button>
        <div class="evc-results" id="roi-results">
          <div class="evc-results-grid" id="roi-stats"></div>
          <div class="evc-chart-wrap"><canvas id="roi-chart"></canvas></div>
          ${affiliateHTML()}
          <div class="evc-actions"><button class="evc-btn evc-btn-secondary" onclick="window.print()">🖨️ Print / Save PDF</button></div>
        </div>
      </div>`;

    let chartInstance = null;

    $('#roi-calc-btn').addEventListener('click', async () => {
      const form = $('#evc-roi');
      if (!validate(form)) return;
      saveInputs();

      const dailyMiles = parseFloat($('#roi-miles').value);
      const elecRate = parseFloat($('#roi-elec').value);
      const efficiency = parseFloat($('#roi-eff').value);
      const gasPrice = parseFloat($('#roi-gas').value);
      const chargerCost = parseFloat($('#roi-charger').value);
      const installCost = parseFloat($('#roi-install').value);

      const totalUpfront = chargerCost + installCost;
      const yearlyMiles = dailyMiles * 365;

      // Gas cost
      const yearlyGasCost = (yearlyMiles / GAS_AVG_MPG) * gasPrice;
      // EV electricity cost
      const yearlyElecCost = (yearlyMiles / efficiency) * elecRate;
      // Savings
      const yearlySavings = yearlyGasCost - yearlyElecCost;
      const monthlySavings = yearlySavings / 12;
      const paybackMonths = yearlySavings > 0 ? totalUpfront / (yearlySavings / 12) : Infinity;
      const fiveYearROI = (yearlySavings * 5 - totalUpfront);
      const roiPercent = totalUpfront > 0 ? (fiveYearROI / totalUpfront) * 100 : 0;

      $('#roi-stats').innerHTML = `
        <div class="evc-stat"><div class="evc-val">${fmt(monthlySavings)}</div><div class="evc-label">Monthly Savings</div></div>
        <div class="evc-stat"><div class="evc-val">${fmt(yearlySavings)}</div><div class="evc-label">Annual Savings</div></div>
        <div class="evc-stat"><div class="evc-val">${paybackMonths === Infinity ? '∞' : fmtNum(paybackMonths) + ' mo'}</div><div class="evc-label">Payback Period</div></div>
        <div class="evc-stat"><div class="evc-val">${fmt(fiveYearROI)}</div><div class="evc-label">5-Year Net Savings</div></div>
        <div class="evc-stat"><div class="evc-val">${fmtNum(roiPercent, 0)}%</div><div class="evc-label">5-Year ROI</div></div>
      `;

      revealResults($('#roi-results'));

      // Chart
      try {
        await ensureChartJs();
        const labels = [];
        const cumSavings = [];
        const cumCost = [];
        for (let m = 0; m <= 60; m++) {
          labels.push(m === 0 ? 'Now' : m % 12 === 0 ? `Year ${m / 12}` : `Mo ${m}`);
          cumSavings.push(parseFloat(((yearlySavings / 12) * m - totalUpfront).toFixed(2)));
          cumCost.push(0);
        }
        if (chartInstance) chartInstance.destroy();
        const ctx = document.getElementById('roi-chart').getContext('2d');
        chartInstance = new Chart(ctx, {
          type: 'line',
          data: {
            labels,
            datasets: [{
              label: 'Cumulative Net Savings ($)',
              data: cumSavings,
              borderColor: '#10b981',
              backgroundColor: 'rgba(16,185,129,0.1)',
              fill: true,
              tension: 0.3,
              pointRadius: 0,
              pointHitRadius: 8,
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
              legend: { display: false },
              tooltip: { callbacks: { label: ctx => fmt(ctx.parsed.y) } }
            },
            scales: {
              x: { ticks: { maxTicksLimit: 7 } },
              y: { ticks: { callback: v => '$' + v.toLocaleString() } }
            }
          }
        });
      } catch (_) { /* Chart.js failed to load, stats still shown */ }
    });
  }

  // ─── 2. EV vs Gas TCO Comparison ─────────────────────────────────────
  function initTCOCalculator(containerSelector) {
    const root = $(containerSelector);
    if (!root) return console.warn('EVCalc: container not found:', containerSelector);

    root.innerHTML = `
      <div class="evc-calc" id="evc-tco">
        <h2>⚖️ EV vs Gas: 5-Year Total Cost of Ownership</h2>
        <p class="evc-subtitle">Compare the true cost of owning an EV versus a gas vehicle over 5 years.</p>
        <div class="evc-grid">
          <div class="evc-field"><label for="tco-ev-price">EV Purchase Price ($)</label><input id="tco-ev-price" type="number" min="0" step="100" value="35000" required data-persist><span class="evc-err-msg"></span></div>
          <div class="evc-field"><label for="tco-gas-price">Gas Car Purchase Price ($)</label><input id="tco-gas-price" type="number" min="0" step="100" value="30000" required data-persist><span class="evc-err-msg"></span></div>
          <div class="evc-field"><label for="tco-miles">Annual Miles</label><input id="tco-miles" type="number" min="0" step="100" value="13500" required data-persist><span class="evc-err-msg"></span></div>
          <div class="evc-field"><label for="tco-elec">Electricity Rate ($/kWh)</label><input id="tco-elec" type="number" min="0" step="0.01" value="0.13" required data-persist><span class="evc-err-msg"></span></div>
          <div class="evc-field"><label for="tco-gas">Gas Price ($/gal)</label><input id="tco-gas" type="number" min="0" step="0.01" value="3.50" required data-persist><span class="evc-err-msg"></span></div>
          <div class="evc-field"><label for="tco-eff">EV Efficiency (mi/kWh)</label><input id="tco-eff" type="number" min="0.1" step="0.1" value="3.5" required data-persist><span class="evc-err-msg"></span></div>
          <div class="evc-field"><label for="tco-ev-ins">EV Annual Insurance ($)</label><input id="tco-ev-ins" type="number" min="0" step="10" value="1800" required data-persist><span class="evc-err-msg"></span></div>
          <div class="evc-field"><label for="tco-gas-ins">Gas Car Annual Insurance ($)</label><input id="tco-gas-ins" type="number" min="0" step="10" value="1500" required data-persist><span class="evc-err-msg"></span></div>
          <div class="evc-field"><label for="tco-credit">EV Tax Credits ($)</label><input id="tco-credit" type="number" min="0" step="100" value="7500" required data-persist><span class="evc-err-msg"></span></div>
        </div>
        <button class="evc-btn" id="tco-calc-btn">📊 Compare Costs</button>
        <div class="evc-results" id="tco-results">
          <div class="evc-results-grid" id="tco-stats"></div>
          <div id="tco-bars-container"></div>
          ${affiliateHTML()}
          <div class="evc-actions"><button class="evc-btn evc-btn-secondary" onclick="window.print()">🖨️ Print / Save PDF</button></div>
        </div>
      </div>`;

    const COLORS = { purchase: '#3b82f6', fuel: '#f59e0b', maintenance: '#ef4444', insurance: '#8b5cf6', credit: '#10b981' };

    $('#tco-calc-btn').addEventListener('click', () => {
      const form = $('#evc-tco');
      if (!validate(form)) return;
      saveInputs();

      const evPrice = parseFloat($('#tco-ev-price').value);
      const gasCarPrice = parseFloat($('#tco-gas-price').value);
      const miles = parseFloat($('#tco-miles').value);
      const elecRate = parseFloat($('#tco-elec').value);
      const gasRate = parseFloat($('#tco-gas').value);
      const eff = parseFloat($('#tco-eff').value);
      const evIns = parseFloat($('#tco-ev-ins').value);
      const gasIns = parseFloat($('#tco-gas-ins').value);
      const credit = parseFloat($('#tco-credit').value);

      const ev = {
        purchase: evPrice - credit,
        fuel: ((miles / eff) * elecRate) * YEARS_TCO,
        maintenance: EV_MAINTENANCE_PER_MILE * miles * YEARS_TCO,
        insurance: evIns * YEARS_TCO,
      };
      ev.total = ev.purchase + ev.fuel + ev.maintenance + ev.insurance;

      const gas = {
        purchase: gasCarPrice,
        fuel: ((miles / GAS_AVG_MPG) * gasRate) * YEARS_TCO,
        maintenance: GAS_MAINTENANCE_PER_MILE * miles * YEARS_TCO,
        insurance: gasIns * YEARS_TCO,
      };
      gas.total = gas.purchase + gas.fuel + gas.maintenance + gas.insurance;

      const diff = gas.total - ev.total;
      const monthlyDiff = diff / (YEARS_TCO * 12);

      $('#tco-stats').innerHTML = `
        <div class="evc-stat"><div class="evc-val">${fmt(ev.total, 0)}</div><div class="evc-label">EV 5-Year TCO</div></div>
        <div class="evc-stat"><div class="evc-val">${fmt(gas.total, 0)}</div><div class="evc-label">Gas 5-Year TCO</div></div>
        <div class="evc-stat"><div class="evc-val" style="color:${diff >= 0 ? '#10b981' : '#ef4444'}">${fmt(Math.abs(diff), 0)}</div><div class="evc-label">${diff >= 0 ? 'EV Saves' : 'Gas Saves'} Over 5 Years</div></div>
        <div class="evc-stat"><div class="evc-val">${fmt(Math.abs(monthlyDiff))}</div><div class="evc-label">${diff >= 0 ? 'EV Saves' : 'Gas Saves'} / Month</div></div>
      `;

      // Stacked bar chart (pure CSS)
      const maxTotal = Math.max(ev.total, gas.total);
      const barHeight = 260;
      function seg(val, color) {
        const h = (val / maxTotal) * barHeight;
        return `<div class="evc-bar-seg" style="height:${h}px;background:${color}" title="${fmt(val, 0)}">${val > maxTotal * 0.06 ? fmt(val, 0) : ''}</div>`;
      }

      $('#tco-bars-container').innerHTML = `
        <div class="evc-tco-bars">
          <div class="evc-bar-group">
            <div class="evc-bar-stack">${seg(ev.insurance, COLORS.insurance)}${seg(ev.maintenance, COLORS.maintenance)}${seg(ev.fuel, COLORS.fuel)}${seg(ev.purchase, COLORS.purchase)}</div>
            <div class="evc-bar-label">⚡ EV</div>
            <div class="evc-bar-total">${fmt(ev.total, 0)}</div>
          </div>
          <div class="evc-bar-group">
            <div class="evc-bar-stack">${seg(gas.insurance, COLORS.insurance)}${seg(gas.maintenance, COLORS.maintenance)}${seg(gas.fuel, COLORS.fuel)}${seg(gas.purchase, COLORS.purchase)}</div>
            <div class="evc-bar-label">⛽ Gas</div>
            <div class="evc-bar-total">${fmt(gas.total, 0)}</div>
          </div>
        </div>
        <div class="evc-legend">
          <div class="evc-legend-item"><span class="evc-legend-swatch" style="background:${COLORS.purchase}"></span>Purchase (net)</div>
          <div class="evc-legend-item"><span class="evc-legend-swatch" style="background:${COLORS.fuel}"></span>Fuel</div>
          <div class="evc-legend-item"><span class="evc-legend-swatch" style="background:${COLORS.maintenance}"></span>Maintenance</div>
          <div class="evc-legend-item"><span class="evc-legend-swatch" style="background:${COLORS.insurance}"></span>Insurance</div>
        </div>`;

      revealResults($('#tco-results'));
    });
  }

  // ─── 3. Quick Savings Calculator ─────────────────────────────────────
  function initQuickCalculator(containerSelector) {
    const root = $(containerSelector);
    if (!root) return console.warn('EVCalc: container not found:', containerSelector);

    root.innerHTML = `
      <div class="evc-calc" id="evc-quick">
        <h2>💡 Quick Savings Calculator</h2>
        <p class="evc-subtitle">Estimate your annual fuel savings in seconds.</p>
        <div class="evc-grid">
          <div class="evc-field"><label for="quick-miles">Miles per Year</label><input id="quick-miles" type="number" min="0" step="100" value="13500" data-persist><span class="evc-err-msg"></span></div>
          <div class="evc-field"><label for="quick-gas">Gas Price ($/gal)</label><input id="quick-gas" type="number" min="0" step="0.01" value="3.50" data-persist><span class="evc-err-msg"></span></div>
          <div class="evc-field"><label for="quick-elec">Electricity Rate ($/kWh)</label><input id="quick-elec" type="number" min="0" step="0.01" value="0.13" data-persist><span class="evc-err-msg"></span></div>
          <div class="evc-field"><label for="quick-eff">EV Efficiency (mi/kWh)</label><input id="quick-eff" type="number" min="0.1" step="0.1" value="3.5" data-persist><span class="evc-err-msg"></span></div>
        </div>
        <div id="quick-results" style="margin-top:1.5rem;">
          <div class="evc-results-grid" id="quick-stats"></div>
        </div>
        <div class="evc-actions"><button class="evc-btn evc-btn-secondary" onclick="window.print()">🖨️ Print / Save PDF</button></div>
      </div>`;

    function calc() {
      const miles = parseFloat($('#quick-miles').value) || 0;
      const gasPrice = parseFloat($('#quick-gas').value) || 0;
      const elecRate = parseFloat($('#quick-elec').value) || 0;
      const eff = parseFloat($('#quick-eff').value) || 3.5;

      const gasCost = (miles / GAS_AVG_MPG) * gasPrice;
      const evCost = (miles / eff) * elecRate;
      const savings = gasCost - evCost;
      const monthlySavings = savings / 12;

      $('#quick-stats').innerHTML = `
        <div class="evc-stat"><div class="evc-val">${fmt(gasCost)}</div><div class="evc-label">Annual Gas Cost</div></div>
        <div class="evc-stat"><div class="evc-val">${fmt(evCost)}</div><div class="evc-label">Annual EV Electricity</div></div>
        <div class="evc-stat"><div class="evc-val" style="color:${savings >= 0 ? '#10b981' : '#ef4444'}">${fmt(savings)}</div><div class="evc-label">Annual Savings</div></div>
        <div class="evc-stat"><div class="evc-val">${fmt(monthlySavings)}</div><div class="evc-label">Monthly Savings</div></div>
      `;
      saveInputs();
    }

    // Real-time updates
    $$('#evc-quick input').forEach(input => {
      input.addEventListener('input', calc);
    });

    // Initial calc
    setTimeout(calc, 50);
  }

  // ─── Public API ──────────────────────────────────────────────────────
  window.EVCalc = {
    initROI: function (sel) { injectStyles(); loadInputs(); initROICalculator(sel); },
    initTCO: function (sel) { injectStyles(); loadInputs(); initTCOCalculator(sel); },
    initQuick: function (sel) { injectStyles(); loadInputs(); initQuickCalculator(sel); },
    initAll: function (roiSel, tcoSel, quickSel) {
      injectStyles();
      loadInputs();
      initROICalculator(roiSel);
      initTCOCalculator(tcoSel);
      initQuickCalculator(quickSel);
    }
  };
})();
