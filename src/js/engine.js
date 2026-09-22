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
