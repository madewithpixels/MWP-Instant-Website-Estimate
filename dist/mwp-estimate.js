/*! MWP Instant Website Estimate v1.0.0 | madewithpixels.co.uk | github.com/madewithpixels/MWP-Instant-Website-Estimate */
(function () {
  'use strict';
  if (window.__MWP_ESTIMATE_LOADED__) return;
  window.__MWP_ESTIMATE_LOADED__ = '1.0.0';
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
      standard: { badge: 'Standard build', sub: 'This looks like a focused website project with a clear route forward.' },
      'content-led': { badge: 'Content-led', sub: 'This looks like a website project where content and messaging will play an important role.' },
      'brand-led': { badge: 'Brand-led', sub: 'This looks like a website project with an opportunity to strengthen the brand at the same time.' },
      'asset-led': { badge: 'Asset-led', sub: 'This looks like a website project where the visual approach will make a big difference.' },
      complex: { badge: 'More involved', sub: 'This looks like a more involved digital project and would benefit from a short discovery conversation.' },
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
    stageLabels: ['Your project', 'Your website', 'Your brand', 'Your content', 'Your visual assets', 'Your features', 'Your assessment'],
    finalGraph: { heading: 'What’s driving your estimate', sub: 'Your estimate reflects the level of design, content, assets and functionality your project is likely to need.' },
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
  var roundMin = function (n) {
    return Math.floor(n / P.rounding.minDownTo) * P.rounding.minDownTo;
  };
  var roundMax = function (n) {
    return Math.ceil(n / P.rounding.maxUpTo) * P.rounding.maxUpTo;
  };
  /* Running figure starts at £0; any stage-1 answer shows P.startFigure (default £500)
     until stage 2 prices the build. Totals from stage 2 on are unaffected. */
  var START = P.startFigure != null ? P.startFigure : 500;
  function compute(s) {
    var cat = { website: [0, 0], brand: [0, 0], content: [0, 0], assets: [0, 0], func: [0, 0] },
      tags = [],
      consult = false;
    if (s.website_size) {
      var b = optData('website_size', s.website_size).data;
      cat.website = [b.baseMin || 0, b.baseMax || 0];
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
      if (val) val.textContent = r.cat[c.key][1] ? money(r.cat[c.key][0]) + '–' + money(r.cat[c.key][1]) : '—';
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
    if (fig) fig.textContent = money(r.roundedMin) + '–' + money(r.roundedMax);
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
        el.textContent = id ? optData(CAT_STAGE[c.key], id).label || '' : '';
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
  function stageComplete(n) {
    var s = STAGES[n];
    if (!s) return true;
    if (s.select === 'multi') return true;
    return !!sel[s.id];
  }
  function updateNav() {
    if (backBtn) backBtn.disabled = stageIndex === 0;
    if (nextBtn) {
      nextBtn.textContent = stageIndex === LAST ? 'See my assessment' : 'Next';
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
    var _r = $('[data-mwp="result"]');
    if (_r) {
      _r.setAttribute('data-active', 'false');
      _r.style.display = 'none';
    }
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
    T('[data-mwp="graph-h"]', 'What’s shaping your estimate');
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
    var size = sel.website_size ? optData('website_size', sel.website_size).label.toLowerCase() : 'website';
    var bits = [];
    if (sel.content_state === 'some' || sel.content_state === 'help') bits.push('content');
    if (sel.visual_assets === 'phone' || sel.visual_assets === 'little') bits.push('visual assets');
    if (sel.brand_state === 'brand-help' || sel.brand_state === 'logo-only') bits.push('brand');
    var support = bits.length ? ' with some support needed around ' + bits.join(' and ') : '';
    return 'Based on your answers, this is likely to be a ' + size + ' project' + support + '. That’s a common starting point, and it gives us a clear opportunity to create something more polished and useful than a simple brochure site.';
  }
  function showResult() {
    var r = compute(sel),
      type = resultType(sel, r);
    STAGES.forEach(function (s) {
      s.el.setAttribute('data-active', 'false');
      s.el.style.display = 'none';
    });
    if (navEl) navEl.style.display = 'none';
    var _r = $('[data-mwp="result"]');
    if (_r) {
      _r.setAttribute('data-active', 'true');
      _r.style.display = '';
    }
    psteps.forEach(function (d, i) {
      d.classList.toggle('is-done', i < STAGES.length);
      d.classList.toggle('is-current', i === STAGES.length);
    });
    if (progEl) progEl.setAttribute('aria-valuenow', STAGES.length + 1);
    T('[data-mwp="stage-label"]', P.stageLabels[STAGES.length]);
    T('[data-mwp="result-type"]', P.resultTypes[type].badge);
    var _rt = $('[data-mwp="result-type"]');
    if (_rt) _rt.setAttribute('data-type', type);
    T('[data-mwp="result-sub"]', P.resultTypes[type].sub);
    T('[data-mwp="shaping"]', shapingText(r));
    T('[data-mwp="big-est"]', r.consult ? money(r.roundedMin) + '–' + money(r.roundedMax) + ' + bespoke functionality to be scoped' : money(r.roundedMin) + '–' + money(r.roundedMax));
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
        div.innerHTML = '<strong class="mwp-driver-h"><span data-dot="' + c.key + '"></span> ' + c.label + ' — ' + money(r.cat[c.key][0]) + '–' + money(r.cat[c.key][1]) + '</strong><div class="mwp-driver-p">' + P.driverCopy[c.key] + '</div>';
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
    var bk = $('[data-mwp="cta-book"]');
    if (bk) bk.setAttribute('href', P.links.bookingUrl);
    syncForm(type, r);
  }
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

/* ---- book-reveal.js ---- */
/* MWP Assessment — "Book a call" reveal.
 * Toggles the [data-mwp="book"] form when [data-mwp="cta-book"] is clicked and
 * focuses its first field.
 */
(function () {
  'use strict';
  var r = document.getElementById('mwp-adv');
  if (!r) return;
  var b = r.querySelector('[data-mwp="cta-book"]'),
    f = r.querySelector('[data-mwp="book"]');
  if (f) f.hidden = true;
  if (b && f)
    b.addEventListener('click', function (e) {
      if (e && e.preventDefault) e.preventDefault();
      f.hidden = !f.hidden;
      if (!f.hidden) {
        var i = f.querySelector('[data-mwp="book-first"]') || f.querySelector('input,textarea');
        if (i) i.focus();
      }
    });
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
      text: 'Start with the essentials and add features in a second phase. Webflow makes it easy to grow the site later.',
    },
    {
      when: function () { return true; },
      text: 'A single point of contact and quick feedback keep the project on schedule. Fewer revision rounds means a lower final cost.',
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
 * values into the compact [data-short] tiles and flags #mwp-adv with
 * .mwp-result-active while the result panel is showing.
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

    /* Hide the dock once the assessment is showing */
    var res = root.querySelector('[data-mwp="result"]');
    if (res) {
      var flag = function () {
        root.classList.toggle('mwp-result-active', res.getAttribute('data-active') === 'true');
      };
      new MutationObserver(flag).observe(res, { attributes: true, attributeFilter: ['data-active'] });
      flag();
    }
  }
})();

  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();
})();
