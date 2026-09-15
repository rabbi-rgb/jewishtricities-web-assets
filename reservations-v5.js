(function () {
  var path = window.location.pathname || '';
  var search = window.location.search || '';
  var isReservationsPage =
    /\/aid\/7431739(?:\/|$)/.test(path) ||
    /(?:^|[?&])aid=7431739(?:&|$)/.test(search);

  if (!isReservationsPage) return;

  var FORM_ID = '7431739';
  var ROSH_IDS = ['id_52', 'id_35', 'id_39', 'id_53', 'id_54', 'id_44'];
  var V2_SRC = 'https://cdn.jsdelivr.net/gh/rabbi-rgb/jewishtricities-web-assets@40b47ff15f1c113f8750e27457e0a2e65ba72243/reservations-v2.js';

  function installCssGuard() {
    if (document.getElementById('tc-hh-rosh-closed-guard')) return;

    var style = document.createElement('style');
    style.id = 'tc-hh-rosh-closed-guard';
    style.textContent =
      '#formContainer form[id="' + FORM_ID + '"] ' +
      ':is(#id_52,#id_35,#id_39,#id_53,#id_54,#id_44){display:none !important;}';
    document.head.appendChild(style);
  }

  function forceHideRosh() {
    ROSH_IDS.forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;

      if (el.getAttribute('data-tc-rosh-closed') !== 'true') {
        el.setAttribute('data-tc-rosh-closed', 'true');
      }
      if (el.getAttribute('aria-hidden') !== 'true') {
        el.setAttribute('aria-hidden', 'true');
      }
      if (el.style.getPropertyValue('display') !== 'none' ||
          el.style.getPropertyPriority('display') !== 'important') {
        el.style.setProperty('display', 'none', 'important');
      }
    });
  }

  function loadReservationUx() {
    if (document.getElementById('tc-hh-reservations-v2-loader')) return;

    var script = document.createElement('script');
    script.id = 'tc-hh-reservations-v2-loader';
    script.src = V2_SRC;
    script.defer = true;
    script.onload = forceHideRosh;
    document.head.appendChild(script);
  }

  function start() {
    installCssGuard();
    forceHideRosh();
    loadReservationUx();

    if (document.documentElement.getAttribute('data-tc-rosh-observer') === 'true') return;
    document.documentElement.setAttribute('data-tc-rosh-observer', 'true');

    var scheduled = false;
    var observer = new MutationObserver(function () {
      if (scheduled) return;
      scheduled = true;
      window.requestAnimationFrame(function () {
        scheduled = false;
        forceHideRosh();
      });
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true
    });

    [100, 300, 700, 1500, 3000, 6000, 10000].forEach(function (delay) {
      window.setTimeout(forceHideRosh, delay);
    });
  }

  installCssGuard();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
})();
