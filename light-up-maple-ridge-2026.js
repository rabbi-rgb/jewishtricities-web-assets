(function () {
  'use strict';

  var path = window.location.pathname || '';
  var search = window.location.search || '';
  var isRegistrationPage =
    /\/tools\/events\/register(?:_cdo|\.asp)?\/eventid\/24377(?:\/|$)/i.test(path) ||
    /(?:^|[?&])eventid=24377(?:&|$)/i.test(search);
  var isReceiptPath = /\/tools\/events\/register(?:_cdo|\.asp)?\/code\//i.test(path);
  var isReceipt = false;

  if (!isRegistrationPage && !isReceiptPath) return;

  if (isRegistrationPage) document.documentElement.classList.add('tc-lightup-2026');

  function ensureStyles() {
    var id = 'tc-light-up-2026-audit-style';
    if (document.getElementById(id)) return;
    var link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/gh/rabbi-rgb/jewishtricities-web-assets@73a442ad9a27e8154c6d07f0e53030d7387ac3e0/light-up-2026.css';
    (document.body || document.head || document.documentElement).appendChild(link);
  }

  var state = window.__tcLightUpMapleRidge2026 || {
    amount: 0,
    choice: '0',
    donationOptedIn: false,
    donationInitialized: false,
    listenersAttached: false,
    maintenanceTimer: null,
    observer: null,
    scheduled: false,
    writingNative: false
  };
  window.__tcLightUpMapleRidge2026 = state;

  var donationChoices = {
    '0': 0,
    '36': 36,
    '72': 72,
    '180': 180,
    '360': 360,
    '540': 540,
    '1800': 1800
  };

  function text(element, value) {
    if (element && element.textContent !== value) element.textContent = value;
  }

  function parseAmount(value) {
    var parsed = Number(String(value || '').replace(/[^0-9.-]/g, ''));
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
  }

  function buildHero() {
    if (document.getElementById('tc-lightup-hero')) return;

    var form = document.getElementById('RegisterSinglePage');
    if (!form || !form.parentNode) return;

    var hero = document.createElement('section');
    hero.id = 'tc-lightup-hero';
    hero.setAttribute('aria-labelledby', 'tc-lightup-title');
    hero.innerHTML = [
      '<div class="tc-lightup-hero__inner">',
        '<div class="tc-lightup-hero__content">',
          '<p class="tc-lightup-eyebrow">A Chanukah celebration for the whole community</p>',
          '<h1 class="tc-lightup-title" id="tc-lightup-title"><em>Light Up</em> Maple Ridge</h1>',
          '<p class="tc-lightup-tagline">Come celebrate Chanukah together! Join us for a free outdoor evening with a giant menorah lighting, fire juggling, doughnuts, hot chocolate, music and fun for the kids.</p>',
          '<ul class="tc-lightup-facts">',
            '<li>Thursday, December 10</li>',
            '<li>5:30–6:30 PM</li>',
            '<li>Memorial Peace Park, Maple Ridge</li>',
            '<li>Free admission · All are welcome</li>',
          '</ul>',
          '<ul class="tc-lightup-highlights">',
            '<li>Giant LED menorah lighting</li>',
            '<li>Doughnuts &amp; hot chocolate</li>',
            '<li>Fire-juggling show</li>',
            '<li>Prizes for kids &amp; upbeat music</li>',
          '</ul>',
          '<p class="tc-lightup-warm-note">This celebration is entirely outdoors. Please dress warmly.</p>',
          '<a class="tc-lightup-cta" href="#RegisterSinglePage">Reserve your place</a>',
        '</div>',
        '<div class="tc-lightup-art" aria-hidden="true">',
          '<img class="tc-lightup-menorah" src="https://cdn.jsdelivr.net/gh/rabbi-rgb/jewishtricities-web-assets@a1fab701965c843b97213093452e7ad2365ad6c9/light-up-2026-menorah.png" alt="">',
          '<div class="tc-lightup-art__note">Share the light</div>',
        '</div>',
      '</div>'
    ].join('');

    form.parentNode.insertBefore(hero, form);
  }

  function stepHeading(number, label, optional) {
    var heading = document.createElement('span');
    heading.className = 'tc-lightup-step-heading';
    heading.innerHTML =
      '<span class="tc-lightup-step-number" aria-hidden="true">' + number + '</span>' +
      '<span>' + label + '</span>' +
      (optional ? '<span class="tc-lightup-step-optional">(Optional)</span>' : '');
    return heading;
  }

  function setStepTitle(element, number, label, optional) {
    if (!element) return;
    var existing = element.querySelector('.tc-lightup-step-heading');
    if (existing) return;
    element.textContent = '';
    element.appendChild(stepHeading(number, label, optional));
  }

  function buildFormIntro() {
    var performances = document.getElementById('Performances');
    if (!performances || document.getElementById('tc-lightup-form-intro')) return;
    var intro = document.createElement('div');
    intro.id = 'tc-lightup-form-intro';
    intro.className = 'tc-lightup-form-intro';
    intro.innerHTML =
      '<div><p class="tc-lightup-form-intro__kicker">Reserve your place</p>' +
      '<h2>Join us for Chanukah!</h2></div><span class="tc-lightup-free-badge">Free</span>';
    performances.insertBefore(intro, performances.firstChild);
  }

  function buildReceiptHero() {
    if (document.getElementById('tc-lightup-receipt-hero')) return;

    var form = document.getElementById('RegisterSinglePage');
    if (!form || !form.parentNode) return;

    var hero = document.createElement('section');
    hero.id = 'tc-lightup-receipt-hero';
    hero.setAttribute('aria-labelledby', 'tc-lightup-receipt-title');
    hero.innerHTML = [
      '<div class="tc-lightup-receipt-hero__check" aria-hidden="true">✓</div>',
      '<div>',
        '<p class="tc-lightup-eyebrow">Reservation confirmed</p>',
        '<h1 id="tc-lightup-receipt-title">You’re registered!</h1>',
        '<p>Light Up Maple Ridge · Thursday, December 10 · 5:30–6:30 PM</p>',
      '</div>'
    ].join('');

    form.parentNode.insertBefore(hero, form);
  }

  function polishGuestControls() {
    var select = document.getElementById('performance_32925_priceCategory');
    if (!select) return;

    buildFormIntro();
    var performances = document.getElementById('Performances');
    setStepTitle(performances && performances.querySelector(':scope > .title'), '1', "Who's coming?", false);

    Array.prototype.forEach.call(select.options, function (option) {
      if (option.value === '12255' || /^Adult(?:\s+-|$)/i.test(option.textContent || '')) {
        text(option, 'Adult');
      } else if (option.value === '12320' || /^Child(?:\s+-|$)/i.test(option.textContent || '')) {
        text(option, 'Child');
      }
    });

    select.setAttribute('aria-label', 'Guest type');
    var selectLabel = select.parentNode && select.parentNode.querySelector('div');
    text(selectLabel, 'Guest type');

    var quantity = document.getElementById('performance_32925_quantityOfAttendees');
    if (quantity) {
      quantity.setAttribute('aria-label', 'Number of guests');
      var quantityLabel = quantity.parentNode && quantity.parentNode.querySelector('div');
      text(quantityLabel, 'Number of guests');
    }

    var reservationCount = document.querySelectorAll('#performance_32925_reservations .reservation').length;
    text(
      document.querySelector('#performance_32925_addAttendeeButton span'),
      reservationCount ? 'Add guests' : 'Add reservation'
    );
    text(
      document.querySelector('#performance_32925_additionalsToggle .toggle_message'),
      '+ Add more people'
    );

    text(
      document.querySelector('#Performances > .regular'),
      'Let us know how many people to expect. Choose Adult or Child, select the quantity, then add the reservation.'
    );

    Array.prototype.forEach.call(document.querySelectorAll('#RegisterSinglePage .regular'), function (element) {
      if (/sponsorship selection before submitting your registration/i.test(element.textContent || '')) {
        text(element, 'We’ll use these details to send your confirmation and any important event updates.');
      }
    });
  }

  function polishReserverFields() {
    var section = document.getElementById('ReserversInformation');
    var title = document.getElementById('ReserversTitle');
    if (!section || !title) return;

    title.value = '';
    var titleRow = title.closest('.clearfix.small_vertical_padding');
    if (titleRow) {
      titleRow.classList.add('tc-lightup-hidden-title');
      titleRow.setAttribute('aria-hidden', 'true');
    }

    var sectionTitle = section.querySelector('.title.large');
    setStepTitle(sectionTitle, '2', 'Your details', false);
    var sectionCopy = document.getElementById('tc-lightup-details-copy');
    if (!sectionCopy && sectionTitle) {
      sectionCopy = document.createElement('p');
      sectionCopy.id = 'tc-lightup-details-copy';
      sectionCopy.className = 'tc-lightup-section-copy';
      sectionCopy.textContent = 'Where should we send your confirmation?';
      sectionTitle.insertAdjacentElement('afterend', sectionCopy);
    }

    function fieldRow(id) {
      var field = document.getElementById(id);
      return field && field.closest('.clearfix.small_vertical_padding');
    }

    function relabel(id, labelText, ariaLabel) {
      var field = document.getElementById(id);
      var row = fieldRow(id);
      if (row) text(row.querySelector('.label'), labelText);
      if (field && ariaLabel) field.setAttribute('aria-label', ariaLabel);
    }

    var firstNameRow = fieldRow('ReserversFirstName');
    var phoneRow = fieldRow('ReserversPhone');
    var addressRow = fieldRow('ReserversBillingAddress1');
    var container = firstNameRow && firstNameRow.parentNode;
    if (!container || !addressRow) return;

    relabel('ReserversBillingAddress1', 'Street address', 'Street address');
    relabel('ReserversBillingPostCode', 'Postal code', 'Postal code');

    var addressIntro = document.getElementById('tc-lightup-address-intro');
    if (!addressIntro) {
      addressIntro = document.createElement('div');
      addressIntro.id = 'tc-lightup-address-intro';
      addressIntro.className = 'tc-lightup-address-intro';
    }
    var addressCopy = 'Please share your home address. It stays with your registration and also supports secure processing if you choose to donate.';
    var addressHeading = addressIntro.querySelector('h3');
    var addressParagraph = addressIntro.querySelector('p');
    if (!addressHeading || !addressParagraph || addressHeading.textContent !== 'Address' || addressParagraph.textContent !== addressCopy) {
      addressIntro.innerHTML = '<h3>Address</h3><p>' + addressCopy + '</p>';
    }

    if (phoneRow) container.insertBefore(phoneRow, addressRow);
    container.insertBefore(addressIntro, addressRow);

    var country = document.getElementById('ReserversCountry');
    if (country && !country.dataset.tcCountryListener) {
      country.dataset.tcCountryListener = 'true';
      country.addEventListener('change', function () {
        if (!country.dataset.tcSettingCountry) country.dataset.tcCountryTouched = 'true';
      });
    }
    if (country && !country.dataset.tcCountryTouched) {
      var canada = Array.prototype.find.call(country.options, function (option) {
        return /^Canada$/i.test((option.textContent || '').trim());
      });
      if (canada && (!country.value || /please choose/i.test(country.options[country.selectedIndex].textContent || ''))) {
        country.dataset.tcSettingCountry = 'true';
        canada.selected = true;
        country.value = canada.value;
        country.dispatchEvent(new Event('input', { bubbles: true }));
        country.dispatchEvent(new Event('change', { bubbles: true }));
        delete country.dataset.tcSettingCountry;
      }
    }
  }

  function polishConsentAndSurvey() {
    var optIn = document.getElementById('ReserversOptIn');
    if (optIn && !optIn.dataset.tcConsentTouched) {
      if (optIn.checked) optIn.checked = false;
      optIn.defaultChecked = false;
      optIn.dataset.tcConsentInitialized = 'true';
    }

    var survey = document.getElementById('AdditionalInformation');
    if (survey) {
      survey.hidden = true;
      survey.setAttribute('aria-hidden', 'true');
      survey.classList.add('tc-lightup-survey-hidden');
    }
  }

  function writeNativeDonation(input, amount) {
    if (!input) return;
    var value = Number(amount).toFixed(2);
    if (input.value === value) return;

    state.writingNative = true;
    input.value = value;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
    state.writingNative = false;
  }

  function buildDonationCard() {
    var card = document.getElementById('tc-lightup-donation');
    if (card) return card;

    card = document.createElement('section');
    card.id = 'tc-lightup-donation';
    card.setAttribute('aria-labelledby', 'tc-lightup-donation-title');
    card.innerHTML = [
      '<h2 id="tc-lightup-donation-title" class="tc-lightup-step-heading">',
        '<span class="tc-lightup-step-number" aria-hidden="true">3</span>',
        '<span>Support the celebration</span>',
        '<span class="tc-lightup-step-optional">(Optional)</span>',
      '</h2>',
      '<p class="tc-lightup-donation__intro">Your RSVP is completely free. If you’d like to help make this community celebration possible, we’d be so grateful. No donation is needed to attend.</p>',
      '<label class="tc-lightup-donation-toggle" for="tc-lightup-donation-opt-in">',
        '<input id="tc-lightup-donation-opt-in" type="checkbox" aria-controls="tc-lightup-donation-options">',
        '<span>Add an optional gift</span><span class="tc-lightup-donation-toggle__arrow" aria-hidden="true">⌄</span>',
      '</label>',
      '<div id="tc-lightup-donation-options" hidden>',
        '<div class="tc-lightup-donation__choices">',
          '<label class="tc-lightup-donation__choice"><input type="radio" name="tc_lightup_donation" value="0" checked><span><strong>No donation</strong><small>$0</small></span></label>',
          '<label class="tc-lightup-donation__choice"><input type="radio" name="tc_lightup_donation" value="36"><span><strong>Candle Sponsor</strong><small>$36</small></span></label>',
          '<label class="tc-lightup-donation__choice"><input type="radio" name="tc_lightup_donation" value="72"><span><strong>Celebration Supporter</strong><small>$72</small></span></label>',
          '<label class="tc-lightup-donation__choice"><input type="radio" name="tc_lightup_donation" value="180"><span><strong>Festival Friend</strong><small>$180</small></span></label>',
          '<label class="tc-lightup-donation__choice"><input type="radio" name="tc_lightup_donation" value="360"><span><strong>Community Leader</strong><small>$360</small></span></label>',
          '<label class="tc-lightup-donation__choice"><input type="radio" name="tc_lightup_donation" value="540"><span><strong>Light Bearer</strong><small>$540</small></span></label>',
          '<label class="tc-lightup-donation__choice"><input type="radio" name="tc_lightup_donation" value="1800"><span><strong>Event Sponsor</strong><small>$1,800</small></span></label>',
          '<label class="tc-lightup-donation__choice"><input type="radio" name="tc_lightup_donation" value="other"><span><strong>Other amount</strong><small>Choose an amount</small></span></label>',
        '</div>',
        '<div id="tc-lightup-custom-donation" hidden>',
          '<label for="tc-lightup-custom-amount">Other amount (CAD)</label>',
          '<div class="tc-lightup-amount-input"><span aria-hidden="true">$</span><input id="tc-lightup-custom-amount" type="number" min="0" step="0.01" inputmode="decimal" aria-label="Other donation amount in Canadian dollars"></div>',
          '<p id="tc-lightup-donation-error" hidden>Please enter an amount of $0 or more.</p>',
        '</div>',
      '</div>'
    ].join('');
    return card;
  }

  function placeDonationAndSurvey(card) {
    var secondary = document.getElementById('SecondaryFormItems');
    var summary = document.getElementById('Summary');
    if (!secondary || !summary) return;

    var contact = document.getElementById('ReserversInformation');
    if (card.parentNode !== secondary) secondary.insertBefore(card, summary);
    if (contact && contact.nextElementSibling !== card) contact.insertAdjacentElement('afterend', card);

    var survey = document.getElementById('AdditionalInformation');
    if (survey) {
      survey.hidden = true;
      survey.setAttribute('aria-hidden', 'true');
      survey.classList.add('tc-lightup-survey-hidden');
    }
  }

  function polishSummary() {
    var summary = document.getElementById('Summary');
    if (!summary) return;
    var count = document.querySelectorAll('#performance_32925_reservations .reservation').length;
    summary.classList.toggle('tc-lightup-summary-empty', count === 0);
    if (!count || summary.querySelector('.tc-lightup-summary-header')) return;
    var header = document.createElement('div');
    header.className = 'tc-lightup-summary-header';
    header.innerHTML = '<h2>Your reservation</h2><span class="tc-lightup-free-badge">Free</span>';
    summary.insertBefore(header, summary.firstChild);
  }

  function updateDonationCard(card, nativeInput) {
    card.querySelector('#tc-lightup-donation-opt-in').checked = state.donationOptedIn;
    card.querySelector('#tc-lightup-donation-options').hidden = !state.donationOptedIn;

    var selected = card.querySelector('input[name="tc_lightup_donation"][value="' + state.choice + '"]');
    if (!selected) {
      state.choice = 'other';
      selected = card.querySelector('input[name="tc_lightup_donation"][value="other"]');
    }
    if (selected) selected.checked = true;

    var customWrap = card.querySelector('#tc-lightup-custom-donation');
    var customInput = card.querySelector('#tc-lightup-custom-amount');
    customWrap.hidden = !state.donationOptedIn || state.choice !== 'other';
    if (state.choice === 'other' && document.activeElement !== customInput) {
      customInput.value = Number(state.amount).toFixed(2);
    }

    writeNativeDonation(nativeInput, state.amount);
  }

  function initDonation() {
    var nativeInput = document.getElementById('TotalDonation');
    var summary = document.getElementById('Summary');
    if (!nativeInput || !summary) return;

    if (!state.donationInitialized) {
      var existing = parseAmount(nativeInput.value);
      state.amount = existing;
      state.donationOptedIn = existing > 0;
      state.choice = Object.prototype.hasOwnProperty.call(donationChoices, String(existing)) ? String(existing) : 'other';
      state.donationInitialized = true;
    }

    var nativeRow = nativeInput.closest('.large_top_margin.medium_bottom_margin');
    if (nativeRow) nativeRow.classList.add('tc-lightup-native-donation-row');

    var card = buildDonationCard();
    placeDonationAndSurvey(card);
    card.hidden = !document.querySelector('#performance_32925_reservations .reservation');
    updateDonationCard(card, nativeInput);
  }

  function handleChange(event) {
    var target = event.target;
    if (!target) return;
    if (target.id === 'ReserversOptIn') {
      target.dataset.tcConsentTouched = 'true';
      return;
    }
    if (target.id === 'tc-lightup-donation-opt-in') {
      state.donationOptedIn = target.checked;
      var card = document.getElementById('tc-lightup-donation');
      if (!state.donationOptedIn) {
        state.choice = '0';
        state.amount = 0;
        var customInput = card.querySelector('#tc-lightup-custom-amount');
        customInput.value = '';
        customInput.setCustomValidity('');
        card.querySelector('#tc-lightup-donation-error').hidden = true;
      }
      updateDonationCard(card, document.getElementById('TotalDonation'));
      return;
    }
    if (!state.donationOptedIn || !target.matches('#tc-lightup-donation input[name="tc_lightup_donation"]')) return;

    state.choice = target.value;
    if (state.choice === 'other') {
      var custom = document.getElementById('tc-lightup-custom-amount');
      if (custom) {
        custom.value = Number(state.amount).toFixed(2);
        custom.setCustomValidity('');
        document.getElementById('tc-lightup-donation-error').hidden = true;
        document.getElementById('tc-lightup-custom-donation').hidden = false;
        custom.focus();
      }
    } else {
      state.amount = donationChoices[state.choice];
    }
    updateDonationCard(document.getElementById('tc-lightup-donation'), document.getElementById('TotalDonation'));
  }

  function handleInput(event) {
    var target = event.target;
    if (!state.donationOptedIn || !target || target.id !== 'tc-lightup-custom-amount') return;

    state.choice = 'other';
    var valid = target.value !== '' && Number.isFinite(Number(target.value)) && Number(target.value) >= 0;
    target.setCustomValidity(valid ? '' : 'Please enter an amount of $0 or more.');
    document.getElementById('tc-lightup-donation-error').hidden = valid;
    if (valid) {
      state.amount = Number(target.value);
      writeNativeDonation(document.getElementById('TotalDonation'), state.amount);
    }
  }

  function handleSubmitClick(event) {
    if (!event.target.closest('#SubmitButton') || state.choice !== 'other') return;
    var custom = document.getElementById('tc-lightup-custom-amount');
    if (custom && !custom.checkValidity()) {
      event.preventDefault();
      event.stopImmediatePropagation();
      custom.reportValidity();
    }
  }

  function attachListeners() {
    if (state.listenersAttached) return;
    state.listenersAttached = true;
    document.addEventListener('change', handleChange);
    document.addEventListener('input', handleInput);
    document.addEventListener('click', handleSubmitClick, true);
  }

  function observeDynamicForm() {
    if (state.observer) {
      state.observer.observe(document.body || document.documentElement, { childList: true, subtree: true });
    }
  }

  function run() {
    state.scheduled = false;
    if (state.observer) state.observer.disconnect();
    try {
      if (isReceipt) {
        buildReceiptHero();
        return;
      }
      buildHero();
      polishGuestControls();
      polishReserverFields();
      polishConsentAndSurvey();
      initDonation();
      polishSummary();
    } finally {
      observeDynamicForm();
    }
  }

  function schedule() {
    if (state.scheduled) return;
    state.scheduled = true;
    window.setTimeout(run, 60);
  }

  function start() {
    ensureStyles();
    if (isReceiptPath) {
      var pageText = (document.title || '') + ' ' + ((document.body && document.body.textContent) || '');
      if (!/Light Up Maple Ridge/i.test(pageText)) return;
      isReceipt = true;
      document.documentElement.classList.add('tc-lightup-2026', 'tc-lightup-receipt');
      run();
      return;
    }

    attachListeners();
    run();

    if (!state.observer) {
      state.observer = new MutationObserver(schedule);
      observeDynamicForm();
    }
    if (!state.maintenanceTimer) state.maintenanceTimer = window.setInterval(run, 800);

    window.setTimeout(run, 400);
    window.setTimeout(run, 1200);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
})();
