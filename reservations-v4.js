(function () {
  var path = window.location.pathname || '';
  var search = window.location.search || '';
  var isReservationsPage =
    /\/aid\/7431739(?:\/|$)/.test(path) ||
    /(?:^|[?&])aid=7431739(?:&|$)/.test(search);

  if (!isReservationsPage) return;

  var V3_SRC = 'https://cdn.jsdelivr.net/gh/rabbi-rgb/jewishtricities-web-assets@26775cbf545bfe89c6866364d2af4f86bfccbf40/reservations-v3.js';
  var ROSH_IDS = ['id_52', 'id_35', 'id_39', 'id_53', 'id_54', 'id_44'];

  function injectClosedHolidayGuard() {
    if (document.getElementById('tc-hh-rosh-closed-guard')) return;

    var style = document.createElement('style');
    style.id = 'tc-hh-rosh-closed-guard';
    style.textContent =
      'html.tc-hh-reservations-final #formContainer form[id="7431739"] ' +
      ':is(#id_52,#id_35,#id_39,#id_53,#id_54,#id_44){display:none !important;}';
    document.head.appendChild(style);
  }

  function forceHideRosh() {
    ROSH_IDS.forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      el.setAttribute('data-tc-hh-rosh-closed', 'true');
      el.setAttribute('aria-hidden', 'true');
      el.style.setProperty('display', 'none', 'important');
    });
  }

  function loadExistingReservationUx() {
    if (document.getElementById('tc-hh-reservations-v3-loader')) return;

    var script = document.createElement('script');
    script.id = 'tc-hh-reservations-v3-loader';
    script.src = V3_SRC;
    script.defer = true;
    script.onload = forceHideRosh;
    document.head.appendChild(script);
  }

  injectClosedHolidayGuard();
  forceHideRosh();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      injectClosedHolidayGuard();
      forceHideRosh();
      loadExistingReservationUx();
    }, { once: true });
  } else {
    loadExistingReservationUx();
  }

  /* Keep the closed state authoritative if ChabadOne or another script rerenders. */
  var observer = new MutationObserver(function () {
    forceHideRosh();
  });
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['class', 'style', 'hidden', 'aria-hidden']
  });

  [100, 300, 700, 1500, 3000, 6000, 10000].forEach(function (delay) {
    window.setTimeout(forceHideRosh, delay);
  });
})();
