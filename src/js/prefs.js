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
    /* Content cost by site size. "some" = content exists, we need help refining it;
       "help" = we need help writing it. "everything" costs nothing. */
    contentMatrix: {
      small: { everything: [0, 0], some: [150, 350], help: [350, 700] },
      medium: { everything: [0, 0], some: [350, 500], help: [500, 1000] },
      large: { everything: [0, 0], some: [500, 1000], help: [750, 1500] },
      notsure: { everything: [0, 0], some: [150, 350], help: [350, 700] },
    },
    cmsBands: [
      { upTo: 1, range: [0, 250] },
      { upTo: 2, range: [250, 500] },
      { upTo: 3, range: [500, 750] },
      { upTo: 99, range: [750, 1250] },
    ],
    resultTypePriority: ['complex', 'brand-led', 'content-led', 'asset-led', 'standard'],
    driverCopy: {
      website: 'The size and structure of the site are the main foundation of the estimate.',
      brand: 'There’s an opportunity to build a more coherent visual identity as part of the project.',
      content: 'Some support may be needed to shape the message and page content.',
      assets: 'The project may benefit from creating or sourcing stronger imagery.',
      func: 'Additional forms, ecommerce or integrations can increase scope.',
    },
    /* The summary paragraph at the top of the result screen is built from the answers:
       "<project> (<size>), with <brand>, <content> and <images>, plus <features>. <close>" */
    summary: {
      project: {
        'new-site': 'You’re planning a new website',
        redesign: 'You’re planning a redesign of your existing website',
        improvement: 'You’re planning improvements to your existing website',
        'wider-support': 'You’re looking for help building integrated business tools',
        fallback: 'You’re planning a website',
      },
      size: { small: 'up to five pages', medium: 'around five to fifteen pages', large: 'fifteen pages or more' },
      brand: { established: 'brand guidelines already in place', 'logo-only': 'a logo already in place', 'brand-help': 'brand work still to do' },
      content: { everything: 'content written and approved', some: 'content that needs shaping', help: 'content still to be written' },
      assets: { pro: 'strong imagery', 'some-imagery': 'some existing imagery', little: 'little imagery so far' },
      features: {
        blog: 'a blog',
        portfolio: 'a portfolio',
        services: 'service pages',
        downloads: 'downloads',
        events: 'events',
        testimonials: 'testimonials',
        team: 'team profiles',
        'adv-forms': 'advanced forms',
        booking: 'a booking system',
        crm: 'CRM or email integration',
        ecom: 'an online shop',
        ai: 'AI features',
        bespoke: 'bespoke functionality',
        social: 'a social media campaign',
      },
      closeStandard: 'It’s a clear brief and a sensible place to start.',
      closeBespoke: 'Because it includes some bespoke functionality, a short chat will help us price that part properly.',
    },
    /* The five "Your …" blocks on the result screen. Each paragraph is one <p>.
       content has one version per content answer; func has two routes (features picked or not). */
    blocks: {
      website: {
        h: 'Your website',
        p: [
          'The size of your site will largely be driven by how much content you have or need and the features your site requires.',
          'There’s likely to be room for manoeuvre with the cost we’ve estimated here. A quick phone call would clear it up.',
        ],
      },
      brand: {
        h: 'Your brand',
        p: ['We can help you to design your brand from scratch or support you in developing your brand further, whatever your requirements. We have a long history of helping businesses and charities extend the reach of their brand.'],
      },
      content: {
        h: 'Your content',
        everything: ['If you have content already written and approved for use that will save you time and money.'],
        some: ['If you need help shaping something rough into its final shape, we have lots of experience in doing that.'],
        help: ['If you’re starting from scratch, we often just need some bullet points to begin crafting professionally written content.'],
      },
      assets: {
        h: 'Your images',
        p: [
          'Lack of imagery is often a sticking point for many clients and projects. We have lots of experience at solving that problem.',
          'Whether it’s sourcing stock imagery, creating new images with generative AI, retouching your existing photographs or finding a more abstract and typographic approach that suits your brand, there are lots of options.',
        ],
      },
      func: {
        h: 'Your functionality',
        picked: ['You seem to have firm ideas for the type of features your site needs. That’s a great starting point and it makes an accurate estimate easier to reach.'],
        none: ['We can help you to decide what type of website features would suit your business. Get in touch for a no-pressure, zero-obligation chat.'],
      },
    },
    /* Optional extra line in "Your website" for people who chose "Improvements to an existing website"
       (empty = none). Webflow sites are the speciality, so wording to be decided. */
    improvementNote: '',
    bespokeNote: 'Your project includes bespoke functionality, so part of the estimate needs a short discovery conversation before it can be priced accurately.',
    /* Progress label while the booking panel is showing. */
    bookLabel: 'Book a free chat',
    stageLabels: ['Your project', 'Your website', 'Your brand', 'Your content', 'Your visual assets', 'Your features', 'Your results'],
    finalGraph: { heading: 'What makes up the cost', sub: 'Each part of your project adds to the range.' },
    /* Side panel while the questions are being answered. */
    stageGraph: { heading: 'Your estimate so far', sub: 'Answer the questions, the price updates as you go' },
  };
  window.MWP_PREFS = Object.assign(DEFAULTS, window.MWP_PREFS || {});
})();
