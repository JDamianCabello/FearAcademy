/* ============================================================
   main.js — nav state, ticker loop, scroll reveal, counters
   Uses a rAF-throttled scroll checker (getBoundingClientRect)
   instead of IntersectionObserver for max compatibility.
   ============================================================ */
(function () {
  const nav = document.getElementById('nav');
  const ticker = document.getElementById('ticker');
  const charmAudio = document.querySelector('[data-charm-audio]');
  const memeModal = document.querySelector('[data-meme-modal]');
  const memeOpen = document.querySelector('[data-meme-open]');
  const memeClose = Array.from(document.querySelectorAll('[data-meme-close]'));
  if (ticker) ticker.innerHTML += ticker.innerHTML;

  const reveals = Array.from(document.querySelectorAll('.reveal'));
  const counters = Array.from(document.querySelectorAll('[data-count]'));
  const counted = new WeakSet();

  function animateCount(el) {
    if (counted.has(el)) return;
    counted.add(el);
    const target = parseFloat(el.dataset.count);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const dur = 1500;
    const start = performance.now();
    function step(now) {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      let val = target * eased;
      val = target >= 1000 ? Math.round(val).toLocaleString('es-ES') : Math.round(val);
      el.textContent = prefix + val + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  let ticking = false;
  let lastY = -1;
  function check() {
    const y = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
    const vh = window.innerHeight || document.documentElement.clientHeight;

    // nav background
    if (y > 40) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');

    // reveals
    for (let i = reveals.length - 1; i >= 0; i--) {
      const el = reveals[i];
      const r = el.getBoundingClientRect();
      if (r.top < vh * 0.92 && r.bottom > 0) {
        el.classList.add('in');
        reveals.splice(i, 1);
      }
    }
    // counters
    for (let i = counters.length - 1; i >= 0; i--) {
      const el = counters[i];
      const r = el.getBoundingClientRect();
      if (r.top < vh * 0.85 && r.bottom > 0) {
        animateCount(el);
        counters.splice(i, 1);
      }
    }
  }

  // Drive from a rAF loop: robust even where scroll events don't fire.
  function loop() {
    check();
    requestAnimationFrame(loop);
  }
  window.addEventListener('load', check);
  requestAnimationFrame(loop);

  if (charmAudio) {
    function playCharmSound() {
      window.removeEventListener('scroll', playCharmSound);
      window.removeEventListener('wheel', playCharmSound);
      window.removeEventListener('touchmove', playCharmSound);

      charmAudio.volume = 0.72;
      charmAudio.currentTime = 0;
      charmAudio.play().catch(function () {});
    }

    window.addEventListener('scroll', playCharmSound, { once: true, passive: true });
    window.addEventListener('wheel', playCharmSound, { once: true, passive: true });
    window.addEventListener('touchmove', playCharmSound, { once: true, passive: true });
  }

  // ── Tracker interactivo (localStorage) ──
  (function initTracker() {
    const grid = document.getElementById('tracker-grid');
    const verdict = document.getElementById('tracker-verdict');
    const resetBtn = document.getElementById('tracker-reset');
    if (!grid) return;

    const TOTAL = 8;
    const items = Array.from(grid.querySelectorAll('.tracker-item'));

    function save(key, val) { try { localStorage.setItem(key, val ? '1' : '0'); } catch(e) {} }
    function load(key) { try { return localStorage.getItem(key) === '1'; } catch(e) { return false; } }

    function updateVerdict() {
      const checked = items.filter(function(it) {
        return it.querySelector('input').checked;
      }).length;
      if (!verdict) return;
      if (checked === TOTAL) {
        verdict.textContent = '✓ Métricas completas — puedes rankear.';
        verdict.className = 'tracker-verdict ok';
      } else if (checked >= 5) {
        verdict.textContent = '⚠ Casi. Faltan ' + (TOTAL - checked) + ' métricas — vuelve a entrenar.';
        verdict.className = 'tracker-verdict warn';
      } else {
        verdict.textContent = '✗ No estás listo. ' + checked + '/' + TOTAL + ' métricas cumplidas.';
        verdict.className = 'tracker-verdict fail';
      }
    }

    // Restore state
    items.forEach(function(item) {
      const key = item.dataset.key;
      const cb = item.querySelector('input');
      cb.checked = load(key);
      item.classList.toggle('checked', cb.checked);
      cb.addEventListener('change', function() {
        item.classList.toggle('checked', cb.checked);
        save(key, cb.checked);
        updateVerdict();
      });
    });
    updateVerdict();

    if (resetBtn) {
      resetBtn.addEventListener('click', function() {
        items.forEach(function(item) {
          const cb = item.querySelector('input');
          cb.checked = false;
          item.classList.remove('checked');
          try { localStorage.removeItem(item.dataset.key); } catch(e) {}
        });
        updateVerdict();
      });
    }
  })();

  if (memeModal && memeOpen) {
    function openMeme() {
      memeModal.classList.add('open');
      memeModal.setAttribute('aria-hidden', 'false');
    }

    function closeMeme() {
      memeModal.classList.remove('open');
      memeModal.setAttribute('aria-hidden', 'true');
    }

    memeOpen.addEventListener('click', openMeme);
    memeClose.forEach(function (btn) { btn.addEventListener('click', closeMeme); });
    window.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && memeModal.classList.contains('open')) closeMeme();
    });
  }
})();
