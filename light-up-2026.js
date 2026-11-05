(function () {
  'use strict';

  var path = window.location.pathname || '';
  var search = window.location.search || '';
  var isLightUpEvent =
    /\/tools\/events\/register(?:_cdo|\.asp)?\/eventid\/24229(?:\/|$)/i.test(path) ||
    /(?:^|[?&])eventid=24229(?:&|$)/i.test(search);

  if (!isLightUpEvent) return;

  document.documentElement.classList.add('tc-lightup-2026');

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

  function groupPriceOptions() {
    var select = document.getElementById('performance_32755_priceCategory');
    if (!select || select.getAttribute('data-tc-lightup-grouped') === 'true') return;

    var options = Array.prototype.slice.call(select.querySelectorAll('option'));
    if (options.length < 4) return;

    var guests = document.createElement('optgroup');
    guests.label = 'Free admission';
    var sponsors = document.createElement('optgroup');
    sponsors.label = 'Optional sponsorship';

    options.slice(1).forEach(function (option) {
      if (/^(Adult|Child)\s+-/i.test(option.textContent || '')) {
        guests.appendChild(option);
      } else {
        sponsors.appendChild(option);
      }
    });

    select.appendChild(guests);
    select.appendChild(sponsors);
    select.setAttribute('data-tc-lightup-grouped', 'true');
  }

  function init() {
    buildHero();
    groupPriceOptions();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
