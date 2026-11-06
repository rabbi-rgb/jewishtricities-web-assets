(function () {
  'use strict';

  var path = window.location.pathname || '';
  var search = window.location.search || '';
  var isLightUpEvent =
    /\/tools\/events\/register(?:_cdo|\.asp)?\/eventid\/24229(?:\/|$)/i.test(path) ||
    /(?:^|[?&])eventid=24229(?:&|$)/i.test(search);

  if (!isLightUpEvent) return;

  document.documentElement.classList.add('tc-lightup-2026');

  var state = window.__tcLightUp2026 || {
    amount: 0,
    choice: '0',
    donationInitialized: false,
    listenersAttached: false,
    observer: null,
    scheduled: false,
    writingNative: false
  };
  window.__tcLightUp2026 = state;

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
          '<h1 class="tc-lightup-title" id="tc-lightup-title"><em>Light Up</em> the Tri-Cities</h1>',
          '<p class="tc-lightup-tagline">An evening of light, warmth and community spirit at Spirit Square. Free admission; advance registration is appreciated.</p>',
          '<ul class="tc-lightup-facts">',
            '<li>Tuesday, December 29</li>',
            '<li>5:30–6:30 PM</li>',
            '<li>Spirit Square, Coquitlam</li>',
          '</ul>',
          '<ul class="tc-lightup-highlights">',
            '<li>Giant LED menorah lighting</li>',
            '<li>Doughnuts &amp; hot chocolate</li>',
            '<li>Fire-juggling show</li>',
            '<li>Prizes for kids &amp; upbeat music</li>',
          '</ul>',
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

  function polishGuestControls() {
    var select = document.getElementById('performance_32755_priceCategory');
    if (!select) return;

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

    var quantity = document.getElementById('performance_32755_quantityOfAttendees');
    if (quantity) {
      quantity.setAttribute('aria-label', 'Number of guests');
      var quantityLabel = quantity.parentNode && quantity.parentNode.querySelector('div');
      text(quantityLabel, 'Number of guests');
    }

    text(
      document.querySelector('#Performances > .regular'),
      'Choose the number of adults and children attending. After selecting your guests, you’ll have the option to support the celebration with a donation.'
    );
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
      '<div class="tc-lightup-section-kicker">Optional donation</div>',
      '<h2 id="tc-lightup-donation-title">Would you consider donating?</h2>',
      '<p class="tc-lightup-donation__intro">Your RSVP is free. A gift helps make this community celebration possible.</p>',
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
      '</div>'
    ].join('');
    return card;
  }

  function placeDonationAndSurvey(card) {
    var secondary = document.getElementById('SecondaryFormItems');
    var summary = document.getElementById('Summary');
    if (!secondary || !summary) return;

    if (card.parentNode !== secondary) secondary.insertBefore(card, summary);

    var survey = document.getElementById('AdditionalInformation');
    if (survey) {
      survey.classList.add('tc-lightup-survey');
      if (card.nextElementSibling !== survey) card.insertAdjacentElement('afterend', survey);
    }
  }

  function updateDonationCard(card, nativeInput) {
    var selected = card.querySelector('input[name="tc_lightup_donation"][value="' + state.choice + '"]');
    if (!selected) {
      state.choice = 'other';
      selected = card.querySelector('input[name="tc_lightup_donation"][value="other"]');
    }
    if (selected) selected.checked = true;

    var customWrap = card.querySelector('#tc-lightup-custom-donation');
    var customInput = card.querySelector('#tc-lightup-custom-amount');
    customWrap.hidden = state.choice !== 'other';
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
      state.choice = Object.prototype.hasOwnProperty.call(donationChoices, String(existing)) ? String(existing) : 'other';
      state.donationInitialized = true;
    }

    var nativeRow = nativeInput.closest('.large_top_margin.medium_bottom_margin');
    if (nativeRow) nativeRow.classList.add('tc-lightup-native-donation-row');

    var card = buildDonationCard();
    placeDonationAndSurvey(card);
    card.hidden = !document.querySelector('#performance_32755_reservations .reservation');
    updateDonationCard(card, nativeInput);
  }

  function handleChange(event) {
    var target = event.target;
    if (!target || !target.matches('#tc-lightup-donation input[name="tc_lightup_donation"]')) return;

    state.choice = target.value;
    if (state.choice === 'other') {
      var custom = document.getElementById('tc-lightup-custom-amount');
      if (custom) {
        custom.value = Number(state.amount).toFixed(2);
        custom.setCustomValidity('');
        document.getElementById('tc-lightup-donation-error').hidden = true;
        custom.focus();
      }
    } else {
      state.amount = donationChoices[state.choice];
    }
    schedule();
  }

  function handleInput(event) {
    var target = event.target;
    if (!target || target.id !== 'tc-lightup-custom-amount') return;

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

  function run() {
    state.scheduled = false;
    buildHero();
    polishGuestControls();
    initDonation();
  }

  function schedule() {
    if (state.scheduled) return;
    state.scheduled = true;
    window.setTimeout(run, 60);
  }

  function start() {
    attachListeners();
    run();

    var body = document.getElementById('RegisterBody');
    if (body && !state.observer) {
      state.observer = new MutationObserver(schedule);
      state.observer.observe(body, { childList: true, subtree: true });
    }

    window.setTimeout(run, 400);
    window.setTimeout(run, 1200);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
})();
