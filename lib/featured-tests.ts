// Featured check-ups shown on every customer landing page.
// Real per-product images are swapped in later; all use the shared
// placeholder for now (product-placeholder.jpg).

export const FEATURED_TESTS = [
  {
    name: 'Health Check Basic',
    tagline: '19 essential health markers from one drop of blood.',
    priceFrom: 249,
    url: 'https://yourself.health/products/annual-health-check-from-home-19-health-parameters',
  },
  {
    name: '360° Vitamin & Nutrient Check',
    tagline: 'Iron, vitamin D, B12, magnesium and more.',
    priceFrom: 199,
    url: 'https://yourself.health/products/vitamin-nutrient-lab-test-from-home-iron-vitamin-b12-vitamin-d',
  },
  {
    name: 'Colon Cancer Screening',
    tagline: 'A simple at-home stool test, processed by Swiss labs.',
    priceFrom: 79,
    url: 'https://yourself.health/products/colon-cancer-screening-from-home-swiss-lab',
  },
  {
    name: 'Testosterone Check',
    tagline: 'Track hormones from home — clear, actionable results.',
    priceFrom: 129,
    url: 'https://yourself.health/products/testosterone-check',
  },
] as const

export const VIEW_ALL_URL = 'https://yourself.health/pages/lab-tests'
export const SUPPORT_EMAIL = 'hello@yourself.health'
