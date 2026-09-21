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
