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
