/**
 * EVCalc.io - Microinteractions & Polish
 * Hover animations, loading states, success animations, CTA pulse
 */
(function() {
  'use strict';

  const s = document.createElement('style');
  s.textContent = `
    /* Card hover lift */
    .evc-calc { transition: transform .3s ease, box-shadow .3s ease; }
    .evc-calc:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(0,0,0,.12); }

    /* Stat card hover */
    .stat-card { transition: transform .3s ease, box-shadow .3s ease; }
    .stat-card:hover { transform: translateY(-6px) scale(1.02); box-shadow: 0 16px 32px rgba(0,0,0,.1); }

    /* Input focus glow */
    .evc-field input:focus { box-shadow: 0 0 0 3px rgba(16,185,129,.2); border-color: #10b981; }

    /* CTA pulse */
    @keyframes ctaPulse {
      0%, 100% { box-shadow: 0 0 0 0 rgba(16,185,129,.4); }
      50% { box-shadow: 0 0 0 12px rgba(16,185,129,0); }
    }
    .cta-btn { animation: ctaPulse 2.5s ease-in-out infinite; }
    .cta-btn:hover { animation: none; }

    /* Loading spinner */
    @keyframes evcSpin { to { transform: rotate(360deg); } }
    .evc-loading { display: inline-flex; align-items: center; gap: .5rem; }
    .evc-spinner { width: 18px; height: 18px; border: 2.5px solid rgba(255,255,255,.3); border-top-color: #fff; border-radius: 50%; animation: evcSpin .6s linear infinite; }

    /* Success checkmark */
    @keyframes evcCheck {
      0% { transform: scale(0) rotate(-45deg); opacity: 0; }
      50% { transform: scale(1.2) rotate(-45deg); }
      100% { transform: scale(1) rotate(-45deg); opacity: 1; }
    }
    .evc-success { display: inline-flex; align-items: center; gap: .5rem; color: #10b981; font-weight: 600; font-size: .9rem; margin-left: .75rem; }
    .evc-success-check { display: inline-block; width: 10px; height: 18px; border-bottom: 3px solid #10b981; border-right: 3px solid #10b981; animation: evcCheck .4s ease-out forwards; }

    /* Result stat value count-up feel */
    .evc-stat .evc-val { transition: transform .3s ease; }
    .evc-stat:hover .evc-val { transform: scale(1.08); }

    /* Button press effect */
    .evc-btn { transition: background .2s, transform .15s, box-shadow .2s; }
    .evc-btn:active { transform: scale(.95); }

    /* Affiliate link hover */
    .evc-affiliate a { transition: color .2s, padding-left .2s; }
    .evc-affiliate a:hover { padding-left: 4px; }
  `;
  document.head.appendChild(s);

  // Intercept calculator buttons to add loading/success states
  document.addEventListener('click', e => {
    const btn = e.target.closest('#roi-calc-btn, #tco-calc-btn');
    if (!btn) return;

    const originalText = btn.innerHTML;
    btn.innerHTML = `<span class="evc-loading"><span class="evc-spinner"></span> Calculating...</span>`;
    btn.disabled = true;

    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.disabled = false;

      // Add success indicator
      const existing = btn.parentElement.querySelector('.evc-success');
      if (existing) existing.remove();
      const success = document.createElement('span');
      success.className = 'evc-success';
      success.innerHTML = '<span class="evc-success-check"></span> Done!';
      btn.insertAdjacentElement('afterend', success);
      setTimeout(() => success.style.opacity = '0', 2000);
      setTimeout(() => success.remove(), 2500);
    }, 600);
  }, true); // capture phase so it runs before the calculator handler

  // Intersection observer for scroll-triggered animations
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  // Animate calculator cards on scroll
  setTimeout(() => {
    document.querySelectorAll('.evc-calc').forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = `opacity .6s ease ${i * .15}s, transform .6s ease ${i * .15}s`;
      obs.observe(el);
    });
  }, 100);
})();
