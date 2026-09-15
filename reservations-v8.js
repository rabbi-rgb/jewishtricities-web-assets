(function () {
  var path = window.location.pathname || '';
  var search = window.location.search || '';
  var isReservationsPage =
    /\/aid\/7431739(?:\/|$)/.test(path) ||
    /(?:^|[?&])aid=7431739(?:&|$)/.test(search);

  if (!isReservationsPage) return;

  var FORM_SELECTOR = '#formContainer form[id="7431739"]';
  var ROSH_IDS = ['id_52', 'id_35', 'id_39', 'id_53', 'id_54', 'id_44'];
  var YK_IDS = ['id_56', 'id_57', 'id_51'];

  function setImportant(el, prop, value) {
    if (!el) return;
    if (el.style.getPropertyValue(prop) !== value || el.style.getPropertyPriority(prop) !== 'important') {
      el.style.setProperty(prop, value, 'important');
    }
  }

  function ensureStyle() {
    if (document.getElementById('tc-hh-v8-stable-fixes')) return;

    var style = document.createElement('style');
    style.id = 'tc-hh-v8-stable-fixes';
    style.textContent = [
      FORM_SELECTOR + ' :is(#id_52,#id_35,#id_39,#id_53,#id_54,#id_44){display:none !important;}',
      FORM_SELECTOR + ' :is(#id_56,#id_57,#id_51){display:block !important;visibility:visible !important;opacity:1 !important;}',
      FORM_SELECTOR + ' #id_51 .form-input,' + FORM_SELECTOR + ' #id_51 .form-input-wide{display:block !important;width:100% !important;}',
      FORM_SELECTOR + ' #id_51 .form-single-column{display:grid !important;grid-template-columns:repeat(2,minmax(0,1fr)) !important;gap:0 !important;width:100% !important;border:1px solid #e6dfd7 !important;border-radius:10px !important;background:#fff !important;overflow:hidden !important;}',
      FORM_SELECTOR + ' #id_51 .form-checkbox-item{display:flex !important;width:100% !important;min-height:50px !important;padding:11px 13px !important;border:0 !important;border-bottom:1px solid #e6dfd7 !important;border-radius:0 !important;background:#fff !important;box-shadow:none !important;box-sizing:border-box !important;}',
      FORM_SELECTOR + ' #id_51 .form-checkbox-item:nth-child(odd){border-right:1px solid #e6dfd7 !important;}',
      FORM_SELECTOR + ' #id_51 .form-checkbox-item:last-child:nth-child(odd){grid-column:1/-1 !important;border-right:0 !important;border-bottom:0 !important;}',
      FORM_SELECTOR + ' #id_51 .form-checkbox-item:last-child:nth-child(even){border-bottom:0 !important;}',
      FORM_SELECTOR + ' #id_56{margin:8px 0 0 !important;padding:0 !important;}',
      FORM_SELECTOR + ' #id_56 table{width:100% !important;margin:0 !important;border:0 !important;border-top:2px solid #a71938 !important;border-left:0 !important;border-bottom:0 !important;border-radius:0 !important;background:transparent !important;box-shadow:none !important;overflow:visible !important;}',
      FORM_SELECTOR + ' #id_56 table td{padding:20px 0 10px !important;border:0 !important;border-left:0 !important;box-shadow:none !important;}',
      FORM_SELECTOR + ' #id_56 h3{margin:0 !important;color:#7e1029 !important;font-family:Georgia,"Times New Roman",serif !important;font-size:30px !important;line-height:1.15 !important;font-weight:400 !important;}',
      FORM_SELECTOR + ' #id_56 h3 + p{display:block !important;margin:5px 0 0 !important;padding:0 !important;border:0 !important;border-radius:0 !important;background:transparent !important;color:#9a7a45 !important;font-size:15px !important;line-height:1.3 !important;font-weight:700 !important;text-transform:none !important;}',
      FORM_SELECTOR + ' #id_57{margin-top:0 !important;}',
      '@media screen and (max-width:720px){',
      FORM_SELECTOR + ' #id_51 .form-single-column{grid-template-columns:minmax(0,1fr) !important;}',
      FORM_SELECTOR + ' #id_51 .form-checkbox-item{border-right:0 !important;}',
      FORM_SELECTOR + ' #id_56 table td{padding:16px 0 8px !important;}',
      FORM_SELECTOR + ' #id_56 h3{font-size:27px !important;}',
      FORM_SELECTOR + ' #id_56 h3 + p{font-size:14px !important;}',
      '}'
    ].join('');

    document.head.appendChild(style);
  }

  function hideRosh() {
    ROSH_IDS.forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      if (el.getAttribute('aria-hidden') !== 'true') el.setAttribute('aria-hidden', 'true');
      setImportant(el, 'display', 'none');
    });
  }

  function showYomKippur() {
    YK_IDS.forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;

      if (el.hasAttribute('hidden')) el.removeAttribute('hidden');
      if (el.getAttribute('aria-hidden') === 'true') el.removeAttribute('aria-hidden');
      if (el.classList.contains('form-field-hidden')) el.classList.remove('form-field-hidden');
      if (el.classList.contains('form-line-hidden')) el.classList.remove('form-line-hidden');
      if (el.hasAttribute('data-tc-hh-hidden-section')) el.removeAttribute('data-tc-hh-hidden-section');

      setImportant(el, 'display', 'block');
      setImportant(el, 'visibility', 'visible');
      setImportant(el, 'opacity', '1');
    });

    var services = document.getElementById('id_51');
    if (!services) return;

    var input = services.querySelector('.form-input, .form-input-wide');
    if (input) setImportant(input, 'display', 'block');

    var column = services.querySelector('.form-single-column');
    if (column) setImportant(column, 'display', 'grid');

    services.querySelectorAll('.form-checkbox-item').forEach(function (item) {
      setImportant(item, 'display', 'flex');
      if (item.classList.contains('form-field-hidden')) item.classList.remove('form-field-hidden');
    });
  }

  function stabilizeYomKippurHeading() {
    var row = document.getElementById('id_56');
    if (!row) return;

    row.querySelectorAll('.tc-hh-day-card').forEach(function (el) {
      el.classList.remove('tc-hh-day-card');
    });

    var table = row.querySelector('table');
    var cell = row.querySelector('td');
    var h3 = row.querySelector('h3');
    var date = h3 && h3.nextElementSibling && h3.nextElementSibling.tagName === 'P'
      ? h3.nextElementSibling
      : null;

    if (table) {
      setImportant(table, 'border', '0');
      setImportant(table, 'border-top', '2px solid #a71938');
      setImportant(table, 'border-left', '0');
      setImportant(table, 'border-bottom', '0');
      setImportant(table, 'border-radius', '0');
      setImportant(table, 'background', 'transparent');
      setImportant(table, 'box-shadow', 'none');
      setImportant(table, 'overflow', 'visible');
    }

    if (cell) {
      setImportant(cell, 'border', '0');
      setImportant(cell, 'border-left', '0');
      setImportant(cell, 'box-shadow', 'none');
    }

    if (h3) {
      setImportant(h3, 'margin', '0');
      setImportant(h3, 'color', '#7e1029');
      setImportant(h3, 'font-weight', '400');
    }

    if (date) {
      setImportant(date, 'display', 'block');
      setImportant(date, 'margin', '5px 0 0');
      setImportant(date, 'padding', '0');
      setImportant(date, 'border', '0');
      setImportant(date, 'border-radius', '0');
      setImportant(date, 'background', 'transparent');
      setImportant(date, 'color', '#9a7a45');
      setImportant(date, 'text-transform', 'none');
    }
  }

  function apply() {
    ensureStyle();
    hideRosh();
    showYomKippur();
    stabilizeYomKippurHeading();
  }

  function start() {
    apply();

    if (document.documentElement.getAttribute('data-tc-hh-v8-observer') === 'true') return;
    document.documentElement.setAttribute('data-tc-hh-v8-observer', 'true');

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

    [50, 150, 350, 800, 1700, 3200, 6500].forEach(function (delay) {
      window.setTimeout(apply, delay);
    });

    window.addEventListener('resize', apply, { passive: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
})();
