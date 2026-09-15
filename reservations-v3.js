(function () {
  var path = window.location.pathname || '';
  var search = window.location.search || '';
  var isReservationsPage =
    /\/aid\/7431739(?:\/|$)/.test(path) ||
    /(?:^|[?&])aid=7431739(?:&|$)/.test(search);

  if (!isReservationsPage) return;

  var FORM_SELECTOR = '#formContainer form[id="7431739"]';
  var V2_SRC = 'https://cdn.jsdelivr.net/gh/rabbi-rgb/jewishtricities-web-assets@40b47ff15f1c113f8750e27457e0a2e65ba72243/reservations-v2.js';

  /*
   * ChabadOne uses .form-field-hidden for fields disabled/hidden in the
   * form builder. The custom reservation layout contains display:block/grid
   * !important rules, so make ChabadOne's hidden state authoritative.
   */
  function addHiddenStateGuard() {
    if (document.getElementById('tc-hh-chabad-hidden-guard')) return;

    var style = document.createElement('style');
    style.id = 'tc-hh-chabad-hidden-guard';
    style.textContent =
      'html.tc-hh-reservations-final ' + FORM_SELECTOR + ' .form-field-hidden{' +
      'display:none !important;' +
      '}';
    document.head.appendChild(style);
  }

  function hasChabadHiddenMarker(element) {
    if (!element) return false;

    var form = document.querySelector(FORM_SELECTOR);
    var node = element;

    while (node && node !== form && node !== document.documentElement) {
      if (
        node.hidden ||
        node.getAttribute('aria-hidden') === 'true' ||
        (node.classList && (
          node.classList.contains('form-field-hidden') ||
          node.classList.contains('form-line-hidden')
        ))
      ) {
        return true;
      }

      /* Detect an inline hide even if later !important CSS overrides it. */
      var inlineStyle = node.getAttribute && node.getAttribute('style');
      if (inlineStyle && /(?:^|;)\s*(?:display\s*:\s*none|visibility\s*:\s*hidden)\s*(?:!important)?\s*(?:;|$)/i.test(inlineStyle)) {
        return true;
      }

      node = node.parentElement;
    }

    return false;
  }

  var holidays = [
    { heading: 'id_52', fields: ['id_35', 'id_39'] },
    { heading: 'id_53', fields: ['id_54', 'id_44'] },
    { heading: 'id_56', fields: ['id_57', 'id_51'] }
  ];

  function syncHolidayHeadings() {
    holidays.forEach(function (holiday) {
      var heading = document.getElementById(holiday.heading);
      if (!heading) return;

      var fields = holiday.fields
        .map(function (id) { return document.getElementById(id); })
        .filter(Boolean);

      /* Only hide the heading when every known field for that holiday is hidden. */
      var shouldHide = fields.length === holiday.fields.length &&
        fields.every(hasChabadHiddenMarker);

      if (shouldHide) {
        heading.setAttribute('data-tc-hh-hidden-by-bridge', 'true');
        heading.style.setProperty('display', 'none', 'important');
      } else if (heading.getAttribute('data-tc-hh-hidden-by-bridge') === 'true') {
        heading.style.removeProperty('display');
        heading.removeAttribute('data-tc-hh-hidden-by-bridge');
      }
    });
  }

  function startHiddenStateBridge() {
    addHiddenStateGuard();
    syncHolidayHeadings();

    if (document.documentElement.hasAttribute('data-tc-hh-hidden-observer')) return;
    document.documentElement.setAttribute('data-tc-hh-hidden-observer', 'true');

    var observer = new MutationObserver(function () {
      syncHolidayHeadings();
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'hidden', 'aria-hidden', 'style']
    });

    /* ChabadOne can apply form conditions shortly after initial render. */
    [0, 100, 300, 700, 1500, 3000, 6000].forEach(function (delay) {
      window.setTimeout(syncHolidayHeadings, delay);
    });
  }

  function loadV2() {
    var existing = document.getElementById('tc-hh-reservations-v2-loader');
    if (existing) {
      startHiddenStateBridge();
      return;
    }

    var script = document.createElement('script');
    script.id = 'tc-hh-reservations-v2-loader';
    script.src = V2_SRC;
    script.defer = true;
    script.onload = startHiddenStateBridge;
    script.onerror = startHiddenStateBridge;
    document.head.appendChild(script);
  }

  /* Install the guard immediately, then load the existing reservation UX. */
  addHiddenStateGuard();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      loadV2();
      startHiddenStateBridge();
    }, { once: true });
  } else {
    loadV2();
    startHiddenStateBridge();
  }
})();
