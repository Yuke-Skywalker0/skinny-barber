/* ================================================================
   servizi.js – Tab switching per la sezione servizi
================================================================ */
(function () {
  'use strict';

  function initTabs() {
    var tabs   = document.querySelectorAll('.s-tab');
    var panels = document.querySelectorAll('.s-panel');

    if (!tabs.length) return;

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var target = this.dataset.panel;

        // Deselect all
        tabs.forEach(function (t) {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        panels.forEach(function (p) {
          p.classList.remove('active');
          p.setAttribute('hidden', '');
        });

        // Activate clicked
        this.classList.add('active');
        this.setAttribute('aria-selected', 'true');

        var panel = document.getElementById('panel-' + target);
        if (panel) {
          panel.removeAttribute('hidden');
          panel.classList.add('active');

          // Re-trigger reveal animations on cards inside
          panel.querySelectorAll('.reveal').forEach(function (el) {
            el.classList.remove('visible');
            requestAnimationFrame(function () {
              el.classList.add('visible');
            });
          });
        }
      });

      // Keyboard nav: arrow keys
      tab.addEventListener('keydown', function (e) {
        var idx = Array.from(tabs).indexOf(this);
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          tabs[(idx + 1) % tabs.length].focus();
          tabs[(idx + 1) % tabs.length].click();
        }
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          tabs[(idx - 1 + tabs.length) % tabs.length].focus();
          tabs[(idx - 1 + tabs.length) % tabs.length].click();
        }
      });
    });
  }

  // Init after site becomes visible
  var site = document.getElementById('site');
  if (site && site.classList.contains('visible')) {
    initTabs();
  } else if (site) {
    var mo = new MutationObserver(function () {
      if (site.classList.contains('visible')) {
        initTabs();
        mo.disconnect();
      }
    });
    mo.observe(site, { attributes: true });
    setTimeout(function () { initTabs(); mo.disconnect(); }, 4000);
  } else {
    initTabs();
  }
})();
