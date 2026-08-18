(function(){var d=document;if(d.getElementById("tc-hh-reservations-ux-v2"))return;var l=d.createElement("link");l.id="tc-hh-reservations-ux-v2";l.rel="stylesheet";l.href="https://cdn.jsdelivr.net/gh/rabbi-rgb/jewishtricities-web-assets@deb768620b2c206e23c7c82d986bf7f2d701664d/reservations-v2.css";d.head.appendChild(l);}());
(function () {
  var path = window.location.pathname || "";
  var search = window.location.search || "";
  var isReservationsPage =
    /\/aid\/7431739(?:\/|$)/.test(path) ||
    /(?:^|[?&])aid=7431739(?:&|$)/.test(search);
  if (!isReservationsPage) return;

  var formSelector = '#formContainer form[id="7431739"]';

  function addMobileTitle() {
    var inner = document.querySelector("#hh-form-intro .hh-bridge-inner");
    if (!inner) return false;
    if (document.getElementById("tc-hh-mobile-page-title")) return true;

    var title = document.createElement("div");
    title.id = "tc-hh-mobile-page-title";
    title.setAttribute("aria-label", "High Holiday Reservations");
    title.innerHTML = "<span>High Holidays</span><strong>Reservations</strong>";
    inner.insertBefore(title, inner.firstChild);
    return true;
  }

  function labelMobileMenu() {
    var control = document.getElementById("mobile-menu-expand");
    if (!control) return false;

    if (!control.querySelector(".tc-hh-menu-label")) {
      var label = document.createElement("span");
      label.className = "tc-hh-menu-label";
      label.textContent = "High Holidays menu";
      control.insertBefore(label, control.firstChild);
    }

    control.setAttribute("role", "button");
    control.setAttribute("tabindex", "0");
    control.setAttribute("aria-label", "Open or close the High Holidays menu");

    if (!control.hasAttribute("data-tc-hh-keyboard")) {
      control.setAttribute("data-tc-hh-keyboard", "true");
      control.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          control.click();
        }
      });
    }
    return true;
  }

  function tidyServiceText(text, time) {
    var name = text.replace(time, "");
    name = name.replace(/\s*[•–—-]\s*/g, " · ");
    name = name.replace(/\s*,\s*/g, " · ");
    name = name.replace(/(?:\s*·\s*)+/g, " · ");
    name = name.replace(/^\s*·\s*|\s*·\s*$/g, "");
    return name.trim();
  }

  function enhanceServiceLabels() {
    var cards = document.querySelectorAll(
      formSelector + " :is(#id_51, #id_44, #id_39) .form-checkbox-item"
    );
    if (!cards.length) return false;

    cards.forEach(function (card) {
      var input = card.querySelector('input[type="checkbox"]');
      var textNode = card.querySelector("label > span");
      if (!input || !textNode) return;

      if (!textNode.hasAttribute("data-tc-hh-service")) {
        var original = textNode.textContent.trim();
        var match = original.match(/\b\d{1,2}:\d{2}\s*(?:AM|PM)\b/i);
        textNode.textContent = "";
        textNode.className = "tc-hh-service-label";
        textNode.setAttribute("data-tc-hh-service", "true");

        if (match) {
          var time = document.createElement("span");
          time.className = "tc-hh-service-time";
          time.textContent = match[0].toUpperCase();

          var name = document.createElement("span");
          name.className = "tc-hh-service-name";
          name.textContent = tidyServiceText(original, match[0]);

          textNode.appendChild(time);
          textNode.appendChild(name);
        } else {
          textNode.classList.add("tc-hh-service-only");
          var onlyName = document.createElement("span");
          onlyName.className = "tc-hh-service-name";
          onlyName.textContent = original;
          textNode.appendChild(onlyName);
        }
      }
    });
    return true;
  }

  function syncSelectedCards() {
    var controls = document.querySelectorAll(
      formSelector + ' .form-checkbox-item input[type="checkbox"],' +
      formSelector + ' .form-radio-item input[type="radio"]'
    );
    if (!controls.length) return false;

    controls.forEach(function (input) {
      var card = input.closest(".form-checkbox-item, .form-radio-item");
      if (card) card.classList.toggle("is-selected", input.checked);

      if (!input.hasAttribute("data-tc-hh-selected-listener")) {
        input.setAttribute("data-tc-hh-selected-listener", "true");
        input.addEventListener("change", syncSelectedCards);
      }
    });
    return true;
  }

  function updateProgress() {
    var progress = document.getElementById("tc-hh-form-progress");
    if (!progress) return;

    var current = 1;
    var marker = window.pageYOffset + 150;
    for (var i = 1; i <= 4; i += 1) {
      var step = document.getElementById("hh-step-" + i);
      if (step && step.getBoundingClientRect().top + window.pageYOffset <= marker) {
        current = i;
      }
    }

    progress.querySelectorAll("a[data-step]").forEach(function (link) {
      var stepNumber = Number(link.getAttribute("data-step"));
      link.classList.toggle("is-active", stepNumber === current);
      link.classList.toggle("is-complete", stepNumber < current);
      if (stepNumber === current) {
        link.setAttribute("aria-current", "step");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  function addProgress() {
    var firstStep = document.getElementById("hh-step-1");
    if (!firstStep) return false;
    if (document.getElementById("tc-hh-form-progress")) {
      updateProgress();
      return true;
    }

    var firstLine = firstStep.closest(".form-line");
    if (!firstLine || !firstLine.parentNode) return false;

    var line = document.createElement("li");
    line.className = "form-line tc-hh-progress-line";

    var progress = document.createElement("nav");
    progress.id = "tc-hh-form-progress";
    progress.setAttribute("aria-label", "Reservation progress");

    var labels = ["Guests", "Services", "Contact", "Support"];
    labels.forEach(function (label, index) {
      var stepNumber = index + 1;
      var link = document.createElement("a");
      link.href = "#hh-step-" + stepNumber;
      link.setAttribute("data-step", String(stepNumber));
      link.innerHTML =
        "<span>" + stepNumber + "</span><strong>" + label + "</strong>";
      link.addEventListener("click", function (event) {
        var target = document.getElementById("hh-step-" + stepNumber);
        if (!target) return;
        event.preventDefault();
        var reduced = window.matchMedia &&
          window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({
          top: window.pageYOffset + target.getBoundingClientRect().top - 68,
          behavior: reduced ? "auto" : "smooth"
        });
      });
      progress.appendChild(link);
    });

    line.appendChild(progress);
    firstLine.parentNode.insertBefore(line, firstLine);

    if (!document.documentElement.hasAttribute("data-tc-hh-progress-listener")) {
      document.documentElement.setAttribute("data-tc-hh-progress-listener", "true");
      window.addEventListener("scroll", updateProgress, { passive: true });
      window.addEventListener("resize", updateProgress);
    }
    updateProgress();
    return true;
  }

  function defaultEmailOptInOff() {
    var optIn = document.querySelector(formSelector + ' input[name="optin"]');
    if (!optIn) return false;
    if (!optIn.hasAttribute("data-tc-hh-optin-default")) {
      optIn.checked = false;
      optIn.defaultChecked = false;
      optIn.removeAttribute("checked");
      optIn.setAttribute("data-tc-hh-optin-default", "off");
      optIn.dispatchEvent(new Event("change", { bubbles: true }));
    }
    return true;
  }

  function stylePrivacyButton() {
    var pill = document.getElementById("echo-cmp-pill");
    if (!pill) return false;

    var mobile = window.matchMedia &&
      window.matchMedia("(max-width: 600px)").matches;
    var base = "rgba(126, 16, 41, 0.96)";
    var hover = "rgba(167, 25, 56, 0.98)";

    pill.style.setProperty("background", base, "important");
    pill.style.setProperty("border", "1px solid rgba(255,255,255,0.24)", "important");
    pill.style.setProperty("box-shadow", "0 5px 16px rgba(74,35,43,0.20)", "important");
    pill.style.setProperty("bottom", "10px", "important");
    pill.style.setProperty("left", "10px", "important");

    var spans = pill.querySelectorAll("span");
    if (mobile) {
      pill.style.setProperty("width", "42px", "important");
      pill.style.setProperty("height", "42px", "important");
      pill.style.setProperty("padding", "0", "important");
      pill.style.setProperty("gap", "0", "important");
      pill.style.setProperty("justify-content", "center", "important");
      spans.forEach(function (span) {
        span.style.setProperty("display", "none", "important");
      });
    } else {
      pill.style.removeProperty("width");
      pill.style.removeProperty("height");
      pill.style.setProperty("padding", "7px 12px", "important");
      pill.style.setProperty("gap", "6px", "important");
      pill.style.removeProperty("justify-content");
      spans.forEach(function (span) {
        span.style.removeProperty("display");
      });
    }

    if (!pill.hasAttribute("data-tc-hh-burgundy")) {
      pill.setAttribute("data-tc-hh-burgundy", "true");
      pill.addEventListener("mouseenter", function () {
        pill.style.setProperty("background", hover, "important");
      });
      pill.addEventListener("mouseleave", function () {
        pill.style.setProperty("background", base, "important");
      });
    }
    return true;
  }


  function enhanceDayHeaders() {
    var matched = 0;
    document.querySelectorAll(formSelector + " h3").forEach(function (heading) {
      var text = (heading.textContent || "").trim();
      if (!/^(?:Rosh Hashanah, Day [12]|Yom Kippur)$/.test(text)) return;
      heading.classList.add("tc-hh-day-title");
      var table = heading.closest("table");
      if (table) table.classList.add("tc-hh-day-card");
      var date = heading.nextElementSibling;
      if (date && date.tagName === "P") date.classList.add("tc-hh-day-date");
      matched += 1;
    });
    return matched > 0;
  }

  function applyEnhancements() {
    return {
      title: addMobileTitle(),
      dayHeaders: enhanceDayHeaders(),
      services: enhanceServiceLabels(),
      selected: syncSelectedCards(),
      progress: addProgress(),
      optIn: defaultEmailOptInOff(),
      privacy: stylePrivacyButton()
    };
  }

  function begin() {
    applyEnhancements();

    var observer = new MutationObserver(function () {
      applyEnhancements();
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });

    window.setTimeout(function () {
      observer.disconnect();
      applyEnhancements();
    }, 15000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", begin, { once: true });
  } else {
    begin();
  }
})();
