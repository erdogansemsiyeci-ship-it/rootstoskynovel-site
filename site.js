(function () {
  var cfg = window.SITE_CONFIG || { links: {} };

  // Outbound links: fill from config, hide the ones that are empty.
  document.querySelectorAll('[data-link]').forEach(function (a) {
    var url = (cfg.links || {})[a.getAttribute('data-link')];
    if (url) { a.href = url; a.target = '_blank'; a.rel = 'noopener'; }
    else { a.hidden = true; }
  });

  // Image fallbacks: if the cover or portrait file is missing, show the placeholder.
  document.querySelectorAll('[data-fallback]').forEach(function (box) {
    var img = box.querySelector('img');
    if (!img) return;
    var fail = function () { box.classList.add('no-img'); };
    if (img.complete && img.naturalWidth === 0) fail();
    img.addEventListener('error', fail);
  });

  // Goodreads reviews: the widget is only mounted once at least one review exists.
  // The flag lives in rts_site_flags (public read) and is refreshed by a Hermes job;
  // before that a designed empty state holds the column.
  (function () {
    var card = document.getElementById('gr-reviews-card');
    var sb = cfg.supabase || {};
    if (!card || !cfg.reviewsWidgetUrl || !sb.url || !sb.key) return;
    fetch(sb.url + '/rest/v1/rts_site_flags?key=eq.reviews_live&select=value', {
      headers: { apikey: sb.key, Authorization: 'Bearer ' + sb.key }
    })
      .then(function (r) { return r.json(); })
      .then(function (rows) {
        if (!rows || !rows[0] || rows[0].value !== 'true') return;
        var f = document.createElement('iframe');
        f.src = cfg.reviewsWidgetUrl;
        f.title = 'Goodreads reviews for Roots to Sky';
        f.loading = 'lazy';
        f.width = 565;
        f.height = 420;
        f.setAttribute('frameborder', '0');
        f.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox');
        card.innerHTML = '';
        card.appendChild(f);
        // the widget brings its own "Write a review" action; hide the duplicate CTA
        var cta = document.getElementById('rev-cta');
        if (cta) cta.hidden = true;
      })
      .catch(function () { /* offline or blocked: keep the empty state */ });
  })();

  var MESSAGES = {
    early: {
      ok: ['ok', 'Thank you. Your request is in — I will write to this address about the early copy.'],
      dup: ['ok', 'You have already asked for an early copy. Nothing more to do.'],
      check_email: ['ok', 'Almost there. Check your inbox and click the link to confirm.'],
      full: ['err', 'The 100 early copies have gone. Join the newsletter below and you will hear from me on release day.'],
      invalid: ['err', 'Please enter a valid email address and tick the box to agree.'],
      error: ['err', 'Something went wrong. Please try again in a moment.'],
      unconfigured: ['err', 'This form is not connected yet.']
    },
    news: {
      ok: ['ok', 'Thank you. You are on the list.'],
      dup: ['ok', 'You are already on the list.'],
      check_email: ['ok', 'Thank you. Check your inbox to confirm your subscription.'],
      full: ['ok', 'Thank you. You are on the list.'],
      invalid: ['err', 'Please enter a valid email address and tick the box to agree.'],
      error: ['err', 'Something went wrong. Please try again in a moment.'],
      unconfigured: ['err', 'This form is not connected yet.']
    }
  };

  // Direct Supabase insert (project decision 8 Oct 2026: no external service is exposed).
  // rts_arc.kaynak only accepts booksirens | kisisel | diaspora | bookstagram | youtube.
  var TABLES = {
    early: { table: 'rts_arc', kaynak: 'kisisel' },
    news: { table: 'rts_subscribers', kaynak: 'site' }
  };

  function postSupabase(kind, email, source) {
    var sb = cfg.supabase || {};
    if (!sb.url || !sb.key) return Promise.reject(new Error('supabase yok'));
    var t = TABLES[kind];
    var body = kind === 'early'
      ? { ad: '', eposta: email, kaynak: t.kaynak, notlar: 'site formu | kaynak: ' + source + ' | consent: true' }
      : { eposta: email, kaynak: t.kaynak };
    return fetch(sb.url + '/rest/v1/' + t.table, {
      method: 'POST',
      headers: {
        apikey: sb.key,
        Authorization: 'Bearer ' + sb.key,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal'
      },
      body: JSON.stringify(body)
    }).then(function (r) {
      if (r.status === 201 || r.status === 200) return 'ok';
      if (r.status === 409) return 'dup';
      throw new Error('HTTP ' + r.status);
    });
  }

  function postWebhook(url, kind, email, hp, source) {
    return fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email, consent: true, source: source, hp: hp })
    })
      .then(function (r) { return r.json(); })
      .then(function (d) { return (d && d.status) || 'error'; });
  }

  document.querySelectorAll('form[data-form]').forEach(function (form) {
    var kind = form.getAttribute('data-form'); // "early" | "news"
    var msg = form.querySelector('.msg');
    var btn = form.querySelector('button[type=submit]');
    var msgs = MESSAGES[kind];

    function show(key) {
      var m = msgs[key] || msgs.error;
      msg.className = 'msg ' + m[0];
      msg.textContent = m[1];
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = (form.elements.email.value || '').trim().toLowerCase();
      var consent = form.elements.consent.checked;
      var hp = form.elements.hp ? form.elements.hp.value : '';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !consent) { show('invalid'); return; }

      // Honeypot: a bot filled the hidden field. Pretend success, store nothing.
      if (hp) { show('ok'); form.reset(); return; }

      var source = location.hostname + (kind === 'early' ? '/#readers' : '/#newsletter');
      var useSupabase = !!(cfg.supabase && cfg.supabase.url && cfg.supabase.key);
      var url = kind === 'early' ? cfg.earlyCopyUrl : cfg.newsletterUrl;
      if (!useSupabase && !url) { show('unconfigured'); return; }

      btn.disabled = true;
      msg.className = 'msg'; msg.textContent = '';

      var task = useSupabase
        ? postSupabase(kind, email, source)
        : postWebhook(url, kind, email, hp, source);

      task
        .then(function (status) {
          show(status);
          if (status === 'ok' || status === 'check_email') form.reset();
        })
        .catch(function () { show('error'); })
        .then(function () { btn.disabled = false; });
    });
  });
})();
