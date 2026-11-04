/*! MWP Instant Website Estimate v2.0.0 | madewithpixels.co.uk | github.com/madewithpixels/MWP-Instant-Website-Estimate */
(function () {
  'use strict';
  if (window.__MWP_ESTIMATE_LOADED__) return;
  window.__MWP_ESTIMATE_LOADED__ = '2.0.0';
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
    contentMatrix: {
      single: { everything: [0, 0], most: [150, 250], some: [250, 350], help: [350, 500] },
      small: { everything: [0, 0], most: [250, 400], some: [400, 650], help: [500, 800] },
      medium: { everything: [0, 0], most: [400, 650], some: [650, 900], help: [700, 1050] },
      large: { everything: [0, 0], most: [650, 900], some: [900, 1300], help: [1050, 1800] },
      notsure: { everything: [0, 0], most: [250, 400], some: [400, 650], help: [500, 800] },
    },
    cmsBands: [
      { upTo: 1, range: [0, 250] },
      { upTo: 2, range: [250, 500] },
      { upTo: 3, range: [500, 750] },
      { upTo: 99, range: [750, 1250] },
    ],
    resultTypePriority: ['complex', 'brand-led', 'content-led', 'asset-led', 'standard'],
    resultTypes: {
      standard: { badge: 'Standard build', sub: 'A focused project with a clear way forward: good news for both budget and timing.' },
      'content-led': { badge: 'Content-led', sub: 'Your content will do a lot of the work here, and sorting it early is the best way to save time and money.' },
      'brand-led': { badge: 'Brand-led', sub: 'A chance to strengthen your brand as the site takes shape, so the two work together and nothing is paid for twice.' },
      'asset-led': { badge: 'Asset-led', sub: 'Strong visuals will make the biggest difference here, so a little planning on imagery goes a long way.' },
      complex: { badge: 'More involved', sub: 'A more involved project, so a short chat first keeps the price accurate and avoids surprises.' },
    },
    driverCopy: {
      website: 'The size and structure of the site are the main foundation of the estimate.',
      brand: 'There’s an opportunity to build a more coherent visual identity as part of the project.',
      content: 'Some support may be needed to shape the message and page content.',
      assets: 'The project may benefit from creating or sourcing stronger imagery.',
      func: 'Additional forms, ecommerce or integrations can increase scope.',
    },
    recommendations: {
      brand: { h: 'Your brand', p: 'Your brand has enough of a starting point to begin the conversation. We can refine the visual language as part of the website so everything feels more coherent.' },
      content: { h: 'Your content', p: 'If the content isn’t fully written yet, that’s fine. We can help structure the pages and develop the messaging alongside the design.' },
      assets: { h: 'Your visual assets', p: 'If you don’t have strong imagery yet, we can help create a visual approach using the best mix of photography, stock, illustration or AI-generated visuals.' },
      complex: { h: 'Your bespoke functionality', p: 'Because your project includes more advanced functionality, the best next step is a short discovery call so we can understand the details before pricing that part properly.' },
    },
    bespokeNote: 'Your project includes bespoke functionality, so part of the estimate needs a short discovery conversation before it can be priced accurately.',
    /* Progress label while the booking panel is showing. */
    bookLabel: 'Book a free chat',
    stageLabels: ['Your project', 'Your website', 'Your brand', 'Your content', 'Your visual assets', 'Your features', 'Your results'],
    finalGraph: { heading: 'What makes up the cost', sub: 'Each part of your project adds to the range.' },
    /* Side panel while the questions are being answered. */
    stageGraph: { heading: 'Your estimate so far', sub: 'Each answer updates the range as you go.' },
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
  function shapingText(r) {
    var size = sel.website_size && sel.website_size !== 'notsure' ? optData('website_size', sel.website_size).label.toLowerCase() : 'website';
    var bits = [];
    if (sel.content_state === 'some' || sel.content_state === 'help') bits.push('content');
    if (sel.visual_assets === 'phone' || sel.visual_assets === 'little') bits.push('visual assets');
    if (sel.brand_state === 'brand-help' || sel.brand_state === 'logo-only') bits.push('brand');
    var support = bits.length ? ', with some support needed around ' + bits.join(' and ') : '';
    return 'From your answers, a ' + size + ' looks like the right fit' + support + '. It’s a sensible place to start, and it can still look polished and do real work for you.';
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
    T('[data-mwp="result-type"]', P.resultTypes[type].badge);
    var _rt = $('[data-mwp="result-type"]');
    if (_rt) _rt.setAttribute('data-type', type);
    T('[data-mwp="result-sub"]', P.resultTypes[type].sub);
    T('[data-mwp="shaping"]', shapingText(r));
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
      var keys = [];
      if (sel.brand_state === 'logo-only' || sel.brand_state === 'logo-assets' || sel.brand_state === 'brand-help') keys.push('brand');
      if (sel.content_state === 'some' || sel.content_state === 'help') keys.push('content');
      if (sel.visual_assets === 'phone' || sel.visual_assets === 'little' || sel.visual_assets === 'assets-notsure') keys.push('assets');
      if (r.consult) keys.push('complex');
      keys.forEach(function (k) {
        var box = document.createElement('div');
        box.setAttribute('data-mwp', 'reco');
        box.className = 'mwp-reco is-' + k;
        box.innerHTML = '<h4 class="mwp-reco-h">' + P.recommendations[k].h + '</h4><p class="mwp-reco-p">' + P.recommendations[k].p + '</p>';
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
    var sub = $('[data-mwp="result-sub"]');
    set('recommendation', sub ? sub.textContent : '');
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
      when: function (a) { return /^(most|some|help)$/.test(a.content_state); },
      text: 'Supplying final, approved copy before design starts is the single biggest saving. It removes rewriting and extra rounds.',
    },
    {
      when: function (a) { return /^(phone|little)$/.test(a.visual_assets); },
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

/* ---- advice.js ---- */
/* MWP Assessment — one short advice line per answer on the result screen.
 * Reads the answers the engine syncs into the hidden [data-f] fields and fills
 * [data-mwp="advice-list"] (inside the optional [data-mwp="advice"] block).
 * Edit the copy in ADVICE below; the keys are the data-answer-id values on the
 * options in Webflow. Lines render as <p class="iwa-fine-print" data-mwp="advice-line">.
 * Approved wording: Michael, 3 November 2026 (R-051, R-050).
 */
(function () {
  'use strict';
  var root = document.getElementById('mwp-adv');
  if (!root) return;
  var box = root.querySelector('[data-mwp="advice"]'),
    list = root.querySelector('[data-mwp="advice-list"]'),
    res = root.querySelector('[data-mwp="result"]');
  if (!box || !list || !res) return;
  /* Most lines shown in total, so the screen stays short. When there are more,
     the "not sure" lines go first, then the last ones. */
  var MAX_LINES = 6;
  /* At most this many feature lines (question 6), in the order listed below. */
  var MAX_FEATURE_LINES = 3;
  var ADVICE = {
    project_type: {
      'new-site': 'A fresh start gives us room to get the structure right first time, which saves rework later.',
      redesign: 'We’ll keep what already works, such as good content and search rankings, so you only pay to change what needs it.',
      improvement: 'Targeted updates are the quickest, most affordable route. Starting small is often the smartest move.',
      'wider-support': 'Planning the brand, site and marketing together avoids paying twice for the same thinking.',
      unsure: 'No problem. A short chat usually makes the best starting point clear.',
    },
    website_size: {
      single: 'Quick to build and easy to keep within budget, and it can still do real work for you.',
      small: 'A sensible size for most service businesses. Every page you add adds time, so keep to the pages that earn their place.',
      medium: 'More pages means more content to prepare, so getting that ready early is the biggest time saver.',
      large: 'Building it in phases keeps the first launch faster and spreads the cost.',
      notsure: 'We’ve estimated cautiously. Once we know the pages you need, the range usually narrows.',
    },
    brand_state: {
      established: 'Having this ready is a real time and cost saver: we can start designing straight away.',
      'logo-assets': 'A good starting point. A short list of your colours and fonts will save us time.',
      'logo-only': 'We’ll build the visual style around your logo as part of the design, which adds a little time.',
      'brand-help': 'Doing the brand and site together keeps them consistent and is usually better value than separate projects.',
    },
    content_state: {
      everything: 'Having your content ready is one of the biggest time savers.',
      most: 'Nearly there. Finishing the gaps before design starts keeps the project on schedule.',
      some: 'Agreeing the page structure early lets us shape the rest of the words around it.',
      help: 'We can write it with you. Sending rough notes or bullet points first saves time.',
    },
    visual_assets: {
      pro: 'Strong images lift a site more than anything else, and they cost you nothing extra here.',
      'some-imagery': 'We’ll make the most of what you have. Sending it all early helps us see what’s missing.',
      phone: 'Good phone photos can work well with careful use. Send your best ones and we’ll tell you where new ones would help.',
      little: 'A small photo shoot or well-chosen stock can fill the gaps affordably.',
      'assets-notsure': 'Send us what you’ve got and we’ll recommend the simplest route.',
    },
    /* Question 6: shown for the first MAX_FEATURE_LINES picked, in this order. */
    features: [
      ['blog', 'A short list of starter articles makes the launch stronger. You can add more later.'],
      ['portfolio', 'A few strong case studies beat a long list.'],
      ['services', 'Clear, separate pages for each service help visitors and search engines.'],
      ['downloads', 'Keep to the few files people ask for most.'],
      ['events', 'Plan how events will be kept up to date, as old dates quickly look stale.'],
      ['testimonials', 'Real quotes with names and faces are the most convincing.'],
      ['team', 'Good photos of your team matter more than long biographies.'],
      ['adv-forms', 'Simple forms get more replies. Only ask for what you need.'],
      ['booking', 'Worth planning carefully, as it often connects to other tools and adds cost.'],
      ['crm', 'Tell us which tools you use now so we can connect to them rather than replace them.'],
      ['ecom', 'Starting with a small product range keeps the first version quick and affordable.'],
      ['ai', 'A clear, single purpose keeps this affordable. We can start small and build on it.'],
      ['bespoke', 'This is where cost grows fastest. A first phase with just the essentials keeps it in control.'],
    ],
  };
  /* Answers whose line is the first to go when there are too many. */
  var DROP_FIRST = { unsure: 1, notsure: 1, 'assets-notsure': 1 };
  var STAGE_ORDER = ['project_type', 'website_size', 'brand_state', 'content_state', 'visual_assets'];
  function val(k) {
    var el = root.querySelector('[data-f="' + k + '"]');
    return el ? (el.value || '').trim() : '';
  }
  function lines() {
    var out = [];
    STAGE_ORDER.forEach(function (k) {
      var id = val(k),
        text = id && ADVICE[k][id];
      if (text) out.push({ text: text, soft: !!DROP_FIRST[id] });
    });
    var picked = val('features')
      .split(',')
      .map(function (s) {
        return s.trim();
      })
      .filter(Boolean);
    var n = 0;
    ADVICE.features.forEach(function (f) {
      if (n >= MAX_FEATURE_LINES || picked.indexOf(f[0]) < 0) return;
      out.push({ text: f[1], soft: false });
      n++;
    });
    for (var i = out.length - 1; i >= 0 && out.length > MAX_LINES; i--) if (out[i].soft) out.splice(i, 1);
    return out.slice(0, MAX_LINES);
  }
  function render() {
    if (res.getAttribute('data-active') !== 'true') return;
    list.innerHTML = '';
    lines().forEach(function (l) {
      var p = document.createElement('p');
      p.className = 'iwa-fine-print';
      p.setAttribute('data-mwp', 'advice-line');
      p.textContent = l.text;
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
