(function () {
  var path = window.location.pathname || '';
  var search = window.location.search || '';
  var isReservationsPage =
    /\/aid\/7431739(?:\/|$)/.test(path) ||
    /(?:^|[?&])aid=7431739(?:&|$)/.test(search);

  if (!isReservationsPage) return;

  var FORM_SELECTOR = '#formContainer form[id="7431739"]';

  function textOf(el) {
    return ((el && el.textContent) || '').replace(/\s+/g, ' ').trim();
  }

  function setImportant(el, prop, value) {
    if (!el) return;
    if (el.style.getPropertyValue(prop) !== value || el.style.getPropertyPriority(prop) !== 'important') {
      el.style.setProperty(prop, value, 'important');
    }
  }

  function clearHiddenState(el) {
    if (!el) return;
    if (el.hasAttribute('hidden')) el.removeAttribute('hidden');
    if (el.getAttribute('aria-hidden') === 'true') el.removeAttribute('aria-hidden');
    ['form-field-hidden', 'form-line-hidden'].forEach(function (cls) {
      if (el.classList && el.classList.contains(cls)) el.classList.remove(cls);
    });
    if (el.hasAttribute('data-tc-hh-hidden-section')) el.removeAttribute('data-tc-hh-hidden-section');
  }

  function isRoshRow(row) {
    var text = textOf(row);
    if (!text) return false;

    return (
      /^Rosh Hashanah, Day [12]\b/i.test(text) ||
      /\bAttend all Day [12] services\b/i.test(text) ||
      /\bRosh Hashana(?:h)? Morning\b/i.test(text) ||
      /\bTashlich\s*&\s*Shofar at Mundy Park\b/i.test(text)
    );
  }

  function isYomKippurHeadingRow(row) {
    var heading = row.querySelector('h3');
    return !!heading && /^Yom Kippur$/i.test(textOf(heading));
  }

  function isYomKippurAllRow(row) {
    return /\bAttend all Yom Kippur services\b/i.test(textOf(row));
  }

  function isYomKippurIndividualRow(row) {
    var text = textOf(row);
    return (
      /\bKol Nidrei Service\b/i.test(text) &&
      (/\bShacharit\s*&\s*Musaf\b/i.test(text) || /\bYizkor Memorial Service\b/i.test(text)) &&
      /\bMincha\s*&\s*Ne['’]?ilah Services\b/i.test(text)
    );
  }

  function installStyle() {
    if (document.getElementById('tc-hh-v9-row-fix')) return;

    var style = document.createElement('style');
    style.id = 'tc-hh-v9-row-fix';
    style.textContent = [
      FORM_SELECTOR + ' .form-line[data-tc-hh-rosh-closed="true"]{display:none !important;}',
      FORM_SELECTOR + ' .form-line[data-tc-hh-yk="heading"],' +
        FORM_SELECTOR + ' .form-line[data-tc-hh-yk="all"],' +
        FORM_SELECTOR + ' .form-line[data-tc-hh-yk="individual"]{display:block !important;visibility:visible !important;opacity:1 !important;}',

      FORM_SELECTOR + ' .form-line[data-tc-hh-yk="heading"]{margin:8px 0 0 !important;padding:0 !important;}',
      FORM_SELECTOR + ' .form-line[data-tc-hh-yk="heading"] table{width:100% !important;margin:0 !important;border:0 !important;border-top:2px solid #a71938 !important;border-left:0 !important;border-bottom:0 !important;border-radius:0 !important;background:transparent !important;box-shadow:none !important;overflow:visible !important;}',
      FORM_SELECTOR + ' .form-line[data-tc-hh-yk="heading"] table td{padding:20px 0 10px !important;border:0 !important;border-left:0 !important;box-shadow:none !important;}',
      FORM_SELECTOR + ' .form-line[data-tc-hh-yk="heading"] h3{margin:0 !important;color:#7e1029 !important;font-family:Georgia,"Times New Roman",serif !important;font-size:30px !important;line-height:1.15 !important;font-weight:400 !important;}',
      FORM_SELECTOR + ' .form-line[data-tc-hh-yk="heading"] h3 + p{display:block !important;margin:5px 0 0 !important;padding:0 !important;border:0 !important;border-radius:0 !important;background:transparent !important;color:#9a7a45 !important;font-size:15px !important;line-height:1.3 !important;font-weight:700 !important;text-transform:none !important;}',

      FORM_SELECTOR + ' .form-line[data-tc-hh-yk="individual"] .form-label-left{display:block !important;width:100% !important;margin:0 !important;padding:0 0 8px !important;}',
      FORM_SELECTOR + ' .form-line[data-tc-hh-yk="individual"] :is(.form-input,.form-input-wide){display:block !important;width:100% !important;margin:0 !important;padding:0 !important;}',
      FORM_SELECTOR + ' .form-line[data-tc-hh-yk="individual"] .form-single-column{display:grid !important;grid-template-columns:repeat(2,minmax(0,1fr)) !important;gap:0 !important;width:100% !important;border:1px solid #e6dfd7 !important;border-radius:10px !important;background:#fff !important;overflow:hidden !important;}',
      FORM_SELECTOR + ' .form-line[data-tc-hh-yk="individual"] .form-checkbox-item{display:flex !important;align-items:flex-start !important;float:none !important;clear:none !important;width:100% !important;min-height:50px !important;margin:0 !important;padding:11px 13px !important;border:0 !important;border-bottom:1px solid #e6dfd7 !important;border-radius:0 !important;background:#fff !important;box-shadow:none !important;box-sizing:border-box !important;}',
      FORM_SELECTOR + ' .form-line[data-tc-hh-yk="individual"] .form-checkbox-item:nth-child(odd){border-right:1px solid #e6dfd7 !important;}',
      FORM_SELECTOR + ' .form-line[data-tc-hh-yk="individual"] .form-checkbox-item:last-child:nth-child(odd){grid-column:1/-1 !important;border-right:0 !important;border-bottom:0 !important;}',
      FORM_SELECTOR + ' .form-line[data-tc-hh-yk="individual"] .form-checkbox-item:last-child:nth-child(even){border-bottom:0 !important;}',

      '@media screen and (max-width:720px){',
      FORM_SELECTOR + ' .form-line[data-tc-hh-yk="individual"] .form-single-column{grid-template-columns:minmax(0,1fr) !important;}',
      FORM_SELECTOR + ' .form-line[data-tc-hh-yk="individual"] .form-checkbox-item{border-right:0 !important;}',
      FORM_SELECTOR + ' .form-line[data-tc-hh-yk="heading"] table td{padding:16px 0 8px !important;}',
      FORM_SELECTOR + ' .form-line[data-tc-hh-yk="heading"] h3{font-size:27px !important;}',
      FORM_SELECTOR + ' .form-line[data-tc-hh-yk="heading"] h3 + p{font-size:14px !important;}',
      '}'
    ].join('');

    document.head.appendChild(style);
  }

  function markRows() {
    var form = document.querySelector(FORM_SELECTOR);
    if (!form) return false;

    var foundYkIndividual = false;

    form.querySelectorAll('.form-line').forEach(function (row) {
      if (isRoshRow(row)) {
        row.setAttribute('data-tc-hh-rosh-closed', 'true');
        row.removeAttribute('data-tc-hh-yk');
        row.setAttribute('aria-hidden', 'true');
        setImportant(row, 'display', 'none');
        return;
      }

      if (isYomKippurHeadingRow(row)) {
        row.setAttribute('data-tc-hh-yk', 'heading');
        row.removeAttribute('data-tc-hh-rosh-closed');
        clearHiddenState(row);
        setImportant(row, 'display', 'block');
        stabilizeHeading(row);
        return;
      }

      if (isYomKippurAllRow(row)) {
        row.setAttribute('data-tc-hh-yk', 'all');
        row.removeAttribute('data-tc-hh-rosh-closed');
        clearHiddenState(row);
        setImportant(row, 'display', 'block');
        return;
      }

      if (isYomKippurIndividualRow(row)) {
        foundYkIndividual = true;
        row.setAttribute('data-tc-hh-yk', 'individual');
        row.removeAttribute('data-tc-hh-rosh-closed');
        clearHiddenState(row);
        showIndividualRow(row);
      }
    });

    return foundYkIndividual;
  }

  function stabilizeHeading(row) {
    row.querySelectorAll('.tc-hh-day-card').forEach(function (el) {
      el.classList.remove('tc-hh-day-card');
    });

    var table = row.querySelector('table');
    var cell = row.querySelector('td');
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
  }

  function showIndividualRow(row) {
    clearHiddenState(row);
    setImportant(row, 'display', 'block');
    setImportant(row, 'visibility', 'visible');
    setImportant(row, 'opacity', '1');

    var label = row.querySelector('.form-label-left');
    if (label) setImportant(label, 'display', 'block');

    row.querySelectorAll('.form-input, .form-input-wide').forEach(function (el) {
      clearHiddenState(el);
      setImportant(el, 'display', 'block');
      setImportant(el, 'visibility', 'visible');
    });

    var column = row.querySelector('.form-single-column');
    if (column) {
      clearHiddenState(column);
      setImportant(column, 'display', 'grid');
      setImportant(column, 'visibility', 'visible');
    }

    row.querySelectorAll('.form-checkbox-item').forEach(function (item) {
      clearHiddenState(item);
      setImportant(item, 'display', 'flex');
      setImportant(item, 'visibility', 'visible');
      setImportant(item, 'opacity', '1');
    });
  }

  function apply() {
    installStyle();
    markRows();
  }

  function start() {
    apply();

    if (document.documentElement.getAttribute('data-tc-hh-v9-observer') === 'true') return;
    document.documentElement.setAttribute('data-tc-hh-v9-observer', 'true');

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

    [50,150,350,800,1700,3200,6500].forEach(function (delay) {
      window.setTimeout(apply, delay);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
})();
