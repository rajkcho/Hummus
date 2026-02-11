/**
 * EVCalc.io - Privacy-Friendly Analytics
 * localStorage-based tracking with owner dashboard
 */
(function() {
  'use strict';
  const KEY = 'evcalc_analytics';

  function getData() {
    try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch { return {}; }
  }
  function save(data) {
    try { localStorage.setItem(KEY, JSON.stringify(data)); } catch {}
  }

  function track(event, meta = {}) {
    const data = getData();
    if (!data.events) data.events = [];
    if (!data.counts) data.counts = {};
    data.counts[event] = (data.counts[event] || 0) + 1;
    data.events.push({ event, meta, ts: Date.now() });
    // Keep last 500 events
    if (data.events.length > 500) data.events = data.events.slice(-500);
    if (!data.firstVisit) data.firstVisit = Date.now();
    data.lastVisit = Date.now();
    data.sessions = (data.sessions || 0) + (event === 'page_view' ? 1 : 0);
    save(data);
  }

  function showDashboard() {
    const data = getData();
    if (document.getElementById('analytics-modal')) {
      document.getElementById('analytics-modal').remove();
      return;
    }

    const counts = data.counts || {};
    const total = Object.values(counts).reduce((a, b) => a + b, 0);
    const first = data.firstVisit ? new Date(data.firstVisit).toLocaleDateString() : 'N/A';
    const last = data.lastVisit ? new Date(data.lastVisit).toLocaleDateString() : 'N/A';

    const topEvents = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 10);

    const modal = document.createElement('div');
    modal.id = 'analytics-modal';
    modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:999;display:flex;align-items:center;justify-content:center;';
    modal.innerHTML = `
      <div style="background:var(--bg,#fff);border-radius:16px;padding:2rem;max-width:500px;width:90%;max-height:80vh;overflow-y:auto;color:var(--text,#1e293b);position:relative;">
        <button onclick="document.getElementById('analytics-modal').remove()" style="position:absolute;top:1rem;right:1rem;background:none;border:none;font-size:1.5rem;cursor:pointer;color:var(--text-muted)">&times;</button>
        <h3 style="margin-bottom:1rem;">📊 Site Analytics</h3>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:.75rem;margin-bottom:1.5rem;">
          <div style="background:var(--bg-alt,#f8fafc);padding:1rem;border-radius:10px;text-align:center;">
            <div style="font-size:1.5rem;font-weight:700;color:var(--primary,#10b981)">${data.sessions || 0}</div>
            <div style="font-size:.8rem;color:var(--text-muted,#64748b)">Sessions</div>
          </div>
          <div style="background:var(--bg-alt,#f8fafc);padding:1rem;border-radius:10px;text-align:center;">
            <div style="font-size:1.5rem;font-weight:700;color:var(--primary,#10b981)">${total}</div>
            <div style="font-size:.8rem;color:var(--text-muted,#64748b)">Total Events</div>
          </div>
          <div style="background:var(--bg-alt,#f8fafc);padding:1rem;border-radius:10px;text-align:center;">
            <div style="font-size:1rem;font-weight:600">${first}</div>
            <div style="font-size:.8rem;color:var(--text-muted,#64748b)">First Visit</div>
          </div>
          <div style="background:var(--bg-alt,#f8fafc);padding:1rem;border-radius:10px;text-align:center;">
            <div style="font-size:1rem;font-weight:600">${last}</div>
            <div style="font-size:.8rem;color:var(--text-muted,#64748b)">Last Visit</div>
          </div>
        </div>
        <h4 style="margin-bottom:.75rem;">Top Events</h4>
        <div style="font-size:.85rem;">
          ${topEvents.map(([name, count]) => `
            <div style="display:flex;justify-content:space-between;padding:.4rem 0;border-bottom:1px solid var(--border,#e2e8f0)">
              <span>${name.replace(/_/g, ' ')}</span>
              <strong>${count}</strong>
            </div>
          `).join('') || '<p style="color:var(--text-muted)">No events yet</p>'}
        </div>
        <button onclick="localStorage.removeItem('evcalc_analytics');document.getElementById('analytics-modal').remove();" style="margin-top:1rem;padding:.5rem 1rem;border:1px solid #ef4444;color:#ef4444;background:none;border-radius:6px;cursor:pointer;font-size:.85rem;">Clear All Data</button>
      </div>`;
    document.body.appendChild(modal);
    modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
  }

  // Auto-track page view
  track('page_view');

  // Auto-track all button clicks
  document.addEventListener('click', e => {
    const btn = e.target.closest('button, .evc-btn, .cta-btn, a[href*="amzn"], a[href*="amazon"]');
    if (!btn) return;
    if (btn.matches('a[href*="amzn"], a[href*="amazon"]')) {
      track('affiliate_click', { text: btn.textContent.trim().slice(0, 50), href: btn.href });
    } else if (btn.id) {
      track('button_click', { id: btn.id, text: btn.textContent.trim().slice(0, 30) });
    }
  });

  // Keyboard shortcut: Ctrl+Shift+A for dashboard
  document.addEventListener('keydown', e => {
    if (e.ctrlKey && e.shiftKey && e.key === 'A') {
      e.preventDefault();
      showDashboard();
    }
  });

  window.EVAnalytics = { track, showDashboard, getData };
})();
