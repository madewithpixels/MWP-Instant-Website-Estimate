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
