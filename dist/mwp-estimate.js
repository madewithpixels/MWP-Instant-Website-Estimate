/*! MWP Instant Website Estimate v3.1.0 | madewithpixels.co.uk | github.com/madewithpixels/MWP-Instant-Website-Estimate */
(function () {
  'use strict';
  if (window.__MWP_ESTIMATE_LOADED__) return;
  window.__MWP_ESTIMATE_LOADED__ = '3.1.0';
  function run() {
/* ---- prefs.js ---- */
/* MWP Assessment — default SETTINGS.
 *
 * These are the defaults shipped in the bundle. A page can override any
 * top-level key by defining window.MWP_PREFS in an inline embed that runs
 * before the bundle, e.g.
 *
 *   <script>window.MWP_PREFS = { startFigure: 750, links: { bookingUrl: '/book', sendAssessmentMode: 'form' } };</script>
 *
 * Overrides are shallow: a key you supply replaces the default for that key
 * entirely (so pass the whole `links` object, not just one property of it).
 */
(function () {
  'use strict';
  var DEFAULTS = {
    behaviour: { requireNext: true, autoAdvanceMs: 550, respectReducedMotion: true, previewOnHover: true, previewOnFocus: true, clearOnBack: true },
    rounding: { minDownTo: 250, maxUpTo: 500 },
    /* Running figure shown once a stage-1 answer is picked, before stage 2 prices the build. */
    startFigure: 500,
    /* Text on the fixed progress bar before the visitor starts (start.js). */
    startLabel: 'Get started',
    /* Screens where Next scrolls the progress bar to the top (next-top.js). */
    scrollOnNext: '(max-width: 991px), (max-height: 800px)',
    graphScale: null /* null = auto per-category ceiling; or {website:8000,brand:900,content:1800,assets:1200,func:3750} */,
    currency: { symbol: '£', locale: 'en-GB' },
    links: { bookingUrl: '#REPLACE_WITH_BOOKING_URL', sendAssessmentMode: 'form' },
    categories: [
      { key: 'website', label: 'Website' },
      { key: 'brand', label: 'Brand' },
      { key: 'content', label: 'Content' },
      { key: 'assets', label: 'Visual Assets' },
      { key: 'func', label: 'Functionality' },
    ],
    /* Content cost by site size. "some" = content exists, we need help refining it;
       "help" = we need help writing it. "everything" costs nothing. */
    contentMatrix: {
      small: { everything: [0, 0], some: [150, 350], help: [350, 700] },
      medium: { everything: [0, 0], some: [350, 500], help: [500, 1000] },
      large: { everything: [0, 0], some: [500, 1000], help: [750, 1500] },
      notsure: { everything: [0, 0], some: [150, 350], help: [350, 700] },
    },
    cmsBands: [
      { upTo: 1, range: [0, 250] },
      { upTo: 2, range: [250, 500] },
      { upTo: 3, range: [500, 750] },
      { upTo: 99, range: [750, 1250] },
    ],
    resultTypePriority: ['complex', 'brand-led', 'content-led', 'asset-led', 'standard'],
    driverCopy: {
      website: 'The size and structure of the site are the main foundation of the estimate.',
      brand: 'There’s an opportunity to build a more coherent visual identity as part of the project.',
      content: 'Some support may be needed to shape the message and page content.',
      assets: 'The project may benefit from creating or sourcing stronger imagery.',
      func: 'Additional forms, ecommerce or integrations can increase scope.',
    },
    /* The summary paragraph at the top of the result screen is built from the answers:
       "<project> (<size>), with <brand>, <content> and <images>, plus <features>. <close>" */
    summary: {
      project: {
        'new-site': 'You’re planning a new website',
        redesign: 'You’re planning a redesign of your existing website',
        improvement: 'You’re planning improvements to your existing website',
        'wider-support': 'You’re looking for help building integrated business tools',
        fallback: 'You’re planning a website',
      },
      size: { small: 'up to five pages', medium: 'around five to fifteen pages', large: 'fifteen pages or more' },
      brand: { established: 'brand guidelines already in place', 'logo-only': 'a logo already in place', 'brand-help': 'brand work still to do' },
      content: { everything: 'content written and approved', some: 'content that needs shaping', help: 'content still to be written' },
      assets: { pro: 'strong imagery', 'some-imagery': 'some existing imagery', little: 'little imagery so far' },
      features: {
        blog: 'a blog',
        portfolio: 'a portfolio',
        services: 'service pages',
        downloads: 'downloads',
        events: 'events',
        testimonials: 'testimonials',
        team: 'team profiles',
        'adv-forms': 'advanced forms',
        booking: 'a booking system',
        crm: 'CRM or email integration',
        ecom: 'an online shop',
        ai: 'AI features',
        bespoke: 'bespoke functionality',
        social: 'a social media campaign',
      },
      closeStandard: 'It’s a clear brief and a sensible place to start.',
      closeBespoke: 'Because it includes some bespoke functionality, a short chat will help us price that part properly.',
    },
    /* The five "Your …" blocks on the result screen. Each paragraph is one <p>.
       content has one version per content answer; func has two routes (features picked or not). */
    blocks: {
      website: {
        h: 'Your website',
        p: [
          'The size of your site will largely be driven by how much content you have or need and the features your site requires.',
          'There’s likely to be room for manoeuvre with the cost we’ve estimated here. A quick phone call would clear it up.',
        ],
      },
      brand: {
        h: 'Your brand',
        p: ['We can help you to design your brand from scratch or support you in developing your brand further, whatever your requirements. We have a long history of helping businesses and charities extend the reach of their brand.'],
      },
      content: {
        h: 'Your content',
        everything: ['If you have content already written and approved for use that will save you time and money.'],
        some: ['If you need help shaping something rough into its final shape, we have lots of experience in doing that.'],
        help: ['If you’re starting from scratch, we often just need some bullet points to begin crafting professionally written content.'],
      },
      assets: {
        h: 'Your images',
        p: [
          'Lack of imagery is often a sticking point for many clients and projects. We have lots of experience at solving that problem.',
          'Whether it’s sourcing stock imagery, creating new images with generative AI, retouching your existing photographs or finding a more abstract and typographic approach that suits your brand, there are lots of options.',
        ],
      },
      func: {
        h: 'Your functionality',
        picked: ['You seem to have firm ideas for the type of features your site needs. That’s a great starting point and it makes an accurate estimate easier to reach.'],
        none: ['We can help you to decide what type of website features would suit your business. Get in touch for a no-pressure, zero-obligation chat.'],
        /* Added to the picked route when any of these features is chosen. {features} becomes their names
           (from summary.features). The estimate covers a full build; off-the-shelf tools can cost far less. */
        offTheShelf: {
          ids: ['adv-forms', 'booking', 'crm', 'ecom', 'ai', 'bespoke'],
          text: 'The estimate for {features} allows for a full custom build. Off-the-shelf tools can often cover this for much less, and we’d happily talk through whether that suits you.',
        },
      },
    },
    /* Optional extra line in "Your website" for people who chose "Improvements to an existing website"
       (empty = none). Webflow sites are the speciality, so wording to be decided. */
    improvementNote: '',
    bespokeNote: 'Your project includes bespoke functionality, so part of the estimate needs a short discovery conversation before it can be priced accurately.',
    /* Progress label while the booking panel is showing. */
    bookLabel: 'Book a free chat',
    stageLabels: ['Your project', 'Your website', 'Your brand', 'Your content', 'Your visual assets', 'Your features', 'Your results'],
    finalGraph: { heading: 'What makes up the cost', sub: 'Each part of your project adds to the range.' },
    /* Side panel while the questions are being answered. */
    stageGraph: { heading: 'Your estimate so far', sub: 'Answer the questions, the price updates as you go' },
  };
  window.MWP_PREFS = Object.assign(DEFAULTS, window.MWP_PREFS || {});
})();

/* ---- engine.js ---- */
/* MWP Assessment — engine.
 * Reads the stage/option markup inside #mwp-adv, tracks answers, computes the
 * estimate, paints the live graph and renders the result panel.
 * Settings come from window.MWP_PREFS (see prefs.js).
 */
(function () {
  'use strict';
  var P = window.MWP_PREFS,
    root = document.getElementById('mwp-adv');
  if (!P || !root) return;
  var $ = function (s, r) {
    return (r || root).querySelector(s);
  };
  var $$ = function (s, r) {
    return [].slice.call((r || root).querySelectorAll(s));
  };
  var T = function (sel, txt) {
    var e = $(sel);
    if (e) e.textContent = txt;
  };
  var NUM = [
    ['data-base-min', 'baseMin'],
    ['data-base-max', 'baseMax'],
    ['data-brand-min', 'brandMin'],
    ['data-brand-max', 'brandMax'],
    ['data-asset-min', 'assetMin'],
    ['data-asset-max', 'assetMax'],
    ['data-content-multiplier', 'contentMultiplier'],
    ['data-cms-count', 'cmsCount'],
    ['data-feature-min', 'featureMin'],
    ['data-feature-max', 'featureMax'],
  ];
  var STAGES = $$('[data-stage]').map(function (el, i) {
    return {
      step: i + 1,
      id: el.getAttribute('data-stage'),
      el: el,
      select: el.getAttribute('data-select') || 'single',
      cat: el.getAttribute('data-cat') || null,
      options: $$('[data-answer-id]', el).map(function (o) {
        var d = {};
        NUM.forEach(function (p) {
          if (o.hasAttribute(p[0])) d[p[1]] = parseFloat(o.getAttribute(p[0]));
        });
        if (o.hasAttribute('data-complexity')) d.complexity = o.getAttribute('data-complexity');
        return { id: o.getAttribute('data-answer-id'), label: o.getAttribute('data-label') || (o.textContent || '').trim(), tags: (o.getAttribute('data-result-tags') || '').split(/\s+/).filter(Boolean), data: d, el: o };
      }),
    };
  });
  function stageById(id) {
    for (var i = 0; i < STAGES.length; i++) if (STAGES[i].id === id) return STAGES[i];
    return null;
  }
  function optData(sid, oid) {
    var st = stageById(sid);
    if (!st) return { data: {}, label: '', tags: [] };
    for (var i = 0; i < st.options.length; i++) if (st.options[i].id === oid) return st.options[i];
    return { data: {}, label: '', tags: [] };
  }
  var LAST = STAGES.length - 1;
  var sel = {};
  STAGES.forEach(function (s) {
    sel[s.id] = s.select === 'multi' ? [] : null;
  });
  var stageIndex = 0;
  function selUpTo(n) {
    var out = {};
    STAGES.forEach(function (s) {
      out[s.id] = s.select === 'multi' ? [] : null;
    });
    for (var i = 0; i <= n && i < STAGES.length; i++) {
      var id = STAGES[i].id;
      out[id] = Array.isArray(sel[id]) ? sel[id].slice() : sel[id];
    }
    return out;
  }
  var money = function (n) {
    return P.currency.symbol + Math.round(n).toLocaleString(P.currency.locale);
  };
  /* "£a–£b", or a single figure when both ends match (e.g. "Not sure" website size) */
  var range = function (a, b) {
    return Math.round(a) === Math.round(b) ? money(a) : money(a) + '–' + money(b);
  };
  var roundMin = function (n) {
    return Math.floor(n / P.rounding.minDownTo) * P.rounding.minDownTo;
  };
  var roundMax = function (n) {
    return Math.ceil(n / P.rounding.maxUpTo) * P.rounding.maxUpTo;
  };
  /* Running figure starts at £0; any stage-1 answer puts P.startFigure (default £500)
     on the Website bar until stage 2 prices the build. Totals from stage 2 on are unaffected. */
  var START = P.startFigure != null ? P.startFigure : 500;
  function compute(s) {
    var cat = { website: [0, 0], brand: [0, 0], content: [0, 0], assets: [0, 0], func: [0, 0] },
      tags = [],
      consult = false;
    if (s.website_size) {
      var b = optData('website_size', s.website_size).data;
      cat.website = [b.baseMin || 0, b.baseMax || 0];
    } else if (s.project_type) {
      cat.website = [START, START];
    }
    if (s.brand_state) {
      var br = optData('brand_state', s.brand_state);
      cat.brand = [br.data.brandMin || 0, br.data.brandMax || 0];
      tags = tags.concat(br.tags || []);
    }
    if (s.website_size && s.content_state) {
      var row = P.contentMatrix[s.website_size] || P.contentMatrix.notsure;
      var c = row[s.content_state] || [0, 0];
      cat.content = [c[0], c[1]];
    }
    if (s.visual_assets) {
      var a = optData('visual_assets', s.visual_assets).data;
      cat.assets = [a.assetMin || 0, a.assetMax || 0];
    }
    var cms = 0,
      fMin = 0,
      fMax = 0;
    (s.features || []).forEach(function (fid) {
      var o = optData('features', fid),
        d = o.data || {};
      if (d.cmsCount) cms += d.cmsCount;
      if (d.featureMin) fMin += d.featureMin;
      if (d.featureMax) fMax += d.featureMax;
      if (d.complexity === 'consultation') consult = true;
      tags = tags.concat(o.tags || []);
    });
    if (cms > 0) {
      var band = P.cmsBands.filter(function (x) {
        return cms <= x.upTo;
      })[0].range;
      fMin += band[0];
      fMax += band[1];
    }
    cat.func = [fMin, fMax];
    var tMin = 0,
      tMax = 0;
    Object.keys(cat).forEach(function (k) {
      tMin += cat[k][0];
      tMax += cat[k][1];
    });
    return { cat: cat, totalMin: tMin, totalMax: tMax, roundedMin: roundMin(tMin), roundedMax: roundMax(tMax), tags: tags, consult: consult, started: !!s.project_type };
  }
  function resultType(s, r) {
    var f = {};
    f.complex = r.consult || ((s.features || []).indexOf('ecom') > -1 && (s.features || []).length > 3);
    f['brand-led'] = s.brand_state === 'brand-help';
    f['content-led'] = s.content_state === 'some' || s.content_state === 'help';
    f['asset-led'] = s.visual_assets === 'little';
    f.standard = true;
    for (var i = 0; i < P.resultTypePriority.length; i++) if (f[P.resultTypePriority[i]]) return P.resultTypePriority[i];
    return 'standard';
  }
  function autoScale() {
    var sc = {};
    P.categories.forEach(function (c) {
      sc[c.key] = 0;
    });
    STAGES.forEach(function (st) {
      st.options.forEach(function (o) {
        var d = o.data || {};
        if ('baseMax' in d) sc.website = Math.max(sc.website, d.baseMax);
        if ('brandMax' in d) sc.brand = Math.max(sc.brand, d.brandMax);
        if ('assetMax' in d) sc.assets = Math.max(sc.assets, d.assetMax);
        if ('featureMax' in d) sc._feat = Math.max(sc._feat || 0, d.featureMax);
      });
    });
    Object.keys(P.contentMatrix).forEach(function (z) {
      Object.keys(P.contentMatrix[z]).forEach(function (k) {
        sc.content = Math.max(sc.content, P.contentMatrix[z][k][1]);
      });
    });
    sc.func = P.cmsBands[P.cmsBands.length - 1].range[1] + (sc._feat || 0);
    delete sc._feat;
    return sc;
  }
  var SCALE = Object.assign(autoScale(), P.graphScale || {});
  var committed = compute(sel);
  function paint(r, pv) {
    P.categories.forEach(function (c) {
      var mid = (r.cat[c.key][0] + r.cat[c.key][1]) / 2,
        scv = SCALE[c.key] || 1;
      var pct = mid > 0 ? Math.max(3, Math.min(100, (mid / scv) * 100)) : 0;
      var fill = $('[data-fill="' + c.key + '"]'),
        val = $('[data-val="' + c.key + '"]');
      if (fill) {
        fill.style.width = pct + '%';
        fill.classList.toggle('is-preview', !!pv);
      }
      if (val) val.textContent = r.cat[c.key][1] ? range(r.cat[c.key][0], r.cat[c.key][1]) : '—';
    });
    var pf = $('[data-mwp="preview-flag"]');
    if (pf) pf.hidden = !pv;
    var fig = $('[data-mwp="est-figure"]'),
      note = $('[data-mwp="est-note"]');
    if (r.totalMax <= 0) {
      if (fig) fig.textContent = money(r.started ? START : 0);
      if (note) note.textContent = '';
      return;
    }
    if (fig) fig.textContent = range(r.roundedMin, r.roundedMax);
    if (note) note.textContent = r.consult ? P.bespokeNote : '';
  }
  var CAT_STAGE = { website: 'website_size', brand: 'brand_state', content: 'content_state', assets: 'visual_assets' };
  function updateChoices(s) {
    P.categories.forEach(function (c) {
      var el = $('[data-choice="' + c.key + '"]');
      if (!el) return;
      if (c.key === 'func') {
        el.textContent = (s.features || [])
          .map(function (id) {
            return optData('features', id).label;
          })
          .filter(Boolean)
          .join(', ');
      } else {
        var id = s[CAT_STAGE[c.key]];
        var txt = id ? optData(CAT_STAGE[c.key], id).label || '' : '';
        /* Before a size is chosen, the Website row shows the stage-1 answer */
        if (!txt && c.key === 'website' && s.project_type) txt = optData('project_type', s.project_type).label || '';
        el.textContent = txt;
      }
    });
  }
  function refreshOptStates() {
    $$('[data-answer-id]').forEach(function (btn) {
      var stEl = btn.closest('[data-stage]');
      if (!stEl) return;
      var st = stageById(stEl.getAttribute('data-stage')),
        id = btn.getAttribute('data-answer-id');
      var on = st.select === 'multi' ? sel[st.id].indexOf(id) > -1 : sel[st.id] === id;
      if (st.select === 'multi') btn.setAttribute('aria-checked', on ? 'true' : 'false');
      else btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      btn.classList.toggle('is-selected', on);
    });
  }
  function commit() {
    committed = compute(selUpTo(stageIndex));
    paint(committed, false);
    updateChoices(selUpTo(stageIndex));
    syncForm();
    updateNav();
  }
  function activate(btn) {
    var stEl = btn.closest('[data-stage]');
    var st = stageById(stEl.getAttribute('data-stage')),
      id = btn.getAttribute('data-answer-id');
    if (st.select === 'multi') {
      var arr = sel[st.id],
        k = arr.indexOf(id);
      if (k > -1) arr.splice(k, 1);
      else arr.push(id);
    } else {
      sel[st.id] = sel[st.id] === id ? null : id;
    }
    refreshOptStates();
    commit();
    if (st.select === 'single' && !P.behaviour.requireNext && sel[st.id]) setTimeout(next, P.behaviour.autoAdvanceMs);
  }
  function preview(btn) {
    if (!(P.behaviour.previewOnHover || P.behaviour.previewOnFocus)) return;
    var stEl = btn.closest('[data-stage]');
    var st = stageById(stEl.getAttribute('data-stage')),
      id = btn.getAttribute('data-answer-id');
    var trial = selUpTo(stageIndex);
    if (st.select === 'multi') {
      var arr = trial[st.id],
        k = arr.indexOf(id);
      if (k > -1) arr.splice(k, 1);
      else arr.push(id);
    } else {
      trial[st.id] = id;
    }
    paint(compute(trial), true);
    updateChoices(trial);
  }
  function unpreview() {
    paint(committed, false);
    updateChoices(selUpTo(stageIndex));
  }
  root.addEventListener('click', function (e) {
    var b = e.target.closest('[data-answer-id]');
    if (b) {
      e.preventDefault();
      activate(b);
    }
  });
  root.addEventListener('mouseover', function (e) {
    var b = e.target.closest('[data-answer-id]');
    if (b) preview(b);
  });
  root.addEventListener('mouseout', function (e) {
    var b = e.target.closest('[data-answer-id]');
    if (b) unpreview();
  });
  root.addEventListener('focusin', function (e) {
    var b = e.target.closest('[data-answer-id]');
    if (b && P.behaviour.previewOnFocus) preview(b);
  });
  root.addEventListener('focusout', function (e) {
    var b = e.target.closest('[data-answer-id]');
    if (b) unpreview();
  });
  root.addEventListener('keydown', function (e) {
    var b = e.target.closest('[data-answer-id]');
    if (!b) return;
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      activate(b);
    }
  });
  var backBtn = $('[data-mwp="back"]'),
    nextBtn = $('[data-mwp="next"]'),
    navEl = $('[data-mwp="nav"]');
  var psteps = $$('[data-mwp="pstep"]'),
    progEl = $('[data-mwp="progress"]');
  /* End of the journey. From the last stage on, the summary box (graph column)
     shows [data-mwp="sum-cta"]: "See assessment" loads the result panel and
     "Book a consultation" loads the booking panel, both in the left column. */
  var sumCta = $('[data-mwp="sum-cta"]'),
    ctaSee = $('[data-mwp="cta-see"]'),
    ctaBook = $('[data-mwp="cta-book"]'),
    resultEl = $('[data-mwp="result"]'),
    bookPanel = $('[data-mwp="book-panel"]');
  var view = 'stage';
  function show(el, on) {
    if (!el) return;
    el.style.display = on ? '' : 'none';
  }
  function setView(v) {
    view = v;
    var last = v === 'stage' && stageIndex === LAST,
      cta = last || v !== 'stage';
    root.classList.toggle('mwp-result-active', v === 'result');
    root.classList.toggle('mwp-book-active', v === 'book');
    root.classList.toggle('mwp-cta-active', cta);
    show(sumCta, cta);
    show(ctaSee, last || v === 'book');
    show(ctaBook, last || v === 'result');
    [
      [resultEl, 'result'],
      [bookPanel, 'book'],
    ].forEach(function (x) {
      if (!x[0]) return;
      x[0].setAttribute('data-active', v === x[1] ? 'true' : 'false');
      show(x[0], v === x[1]);
    });
  }
  function announce(v) {
    var ev;
    try {
      ev = new CustomEvent('mwp:view', { detail: { view: v } });
    } catch (e) {
      ev = document.createEvent('CustomEvent');
      ev.initCustomEvent('mwp:view', false, false, { view: v });
    }
    root.dispatchEvent(ev);
  }
  /* The last stage moves on through the summary box, so its Next buttons go */
  if (STAGES[LAST])
    $$('[data-mwp="next-top"]', STAGES[LAST].el).forEach(function (b) {
      show(b, false);
    });
  function stageComplete(n) {
    var s = STAGES[n];
    if (!s) return true;
    if (s.select === 'multi') return true;
    return !!sel[s.id];
  }
  function updateNav() {
    if (backBtn) backBtn.disabled = stageIndex === 0;
    if (nextBtn) {
      show(nextBtn, stageIndex !== LAST);
      nextBtn.disabled = !stageComplete(stageIndex);
    }
  }
  function showStage(n) {
    stageIndex = n;
    STAGES.forEach(function (s, i) {
      var on = i === n;
      s.el.setAttribute('data-active', on ? 'true' : 'false');
      s.el.style.display = on ? '' : 'none';
    });
    setView('stage');
    if (navEl) navEl.style.display = 'flex';
    psteps.forEach(function (d, i) {
      d.classList.toggle('is-done', i < n);
      d.classList.toggle('is-current', i === n);
    });
    if (progEl) progEl.setAttribute('aria-valuenow', n + 1);
    T('[data-mwp="stage-label"]', 'Step ' + (n + 1) + ' of ' + STAGES.length + ' — ' + P.stageLabels[n]);
    committed = compute(selUpTo(n));
    paint(committed, false);
    updateChoices(selUpTo(n));
    updateNav();
    T('[data-mwp="graph-h"]', P.stageGraph.heading);
    T('[data-mwp="graph-sub"]', P.stageGraph.sub);
  }
  function next() {
    if (!stageComplete(stageIndex)) return;
    if (stageIndex < LAST) showStage(stageIndex + 1);
    else showResult();
  }
  function back() {
    if (stageIndex <= 0) return;
    var n = stageIndex - 1;
    if (P.behaviour.clearOnBack) {
      for (var i = n; i < STAGES.length; i++) {
        var s = STAGES[i];
        sel[s.id] = s.select === 'multi' ? [] : null;
      }
      refreshOptStates();
    }
    showStage(n);
  }
  if (nextBtn)
    nextBtn.addEventListener('click', function (e) {
      if (e && e.preventDefault) e.preventDefault();
      next();
    });
  if (backBtn)
    backBtn.addEventListener('click', function (e) {
      if (e && e.preventDefault) e.preventDefault();
      back();
    });
  function listJoin(a) {
    return a.length < 2 ? a.join('') : a.slice(0, -1).join(', ') + ' and ' + a[a.length - 1];
  }
  /* One paragraph that sums up the answers: "<project> (<size>), with <brand>, <content> and
     <images>, plus <features>. <close>". Wording lives in P.summary. */
  function summaryText(r) {
    var S = P.summary,
      pt = sel.project_type,
      out = S.project[pt] || S.project.fallback,
      size = pt === 'wider-support' ? '' : S.size[sel.website_size];
    if (size) out += ' (' + size + ')';
    var parts = [S.brand[sel.brand_state], S.content[sel.content_state], S.assets[sel.visual_assets]].filter(Boolean);
    if (parts.length) out += ', with ' + listJoin(parts);
    var feats = (sel.features || []).map(function (id) {
      return S.features[id] || optData('features', id).label.toLowerCase();
    });
    if (feats.length) out += ', plus ' + listJoin(feats);
    return out + '. ' + (r.consult ? S.closeBespoke : S.closeStandard);
  }
  /* The five "Your …" blocks. Each takes the class of a Webflow combo that already exists
     (is-brand, is-content, is-assets, is-complex) except Website, which the tool styles itself. */
  var BLOCK_CLASS = { website: 'is-website', brand: 'is-brand', content: 'is-content', assets: 'is-assets', func: 'is-complex' };
  function blocks() {
    var B = P.blocks,
      web = B.website.p.slice();
    if (sel.project_type === 'improvement' && P.improvementNote) web.push(P.improvementNote);
    return [
      ['website', B.website.h, web],
      ['brand', B.brand.h, B.brand.p],
      ['content', B.content.h, B.content[sel.content_state] || B.content.some],
      ['assets', B.assets.h, B.assets.p],
      ['func', B.func.h, funcParas()],
    ];
  }
  /* Functionality paragraphs: the picked or none route, plus the off-the-shelf note when any
     feature that has an off-the-shelf alternative is chosen. */
  function funcParas() {
    var B = P.blocks.func,
      picked = sel.features || [];
    if (!picked.length) return B.none;
    var ots = B.offTheShelf,
      hit = ots
        ? picked.filter(function (id) {
            return ots.ids.indexOf(id) > -1;
          })
        : [];
    if (!hit.length) return B.picked;
    var names = hit.map(function (id) {
      return P.summary.features[id] || optData('features', id).label.toLowerCase();
    });
    return B.picked.concat(ots.text.replace('{features}', listJoin(names)));
  }
  /* v = 'result' (See assessment) or 'book' (Book a consultation). Both fill the
     result panel, so switching between them later needs no recompute. */
  function showResult(v) {
    v = v === 'book' ? 'book' : 'result';
    var r = compute(sel),
      type = resultType(sel, r);
    STAGES.forEach(function (s) {
      s.el.setAttribute('data-active', 'false');
      s.el.style.display = 'none';
    });
    if (navEl) navEl.style.display = 'none';
    setView(v);
    psteps.forEach(function (d, i) {
      d.classList.toggle('is-done', i < STAGES.length);
      d.classList.toggle('is-current', i === STAGES.length);
    });
    if (progEl) progEl.setAttribute('aria-valuenow', STAGES.length + 1);
    T('[data-mwp="stage-label"]', v === 'book' ? P.bookLabel || 'Book a consultation' : P.stageLabels[STAGES.length]);
    T('[data-mwp="shaping"]', summaryText(r));
    T('[data-mwp="big-est"]', range(r.roundedMin, r.roundedMax) + (r.consult ? ' + bespoke functionality to be scoped' : ''));
    committed = r;
    paint(r, false);
    updateChoices(sel);
    T('[data-mwp="graph-h"]', P.finalGraph.heading);
    T('[data-mwp="graph-sub"]', P.finalGraph.sub);
    var dEl = $('[data-mwp="drivers"]');
    if (dEl) {
      dEl.innerHTML = '';
      P.categories.forEach(function (c) {
        if (r.cat[c.key][1] <= 0) return;
        var div = document.createElement('div');
        div.setAttribute('data-mwp', 'driver');
        div.className = 'mwp-driver';
        div.innerHTML = '<strong class="mwp-driver-h"><span data-dot="' + c.key + '"></span> ' + c.label + ' — ' + range(r.cat[c.key][0], r.cat[c.key][1]) + '</strong><div class="mwp-driver-p">' + P.driverCopy[c.key] + '</div>';
        dEl.appendChild(div);
      });
    }
    var rc = $('[data-mwp="recos"]');
    if (rc) {
      rc.innerHTML = '';
      blocks().forEach(function (b) {
        var box = document.createElement('div');
        box.setAttribute('data-mwp', 'reco');
        box.className = 'mwp-reco ' + BLOCK_CLASS[b[0]];
        box.innerHTML = '<h4 class="mwp-reco-h">' + b[1] + '</h4>' + b[2].map(function (t) {
          return '<p class="mwp-reco-p">' + t + '</p>';
        }).join('');
        rc.appendChild(box);
      });
    }
    syncForm(type, r);
    if (v === 'book') focusBook();
    announce(v);
  }
  /* Focus the booking form's first field, except on touch screens where it
     would pop the keyboard up over the panel. */
  function focusBook() {
    if (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) return;
    var f = $('[data-mwp="book"]'),
      i = f && (f.querySelector('[data-mwp="book-first"]') || f.querySelector('input,textarea'));
    if (!i) return;
    try {
      i.focus({ preventScroll: true });
    } catch (e) {
      i.focus();
    }
  }
  if (ctaSee)
    ctaSee.addEventListener('click', function (e) {
      if (e && e.preventDefault) e.preventDefault();
      showResult('result');
    });
  if (ctaBook) {
    ctaBook.setAttribute('href', P.links.bookingUrl);
    ctaBook.addEventListener('click', function (e) {
      if (e && e.preventDefault) e.preventDefault();
      showResult('book');
    });
  }
  var bookForm = $('[data-mwp="book"]');
  if (bookForm) bookForm.hidden = false;
  function syncForm(type, r) {
    r = r || compute(sel);
    type = type || resultType(sel, r);
    var set = function (k, v) {
      var el = $('[data-f="' + k + '"]');
      if (el) el.value = v;
    };
    set('project_type', sel.project_type || '');
    set('brand_state', sel.brand_state || '');
    set('website_size', sel.website_size || '');
    set('content_state', sel.content_state || '');
    set('visual_assets', sel.visual_assets || '');
    set('features', (sel.features || []).join(', '));
    set('estimate_min', r.roundedMin);
    set('estimate_max', r.roundedMax);
    set('result_type', type);
    set('complexity_tags', r.tags.join(', '));
    var sum = $('[data-mwp="shaping"]');
    set('recommendation', sum ? sum.textContent : '');
  }
  var ctaSend = $('[data-mwp="cta-send"]');
  if (ctaSend)
    ctaSend.addEventListener('click', function (e) {
      if (e && e.preventDefault) e.preventDefault();
      var s = $('[data-mwp="send"]');
      if (!s) return;
      s.hidden = !s.hidden;
      if (!s.hidden) {
        var em = $('[data-mwp="email"]');
        if (em) em.focus();
      }
    });
  var sendGo = $('[data-mwp="send-go"]');
  if (sendGo)
    sendGo.addEventListener('click', function () {
      var emel = $('[data-mwp="email"]');
      var em = ((emel && emel.value) || '').trim();
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em)) {
        if (emel) emel.focus();
        return;
      }
      syncForm();
      var f = $('[data-f="email"]');
      if (f) f.value = em;
      var sd = $('[data-mwp="send"]');
      if (sd) sd.hidden = true;
      var ok = $('[data-mwp="send-ok"]');
      if (ok) {
        ok.hidden = false;
        ok.textContent = 'Thanks — we’ll email your assessment to ' + em + '.';
      }
    });
  refreshOptStates();
  paint(committed, false);
  updateChoices(sel);
  var _sf = $('[data-mwp="send"]');
  if (_sf) _sf.hidden = true;
  showStage(0);
})();

/* ---- rating.js ---- */
/* MWP Assessment — star rating.
 * Any [data-mwp="rating"] block containing [data-rate="1..5"] stars and a
 * hidden [data-mwp="rating-value"] input becomes a clickable / keyboard rating.
 */
(function () {
  'use strict';
  var r = document.getElementById('mwp-adv');
  if (!r) return;
  var GOLD = '#f5b301',
    FULL = '★',
    EMPTY = '☆';
  function paint(st, on) {
    st.textContent = on ? FULL : EMPTY;
    st.classList.toggle('is-on', on);
    st.style.color = on ? GOLD : '';
    st.style.webkitTextFillColor = on ? GOLD : '';
  }
  function setRating(wrap, val) {
    [].forEach.call(wrap.querySelectorAll('[data-rate]'), function (st) {
      var v = parseInt(st.getAttribute('data-rate'), 10);
      paint(st, v <= val);
      st.setAttribute('aria-checked', v === val ? 'true' : 'false');
    });
    var h = wrap.querySelector('[data-mwp="rating-value"]');
    if (h) h.value = val;
  }
  [].forEach.call(r.querySelectorAll('[data-mwp="rating"]'), function (w) {
    [].forEach.call(w.querySelectorAll('[data-rate]'), function (st) {
      st.textContent = EMPTY;
    });
  });
  function handle(e) {
    var s = e.target.closest('[data-rate]');
    if (!s) return;
    e.preventDefault();
    var w = s.closest('[data-mwp="rating"]');
    if (w) setRating(w, parseInt(s.getAttribute('data-rate'), 10));
  }
  r.addEventListener('click', handle);
  r.addEventListener('keydown', function (e) {
    if (e.key === ' ' || e.key === 'Enter') handle(e);
  });
})();

/* ---- tips.js ---- */
/* MWP Assessment — "Keeping costs towards the lower end" tips on the result screen.
 * Reads the answers the engine syncs into the hidden [data-f] fields and fills
 * [data-mwp="tips-list"]. Edit TIPS copy here; `when` decides which answers
 * show each tip. Tips render as <p class="iwa-fine-print" data-mwp="tip">.
 */
(function () {
  'use strict';
  var root = document.getElementById('mwp-adv');
  if (!root) return;
  var box = root.querySelector('[data-mwp="tips"]'),
    list = root.querySelector('[data-mwp="tips-list"]'),
    res = root.querySelector('[data-mwp="result"]');
  if (!box || !list || !res) return;
  var TIPS = [
    {
      when: function (a) { return /^(some|help)$/.test(a.content_state); },
      text: 'Supplying final, approved copy before design starts is the single biggest saving. It removes rewriting and extra rounds.',
    },
    {
      when: function (a) { return /^little$/.test(a.visual_assets); },
      text: 'Good photos of your team, premises or products, even from a recent phone, cut down on stock or custom imagery.',
    },
    {
      when: function (a) { return /^(logo-only|brand-help)$/.test(a.brand_state); },
      text: 'Getting your logo files, colours and fonts together up front saves discovery time.',
    },
    {
      when: function (a) { return !!a.features; },
      text: 'Start with the essentials and add extras later. Webflow makes growing the site easy.',
    },
    {
      when: function () { return true; },
      text: 'Quick, consolidated feedback keeps the project on schedule, and fewer revision rounds mean a lower final cost.',
    },
  ];
  function val(k) {
    var el = root.querySelector('[data-f="' + k + '"]');
    return el ? (el.value || '').trim() : '';
  }
  function render() {
    if (res.getAttribute('data-active') !== 'true') return;
    var a = { content_state: val('content_state'), visual_assets: val('visual_assets'), brand_state: val('brand_state'), features: val('features') };
    list.innerHTML = '';
    TIPS.forEach(function (t) {
      if (!t.when(a)) return;
      var p = document.createElement('p');
      p.className = 'iwa-fine-print';
      p.setAttribute('data-mwp', 'tip');
      p.textContent = t.text;
      list.appendChild(p);
    });
    box.hidden = !list.children.length;
  }
  if (window.MutationObserver) new MutationObserver(render).observe(res, { attributes: true, attributeFilter: ['data-active'] });
  render();
})();

/* ---- dock.js ---- */
/* MWP Assessment — mobile estimate dock behaviour.
 * Below 768px the graph column becomes a fixed dock. Tapping the total
 * ([data-mwp="est"]) toggles .is-open (bars shown). Also mirrors category
 * values into the compact [data-short] tiles. The engine flags #mwp-adv with
 * .mwp-cta-active / .mwp-result-active / .mwp-book-active; dock.css uses them.
 */
(function () {
  'use strict';
  var root = document.getElementById('mwp-adv');
  if (!root) return;
  var dock = root.querySelector('[data-mwp="graph-col"]');
  var est = root.querySelector('[data-mwp="est"]');
  if (!dock || !est) return;
  var hint = root.querySelector('[data-mwp="dock-hint"]');
  var chev = root.querySelector('[data-mwp="dock-chev"]');
  var isMobile = function () {
    return window.matchMedia('(max-width: 767px)').matches;
  };

  function setOpen(open) {
    dock.classList.toggle('is-open', open);
    if (hint) hint.textContent = open ? 'Less detail' : 'Breakdown';
    if (chev) chev.style.transform = open ? 'rotate(180deg)' : 'none';
  }
  setOpen(false);

  est.addEventListener('click', function (e) {
    if (!isMobile()) return;
    if (e && e.preventDefault) e.preventDefault();
    setOpen(!dock.classList.contains('is-open'));
  });

  /* Mirror the full category values into the compact tile values */
  var KEYS = ['website', 'brand', 'content', 'assets', 'func'];
  var num = function (n) {
    return n >= 1000 ? Math.round(n / 100) / 10 : Math.round(n);
  };
  var suf = function (n) {
    return n >= 1000 ? 'k' : '';
  };
  function shorten(txt) {
    if (!txt) return '—';
    var m = txt.replace(/[,\s]/g, '').match(/\d+(?:\.\d+)?/g);
    if (!m || !m.length) return '—';
    var a = parseFloat(m[0]);
    if (m.length === 1) return '£' + num(a) + suf(a);
    var b = parseFloat(m[1]);
    if (a >= 1000 && b >= 1000) return '£' + num(a) + '–' + num(b) + 'k';
    return '£' + num(a) + suf(a) + '–' + num(b) + suf(b);
  }
  function sync() {
    KEYS.forEach(function (k) {
      var src = root.querySelector('[data-val="' + k + '"]');
      var dst = root.querySelector('[data-short="' + k + '"]');
      if (src && dst) dst.textContent = shorten(src.textContent);
    });
  }
  sync();
  if (window.MutationObserver) {
    var mo = new MutationObserver(sync);
    KEYS.forEach(function (k) {
      var src = root.querySelector('[data-val="' + k + '"]');
      if (src) mo.observe(src, { childList: true, characterData: true, subtree: true });
    });
  }
})();

/* ---- start.js ---- */
/* MWP Assessment — "Get started" launcher.
 * Before the visitor starts, the progress wrapper ([data-mwp="progress-wrap"])
 * sits fixed at the bottom of the screen (its Webflow class does that) and acts
 * as the "Get started" button. Starting adds .mwp-started to #mwp-adv, which
 * drops the wrapper back into place at the top of the widget (see start.css),
 * restores the step label and scrolls the widget into view (respecting
 * scroll-margin-top, reduced motion and the site's Lenis smooth scrolling).
 *
 * It also starts without scrolling if the visitor scrolls down to the widget
 * or clicks an answer, so the fixed bar never sits over the questions.
 *
 * The change is animated: when started by scrolling, the button glides from
 * the bottom of the screen into its slot (FLIP) while its colour fades to the
 * panel style, the label cross-fades and the progress pips grow in from the
 * left one after another. A placeholder padding on #mwp-adv reserves the
 * slot's height before starting, so nothing below jumps when it lands.
 */
(function () {
  'use strict';
  var root = document.getElementById('mwp-adv');
  if (!root) return;
  var wrap = root.querySelector('[data-mwp="progress-wrap"]');
  if (!wrap) return;
  var P = window.MWP_PREFS || {};
  var LABEL = P.startLabel || 'Get started';
  var label = wrap.querySelector('[data-mwp="stage-label"]');
  var stepText = label ? label.textContent : '';
  var started = false;
  var io = null;

  var reduceMotion = function () {
    return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  };

  /* Reserve the in-flow slot's height while the wrapper is fixed, so content
     doesn't shift when it drops into place. */
  function reserve() {
    if (started) return;
    root.style.paddingTop = '';
    wrap.style.transition = 'none'; /* measuring must not kick off the colour fade */
    root.classList.add('mwp-started');
    var cs = getComputedStyle(wrap);
    var h = wrap.offsetHeight + (parseFloat(cs.marginTop) || 0) + (parseFloat(cs.marginBottom) || 0);
    root.classList.remove('mwp-started');
    void wrap.offsetHeight;
    wrap.style.transition = '';
    root.style.paddingTop = h + 'px';
  }
  reserve();
  window.addEventListener('resize', reserve);

  /* Progress pips grow in from the left, one after another; label fades in */
  function emerge() {
    if (!wrap.animate || reduceMotion()) return;
    var ease = 'cubic-bezier(.2,.8,.2,1)';
    if (label) label.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 400, easing: 'ease-out' });
    [].forEach.call(wrap.querySelectorAll('[data-mwp="pstep"]'), function (p, i) {
      p.animate([{ transform: 'scaleX(0)', transformOrigin: 'left center', opacity: 0 }, { transform: 'scaleX(1)', transformOrigin: 'left center', opacity: 1 }], { duration: 450, delay: 150 + i * 70, easing: ease, fill: 'backwards' });
    });
  }

  wrap.setAttribute('role', 'button');
  wrap.setAttribute('tabindex', '0');
  wrap.setAttribute('aria-controls', 'mwp-adv');
  if (label) label.textContent = LABEL;

  function start(scroll) {
    if (started) return;
    started = true;
    var first = wrap.getBoundingClientRect();
    window.removeEventListener('resize', reserve);
    root.style.paddingTop = '';
    root.classList.add('mwp-started');
    wrap.removeAttribute('role');
    wrap.removeAttribute('tabindex');
    if (label) label.textContent = stepText;
    if (io) io.disconnect();
    if (wrap.animate && !reduceMotion()) {
      if (scroll) {
        /* Page is about to scroll: rise gently into place */
        wrap.animate([{ opacity: 0, transform: 'translateY(24px)' }, { opacity: 1, transform: 'none' }], { duration: 500, easing: 'cubic-bezier(.2,.8,.2,1)' });
      } else {
        /* FLIP: start where the fixed button was, glide into the slot */
        var last = wrap.getBoundingClientRect();
        var dx = first.left - last.left,
          dy = first.top - last.top;
        if (Math.abs(dx) + Math.abs(dy) > 1) {
          wrap.animate([{ transform: 'translate(' + dx + 'px,' + dy + 'px)' }, { transform: 'none' }], { duration: 650, easing: 'cubic-bezier(.2,.8,.2,1)' });
        }
      }
      emerge();
    }
    if (scroll) scrollToWidget();
  }

  /* Smooth scroll driven by instant steps. The site's Lenis instance swallows
     native smooth scrolling (scrollIntoView / behavior:'smooth'), but it follows
     instant scrolls. Honours scroll-margin-top on #mwp-adv and stops if the
     visitor scrolls themselves. */
  function jump(y) {
    try {
      window.scrollTo({ top: y, behavior: 'instant' });
    } catch (e) {
      window.scrollTo(0, y);
    }
  }
  function scrollToWidget() {
    var reduce = reduceMotion();
    var off = parseFloat(getComputedStyle(root).scrollMarginTop) || 0;
    var from = window.pageYOffset,
      to = Math.max(0, from + root.getBoundingClientRect().top - off);
    if (reduce || Math.abs(to - from) < 2) return jump(to);
    var d = Math.min(1200, Math.max(500, Math.abs(to - from) * 0.6)),
      t0 = null,
      done = false;
    function stop() {
      done = true;
      window.removeEventListener('wheel', stop);
      window.removeEventListener('touchstart', stop);
    }
    window.addEventListener('wheel', stop, { passive: true });
    window.addEventListener('touchstart', stop, { passive: true });
    function step(t) {
      if (done) return;
      if (t0 === null) t0 = t;
      var p = Math.min(1, (t - t0) / d),
        e = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
      jump(from + (to - from) * e);
      if (p < 1) requestAnimationFrame(step);
      else stop();
    }
    requestAnimationFrame(step);
    /* Safety net if rAF is throttled (background tab) */
    setTimeout(function () {
      if (!done) {
        stop();
        jump(to);
      }
    }, d + 300);
  }

  wrap.addEventListener('click', function (e) {
    if (started) return;
    e.preventDefault();
    start(true);
  });
  wrap.addEventListener('keydown', function (e) {
    if (started) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      start(true);
    }
  });

  /* Keep the engine's step label while not started (engine rewrites it on stage change) */
  if (label && window.MutationObserver) {
    new MutationObserver(function () {
      if (started) return;
      if (label.textContent !== LABEL) {
        stepText = label.textContent;
        label.textContent = LABEL;
      }
    }).observe(label, { childList: true, characterData: true, subtree: true });
  }

  /* Visitor scrolled down to the widget themselves, or answered something */
  var grid = root.querySelector('[data-mwp="grid"]') || root;
  if (window.IntersectionObserver) {
    io = new IntersectionObserver(
      function (entries) {
        if (entries[0].isIntersecting) start(false);
      },
      { rootMargin: '0px 0px -40% 0px' }
    );
    io.observe(grid);
  }
  root.addEventListener('click', function (e) {
    if (!started && e.target.closest('[data-answer-id]')) start(false);
  }, true);
})();

/* ---- next-top.js ---- */
/* MWP Assessment — extra Next buttons beside each question.
 * Every [data-mwp="next-top"] (one per stage, inside [data-mwp="q-row"]) acts
 * as the main Next button. It clicks [data-mwp="next"], so the engine's rules
 * still apply. Both kinds of Next button get aria-disabled="true" while the
 * active single-choice stage has no answer. On tablet, mobile and short screens
 * moving on scrolls the progress bar to the top of the viewport.
 */
(function () {
  'use strict';
  var root = document.getElementById('mwp-adv');
  if (!root) return;
  var main = root.querySelector('[data-mwp="next"]');
  var tops = [].slice.call(root.querySelectorAll('[data-mwp="next-top"]'));
  if (!main || !tops.length) return;

  tops.forEach(function (b) {
    b.setAttribute('role', 'button');
    b.addEventListener('click', function (e) {
      e.preventDefault();
      if (b.getAttribute('aria-disabled') === 'true') return;
      main.click();
    });
  });

  function update() {
    var st = root.querySelector('[data-stage][data-active="true"]');
    var blocked = !!st && (st.getAttribute('data-select') || 'single') === 'single' && !st.querySelector('[data-answer-id].is-selected');
    [main].concat(tops).forEach(function (b) {
      b.setAttribute('aria-disabled', blocked ? 'true' : 'false');
    });
  }
  update();
  if (window.MutationObserver) {
    new MutationObserver(update).observe(root, { subtree: true, attributes: true, attributeFilter: ['data-active', 'aria-pressed'] });
  }

  /* On tablet, mobile and short screens, moving to the next stage scrolls the
     progress bar back to the top of the viewport (below the navbar, using
     #mwp-adv's scroll-margin-top). Media query is MWP_PREFS.scrollOnNext. */
  var P = window.MWP_PREFS || {};
  var MQ = P.scrollOnNext || '(max-width: 991px), (max-height: 800px)';
  var target = root.querySelector('[data-mwp="progress-wrap"]') || root;
  var activeKey = function () {
    var st = root.querySelector('[data-stage][data-active="true"]');
    return st ? st.getAttribute('data-stage') : 'result';
  };
  var before = null;
  main.addEventListener('click', function () { before = activeKey(); }, true);
  main.addEventListener('click', function () {
    var moved = before !== null && activeKey() !== before;
    before = null;
    if (!moved || !(window.matchMedia && window.matchMedia(MQ).matches)) return;
    var off = parseFloat(getComputedStyle(root).scrollMarginTop) || 0;
    var to = Math.max(0, window.pageYOffset + target.getBoundingClientRect().top - off);
    if (Math.abs(to - window.pageYOffset) > 8) smoothTo(to);
  });

  /* "See assessment" / "Book a consultation" (summary box) swap the left
     column's content. Bring its top into view when it's off screen, or on the
     same tablet/mobile/short screens as above. */
  var qcol = root.querySelector('[data-mwp="q-col"]') || target;
  root.addEventListener('mwp:view', function () {
    var off = parseFloat(getComputedStyle(root).scrollMarginTop) || 0;
    var top = qcol.getBoundingClientRect().top;
    var mq = window.matchMedia && window.matchMedia(MQ).matches;
    if (!mq && top >= off) return;
    var to = Math.max(0, window.pageYOffset + top - off);
    if (Math.abs(to - window.pageYOffset) > 8) smoothTo(to);
  });

  /* Lenis-safe smooth scroll (instant steps; see start.js) */
  function jump(y) {
    try {
      window.scrollTo({ top: y, behavior: 'instant' });
    } catch (e) {
      window.scrollTo(0, y);
    }
  }
  function smoothTo(to) {
    var from = window.pageYOffset;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return jump(to);
    var d = Math.min(700, Math.max(350, Math.abs(to - from) * 0.5)),
      t0 = null,
      done = false;
    function stop() {
      done = true;
      window.removeEventListener('wheel', stop);
      window.removeEventListener('touchstart', stop);
    }
    window.addEventListener('wheel', stop, { passive: true });
    window.addEventListener('touchstart', stop, { passive: true });
    function step(t) {
      if (done) return;
      if (t0 === null) t0 = t;
      var p = Math.min(1, (t - t0) / d),
        e = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
      jump(from + (to - from) * e);
      if (p < 1) requestAnimationFrame(step);
      else stop();
    }
    requestAnimationFrame(step);
    setTimeout(function () {
      if (!done) {
        stop();
        jump(to);
      }
    }, d + 300);
  }
})();

  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();
})();
