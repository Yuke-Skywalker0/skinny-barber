/* ================================================================
   cookies.js – Cookie banner GDPR + Privacy/Cookie Policy modal
   Salva consenso in localStorage (chiave: sb_cookie_consent)
   Valori: 'all' | 'essential'
================================================================ */
(function () {
  'use strict';

  var STORAGE_KEY = 'sb_cookie_consent';

  /* ── Testi policy ──────────────────────────────────────*/
  var PRIVACY_HTML = [
    '<h2>Privacy Policy</h2>',
    '<span class="policy-meta">Aggiornata: Giugno 2025 · Titolare: Skinny Barber</span>',

    '<h3>1. Titolare del trattamento</h3>',
    '<p>Skinny Barber, Via S. Maurizio Al Lambro 7, 20861 Brugherio (MB).<br>',
    'Telefono: <a href="tel:+393888729907">+39 388 872 9907</a></p>',

    '<h3>2. Dati raccolti</h3>',
    '<p>Il sito raccoglie i seguenti dati:</p>',
    '<ul>',
    '<li>Dati di navigazione (IP, browser, pagine visitate) tramite log del server</li>',
    '<li>Dati inseriti volontariamente (es. prenotazioni tramite Treatwell)</li>',
    '<li>Cookie tecnici necessari al funzionamento del sito</li>',
    '<li>Cookie analitici (solo previo consenso)</li>',
    '</ul>',

    '<h3>3. Finalità e base giuridica</h3>',
    '<ul>',
    '<li>Erogazione del servizio web (interesse legittimo, art. 6.1.f GDPR)</li>',
    '<li>Analisi statistica anonima delle visite (consenso, art. 6.1.a GDPR)</li>',
    '<li>Gestione prenotazioni tramite Treatwell (adempimento contrattuale)</li>',
    '</ul>',

    '<h3>4. Conservazione</h3>',
    '<p>I dati di navigazione sono conservati per massimo 12 mesi. ',
    'Le preferenze cookie sono conservate per 12 mesi nel browser dell\'utente.</p>',

    '<h3>5. Condivisione con terzi</h3>',
    '<p>I dati non vengono venduti a terzi. Possono essere condivisi con:</p>',
    '<ul>',
    '<li><strong>Treatwell</strong> – piattaforma di prenotazione (privacy policy su treatwell.it)</li>',
    '<li><strong>Instagram / Meta</strong> – link social (dati gestiti da Meta Platforms)</li>',
    '<li><strong>Google Maps</strong> – mappa incorporata (dati gestiti da Google LLC)</li>',
    '</ul>',

    '<h3>6. Diritti dell\'interessato</h3>',
    '<p>Hai diritto di accesso, rettifica, cancellazione, limitazione, portabilità e opposizione. ',
    'Puoi esercitarli scrivendo a: <a href="tel:+393888729907">+39 388 872 9907</a> ',
    'o contattandoci in sede a Brugherio.</p>',

    '<h3>7. Reclami</h3>',
    '<p>Puoi presentare reclamo al Garante per la Protezione dei Dati Personali: ',
    '<a href="https://www.garanteprivacy.it" target="_blank" rel="noopener">garanteprivacy.it</a></p>',
  ].join('');

  var COOKIE_HTML = [
    '<h2>Cookie Policy</h2>',
    '<span class="policy-meta">Aggiornata: Giugno 2025 · Titolare: Skinny Barber</span>',

    '<h3>Cosa sono i cookie</h3>',
    '<p>I cookie sono piccoli file di testo salvati nel tuo browser quando visiti un sito. ',
    'Servono a far funzionare correttamente le pagine e, se lo accetti, a raccogliere statistiche anonime.</p>',

    '<h3>Cookie tecnici (sempre attivi)</h3>',
    '<ul>',
    '<li><strong>sb_cookie_consent</strong> – Memorizza la tua preferenza cookie. Durata: 12 mesi.</li>',
    '</ul>',

    '<h3>Cookie analitici (solo con consenso)</h3>',
    '<ul>',
    '<li><strong>Google Analytics</strong> (opzionale) – Analisi anonima del traffico. Durata: 13 mesi. ',
    'Puoi rinunciare su <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener">tools.google.com/dlpage/gaoptout</a></li>',
    '</ul>',

    '<h3>Cookie di terze parti</h3>',
    '<ul>',
    '<li><strong>Google Maps</strong> – mappa incorporata nella sezione "Dove Siamo". Gestito da Google LLC.</li>',
    '<li><strong>Treatwell</strong> – link di prenotazione. Non imposta cookie direttamente su questo sito.</li>',
    '</ul>',

    '<h3>Come gestire i cookie</h3>',
    '<p>Puoi modificare le tue preferenze in qualsiasi momento dal footer del sito (voce "Gestisci consenso") ',
    'oppure tramite le impostazioni del tuo browser:</p>',
    '<ul>',
    '<li>Chrome: Impostazioni → Privacy e sicurezza → Cookie</li>',
    '<li>Firefox: Preferenze → Privacy e sicurezza</li>',
    '<li>Safari: Preferenze → Privacy</li>',
    '</ul>',
    '<p>Disabilitare i cookie tecnici può compromettere il corretto funzionamento del sito.</p>',
  ].join('');

  /* ── DOM refs ──────────────────────────────────────────*/
  var banner        = document.getElementById('cookieBanner');
  var modal         = document.getElementById('policyModal');
  var policyContent = document.getElementById('policyContent');
  var backdrop      = document.getElementById('policyBackdrop');
  var closeBtn      = document.getElementById('policyClose');
  var btnAccept     = document.getElementById('cookieAccept');
  var btnReject     = document.getElementById('cookieReject');
  var openPrivacy   = document.getElementById('openPrivacy');
  var openCookie    = document.getElementById('openCookie');
  var footerPrivacy = document.getElementById('footerPrivacy');
  var footerCookie  = document.getElementById('footerCookie');
  var footerManage  = document.getElementById('footerManageCookie');

  /* ── Banner show/hide ──────────────────────────────────*/
  function showBanner() {
    if (!banner) return;
    banner.removeAttribute('hidden');
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        banner.classList.add('visible');
      });
    });
  }

  function hideBanner() {
    if (!banner) return;
    banner.classList.remove('visible');
    setTimeout(function () { banner.setAttribute('hidden', ''); }, 600);
  }

  function saveConsent(value) {
    try { localStorage.setItem(STORAGE_KEY, value); } catch(e) {}
    hideBanner();
    if (value === 'all') loadAnalytics();
  }

  function getConsent() {
    try { return localStorage.getItem(STORAGE_KEY); } catch(e) { return null; }
  }

  /* ── Analytics loader (solo con consenso) ──────────────*/
  function loadAnalytics() {
    /* Sostituire 'G-XXXXXXXXXX' con il vero Google Analytics ID */
    /* Uncomment when GA ID is available:
    if (document.querySelector('script[src*="googletagmanager"]')) return;
    var s = document.createElement('script');
    s.src = 'https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX';
    s.async = true;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-XXXXXXXXXX', { anonymize_ip: true });
    */
  }

  /* ── Modal ─────────────────────────────────────────────*/
  var lastFocus = null;

  function openModal(html) {
    if (!modal || !policyContent) return;
    lastFocus = document.activeElement;
    policyContent.innerHTML = html;
    modal.removeAttribute('hidden');
    policyContent.scrollTop = 0;
    document.body.style.overflow = 'hidden';
    if (closeBtn) setTimeout(function () { closeBtn.focus(); }, 50);

    // Trap focus
    modal.addEventListener('keydown', trapFocus);
  }

  function closeModal() {
    if (!modal) return;
    modal.setAttribute('hidden', '');
    document.body.style.overflow = '';
    modal.removeEventListener('keydown', trapFocus);
    if (lastFocus) lastFocus.focus();
  }

  function trapFocus(e) {
    if (e.key !== 'Tab') return;
    var focusable = modal.querySelectorAll(
      'button:not([disabled]), a[href], input, [tabindex]:not([tabindex="-1"])'
    );
    var first = focusable[0];
    var last  = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }

  /* ── Event listeners ───────────────────────────────────*/
  if (btnAccept)   btnAccept.addEventListener('click', function () { saveConsent('all'); });
  if (btnReject)   btnReject.addEventListener('click', function () { saveConsent('essential'); });
  if (openPrivacy) openPrivacy.addEventListener('click', function () { openModal(PRIVACY_HTML); });
  if (openCookie)  openCookie.addEventListener('click', function () { openModal(COOKIE_HTML); });
  if (footerPrivacy) footerPrivacy.addEventListener('click', function () { openModal(PRIVACY_HTML); });
  if (footerCookie)  footerCookie.addEventListener('click', function () { openModal(COOKIE_HTML); });
  if (footerManage)  footerManage.addEventListener('click', function () {
    try { localStorage.removeItem(STORAGE_KEY); } catch(e) {}
    showBanner();
  });

  if (closeBtn)  closeBtn.addEventListener('click', closeModal);
  if (backdrop)  backdrop.addEventListener('click', closeModal);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal && !modal.hasAttribute('hidden')) closeModal();
  });

  /* ── Init ──────────────────────────────────────────────*/
  var consent = getConsent();

  if (consent === null) {
    // No prior choice – show banner after loader exits
    var site = document.getElementById('site');
    function tryShow() {
      if (site && site.classList.contains('visible')) {
        setTimeout(showBanner, 800);
      } else {
        setTimeout(tryShow, 200);
      }
    }
    tryShow();
  } else if (consent === 'all') {
    loadAnalytics();
  }

})();
