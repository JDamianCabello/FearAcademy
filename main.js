/* ============================================================
   main.js — nav state, ticker loop, scroll reveal, counters
   Uses a rAF-throttled scroll checker (getBoundingClientRect)
   instead of IntersectionObserver for max compatibility.
   ============================================================ */
(function () {
  const nav = document.getElementById('nav');
  const ticker = document.getElementById('ticker');
  const charmAudio = document.querySelector('[data-charm-audio]');
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
})();
