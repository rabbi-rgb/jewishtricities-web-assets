(function () {
  var path = window.location.pathname || '';
  var search = window.location.search || '';
  var isReservationsPage =
    /\/aid\/7431739(?:\/|$)/.test(path) ||
    /(?:^|[?&])aid=7431739(?:&|$)/.test(search);

  if (!isReservationsPage) return;

  var V2_SRC = 'https://cdn.jsdelivr.net/gh/rabbi-rgb/jewishtricities-web-assets@40b47ff15f1c113f8750e27457e0a2e65ba72243/reservations-v2.js';
  var ROSH_IDS = ['id_52', 'id_35', 'id_39', 'id_53', 'id_54', 'id_44'];

  function installPageFixes() {
    if (document.getElementById('tc-hh-v6-fixes')) return;

    var style = document.createElement('style');
    style.id = 'tc-hh-v6-fixes';
    style.textContent = [
      /* Rosh Hashanah is closed. */
      '#formContainer form[id="7431739"] :is(#id_52,#id_35,#id_39,#id_53,#id_54,#id_44){display:none !important;}',

      /* Yom Kippur heading belongs to the service section, not in its own card. */
      '#formContainer form[id="7431739"] #id_56{margin-bottom:0 !important;padding-bottom:0 !important;}',
      '#formContainer form[id="7431739"] #id_56 table.tc-hh-day-card{background:transparent !important;box-shadow:none !important;border:0 !important;border-radius:0 !important;overflow:visible !important;}',
      '#formContainer form[id="7431739"] #id_56 table.tc-hh-day-card td{padding:0 0 10px !important;border-left:0 !important;}',
      '#formContainer form[id="7431739"] #id_56 .tc-hh-day-title{margin:0 !important;}',
      '#formContainer form[id="7431739"] #id_56 .tc-hh-day-date{margin-top:7px !important;}',
      '#formContainer form[id="7431739"] #id_57{margin-top:0 !important;}',

      '@media screen and (max-width:600px){',
      '#formContainer form[id="7431739"] #id_56 table.tc-hh-day-card td{padding:0 0 8px !important;}',
      '}'
    ].join('');
    document.head.appendChild(style);
  }

  function forceHideRosh() {
    ROSH_IDS.forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      el.setAttribute('data-tc-rosh-closed', 'true');
      el.setAttribute('aria-hidden', 'true');
      el.style.setProperty('display', 'none', 'important');
    });
  }

  function normalizeYomKippurHeader() {
    var headingLine = document.getElementById('id_56');
    if (!headingLine) return;

    var table = headingLine.querySelector('table.tc-hh-day-card');
    if (table) {
      table.style.setProperty('background', 'transparent', 'important');
      table.style.setProperty('box-shadow', 'none', 'important');
      table.style.setProperty('border', '0', 'important');
      table.style.setProperty('border-radius', '0', 'important');
      table.style.setProperty('overflow', 'visible', 'important');
    }

    var cell = headingLine.querySelector('table.tc-hh-day-card td');
    if (cell) {
      cell.style.setProperty('border-left', '0', 'important');
    }
  }

  function loadReservationUx() {
    if (document.getElementById('tc-hh-reservations-v2-loader')) return;

    var script = document.createElement('script');
    script.id = 'tc-hh-reservations-v2-loader';
    script.src = V2_SRC;
    script.defer = true;
    script.onload = function () {
      forceHideRosh();
      normalizeYomKippurHeader();
    };
    document.head.appendChild(script);
  }

  function applyFixes() {
    installPageFixes();
    forceHideRosh();
    normalizeYomKippurHeader();
  }

  function start() {
    applyFixes();
    loadReservationUx();

    if (document.documentElement.getAttribute('data-tc-hh-v6-observer') === 'true') return;
    document.documentElement.setAttribute('data-tc-hh-v6-observer', 'true');

    var scheduled = false;
    var observer = new MutationObserver(function () {
      if (scheduled) return;
      scheduled = true;
      window.requestAnimationFrame(function () {
        scheduled = false;
        applyFixes();
      });
    });

    observer.observe(document.documentElement, { childList: true, subtree: true });

    [100,300,700,1500,3000,6000,10000].forEach(function (delay) {
      window.setTimeout(applyFixes, delay);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
})();
