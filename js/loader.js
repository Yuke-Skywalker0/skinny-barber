/* ================================================================
   loader.js – Gestione schermata di caricamento con video
   Il video "caricamento.mp4" viene riprodotto centrato.
   Al termine (o max 5s) il loader esce e il sito appare.
================================================================ */

(function () {
  'use strict';

  const loader = document.getElementById('loader');
  const site   = document.getElementById('site');
  const video  = document.getElementById('loader-video');
  const bar    = document.getElementById('loaderBar');

  if (!loader || !site) return;

  // Blocca scroll durante il loader
  document.body.style.overflow = 'hidden';

  let exited = false;

  function exitLoader() {
    if (exited) return;
    exited = true;

    // Completa la barra al 100%
    if (bar) {
      bar.style.transition = 'width 0.3s ease';
      bar.style.width = '100%';
    }

    setTimeout(function () {
      loader.classList.add('exit');
      site.classList.add('visible');
      document.body.style.overflow = '';

      // Rimuove dal DOM dopo l'animazione di uscita
      setTimeout(function () {
        loader.style.display = 'none';
      }, 950);
    }, 300);
  }

  // ── Progress bar animata durante il video ─────────────
  function animateBar(duration) {
    if (!bar) return;
    var start = null;
    var targetPct = 92; // si ferma a 92%, poi salta a 100% all'uscita

    function step(ts) {
      if (!start) start = ts;
      var elapsed = ts - start;
      var pct = Math.min((elapsed / duration) * targetPct, targetPct);
      bar.style.width = pct + '%';
      if (pct < targetPct) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // ── Strategia principale: aspetta fine video ──────────
  if (video) {
    video.addEventListener('loadedmetadata', function () {
      var dur = (video.duration || 3) * 1000;
      animateBar(dur);
    });

    video.addEventListener('ended', exitLoader);

    // Fallback: se il video non parte entro 1.5s
    var videoTimeout = setTimeout(function () {
      if (!exited) {
        animateBar(2500);
        setTimeout(exitLoader, 2800);
      }
    }, 1500);

    video.addEventListener('playing', function () {
      clearTimeout(videoTimeout);
    });

    // Fallback assoluto: massimo 6s
    setTimeout(exitLoader, 6000);

  } else {
    // Nessun video trovato: loader di 2s con barra
    animateBar(2000);
    setTimeout(exitLoader, 2200);
  }

})();
