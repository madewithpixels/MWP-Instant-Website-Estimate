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
    /* Text on the fixed progress bar before the visitor starts (start.js). */
    startLabel: 'Get started',
    /* Screens where Next scrolls the progress bar to the top (next-top.js). */
    scrollOnNext: '(max-width: 991px), (max-height: 800px)',
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
