/* ================================================================
   reveal.js – Scroll-triggered reveal con IntersectionObserver
   Supporta delay staggered automatico per card grid
================================================================ */

(function () {
  'use strict';

  // Aspetta che il sito sia visibile prima di attivare le reveal
  var site = document.getElementById('site');

  function initReveal() {
    var els = document.querySelectorAll('.reveal');

    if (!els.length) return;

    // Stagger automatico per card dentro la stessa griglia
    var grids = document.querySelectorAll('.valori-grid, .servizi-grid, .gallery-grid, .reel-grid');
    grids.forEach(function (grid) {
      var cards = grid.querySelectorAll('.reveal');
      cards.forEach(function (card, i) {
        card.style.transitionDelay = (i * 0.09) + 's';
      });
    });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    els.forEach(function (el) {
      observer.observe(el);
    });
  }

  // Se il sito è già visibile (no loader), inizia subito
  if (site && site.classList.contains('visible')) {
    initReveal();
  } else if (site) {
    // Altrimenti aspetta che diventi visible
    var mo = new MutationObserver(function (mutations) {
      mutations.forEach(function (m) {
        if (m.type === 'attributes' && m.attributeName === 'class') {
          if (site.classList.contains('visible')) {
            initReveal();
            mo.disconnect();
          }
        }
      });
    });
    mo.observe(site, { attributes: true });

    // Fallback: dopo 4s inizia comunque
    setTimeout(function () {
      initReveal();
      mo.disconnect();
    }, 4000);
  }

  // Touch performance
  document.addEventListener('touchstart', function () {}, { passive: true });

})();
