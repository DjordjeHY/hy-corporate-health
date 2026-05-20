// Shared mockup data — design previews only.

export const COMPANY_NAME = 'Test Co'
export const COMPANY_VOUCHER_VALUE_CHF = 200

export const HOW_IT_WORKS = [
  { step: 1, title: 'Enter your work email', body: 'We check it against the companies that offer the benefit.' },
  { step: 2, title: 'Receive your voucher code', body: 'Sent straight to your inbox within seconds.' },
  { step: 3, title: 'Redeem on any check-up', body: 'Use the code as a discount at checkout. Multiple orders allowed.' },
] as const

export const FEATURED_TESTS = [
  {
    name: 'Health Check Basic',
    tagline: '19 essential health markers from one drop of blood.',
    priceFrom: 249,
    url: 'https://yourself.health/products/annual-health-check-from-home-19-health-parameters',
    hue: 'from-violet-500 to-fuchsia-400',
  },
  {
    name: '360° Vitamin & Nutrient Check',
    tagline: 'Iron, vitamin D, B12, magnesium and more.',
    priceFrom: 199,
    url: 'https://yourself.health/products/vitamin-nutrient-lab-test-from-home-iron-vitamin-b12-vitamin-d',
    hue: 'from-orange-400 to-pink-500',
  },
  {
    name: 'Colon Cancer Screening',
    tagline: 'A simple at-home stool test, processed by Swiss labs.',
    priceFrom: 79,
    url: 'https://yourself.health/products/colon-cancer-screening-from-home-swiss-lab',
    hue: 'from-emerald-400 to-teal-500',
  },
  {
    name: 'Testosterone Check',
    tagline: 'Track hormones from home — clear, actionable results.',
    priceFrom: 129,
    url: 'https://yourself.health/products/testosterone-check',
    hue: 'from-amber-400 to-orange-500',
  },
] as const

export const VIEW_ALL_URL = 'https://yourself.health/pages/lab-tests'
