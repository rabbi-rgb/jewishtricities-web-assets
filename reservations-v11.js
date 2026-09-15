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
    if (document.getElementById('tc-hh-v11-style')) return;

    var style = document.createElement('style');
    style.id = 'tc-hh-v11-style';
    style.textContent = [
      FORM_SELECTOR + ' .form-line[data-tc-hh-rosh-closed="true"]{display:none !important;}',

      FORM_SELECTOR + ' .form-line[data-tc-hh-yk]{float:none !important;clear:both !important;width:100% !important;max-width:100% !important;box-sizing:border-box !important;}',

      /* Yom Kippur heading */
      FORM_SELECTOR + ' .form-line[data-tc-hh-yk="heading"]{display:block !important;margin:14px 0 10px !important;padding:14px 0 0 !important;position:relative !important;}',
      FORM_SELECTOR + ' .form-line[data-tc-hh-yk="heading"]::before{content:"" !important;display:block !important;width:48px !important;height:3px !important;margin:0 0 12px !important;border-radius:999px !important;background:#b58a45 !important;}',
      FORM_SELECTOR + ' .form-line[data-tc-hh-yk="heading"] table,' + FORM_SELECTOR + ' .form-line[data-tc-hh-yk="heading"] tbody,' + FORM_SELECTOR + ' .form-line[data-tc-hh-yk="heading"] tr,' + FORM_SELECTOR + ' .form-line[data-tc-hh-yk="heading"] td{width:100% !important;border:0 !important;border-top:0 !important;border-left:0 !important;border-bottom:0 !important;border-radius:0 !important;background:transparent !important;box-shadow:none !important;}',
      FORM_SELECTOR + ' .form-line[data-tc-hh-yk="heading"] td{padding:0 !important;}',
      FORM_SELECTOR + ' .form-line[data-tc-hh-yk="heading"] h3{margin:0 0 4px !important;color:#7e1029 !important;font-family:Georgia,"Times New Roman",serif !important;font-size:32px !important;line-height:1.05 !important;font-weight:500 !important;letter-spacing:-.25px !important;}',
      FORM_SELECTOR + ' .form-line[data-tc-hh-yk="heading"] h3 + p{display:block !important;margin:0 !important;padding:0 !important;border:0 !important;background:transparent !important;color:#7d6d58 !important;font-size:13px !important;line-height:1.35 !important;font-weight:700 !important;letter-spacing:0 !important;text-transform:none !important;}',

      /* labels */
      FORM_SELECTOR + ' .form-line[data-tc-hh-yk="all"] .form-label-left,' + FORM_SELECTOR + ' .form-line[data-tc-hh-yk="individual"] .form-label-left{display:block !important;width:100% !important;margin:0 !important;padding:0 0 8px !important;color:#5e5852 !important;font-size:10.5px !important;line-height:1.2 !important;font-weight:800 !important;letter-spacing:.11em !important;text-transform:uppercase !important;}',

      /* all services */
      FORM_SELECTOR + ' .form-line[data-tc-hh-yk="all"]{display:block !important;margin:0 0 16px !important;padding:0 !important;background:transparent !important;border:0 !important;box-shadow:none !important;}',
      FORM_SELECTOR + ' .form-line[data-tc-hh-yk="all"] :is(.form-input,.form-input-wide,.form-single-column){display:block !important;width:100% !important;margin:0 !important;padding:0 !important;border:0 !important;background:transparent !important;}',
      FORM_SELECTOR + ' .form-line[data-tc-hh-yk="all"] .form-checkbox-item{display:flex !important;align-items:center !important;float:none !important;width:100% !important;min-height:54px !important;margin:0 !important;padding:12px 14px !important;border:1px solid #dccbad !important;border-left:4px solid #b58a45 !important;border-radius:10px !important;background:linear-gradient(90deg,#fbf8f3 0%,#fff 72%) !important;box-shadow:0 2px 8px rgba(46,42,37,.04) !important;box-sizing:border-box !important;}',
      FORM_SELECTOR + ' .form-line[data-tc-hh-yk="all"] .form-checkbox-item:has(input:checked){border-color:#b58a45 !important;border-left-color:#a71938 !important;background:#f8efe8 !important;box-shadow:0 0 0 2px rgba(181,138,69,.10) !important;}',

      /* individual services */
      FORM_SELECTOR + ' .form-line[data-tc-hh-yk="individual"]{display:block !important;margin:0 0 20px !important;padding:0 !important;}',
      FORM_SELECTOR + ' .form-line[data-tc-hh-yk="individual"] :is(.form-input,.form-input-wide){display:block !important;width:100% !important;margin:0 !important;padding:0 !important;}',
      FORM_SELECTOR + ' .form-line[data-tc-hh-yk="individual"] .form-single-column{display:grid !important;grid-template-columns:repeat(2,minmax(0,1fr)) !important;gap:10px !important;width:100% !important;margin:0 !important;padding:0 !important;border:0 !important;border-radius:0 !important;background:transparent !important;overflow:visible !important;}',
      FORM_SELECTOR + ' .form-line[data-tc-hh-yk="individual"] .form-checkbox-item{display:flex !important;align-items:flex-start !important;float:none !important;clear:none !important;width:100% !important;min-height:58px !important;margin:0 !important;padding:13px 14px !important;border:1px solid #e1d8cf !important;border-radius:10px !important;background:#fff !important;box-shadow:0 2px 8px rgba(46,42,37,.03) !important;box-sizing:border-box !important;transition:border-color .15s ease,background-color .15s ease,box-shadow .15s ease !important;}',
      FORM_SELECTOR + ' .form-line[data-tc-hh-yk="individual"] .form-checkbox-item:hover{border-color:#ccb68d !important;background:#fffdfa !important;box-shadow:0 4px 12px rgba(46,42,37,.05) !important;}',
      FORM_SELECTOR + ' .form-line[data-tc-hh-yk="individual"] .form-checkbox-item:has(input:checked){border-color:#b58a45 !important;background:#fbf5ed !important;box-shadow:0 0 0 2px rgba(181,138,69,.10) !important;}',

      /* checkbox alignment */
      FORM_SELECTOR + ' .form-line[data-tc-hh-yk] .form-checkbox-item input[type="checkbox"]{flex:0 0 18px !important;width:18px !important;height:18px !important;margin:2px 10px 0 0 !important;accent-color:#a71938 !important;}',
      FORM_SELECTOR + ' .form-line[data-tc-hh-yk] .form-checkbox-item label{display:block !important;flex:1 1 auto !important;min-width:0 !important;margin:0 !important;color:#302b28 !important;font-size:14px !important;line-height:1.4 !important;font-weight:600 !important;cursor:pointer !important;}',
      FORM_SELECTOR + ' .form-line[data-tc-hh-yk] .form-checkbox-item:has(input:checked) label{color:#5f1427 !important;font-weight:700 !important;}',
      FORM_SELECTOR + ' .form-line[data-tc-hh-yk] .clearfix{display:none !important;}',

      FORM_SELECTOR + ' #hh-step-3{clear:both !important;display:block !important;width:100% !important;margin-top:26px !important;}',

      '@media screen and (max-width:720px){',
      FORM_SELECTOR + ' .form-line[data-tc-hh-yk="heading"]{margin-top:12px !important;padding-top:12px !important;}',
      FORM_SELECTOR + ' .form-line[data-tc-hh-yk="heading"]::before{width:44px !important;margin-bottom:10px !important;}',
      FORM_SELECTOR + ' .form-line[data-tc-hh-yk="heading"] h3{font-size:28px !important;}',
      FORM_SELECTOR + ' .form-line[data-tc-hh-yk="individual"] .form-single-column{grid-template-columns:minmax(0,1fr) !important;gap:8px !important;}',
      FORM_SELECTOR + ' .form-line[data-tc-hh-yk="individual"] .form-checkbox-item{min-height:52px !important;padding:11px 12px !important;}',
      FORM_SELECTOR + ' #hh-step-3{margin-top:22px !important;}',
      '}'
    ].join('');

    document.head.appendChild(style);
  }

  function stabilizeHeading(row) {
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
      setImportant(table, 'border-top', '0');
      setImportant(table, 'border-left', '0');
      setImportant(table, 'border-bottom', '0');
      setImportant(table, 'border-radius', '0');
      setImportant(table, 'background', 'transparent');
      setImportant(table, 'box-shadow', 'none');
      setImportant(table, 'overflow', 'visible');
      setImportant(table, 'width', '100%');
    }

    if (cell) {
      setImportant(cell, 'padding', '0');
      setImportant(cell, 'border', '0');
      setImportant(cell, 'border-left', '0');
      setImportant(cell, 'box-shadow', 'none');
    }

    if (h3) {
      setImportant(h3, 'margin', '0 0 4px');
      setImportant(h3, 'color', '#7e1029');
      setImportant(h3, 'font-weight', '500');
    }

    if (date) {
      setImportant(date, 'display', 'block');
      setImportant(date, 'margin', '0');
      setImportant(date, 'padding', '0');
      setImportant(date, 'border', '0');
      setImportant(date, 'background', 'transparent');
      setImportant(date, 'color', '#7d6d58');
      setImportant(date, 'text-transform', 'none');
    }
  }

  function showIndividualRow(row) {
    clearHiddenState(row);
    setImportant(row, 'display', 'block');
    setImportant(row, 'visibility', 'visible');
    setImportant(row, 'opacity', '1');
    setImportant(row, 'float', 'none');
    setImportant(row, 'clear', 'both');
    setImportant(row, 'width', '100%');

    row.querySelectorAll('.form-input, .form-input-wide').forEach(function (el) {
      clearHiddenState(el);
      setImportant(el, 'display', 'block');
      setImportant(el, 'width', '100%');
    });

    var column = row.querySelector('.form-single-column');
    if (column) {
      clearHiddenState(column);
      setImportant(column, 'display', 'grid');
      setImportant(column, 'width', '100%');
    }

    row.querySelectorAll('.form-checkbox-item').forEach(function (item) {
      clearHiddenState(item);
      setImportant(item, 'display', 'flex');
      setImportant(item, 'visibility', 'visible');
      setImportant(item, 'opacity', '1');
      setImportant(item, 'float', 'none');
      setImportant(item, 'width', '100%');
    });
  }

  function markRows() {
    var form = document.querySelector(FORM_SELECTOR);
    if (!form) return;

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
        setImportant(row, 'float', 'none');
        setImportant(row, 'clear', 'both');
        setImportant(row, 'width', '100%');
        stabilizeHeading(row);
        return;
      }

      if (isYomKippurAllRow(row)) {
        row.setAttribute('data-tc-hh-yk', 'all');
        row.removeAttribute('data-tc-hh-rosh-closed');
        clearHiddenState(row);
        setImportant(row, 'display', 'block');
        setImportant(row, 'float', 'none');
        setImportant(row, 'clear', 'both');
        setImportant(row, 'width', '100%');
        return;
      }

      if (isYomKippurIndividualRow(row)) {
        row.setAttribute('data-tc-hh-yk', 'individual');
        row.removeAttribute('data-tc-hh-rosh-closed');
        showIndividualRow(row);
      }
    });
  }

  function apply() {
    installStyle();
    markRows();
  }

  function start() {
    apply();

    if (document.documentElement.getAttribute('data-tc-hh-v11-observer') === 'true') return;
    document.documentElement.setAttribute('data-tc-hh-v11-observer', 'true');

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
