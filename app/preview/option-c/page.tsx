import Link from 'next/link'
import { ArrowLeft, ArrowRight, Mail } from 'lucide-react'
import {
  COMPANY_NAME,
  FEATURED_TESTS,
  HOW_IT_WORKS,
  VIEW_ALL_URL,
} from '../_data'

export default function OptionC() {
  const [featured, ...rest] = FEATURED_TESTS

  return (
    <main className="min-h-screen bg-background pb-24 sm:pb-12">
      <PreviewBar option="C" title="Product showcase first" />

      {/* Top bar */}
      <header className="border-b bg-card">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3">
          <div className="flex items-center gap-3">
            <div
              className="flex h-8 items-center rounded-md px-2.5"
              style={{ backgroundImage: 'var(--brand-gradient)' }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo-white.svg" alt="Health Yourself" className="h-4 w-auto" />
            </div>
            <span className="hidden text-xs text-muted-foreground sm:inline">
              for {COMPANY_NAME}
            </span>
          </div>
          <a
            href="#request"
            className="hidden h-9 items-center gap-2 rounded-lg px-4 text-sm font-semibold text-white shadow-sm transition-all hover:brightness-110 sm:inline-flex"
            style={{ backgroundImage: 'var(--brand-gradient)' }}
          >
            <Mail className="h-3.5 w-3.5" />
            Get my voucher code
          </a>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-5 pb-10 pt-8 sm:pt-12">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
          {COMPANY_NAME} wellness benefit
        </p>
        <h1 className="mt-2 text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
          Pick a check-up.
          <br className="hidden sm:block" />{' '}
          <span className="bg-gradient-to-r from-[color:var(--brand-purple)] to-[color:var(--brand-coral)] bg-clip-text text-transparent">
            Redeem with your code.
          </span>
        </h1>
        <p className="mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">
          Browse our most popular check-ups below. Your voucher works on every test we offer.
        </p>

        <div className="mt-8 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
          {/* Featured */}
          <a
            href={featured.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group overflow-hidden rounded-2xl border bg-card ring-1 ring-foreground/10 transition-all hover:-translate-y-1 hover:shadow-lg"
          >
            <div className={`flex h-56 items-end bg-gradient-to-br ${featured.hue} p-6 text-white sm:h-72`}>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-white/80">Most picked</p>
                <h2 className="mt-1 text-3xl font-bold sm:text-4xl">{featured.name}</h2>
              </div>
            </div>
            <div className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm text-muted-foreground">{featured.tagline}</p>
                <p className="mt-2 text-base font-semibold">from CHF {featured.priceFrom}</p>
              </div>
              <span className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-primary group-hover:underline">
                Use voucher
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </div>
          </a>

          {/* Smaller tests */}
          <div className="grid gap-4">
            {rest.map((t) => (
              <a
                key={t.name}
                href={t.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group grid grid-cols-[100px_1fr] overflow-hidden rounded-xl border bg-card ring-1 ring-foreground/10 transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className={`bg-gradient-to-br ${t.hue}`} />
                <div className="p-4">
                  <p className="text-sm font-bold">{t.name}</p>
                  <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{t.tagline}</p>
                  <p className="mt-1.5 text-xs font-semibold text-foreground">
                    from CHF {t.priceFrom}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>

        <a
          href={VIEW_ALL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg border bg-card px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted/40 sm:w-auto"
        >
          Browse all check-ups
          <ArrowRight className="h-3.5 w-3.5" />
        </a>
      </section>

      {/* How it works + inline form */}
      <section id="request" className="border-t bg-muted/30 py-12 sm:py-16">
        <div className="mx-auto grid max-w-5xl gap-10 px-5 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold sm:text-3xl">How it works</h2>
            <ol className="mt-6 space-y-4">
              {HOW_IT_WORKS.map((s) => (
                <li key={s.step} className="flex gap-4">
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                    style={{ backgroundImage: 'var(--brand-gradient)' }}
                  >
                    {s.step}
                  </div>
                  <div>
                    <p className="text-sm font-semibold sm:text-base">{s.title}</p>
                    <p className="mt-0.5 text-sm text-muted-foreground">{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <form className="rounded-2xl border bg-card p-5 ring-1 ring-foreground/10 sm:p-6">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Get your voucher
            </p>
            <h3 className="mt-1 text-xl font-bold sm:text-2xl">Request your code</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              We&apos;ll only use your email to send your voucher code.
            </p>
            <label htmlFor="email-c" className="mt-5 block text-sm font-medium">
              Work email
            </label>
            <input
              id="email-c"
              type="email"
              placeholder={`name@${COMPANY_NAME.toLowerCase().replace(/\s+/g, '')}.com`}
              className="mt-1.5 h-12 w-full rounded-lg border border-input bg-background px-4 text-base outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
            <button
              type="button"
              className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-lg text-base font-semibold text-white shadow-sm transition-all hover:brightness-110 active:translate-y-px"
              style={{ backgroundImage: 'var(--brand-gradient)' }}
            >
              <Mail className="h-4 w-4" />
              Request voucher code
            </button>
          </form>
        </div>
      </section>

      <footer className="mt-12 text-center text-xs text-muted-foreground">
        Powered by{' '}
        <a href="https://yourself.health" target="_blank" className="underline hover:text-foreground">
          Health Yourself
        </a>
      </footer>

      {/* Sticky mobile CTA */}
      <a
        href="#request"
        className="fixed inset-x-0 bottom-0 z-50 flex h-14 items-center justify-center gap-2 text-base font-semibold text-white shadow-lg sm:hidden"
        style={{ backgroundImage: 'var(--brand-gradient)' }}
      >
        <Mail className="h-4 w-4" />
        Get my voucher code
      </a>
    </main>
  )
}

function PreviewBar({ option, title }: { option: string; title: string }) {
  return (
    <div className="border-b bg-muted/40 px-4 py-2 text-xs sm:flex sm:items-center sm:justify-between sm:px-5">
      <div className="flex items-center gap-2">
        <Link href="/preview" className="inline-flex items-center gap-1 hover:underline">
          <ArrowLeft className="h-3 w-3" />
          All previews
        </Link>
        <span className="text-muted-foreground">·</span>
        <span className="font-medium">
          Option {option}: <span className="font-normal text-muted-foreground">{title}</span>
        </span>
      </div>
      <div className="mt-1 sm:mt-0">
        <Link
          href="/preview/option-b"
          className="text-muted-foreground hover:text-foreground hover:underline"
        >
          ← Option B
        </Link>
      </div>
    </div>
  )
}
