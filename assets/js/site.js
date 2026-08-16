/* ==========================================================================
   Cath Crochets
   Everything here is an enhancement. With JavaScript switched off the site
   still reads, navigates and submits.
   ========================================================================== */

(function () {
  'use strict';

  var CFG = window.SITE || {};
  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ------------------------------------------------------------------
     Mobile navigation
     ------------------------------------------------------------------ */

  function initNav() {
    var toggle = $('.nav-toggle');
    var panel  = $('.header__nav');
    if (!toggle || !panel) return;

    function close() {
      toggle.setAttribute('aria-expanded', 'false');
      panel.classList.remove('is-open');
    }

    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      panel.classList.toggle('is-open', !open);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        close();
        toggle.focus();
      }
    });

    document.addEventListener('click', function (e) {
      if (toggle.getAttribute('aria-expanded') !== 'true') return;
      if (!panel.contains(e.target) && !toggle.contains(e.target)) close();
    });

    // Reset when we cross back to the desktop layout
    var mq = window.matchMedia('(min-width: 62.5rem)');
    var onChange = function (e) { if (e.matches) close(); };
    if (mq.addEventListener) mq.addEventListener('change', onChange);
    else if (mq.addListener) mq.addListener(onChange);
  }

  /* ------------------------------------------------------------------
     Header hairline once you scroll
     ------------------------------------------------------------------ */

  function initHeader() {
    var header = $('.header');
    if (!header) return;
    var ticking = false;
    function update() {
      header.classList.toggle('is-stuck', window.scrollY > 8);
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }

  /* ------------------------------------------------------------------
     Gentle reveal on scroll
     ------------------------------------------------------------------ */

  function initReveal() {
    var items = $$('.reveal');
    if (!items.length) return;

    if (!('IntersectionObserver' in window) ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      items.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.style.transitionDelay = (entry.target.dataset.delay || 0) + 'ms';
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });

    items.forEach(function (el) { io.observe(el); });
  }

  /* ------------------------------------------------------------------
     Marquee, duplicated so the loop has no seam
     ------------------------------------------------------------------ */

  function initMarquee() {
    $$('.marquee__track').forEach(function (track) {
      var list = track.firstElementChild;
      if (!list) return;
      var clone = list.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      track.appendChild(clone);
    });
  }

  /* ------------------------------------------------------------------
     Shop filters
     ------------------------------------------------------------------ */

  function initFilters() {
    var chips = $$('.chip[data-filter]');
    var items = $$('[data-cat]');
    if (!chips.length || !items.length) return;

    var live = $('#filter-status');

    function apply(want) {
      var shown = 0;
      items.forEach(function (el) {
        var hit = want === 'all' || el.dataset.cat === want;
        el.hidden = !hit;
        if (hit) shown++;
      });
      chips.forEach(function (c) {
        c.setAttribute('aria-pressed', String(c.dataset.filter === want));
      });
      if (live) {
        live.textContent = shown + (shown === 1 ? ' item' : ' items') + ' showing';
      }
      // Keep the address bar in step so a filter can be linked to
      try {
        var url = new URL(window.location.href);
        if (want === 'all') url.searchParams.delete('show');
        else url.searchParams.set('show', want);
        window.history.replaceState({}, '', url);
      } catch (err) { /* older browsers, no harm done */ }
    }

    chips.forEach(function (chip) {
      chip.addEventListener('click', function () { apply(chip.dataset.filter); });
    });

    try {
      var pre = new URL(window.location.href).searchParams.get('show');
      if (pre && chips.some(function (c) { return c.dataset.filter === pre; })) apply(pre);
    } catch (err) { /* ignore */ }
  }

  /* ------------------------------------------------------------------
     Custom order form, show only the measurements that matter
     ------------------------------------------------------------------ */

  function initMeasurements() {
    var picker = $('#order-type');
    var blocks = $$('.measure-block');
    if (!picker || !blocks.length) return;

    var empty = $('.measure-empty');

    function sync() {
      var val = picker.value;
      var any = false;
      blocks.forEach(function (b) {
        var on = val !== '' && (b.dataset.forType || '').split(' ').indexOf(val) > -1;
        if (on) any = true;
        b.classList.toggle('is-on', on);
        // Stop hidden fields being sent or validated
        $$('input, select, textarea', b).forEach(function (f) {
          f.disabled = !on;
        });
      });
      if (empty) empty.hidden = any;
    }

    picker.addEventListener('change', sync);
    sync();
  }

  /* ------------------------------------------------------------------
     Character counter on the brief
     ------------------------------------------------------------------ */

  function initCounter() {
    $$('[data-counter]').forEach(function (field) {
      var out = $('#' + field.dataset.counter);
      if (!out) return;
      var min = parseInt(field.getAttribute('minlength') || '0', 10);
      function tick() {
        var n = field.value.trim().length;
        if (n === 0) out.textContent = '';
        else if (n < min) out.textContent = (min - n) + ' more characters, so I have enough to go on';
        else out.textContent = 'That is plenty, thank you';
      }
      field.addEventListener('input', tick);
      tick();
    });
  }

  /* ------------------------------------------------------------------
     Forms
     ------------------------------------------------------------------ */

  function labelFor(field, form) {
    if (field.dataset.label) return field.dataset.label;
    var id = field.id;
    if (id) {
      var lab = form.querySelector('label[for="' + id + '"]');
      if (lab) return lab.textContent.replace(/\s+/g, ' ').replace(/\s*optional\s*$/i, '').trim();
    }
    var set = field.closest('fieldset');
    var legend = set && set.querySelector('legend');
    return (legend ? legend.textContent.trim() + ': ' : '') + (field.name || 'Field');
  }

  function collect(form) {
    var lines = [];
    var groups = {};

    $$('input, select, textarea', form).forEach(function (field) {
      if (field.disabled || !field.name) return;
      if (field.name === '_gotcha' || field.type === 'hidden') return;

      if (field.type === 'checkbox') {
        if (!field.checked) return;
        var key = field.name.replace(/\[\]$/, '');
        var text = field.dataset.label ||
          (field.closest('label') ? field.closest('label').textContent.replace(/\s+/g, ' ').trim() : field.value);
        (groups[key] = groups[key] || []).push(text);
        return;
      }
      if (field.type === 'radio') {
        if (!field.checked) return;
        lines.push([labelFor(field, form), field.value]);
        return;
      }
      var v = (field.value || '').trim();
      if (!v) return;
      // Send the wording Cath will recognise, not the internal value
      if (field.tagName === 'SELECT' && field.selectedIndex > -1) {
        v = field.options[field.selectedIndex].text.trim();
      }
      lines.push([labelFor(field, form), v]);
    });

    Object.keys(groups).forEach(function (k) {
      var nice = k.replace(/-/g, ' ');
      nice = nice.charAt(0).toUpperCase() + nice.slice(1);
      lines.push([nice, groups[k].join(', ')]);
    });

    return lines;
  }

  function toText(lines) {
    return lines.map(function (l) { return l[0] + ': ' + l[1]; }).join('\n');
  }

  function setStatus(box, kind, html) {
    if (!box) return;
    box.className = 'form-status is-visible form-status--' + kind;
    box.innerHTML = html;
    box.setAttribute('role', kind === 'bad' ? 'alert' : 'status');
  }

  function initForms() {
    $$('form[data-form]').forEach(function (form) {
      var kind    = form.dataset.form;                       // 'order' or 'list'
      var status  = $('.form-status', form);
      var button  = form.querySelector('button[type="submit"]');
      var idKey   = kind === 'list' ? 'mailingListFormId' : 'customOrderFormId';
      var subject = form.dataset.subject || 'Message from the website';

      form.addEventListener('submit', function (e) {
        if (!form.checkValidity()) return;              // let the browser complain first
        e.preventDefault();

        // Read this at submit time, so the settings file can be edited without
        // worrying about the order things load in.
        var formId = ((window.SITE && window.SITE[idKey]) || '').trim();
        var lines  = collect(form);

        /* No Formspree ID yet, so hand it to the customer's mail app.
           Nothing is lost, it just takes one more tap. */
        if (!formId) {
          var body = toText(lines) +
            '\n\n(Sent from cathcrochets.co.uk. If your email app opened, ' +
            'just press send and it will reach Cath.)';
          window.location.href = 'mailto:' + (CFG.email || '') +
            '?subject=' + encodeURIComponent(subject) +
            '&body=' + encodeURIComponent(body);
          setStatus(status, 'ok',
            '<strong>Nearly there.</strong> Your email app should have opened with everything ' +
            'filled in. Press send and it will land with Cath. If nothing opened, email ' +
            '<a href="mailto:' + CFG.email + '">' + CFG.email + '</a> and paste your details in.');
          return;
        }

        var payload = new FormData(form);
        payload.delete('_gotcha');
        payload.append('_subject', subject);
        payload.append('Summary', toText(lines));

        var original = button ? button.innerHTML : '';
        if (button) { button.disabled = true; button.innerHTML = 'Sending, one moment'; }
        setStatus(status, 'busy', 'Sending your message.');

        fetch('https://formspree.io/f/' + formId, {
          method: 'POST',
          body: payload,
          headers: { Accept: 'application/json' }
        }).then(function (res) {
          if (!res.ok) throw new Error('Formspree said no');
          form.reset();
          $$('.measure-block', form).forEach(function (b) { b.classList.remove('is-on'); });
          initMeasurements();
          setStatus(status, 'ok', kind === 'list'
            ? '<strong>You are on the list.</strong> I will only email when there is something new, and never more than once a month.'
            : '<strong>Got it, thank you.</strong> I read these myself so it may take a day or two, and I will come back to you with a price and a rough date. Check your junk folder if you have not heard by the end of the week.');
        }).catch(function () {
          setStatus(status, 'bad',
            '<strong>That did not go through.</strong> Sorry. Please email ' +
            '<a href="mailto:' + CFG.email + '?subject=' + encodeURIComponent(subject) + '">' +
            CFG.email + '</a> instead and it will get to Cath just the same.');
        }).then(function () {
          if (button) { button.disabled = false; button.innerHTML = original; }
        });
      });
    });
  }

  /* ------------------------------------------------------------------
     Fill in anything that comes from config
     ------------------------------------------------------------------ */

  function initConfigBits() {
    $$('[data-site]').forEach(function (el) {
      var val = CFG[el.dataset.site];
      if (!val) return;
      if (el.tagName === 'A') {
        el.href = el.dataset.site === 'email' ? 'mailto:' + val : val;
        if (el.dataset.fill === 'text') el.textContent = val;
      } else {
        el.textContent = val;
      }
    });

    var year = $('#year');
    if (year) year.textContent = new Date().getFullYear();
  }

  /* ------------------------------------------------------------------
     Carry the shop category into the custom order form
     ------------------------------------------------------------------ */

  function initPrefill() {
    var picker = $('#order-type');
    if (!picker) return;
    try {
      var want = new URL(window.location.href).searchParams.get('about');
      if (!want) return;
      var match = Array.prototype.some.call(picker.options, function (o) { return o.value === want; });
      if (!match) return;
      picker.value = want;
      picker.dispatchEvent(new Event('change'));
    } catch (err) { /* ignore */ }
  }

  /* ------------------------------------------------------------------ */

  function boot() {
    initNav();
    initHeader();
    initReveal();
    initMarquee();
    initFilters();
    initMeasurements();
    initPrefill();
    initCounter();
    initForms();
    initConfigBits();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
