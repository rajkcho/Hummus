/**
 * EVCalc.io - Social Sharing Module
 * Share savings results via Twitter, Facebook, or copy link
 */
(function() {
  'use strict';

  function injectStyles() {
    if (document.getElementById('evshare-styles')) return;
    const s = document.createElement('style');
    s.id = 'evshare-styles';
    s.textContent = `
      .evshare-bar { display: flex; gap: .5rem; flex-wrap: wrap; margin-top: 1rem; align-items: center; }
      .evshare-btn { display: inline-flex; align-items: center; gap: .4rem; padding: .5rem 1rem; border: none; border-radius: 8px; font-size: .85rem; font-weight: 600; cursor: pointer; transition: all .2s; text-decoration: none; color: #fff; }
      .evshare-btn:hover { transform: translateY(-1px); filter: brightness(1.1); }
      .evshare-twitter { background: #1da1f2; }
      .evshare-facebook { background: #1877f2; }
      .evshare-copy { background: var(--bg-alt, #f1f5f9); color: var(--text, #1e293b); border: 1.5px solid var(--border, #e2e8f0); }
      .evshare-copy:hover { border-color: var(--primary, #10b981); }
      .evshare-toast { position: fixed; bottom: 2rem; left: 50%; transform: translateX(-50%) translateY(100px); background: var(--text, #1e293b); color: #fff; padding: .75rem 1.5rem; border-radius: 10px; font-size: .9rem; font-weight: 600; z-index: 999; opacity: 0; transition: all .3s ease; pointer-events: none; }
      .evshare-toast.show { transform: translateX(-50%) translateY(0); opacity: 1; }
    `;
    document.head.appendChild(s);
  }

  let toast;
  function showToast(msg) {
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'evshare-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2500);
  }

  function createShareBar(savings) {
    const savingsText = '$' + Math.round(savings).toLocaleString();
    const url = encodeURIComponent('https://rajkcho.github.io/Hummus');
    const text = encodeURIComponent(`I'd save ${savingsText} per year by switching to an EV! Calculate yours:`);

    const div = document.createElement('div');
    div.className = 'evshare-bar';
    div.innerHTML = `
      <span style="font-size:.85rem;color:var(--text-muted);font-weight:500;">Share your savings:</span>
      <a class="evshare-btn evshare-twitter" href="https://twitter.com/intent/tweet?text=${text}&url=${url}" target="_blank" rel="noopener">𝕏 Tweet</a>
      <a class="evshare-btn evshare-facebook" href="https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}" target="_blank" rel="noopener">f Share</a>
      <button class="evshare-btn evshare-copy" data-savings="${savingsText}">📋 Copy Link</button>
    `;
    div.querySelector('.evshare-copy').addEventListener('click', () => {
      const shareText = `I'd save ${savingsText} per year by switching to an EV! Calculate yours: https://rajkcho.github.io/Hummus`;
      navigator.clipboard.writeText(shareText).then(() => {
        showToast('✓ Copied to clipboard!');
        if (typeof EVAnalytics !== 'undefined') EVAnalytics.track('share_copy');
      }).catch(() => showToast('Could not copy — try manually'));
    });

    // Track share clicks
    div.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        const platform = a.classList.contains('evshare-twitter') ? 'twitter' : 'facebook';
        if (typeof EVAnalytics !== 'undefined') EVAnalytics.track('share_click', { platform, savings: savingsText });
      });
    });

    return div;
  }

  // Auto-inject share bars into calculator results
  function autoInject() {
    // Watch for ROI results
    const observer = new MutationObserver(() => {
      // ROI calculator
      const roiStats = document.querySelector('#roi-stats');
      if (roiStats && roiStats.children.length && !roiStats.parentElement.querySelector('.evshare-bar')) {
        const annualEl = roiStats.querySelector('.evc-stat:nth-child(2) .evc-val');
        if (annualEl) {
          const savings = parseFloat(annualEl.textContent.replace(/[$,]/g, ''));
          if (!isNaN(savings) && savings > 0) {
            roiStats.parentElement.appendChild(createShareBar(savings));
          }
        }
      }
      // TCO calculator
      const tcoStats = document.querySelector('#tco-stats');
      if (tcoStats && tcoStats.children.length && !tcoStats.parentElement.querySelector('.evshare-bar')) {
        const savingsEl = tcoStats.querySelector('.evc-stat:nth-child(3) .evc-val');
        if (savingsEl) {
          const savings = parseFloat(savingsEl.textContent.replace(/[$,]/g, '')) / 5; // annualize
          if (!isNaN(savings) && savings > 0) {
            tcoStats.parentElement.appendChild(createShareBar(savings));
          }
        }
      }
      // Quick calculator
      const quickStats = document.querySelector('#quick-stats');
      if (quickStats && quickStats.children.length && !quickStats.parentElement.querySelector('.evshare-bar')) {
        const savingsEl = quickStats.querySelector('.evc-stat:nth-child(3) .evc-val');
        if (savingsEl) {
          const savings = parseFloat(savingsEl.textContent.replace(/[$,]/g, ''));
          if (!isNaN(savings) && savings > 0) {
            quickStats.parentElement.appendChild(createShareBar(savings));
          }
        }
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  injectStyles();
  autoInject();

  window.EVShare = { createShareBar, showToast };
})();
