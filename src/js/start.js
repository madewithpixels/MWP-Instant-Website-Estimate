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
