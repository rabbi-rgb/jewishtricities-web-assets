(function () {
  var path = window.location.pathname || '';
  var search = window.location.search || '';
  var isReservationsPage =
    /\/aid\/7431739(?:\/|$)/.test(path) ||
    /(?:^|[?&])aid=7431739(?:&|$)/.test(search);

  if (!isReservationsPage) return;

  var ROSH_IDS = ['id_52', 'id_35', 'id_39', 'id_53', 'id_54', 'id_44'];
  var YK_IDS = ['id_56', 'id_57', 'id_51'];

  function ensureStyle() {
    if (document.getElementById('tc-hh-v7-stable-fixes')) return;

    var style = document.createElement('style');
    style.id = 'tc-hh-v7-stable-fixes';
    style.textContent = [
      /* Rosh Hashanah is closed. */
      '#formContainer form[id="7431739"] :is(#id_52,#id_35,#id_39,#id_53,#id_54,#id_44){display:none !important;}',

      /* Yom Kippur rows must remain visible. */
      '#formContainer form[id="7431739"] :is(#id_56,#id_57,#id_51){display:block !important;visibility:visible !important;opacity:1 !important;}',
      '#formContainer form[id="7431739"] #id_57 :is(.form-input,.form-input-wide){display:block !important;width:100% !important;}',
      '#formContainer form[id="7431739"] #id_51 :is(.form-input,.form-input-wide){display:block !important;width:100% !important;}',
      '#formContainer form[id="7431739"] #id_51 .form-single-column{display:grid !important;grid-template-columns:1fr !important;gap:8px !important;width:100% !important;}',
      '#formContainer form[id="7431739"] #id_51 .form-checkbox-item{display:flex !important;width:100% !important;}',

      /* Keep the Yom Kippur title/date in the same visual flow, never its own card. */
      '#formContainer form[id="7431739"] #id_56{margin-bottom:0 !important;padding-bottom:6px !important;}',
      '#formContainer form[id="7431739"] #id_56 table{background:transparent !important;box-shadow:none !important;border:0 !important;border-radius:0 !important;overflow:visible !important;}',
      '#formContainer form[id="7431739"] #id_56 table td{border-left:0 !important;box-shadow:none !important;}',
      '#formContainer form[id="7431739"] #id_57{margin-top:0 !important;}',

      '@media screen and (max-width:600px){',
      '#formContainer form[id="7431739"] #id_51 .form-single-column{gap:7px !important;}',
      '}'
    ].join('');

    document.head.appendChild(style);
  }

  function hideRosh() {
    ROSH_IDS.forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;

      if (el.getAttribute('aria-hidden') !== 'true') {
        el.setAttribute('aria-hidden', 'true');
      }
      if (el.style.getPropertyValue('display') !== 'none' ||
          el.style.getPropertyPriority('display') !== 'important') {
        el.style.setProperty('display', 'none', 'important');
      }
    });
  }

  function showYomKippur() {
    YK_IDS.forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;

      if (el.hasAttribute('hidden')) el.removeAttribute('hidden');
      if (el.getAttribute('aria-hidden') === 'true') el.removeAttribute('aria-hidden');

      if (el.classList.contains('form-field-hidden')) {
        el.classList.remove('form-field-hidden');
      }
      if (el.classList.contains('form-line-hidden')) {
        el.classList.remove('form-line-hidden');
      }

      if (el.style.getPropertyValue('display') !== 'block' ||
          el.style.getPropertyPriority('display') !== 'important') {
        el.style.setProperty('display', 'block', 'important');
      }
      if (el.style.getPropertyValue('visibility') === 'hidden') {
        el.style.setProperty('visibility', 'visible', 'important');
      }
    });

    var services = document.getElementById('id_51');
    if (services) {
      var column = services.querySelector('.form-single-column');
      if (column && (column.style.getPropertyValue('display') !== 'grid' ||
          column.style.getPropertyPriority('display') !== 'important')) {
        column.style.setProperty('display', 'grid', 'important');
      }

      services.querySelectorAll('.form-checkbox-item').forEach(function (item) {
        if (item.style.getPropertyValue('display') !== 'flex' ||
            item.style.getPropertyPriority('display') !== 'important') {
          item.style.setProperty('display', 'flex', 'important');
        }
      });
    }
  }

  function normalizeYomKippurHeading() {
    var headingLine = document.getElementById('id_56');
    if (!headingLine) return;

    headingLine.querySelectorAll('table.tc-hh-day-card').forEach(function (table) {
      table.classList.remove('tc-hh-day-card');
    });

    var table = headingLine.querySelector('table');
    if (table) {
      [
        'background', 'box-shadow', 'border', 'border-left',
        'border-radius', 'overflow'
      ].forEach(function (prop) {
        table.style.removeProperty(prop);
      });
    }

    headingLine.querySelectorAll('td').forEach(function (cell) {
      cell.style.removeProperty('border-left');
      cell.style.removeProperty('box-shadow');
    });
  }

  function apply() {
    ensureStyle();
    hideRosh();
    showYomKippur();
    normalizeYomKippurHeading();
  }

  function start() {
    apply();

    if (document.documentElement.getAttribute('data-tc-hh-v7-observer') === 'true') return;
    document.documentElement.setAttribute('data-tc-hh-v7-observer', 'true');

    var scheduled = false;
    var observer = new MutationObserver(function () {
      if (scheduled) return;
      scheduled = true;
      window.requestAnimationFrame(function () {
        scheduled = false;
        apply();
      });
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'hidden', 'aria-hidden', 'style']
    });

    [100, 300, 700, 1500, 3000, 6000].forEach(function (delay) {
      window.setTimeout(apply, delay);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
})();
