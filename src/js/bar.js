/* MWP Assessment — tablet and mobile sticky bottom bar (991px and below).
 * Builds one fixed bar from three things the visitor otherwise has to hunt for:
 *   [estimated investment]  [step n of 6 pips]  [Next]
 * Everything in it is a mirror of the real elements, so the engine keeps full
 * control: the figure copies [data-mwp="est-figure"], the pips copy the
 * [data-mwp="pstep"] states, and the button clicks the real Next (or, from the
 * last stage on, "See assessment" / "Book a consultation").
 * Tapping the figure opens or closes the breakdown sheet (.is-open on the
 * graph column). Styling is in bar.css; the button carries the shared
 * IWA Btn classes, so it matches the Webflow buttons.
 */
(function () {
  'use strict';
  var root = document.getElementById('mwp-adv');
  if (!root) return;
  var main = root.querySelector('[data-mwp="next"]');
  var fig = root.querySelector('[data-mwp="est-figure"]');
  var dock = root.querySelector('[data-mwp="graph-col"]');
  if (!main || !fig) return;
  var psteps = [].slice.call(root.querySelectorAll('[data-mwp="pstep"]'));
  var see = root.querySelector('[data-mwp="cta-see"]');
  var book = root.querySelector('[data-mwp="cta-book"]');

  var bar = document.createElement('div');
  bar.setAttribute('data-mwp', 'bar');
  bar.setAttribute('role', 'region');
  bar.setAttribute('aria-label', 'Your estimate and progress');
  var pips = psteps.map(function () { return '<span data-mwp="bar-pip"></span>'; }).join('');
  bar.innerHTML =
    '<button type="button" data-mwp="bar-est" aria-expanded="false">' +
      '<span data-mwp="bar-est-label">Estimated investment</span>' +
      '<span data-mwp="bar-est-figure"></span>' +
    '</button>' +
    '<div data-mwp="bar-steps">' +
      '<span data-mwp="bar-step-text"></span>' +
      '<span data-mwp="bar-pips" role="progressbar" aria-valuemin="1" aria-valuemax="' + psteps.length + '" aria-label="Progress">' + pips + '</span>' +
    '</div>' +
    '<a href="#" role="button" class="iwa-btn iwa-btn-primary" data-mwp="bar-next">Next</a>';
  root.appendChild(bar);

  var q = function (s) { return bar.querySelector(s); };
  var barEst = q('[data-mwp="bar-est"]'),
    barFig = q('[data-mwp="bar-est-figure"]'),
    barText = q('[data-mwp="bar-step-text"]'),
    barPips = [].slice.call(bar.querySelectorAll('[data-mwp="bar-pip"]')),
    barPipsEl = q('[data-mwp="bar-pips"]'),
    barNext = q('[data-mwp="bar-next"]');

  /* The button's job depends on where the visitor is: Next during the
     questions, then See assessment, then Book. The engine shows and hides the
     summary buttons with inline display, so visibility says which applies. */
  function shown(el) { return !!el && el.style.display !== 'none'; }
  function target() {
    if (root.classList.contains('mwp-cta-active')) {
      if (shown(see)) return see;
      if (shown(book)) return book;
    }
    return main;
  }

  /* Only write when something changed: the observer below watches the whole
     widget, bar included, so an unconditional write would retrigger sync(). */
  function setText(el, v) { if (el.textContent !== v) el.textContent = v; }
  function setAttr(el, k, v) { if (el.getAttribute(k) !== v) el.setAttribute(k, v); }
  function sync() {
    setText(barFig, fig.textContent);
    var n = -1;
    psteps.forEach(function (p, i) {
      var done = p.classList.contains('is-done'), cur = p.classList.contains('is-current');
      var c = done ? 'is-done' : cur ? 'is-current' : '';
      if (barPips[i].className !== c) barPips[i].className = c;
      if (cur) n = i + 1;
    });
    setAttr(barPipsEl, 'aria-valuenow', String(Math.max(n, 1)));
    setText(barText, n > 0 ? 'Step ' + n + ' of ' + psteps.length : '');
    var t = target();
    setText(barNext, (t.textContent || '').replace(/\s+/g, ' ').trim() || 'Next');
    setAttr(barNext, 'aria-disabled', t.getAttribute('aria-disabled') === 'true' ? 'true' : 'false');
    setAttr(barEst, 'aria-expanded', dock && dock.classList.contains('is-open') ? 'true' : 'false');
  }

  barNext.addEventListener('click', function (e) {
    e.preventDefault();
    if (barNext.getAttribute('aria-disabled') === 'true') return;
    target().click();
  });
  barEst.addEventListener('click', function () {
    if (!dock) return;
    dock.classList.toggle('is-open');
    sync();
  });

  sync();
  if (window.MutationObserver) {
    var mo = new MutationObserver(sync);
    mo.observe(root, { subtree: true, attributes: true, attributeFilter: ['class', 'style', 'aria-disabled'] });
    mo.observe(fig, { childList: true, characterData: true, subtree: true });
    [see, book].forEach(function (b) { if (b) mo.observe(b, { childList: true, characterData: true, subtree: true }); });
  }
})();
