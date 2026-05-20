import Link from 'next/link'
import { ArrowLeft, ArrowRight, Mail } from 'lucide-react'
import {
  COMPANY_NAME,
  FEATURED_TESTS,
  HOW_IT_WORKS,
  VIEW_ALL_URL,
} from '../_data'

export default function OptionA() {
  return (
    <main className="min-h-screen bg-background">
      <PreviewBar option="A" title="Direct & focused" />

      {/* Slim co-brand strip */}
      <header
        className="flex items-center justify-between px-5 py-3 sm:px-6"
        style={{ backgroundImage: 'var(--brand-gradient)' }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-white.svg" alt="Health Yourself" className="h-5 w-auto sm:h-6" />
        <span className="text-xs font-medium uppercase tracking-wide text-white/90 sm:text-sm">
          × {COMPANY_NAME}
        </span>
      </header>

      <div className="mx-auto max-w-xl px-5 py-10 sm:py-14">
        <div className="space-y-2 text-center">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {COMPANY_NAME} × Health Yourself
          </p>
          <h1 className="text-3xl font-bold leading-tight sm:text-4xl">
            Claim your personal check-up voucher
          </h1>
          <p className="mx-auto max-w-md text-sm text-muted-foreground sm:text-base">
            Enter your work email below and we&apos;ll send a code you can use on any check-up from
            yourself.health.
          </p>
        </div>

        <form className="mt-8 space-y-3 rounded-2xl border bg-card p-5 ring-1 ring-foreground/10 sm:p-6">
          <label htmlFor="email" className="block text-sm font-medium">
            Work email
          </label>
          <input
            id="email"
            type="email"
            placeholder={`name@${COMPANY_NAME.toLowerCase().replace(/\s+/g, '')}.com`}
            className="h-12 w-full rounded-lg border border-input bg-background px-4 text-base outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
          <button
            type="button"
            className="flex h-12 w-full items-center justify-center gap-2 rounded-lg text-base font-semibold text-white shadow-sm transition-all hover:brightness-110 active:translate-y-px"
            style={{ backgroundImage: 'var(--brand-gradient)' }}
          >
            <Mail className="h-4 w-4" />
            Request voucher code
          </button>
          <p className="text-center text-xs text-muted-foreground">
            We&apos;ll only use your email to send your voucher code.
          </p>
        </form>

        <section className="mt-12">
          <h2 className="text-center text-lg font-bold sm:text-xl">How it works</h2>
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
        </section>

        <section className="mt-12">
          <h2 className="text-lg font-bold sm:text-xl">Most popular check-ups</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Pick a test that fits — your voucher works on any of them.
          </p>
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {FEATURED_TESTS.map((t) => (
              <a
                key={t.name}
                href={t.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group overflow-hidden rounded-xl border bg-card ring-1 ring-foreground/10 transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <div
                  className={`flex h-28 items-center justify-center bg-gradient-to-br ${t.hue} p-4 text-center text-white sm:h-32`}
                >
                  <span className="text-lg font-bold leading-tight">{t.name}</span>
                </div>
                <div className="p-4">
                  <p className="text-xs text-muted-foreground">{t.tagline}</p>
                  <p className="mt-2 text-sm font-semibold">from CHF {t.priceFrom}</p>
                </div>
              </a>
            ))}
          </div>
        </section>

        <a
          href={VIEW_ALL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 flex h-12 w-full items-center justify-center gap-2 rounded-lg text-base font-semibold text-white shadow-sm transition-all hover:brightness-110"
          style={{ backgroundImage: 'var(--brand-gradient)' }}
        >
          View all check-ups
          <ArrowRight className="h-4 w-4" />
        </a>

        <footer className="mt-12 text-center text-xs text-muted-foreground">
          Powered by{' '}
          <a href="https://yourself.health" target="_blank" className="underline hover:text-foreground">
            Health Yourself
          </a>
        </footer>
      </div>
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
          Next: Option B →
        </Link>
      </div>
    </div>
  )
}
