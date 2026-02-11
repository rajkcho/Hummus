/**
 * EVCalc.io - EV Model Comparison Tool
 * Side-by-side comparison of EV models with filtering and detailed tables
 */
(function() {
  'use strict';

  const MODELS = [
    { id: 'tesla-model-3', name: 'Tesla Model 3', manufacturer: 'Tesla', year: 2024, msrp: 40380, efficiency: 4.1, range: 272, battery: 66, category: 'sedan', taxCredit: 7500, image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400&h=250&fit=crop' },
    { id: 'tesla-model-y', name: 'Tesla Model Y', manufacturer: 'Tesla', year: 2024, msrp: 47740, efficiency: 3.5, range: 260, battery: 75, category: 'suv', taxCredit: 7500, image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=400&h=250&fit=crop' },
    { id: 'chevy-bolt', name: 'Chevrolet Bolt EV', manufacturer: 'Chevrolet', year: 2024, msrp: 26500, efficiency: 3.8, range: 259, battery: 66, category: 'sedan', taxCredit: 7500, image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=400&h=250&fit=crop' },
    { id: 'mustang-mach-e', name: 'Ford Mustang Mach-E', manufacturer: 'Ford', year: 2024, msrp: 42995, efficiency: 3.0, range: 250, battery: 70, category: 'suv', taxCredit: 7500, image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=400&h=250&fit=crop' },
    { id: 'ioniq-5', name: 'Hyundai Ioniq 5', manufacturer: 'Hyundai', year: 2024, msrp: 41800, efficiency: 3.4, range: 266, battery: 77, category: 'suv', taxCredit: 0, image: 'https://images.unsplash.com/photo-1617886903355-9354bb57751f?w=400&h=250&fit=crop' },
    { id: 'vw-id4', name: 'Volkswagen ID.4', manufacturer: 'Volkswagen', year: 2024, msrp: 38995, efficiency: 3.3, range: 260, battery: 77, category: 'suv', taxCredit: 7500, image: 'https://images.unsplash.com/photo-1617886322207-676baff86f6c?w=400&h=250&fit=crop' },
    { id: 'rivian-r1t', name: 'Rivian R1T', manufacturer: 'Rivian', year: 2024, msrp: 69900, efficiency: 2.1, range: 270, battery: 128, category: 'truck', taxCredit: 0, image: 'https://images.unsplash.com/photo-1625231334168-31253a44f166?w=400&h=250&fit=crop' },
    { id: 'f150-lightning', name: 'Ford F-150 Lightning', manufacturer: 'Ford', year: 2024, msrp: 49995, efficiency: 2.1, range: 240, battery: 98, category: 'truck', taxCredit: 7500, image: 'https://images.unsplash.com/photo-1623520527779-c4ef05e5b5f3?w=400&h=250&fit=crop' },
    { id: 'nissan-ariya', name: 'Nissan Ariya', manufacturer: 'Nissan', year: 2024, msrp: 39590, efficiency: 3.4, range: 265, battery: 87, category: 'suv', taxCredit: 0, image: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=400&h=250&fit=crop' },
    { id: 'kia-ev6', name: 'Kia EV6', manufacturer: 'Kia', year: 2024, msrp: 42600, efficiency: 3.5, range: 282, battery: 77, category: 'suv', taxCredit: 0, image: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=400&h=250&fit=crop' },
  ];

  const fmt = n => '$' + Number(n).toLocaleString('en-US', { maximumFractionDigits: 0 });
  let selected = new Set();

  function injectComparisonStyles() {
    if (document.getElementById('evc-comp-styles')) return;
    const s = document.createElement('style');
    s.id = 'evc-comp-styles';
    s.textContent = `
      .comp-section { max-width: 1200px; margin: 3rem auto; padding: 0 1.5rem; }
      .comp-filters { display: flex; flex-wrap: wrap; gap: .75rem; margin-bottom: 1.5rem; align-items: center; }
      .comp-filter-btn { padding: .5rem 1rem; border: 1.5px solid var(--border, #e2e8f0); border-radius: 8px; background: var(--bg-alt, #f8fafc); color: var(--text, #1e293b); cursor: pointer; font-size: .9rem; font-weight: 500; transition: all .2s; }
      .comp-filter-btn:hover { border-color: var(--primary, #10b981); }
      .comp-filter-btn.active { background: var(--primary, #10b981); color: #fff; border-color: var(--primary, #10b981); }
      .comp-range-filter { display: flex; align-items: center; gap: .5rem; font-size: .85rem; color: var(--text-muted, #64748b); }
      .comp-range-filter select { padding: .4rem .6rem; border: 1.5px solid var(--border, #e2e8f0); border-radius: 6px; background: var(--bg-alt, #f8fafc); color: var(--text, #1e293b); font-size: .85rem; }
      .comp-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.25rem; }
      .comp-card { background: var(--bg-alt, #f8fafc); border: 2px solid var(--border, #e2e8f0); border-radius: 14px; overflow: hidden; cursor: pointer; transition: all .3s ease; position: relative; }
      .comp-card:hover { transform: translateY(-4px); box-shadow: 0 12px 24px rgba(0,0,0,.1); }
      .comp-card.selected { border-color: var(--primary, #10b981); box-shadow: 0 0 0 3px rgba(16,185,129,.2); }
      .comp-card-check { position: absolute; top: 12px; right: 12px; width: 28px; height: 28px; border-radius: 50%; background: rgba(255,255,255,.9); border: 2px solid var(--border, #e2e8f0); display: flex; align-items: center; justify-content: center; font-size: .9rem; transition: all .2s; z-index: 2; }
      .comp-card.selected .comp-card-check { background: var(--primary, #10b981); border-color: var(--primary, #10b981); color: #fff; }
      .comp-card-img { width: 100%; height: 160px; object-fit: cover; background: #e2e8f0; }
      .comp-card-body { padding: 1rem; }
      .comp-card-name { font-size: 1.1rem; font-weight: 700; margin-bottom: .25rem; }
      .comp-card-mfr { font-size: .8rem; color: var(--text-muted, #64748b); margin-bottom: .75rem; }
      .comp-card-specs { display: grid; grid-template-columns: 1fr 1fr; gap: .5rem; }
      .comp-spec { text-align: center; padding: .4rem; background: var(--bg, #fff); border-radius: 8px; }
      .comp-spec-val { font-size: 1rem; font-weight: 700; color: var(--primary, #10b981); }
      .comp-spec-label { font-size: .7rem; color: var(--text-muted, #64748b); }
      .comp-card-footer { display: flex; justify-content: space-between; align-items: center; margin-top: .75rem; padding-top: .75rem; border-top: 1px solid var(--border, #e2e8f0); }
      .comp-card-price { font-size: 1.25rem; font-weight: 800; }
      .comp-card-credit { font-size: .8rem; color: var(--primary, #10b981); font-weight: 600; background: var(--primary-light, #d1fae5); padding: .2rem .5rem; border-radius: 4px; }
      .comp-card-no-credit { font-size: .8rem; color: var(--text-muted, #64748b); }
      .comp-compare-bar { position: sticky; bottom: 0; left: 0; right: 0; background: var(--bg, #fff); border-top: 2px solid var(--primary, #10b981); padding: 1rem 1.5rem; display: flex; align-items: center; justify-content: space-between; z-index: 50; box-shadow: 0 -4px 12px rgba(0,0,0,.1); transform: translateY(100%); transition: transform .3s ease; }
      .comp-compare-bar.visible { transform: translateY(0); }
      .comp-compare-bar-info { font-weight: 600; }
      .comp-compare-btn { padding: .7rem 1.5rem; background: var(--primary, #10b981); color: #fff; border: none; border-radius: 8px; font-weight: 700; cursor: pointer; font-size: 1rem; transition: background .2s; }
      .comp-compare-btn:hover { background: var(--primary-dark, #059669); }
      .comp-table-wrap { overflow-x: auto; margin-top: 1.5rem; border-radius: 12px; border: 1px solid var(--border, #e2e8f0); }
      .comp-table { width: 100%; border-collapse: collapse; font-size: .9rem; }
      .comp-table th, .comp-table td { padding: .75rem 1rem; text-align: left; border-bottom: 1px solid var(--border, #e2e8f0); }
      .comp-table th { background: var(--bg-alt, #f8fafc); font-weight: 700; position: sticky; left: 0; }
      .comp-table td { text-align: center; }
      .comp-table tr:last-child td, .comp-table tr:last-child th { border-bottom: none; }
      .comp-table .best { color: var(--primary, #10b981); font-weight: 700; }
      .comp-modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.5); z-index: 200; display: flex; align-items: center; justify-content: center; opacity: 0; pointer-events: none; transition: opacity .3s; }
      .comp-modal-overlay.open { opacity: 1; pointer-events: auto; }
      .comp-modal { background: var(--bg, #fff); border-radius: 16px; padding: 2rem; max-width: 900px; width: 95%; max-height: 80vh; overflow-y: auto; position: relative; }
      .comp-modal-close { position: absolute; top: 1rem; right: 1rem; background: none; border: none; font-size: 1.5rem; cursor: pointer; color: var(--text-muted, #64748b); }
      .comp-category-badge { display: inline-block; padding: .15rem .5rem; border-radius: 4px; font-size: .7rem; font-weight: 600; text-transform: uppercase; letter-spacing: .5px; }
      .comp-category-sedan { background: #dbeafe; color: #1d4ed8; }
      .comp-category-suv { background: #fef3c7; color: #92400e; }
      .comp-category-truck { background: #fce7f3; color: #9d174d; }
      .comp-category-hatchback { background: #e0e7ff; color: #3730a3; }
      .comp-empty { text-align: center; padding: 3rem; color: var(--text-muted, #64748b); }
    `;
    document.head.appendChild(s);
  }

  function categoryBadge(cat) {
    return `<span class="comp-category-badge comp-category-${cat}">${cat}</span>`;
  }

  function renderCard(model) {
    const isSelected = selected.has(model.id);
    return `
      <div class="comp-card ${isSelected ? 'selected' : ''}" data-id="${model.id}">
        <div class="comp-card-check">${isSelected ? '✓' : ''}</div>
        <img class="comp-card-img" src="${model.image}" alt="${model.name}" loading="lazy" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 400 250%22><rect fill=%22%23e2e8f0%22 width=%22400%22 height=%22250%22/><text x=%2250%%22 y=%2250%%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 fill=%22%2394a3b8%22 font-size=%2220%22>⚡ ${model.name}</text></svg>'">
        <div class="comp-card-body">
          <div class="comp-card-name">${model.name} ${categoryBadge(model.category)}</div>
          <div class="comp-card-mfr">${model.manufacturer} · ${model.year}</div>
          <div class="comp-card-specs">
            <div class="comp-spec"><div class="comp-spec-val">${model.range} mi</div><div class="comp-spec-label">Range</div></div>
            <div class="comp-spec"><div class="comp-spec-val">${model.efficiency}</div><div class="comp-spec-label">mi/kWh</div></div>
            <div class="comp-spec"><div class="comp-spec-val">${model.battery} kWh</div><div class="comp-spec-label">Battery</div></div>
            <div class="comp-spec"><div class="comp-spec-val">${fmt(model.msrp / 12 / 60)}/mo*</div><div class="comp-spec-label">Est. Payment</div></div>
          </div>
          <div class="comp-card-footer">
            <span class="comp-card-price">${fmt(model.msrp)}</span>
            ${model.taxCredit > 0 ? `<span class="comp-card-credit">💰 ${fmt(model.taxCredit)} credit</span>` : `<span class="comp-card-no-credit">No federal credit</span>`}
          </div>
        </div>
      </div>`;
  }

  function renderComparisonTable(models) {
    const specs = [
      { label: 'Price (MSRP)', key: 'msrp', format: fmt, best: 'min' },
      { label: 'After Tax Credit', key: m => m.msrp - m.taxCredit, format: fmt, best: 'min' },
      { label: 'Range (miles)', key: 'range', format: v => v + ' mi', best: 'max' },
      { label: 'Efficiency (mi/kWh)', key: 'efficiency', format: v => v.toFixed(1), best: 'max' },
      { label: 'Battery Size', key: 'battery', format: v => v + ' kWh', best: 'max' },
      { label: 'Category', key: 'category', format: v => v.charAt(0).toUpperCase() + v.slice(1) },
      { label: 'Tax Credit', key: 'taxCredit', format: fmt, best: 'max' },
      { label: 'Est. Annual Fuel Cost*', key: m => (12000 / m.efficiency) * 0.14, format: v => fmt(Math.round(v)), best: 'min' },
      { label: 'Cost per Mile (fuel)', key: m => (1 / m.efficiency) * 0.14, format: v => '$' + v.toFixed(3), best: 'min' },
    ];

    let html = `<div class="comp-table-wrap"><table class="comp-table"><thead><tr><th></th>`;
    models.forEach(m => { html += `<td><strong>${m.name}</strong></td>`; });
    html += `</tr></thead><tbody>`;

    specs.forEach(spec => {
      const vals = models.map(m => typeof spec.key === 'function' ? spec.key(m) : m[spec.key]);
      const bestVal = spec.best === 'min' ? Math.min(...vals) : spec.best === 'max' ? Math.max(...vals) : null;
      html += `<tr><th>${spec.label}</th>`;
      models.forEach((m, i) => {
        const v = vals[i];
        const isBest = bestVal !== null && v === bestVal && models.length > 1;
        html += `<td class="${isBest ? 'best' : ''}">${spec.format(v)}${isBest ? ' ✓' : ''}</td>`;
      });
      html += `</tr>`;
    });
    html += `</tbody></table></div><p style="font-size:.75rem;color:var(--text-muted);margin-top:.5rem;">*Based on 12,000 mi/year at $0.14/kWh national average</p>`;
    return html;
  }

  function init(containerSelector) {
    injectComparisonStyles();
    const root = document.querySelector(containerSelector);
    if (!root) return;

    let activeCategory = 'all';
    let maxPrice = Infinity;
    let minRange = 0;

    function getFiltered() {
      return MODELS.filter(m => {
        if (activeCategory !== 'all' && m.category !== activeCategory) return false;
        if (m.msrp > maxPrice) return false;
        if (m.range < minRange) return false;
        return true;
      });
    }

    function render() {
      const filtered = getFiltered();
      const grid = root.querySelector('.comp-grid');
      grid.innerHTML = filtered.length ? filtered.map(renderCard).join('') : '<div class="comp-empty">No models match your filters. Try adjusting them.</div>';

      // Bind card clicks
      grid.querySelectorAll('.comp-card').forEach(card => {
        card.addEventListener('click', () => {
          const id = card.dataset.id;
          if (selected.has(id)) selected.delete(id);
          else if (selected.size < 4) selected.add(id);
          render();
          if (typeof EVAnalytics !== 'undefined') EVAnalytics.track('comparison_select', { model: id });
        });
      });

      // Compare bar
      const bar = root.querySelector('.comp-compare-bar');
      bar.classList.toggle('visible', selected.size >= 2);
      bar.querySelector('.comp-compare-bar-info').textContent = `${selected.size} model${selected.size !== 1 ? 's' : ''} selected`;
    }

    root.innerHTML = `
      <div class="section-header">
        <h2>🔍 Compare EV Models</h2>
        <p>Select up to 4 models for a detailed side-by-side comparison</p>
      </div>
      <div class="comp-filters">
        <button class="comp-filter-btn active" data-cat="all">All</button>
        <button class="comp-filter-btn" data-cat="sedan">Sedans</button>
        <button class="comp-filter-btn" data-cat="suv">SUVs</button>
        <button class="comp-filter-btn" data-cat="truck">Trucks</button>
        <div class="comp-range-filter">
          <span>Max Price:</span>
          <select id="comp-price-filter">
            <option value="999999">Any</option>
            <option value="30000">Under $30K</option>
            <option value="40000">Under $40K</option>
            <option value="50000">Under $50K</option>
          </select>
        </div>
        <div class="comp-range-filter">
          <span>Min Range:</span>
          <select id="comp-range-filter">
            <option value="0">Any</option>
            <option value="250">250+ mi</option>
            <option value="260">260+ mi</option>
            <option value="270">270+ mi</option>
          </select>
        </div>
      </div>
      <div class="comp-grid"></div>
      <div class="comp-compare-bar">
        <span class="comp-compare-bar-info">0 models selected</span>
        <button class="comp-compare-btn">📊 Compare Selected</button>
      </div>
      <div class="comp-modal-overlay">
        <div class="comp-modal">
          <button class="comp-modal-close">&times;</button>
          <h3 style="margin-bottom:1rem;">Side-by-Side Comparison</h3>
          <div class="comp-modal-body"></div>
        </div>
      </div>`;

    // Filter buttons
    root.querySelectorAll('.comp-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        root.querySelectorAll('.comp-filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeCategory = btn.dataset.cat;
        render();
      });
    });

    root.querySelector('#comp-price-filter').addEventListener('change', e => {
      maxPrice = parseInt(e.target.value);
      render();
    });

    root.querySelector('#comp-range-filter').addEventListener('change', e => {
      minRange = parseInt(e.target.value);
      render();
    });

    // Compare button
    root.querySelector('.comp-compare-btn').addEventListener('click', () => {
      const models = MODELS.filter(m => selected.has(m.id));
      if (models.length < 2) return;
      const overlay = root.querySelector('.comp-modal-overlay');
      overlay.querySelector('.comp-modal-body').innerHTML = renderComparisonTable(models);
      overlay.classList.add('open');
      if (typeof EVAnalytics !== 'undefined') EVAnalytics.track('comparison_view', { models: models.map(m => m.id) });
    });

    // Modal close
    root.querySelector('.comp-modal-close').addEventListener('click', () => {
      root.querySelector('.comp-modal-overlay').classList.remove('open');
    });
    root.querySelector('.comp-modal-overlay').addEventListener('click', e => {
      if (e.target === e.currentTarget) e.currentTarget.classList.remove('open');
    });

    render();
  }

  window.EVComparison = { init };
})();
