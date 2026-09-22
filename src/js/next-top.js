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
