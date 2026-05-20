import { ArrowRight, FlaskConical, Mail, MailCheck } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { FEATURED_TESTS, VIEW_ALL_URL } from '@/lib/featured-tests'
import { VoucherRequestForm } from '@/components/voucher-request-form'

const HERO_BG = 'linear-gradient(90deg, rgb(89,70,149) 0%, rgb(149,80,120) 100%)'
const BRAND_GRADIENT = 'linear-gradient(90deg, #564494, #FF6145)'

const HOW_IT_WORKS = [
  {
    title: 'Enter your work email',
    body: 'We check it against the companies that offer the benefit.',
    Icon: Mail,
  },
  {
    title: 'Receive your voucher code',
    body: 'Sent straight to your inbox within seconds.',
    Icon: MailCheck,
  },
  {
    title: 'Redeem on any check-up',
    body: 'Use the code as a discount at checkout. Multiple orders allowed.',
    Icon: FlaskConical,
  },
]

// Reserved top-level paths that are NOT company slugs.
const RESERVED = new Set([
  'admin',
  'preview',
  'redeem',
  'auth',
  'login',
  'signup',
  'dashboard',
  'fonts',
])

type CompanyRow = {
  id: string
  name: string
  slug: string
  logo_url: string | null
  language: string
  voucher_value_chf: number
  discount_pct: number
  start_date: string
  service_period_months: number
}

export default async function CompanyLandingPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  if (RESERVED.has(slug)) {
    return <NotOffered />
  }

  const supabase = await createClient()
  const { data } = await supabase.rpc('get_company_by_slug', { p_slug: slug })
  const company = (Array.isArray(data) ? data[0] : data) as CompanyRow | undefined

  if (!company) {
    return <NotOffered />
  }

  // Derive the email domain from the company for the input placeholder.
  // (The strict check happens server-side in claim_voucher.)
  const emailDomainGuess = `${company.slug}.com`

  return (
    <main className="min-h-screen bg-background pb-16">
      {/* Hero */}
      <section className="px-3 pt-3 sm:px-5 sm:pt-5">
        <div
          className="relative mx-auto overflow-hidden rounded-[24px] px-5 py-8 text-white sm:rounded-[32px] sm:px-12 sm:py-14 lg:max-w-7xl lg:px-16 lg:py-20"
          style={{ background: HERO_BG }}
        >
          <div className="flex items-center justify-center gap-3 sm:gap-5">
            {company.logo_url ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={company.logo_url}
                alt={company.name}
                className="h-5 w-auto sm:h-7"
              />
            ) : (
              <span className="text-sm font-medium tracking-[0.08em] text-white sm:text-lg">
                {company.name}
              </span>
            )}
            <span className="text-lg text-white/55 sm:text-2xl">×</span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-white.svg" alt="Health Yourself" className="h-5 w-auto sm:h-7" />
          </div>

          <div className="mx-auto mt-8 max-w-3xl text-center sm:mt-12">
            <h1 className="text-[34px] font-normal leading-[1.1] tracking-[-0.5px] sm:text-[48px] sm:tracking-[-0.9px] lg:text-[60px] lg:tracking-[-1.1px]">
              Get your personal check-up voucher{' '}
              <span className="text-white/55">from {company.name}.</span>
            </h1>
            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-white/85 sm:mt-6 sm:max-w-xl sm:text-base">
              Enter your work email — we&apos;ll send your code in seconds.
            </p>
          </div>

          <VoucherRequestForm
            slug={company.slug}
            companyName={company.name}
            emailDomain={emailDomainGuess}
          />
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-5xl px-6 pt-20 sm:pt-28 lg:px-0">
        <div className="text-center">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-foreground sm:text-sm">
            How it works
          </p>
          <h2 className="mx-auto mt-4 max-w-2xl text-[34px] font-normal leading-[1.1] tracking-[-0.8px] sm:text-[44px] sm:tracking-[-1.1px] lg:text-[52px] lg:tracking-[-1.3px]">
            Get Your Voucher In Seconds
          </h2>
        </div>
        <ol className="mt-12 grid gap-10 sm:mt-16 sm:grid-cols-3 sm:gap-8">
          {HOW_IT_WORKS.map((s, i) => (
            <li key={s.title}>
              <span className="inline-flex items-center justify-center rounded-full border border-foreground/15 px-3 py-1 text-[11px] font-medium tracking-wide text-foreground">
                {String(i + 1).padStart(2, '0')}
              </span>
              <s.Icon className="mt-5 h-7 w-7 stroke-[1.5] text-foreground" />
              <p className="mt-3 text-lg font-normal leading-snug tracking-[-0.2px] sm:text-xl">
                {s.title}
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Most popular check-ups */}
      <section className="mx-auto max-w-5xl px-6 pt-20 sm:pt-28 lg:px-0">
        <div className="text-center">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-foreground sm:text-sm">
            Most popular check-ups
          </p>
          <h2 className="mx-auto mt-4 max-w-3xl text-[34px] font-normal leading-[1.1] tracking-[-0.8px] sm:text-[44px] sm:tracking-[-1.1px] lg:text-[52px] lg:tracking-[-1.3px]">
            Redeem Your Voucher For Any Of Our Health Check-ups From Home.
          </h2>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-3 sm:mt-14 sm:gap-5 lg:grid-cols-4">
          {FEATURED_TESTS.map((t) => (
            <article
              key={t.name}
              className="flex flex-col overflow-hidden rounded-[20px] bg-card ring-1 ring-foreground/[0.08] sm:rounded-[24px]"
            >
              <div
                className="aspect-square w-full bg-muted/40 bg-cover bg-center"
                style={{ backgroundImage: 'url(/product-placeholder.jpg)' }}
                role="img"
                aria-label={t.name}
              />
              <div className="flex flex-1 flex-col p-4 sm:p-5">
                <h3 className="text-base font-medium leading-tight tracking-[-0.2px] sm:text-lg">
                  {t.name}
                </h3>
                <p className="mt-1.5 text-sm font-medium text-foreground">CHF {t.priceFrom}</p>
                <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                  {t.tagline}
                </p>
                <a
                  href={t.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto inline-flex h-10 items-center justify-center self-start rounded-full px-5 text-xs font-medium text-white transition-opacity hover:opacity-90 sm:h-11 sm:px-6 sm:text-sm"
                  style={{ backgroundImage: BRAND_GRADIENT }}
                >
                  Go to test
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* View all */}
      <section className="mx-auto max-w-5xl px-6 pt-12 sm:pt-16 lg:px-0">
        <a
          href={VIEW_ALL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center justify-between gap-4 rounded-[24px] bg-card p-6 ring-1 ring-foreground/[0.08] transition-colors hover:bg-muted/30 sm:p-8"
        >
          <div>
            <p className="text-lg font-medium leading-tight sm:text-xl">
              See every check-up we offer
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Your voucher works on the full Health Yourself catalogue.
            </p>
          </div>
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-white transition-transform group-hover:translate-x-0.5"
            style={{ backgroundImage: BRAND_GRADIENT }}
          >
            <ArrowRight className="h-5 w-5" />
          </div>
        </a>
      </section>

      <footer className="mx-auto mt-16 max-w-5xl px-6 text-center text-xs text-muted-foreground sm:mt-24 lg:px-0">
        Powered by{' '}
        <a href="https://yourself.health" target="_blank" className="underline hover:text-foreground">
          Health Yourself
        </a>{' '}
        · Swiss labs · Results from home
      </footer>
    </main>
  )
}

function NotOffered() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 p-6">
      <div className="w-full max-w-md rounded-[24px] bg-card p-8 text-center ring-1 ring-foreground/[0.08]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo-gradient.svg"
          alt="Health Yourself"
          className="mx-auto h-7 w-auto"
        />
        <p className="mt-6 text-sm leading-relaxed text-foreground">
          Unfortunately, your employer does not currently offer check-ups with us.
        </p>
        <a
          href="https://yourself.health"
          className="mt-5 inline-block text-sm font-medium text-[#c45760] underline-offset-4 hover:underline"
        >
          Explore Health Yourself
        </a>
      </div>
    </main>
  )
}
