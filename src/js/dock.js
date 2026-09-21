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
