(function () {
  var path = window.location.pathname || '';
  var search = window.location.search || '';
  var isReservationsPage =
    /\/aid\/7431739(?:\/|$)/.test(path) ||
    /(?:^|[?&])aid=7431739(?:&|$)/.test(search);

  if (!isReservationsPage) return;

  var V9_SRC = 'https://cdn.jsdelivr.net/gh/rabbi-rgb/jewishtricities-web-assets@24b82b7dd566c97ccf8149da818e318fb99bf89a/reservations-v9.js';
  var FORM = '#formContainer form[id="7431739"]';

  function installPolish() {
    if (document.getElementById('tc-hh-v10-polish')) return;

    var style = document.createElement('style');
    style.id = 'tc-hh-v10-polish';
    style.textContent = [
      /* Yom Kippur heading: clean and integrated, with a short gold accent. */
      FORM + ' .form-line[data-tc-hh-yk="heading"]{margin:14px 0 2px !important;padding:0 !important;}',
      FORM + ' .form-line[data-tc-hh-yk="heading"]::before{' +
        'content:"" !important;display:block !important;width:54px !important;height:3px !important;' +
        'margin:0 0 12px 2px !important;border-radius:999px !important;' +
        'background:linear-gradient(90deg,#b58a45 0%,#d4b878 100%) !important;' +
      '}',
      FORM + ' .form-line[data-tc-hh-yk="heading"] table{border-top:0 !important;}',
      FORM + ' .form-line[data-tc-hh-yk="heading"] table td{padding:0 2px 12px !important;}',
      FORM + ' .form-line[data-tc-hh-yk="heading"] h3{font-size:29px !important;letter-spacing:-.25px !important;}',
      FORM + ' .form-line[data-tc-hh-yk="heading"] h3 + p{margin-top:4px !important;color:#8f7447 !important;font-size:13px !important;letter-spacing:.15px !important;}',

      /* Small section labels. */
      FORM + ' .form-line[data-tc-hh-yk="all"] .form-label-left,' +
      FORM + ' .form-line[data-tc-hh-yk="individual"] .form-label-left{' +
        'display:block !important;width:100% !important;margin:0 !important;padding:0 0 8px !important;' +
        'color:#5e5852 !important;font-size:10.5px !important;line-height:1.25 !important;font-weight:800 !important;' +
        'letter-spacing:1.25px !important;text-transform:uppercase !important;' +
      '}',

      /* All-services choice: one featured, compact option. */
      FORM + ' .form-line[data-tc-hh-yk="all"]{' +
        'display:block !important;margin:0 0 18px !important;padding:0 !important;background:transparent !important;' +
        'border:0 !important;box-shadow:none !important;' +
      '}',
      FORM + ' .form-line[data-tc-hh-yk="all"] :is(.form-input,.form-input-wide,.form-single-column){' +
        'display:block !important;width:100% !important;margin:0 !important;padding:0 !important;background:transparent !important;border:0 !important;' +
      '}',
      FORM + ' .form-line[data-tc-hh-yk="all"] .form-checkbox-item{' +
        'display:flex !important;align-items:center !important;width:100% !important;min-height:54px !important;' +
        'margin:0 !important;padding:12px 15px !important;border:1px solid #dccbad !important;border-left:4px solid #b58a45 !important;' +
        'border-radius:10px !important;background:linear-gradient(90deg,#fbf8f3 0%,#fff 72%) !important;' +
        'box-shadow:0 3px 12px rgba(46,42,37,.035) !important;box-sizing:border-box !important;' +
      '}',
      FORM + ' .form-line[data-tc-hh-yk="all"] .form-checkbox-item:has(input:checked){' +
        'border-color:#b58a45 !important;border-left-color:#a71938 !important;background:#f8efe8 !important;' +
        'box-shadow:0 0 0 2px rgba(181,138,69,.10) !important;' +
      '}',

      /* Individual services: separate cards instead of one spreadsheet-like block. */
      FORM + ' .form-line[data-tc-hh-yk="individual"]{margin:0 0 18px !important;padding:0 !important;}',
      FORM + ' .form-line[data-tc-hh-yk="individual"] .form-single-column{' +
        'display:grid !important;grid-template-columns:repeat(2,minmax(0,1fr)) !important;gap:10px !important;' +
        'width:100% !important;margin:0 !important;padding:0 !important;border:0 !important;border-radius:0 !important;' +
        'background:transparent !important;overflow:visible !important;' +
      '}',
      FORM + ' .form-line[data-tc-hh-yk="individual"] .form-checkbox-item{' +
        'display:flex !important;align-items:flex-start !important;width:100% !important;min-height:58px !important;' +
        'margin:0 !important;padding:13px 14px !important;border:1px solid #e1d8cf !important;border-radius:10px !important;' +
        'background:#fff !important;box-shadow:0 2px 8px rgba(46,42,37,.035) !important;box-sizing:border-box !important;' +
        'transition:border-color .15s ease,background-color .15s ease,box-shadow .15s ease,transform .15s ease !important;' +
      '}',
      FORM + ' .form-line[data-tc-hh-yk="individual"] .form-checkbox-item:nth-child(odd){border-right:1px solid #e1d8cf !important;}',
      FORM + ' .form-line[data-tc-hh-yk="individual"] .form-checkbox-item:last-child:nth-child(odd){grid-column:auto !important;border-right:1px solid #e1d8cf !important;border-bottom:1px solid #e1d8cf !important;}',
      FORM + ' .form-line[data-tc-hh-yk="individual"] .form-checkbox-item:last-child:nth-child(even){border-bottom:1px solid #e1d8cf !important;}',
      '@media (hover:hover){' +
        FORM + ' .form-line[data-tc-hh-yk="individual"] .form-checkbox-item:hover{' +
          'border-color:#cdb78f !important;background:#fffdfa !important;box-shadow:0 5px 14px rgba(46,42,37,.055) !important;transform:translateY(-1px) !important;' +
        '}' +
      '}',
      FORM + ' .form-line[data-tc-hh-yk="individual"] .form-checkbox-item:has(input:checked){' +
        'border-color:#b58a45 !important;background:#fbf5ed !important;box-shadow:0 0 0 2px rgba(181,138,69,.10) !important;' +
      '}',

      /* Checkbox + text alignment. */
      FORM + ' .form-line[data-tc-hh-yk] .form-checkbox-item input[type="checkbox"]{' +
        'flex:0 0 18px !important;width:18px !important;height:18px !important;margin:2px 10px 0 0 !important;accent-color:#a71938 !important;' +
      '}',
      FORM + ' .form-line[data-tc-hh-yk] .form-checkbox-item label{' +
        'display:block !important;flex:1 1 auto !important;min-width:0 !important;margin:0 !important;' +
        'color:#302b28 !important;font-size:13.5px !important;line-height:1.4 !important;font-weight:600 !important;' +
      '}',
      FORM + ' .form-line[data-tc-hh-yk] .form-checkbox-item:has(input:checked) label{font-weight:700 !important;color:#5f1427 !important;}',

      /* Give Step 3 a little breathing room after services. */
      FORM + ' #hh-step-3{margin-top:27px !important;}',

      '@media screen and (max-width:720px){',
        FORM + ' .form-line[data-tc-hh-yk="heading"]{margin-top:12px !important;}',
        FORM + ' .form-line[data-tc-hh-yk="heading"]::before{width:46px !important;height:3px !important;margin-bottom:10px !important;}',
        FORM + ' .form-line[data-tc-hh-yk="heading"] table td{padding:0 0 9px !important;}',
        FORM + ' .form-line[data-tc-hh-yk="heading"] h3{font-size:26px !important;}',
        FORM + ' .form-line[data-tc-hh-yk="individual"] .form-single-column{grid-template-columns:minmax(0,1fr) !important;gap:8px !important;}',
        FORM + ' .form-line[data-tc-hh-yk="individual"] .form-checkbox-item{min-height:52px !important;padding:11px 12px !important;}',
        FORM + ' .form-line[data-tc-hh-yk="individual"] .form-checkbox-item:last-child:nth-child(odd){grid-column:auto !important;}',
        FORM + ' #hh-step-3{margin-top:23px !important;}',
      '}',

      '@media (prefers-reduced-motion:reduce){' +
        FORM + ' .form-line[data-tc-hh-yk="individual"] .form-checkbox-item{transition:none !important;}' +
      '}'
    ].join('');

    document.head.appendChild(style);
  }

  function loadV9() {
    if (document.getElementById('tc-hh-v9-loader')) {
      installPolish();
      return;
    }

    var script = document.createElement('script');
    script.id = 'tc-hh-v9-loader';
    script.src = V9_SRC;
    script.defer = true;
    script.onload = installPolish;
    document.head.appendChild(script);
  }

  installPolish();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadV9, { once: true });
  } else {
    loadV9();
  }
})();
