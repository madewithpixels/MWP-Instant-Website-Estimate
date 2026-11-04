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
