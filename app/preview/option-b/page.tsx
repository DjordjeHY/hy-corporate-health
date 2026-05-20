import Link from 'next/link'
import { ArrowLeft, ArrowRight, FlaskConical, Mail, MailCheck } from 'lucide-react'
import {
  COMPANY_NAME,
  FEATURED_TESTS,
  HOW_IT_WORKS,
  VIEW_ALL_URL,
} from '../_data'

const STEP_ICONS = [Mail, MailCheck, FlaskConical] as const

// yourself.health brand-aligned mockup.
// Hero gradient sampled from theme/assets/homepage-hero-gradient.css.
const HERO_BG = 'linear-gradient(90deg, rgb(89,70,149) 0%, rgb(149,80,120) 100%)'
const BRAND_GRADIENT = 'linear-gradient(90deg, #564494, #FF6145)'

export default function OptionB() {
  return (
    <main className="min-h-screen bg-background pb-16">
      <PreviewBar option="B" title="yourself.health storefront" />

      {/* Inset rounded hero card */}
      <section className="px-3 pt-3 sm:px-5 sm:pt-5">
        <div
          className="relative mx-auto overflow-hidden rounded-[24px] px-5 py-8 text-white sm:rounded-[32px] sm:px-12 sm:py-14 lg:max-w-7xl lg:px-16 lg:py-20"
          style={{ background: HERO_BG }}
        >
          {/* Dual logos: company × Health Yourself, same size, centered */}
          <div className="flex items-center justify-center gap-3 sm:gap-5">
            <span className="text-sm font-medium tracking-[0.08em] text-white sm:text-lg">
              {COMPANY_NAME}
            </span>
            <span className="text-lg text-white/55 sm:text-2xl">×</span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-white.svg" alt="Health Yourself" className="h-5 w-auto sm:h-7" />
          </div>

          <div className="mx-auto mt-8 max-w-3xl text-center sm:mt-12">
            <h1 className="text-[34px] font-normal leading-[1.1] tracking-[-0.5px] sm:text-[48px] sm:tracking-[-0.9px] lg:text-[60px] lg:tracking-[-1.1px]">
              Get your personal check-up voucher{' '}
              <span className="text-white/55">from {COMPANY_NAME}.</span>
            </h1>
            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-white/85 sm:mt-6 sm:max-w-xl sm:text-base">
              Enter your work email — we&apos;ll send your code in seconds.
            </p>
          </div>

          <form className="mx-auto mt-7 max-w-xl sm:mt-10">
            {/* White pill email field — Airbnb-style affordance */}
            <div className="flex items-center rounded-full bg-white px-5 py-3 shadow-lg ring-1 ring-black/5 sm:px-6 sm:py-3.5">
              <div className="min-w-0 flex-1">
                <label
                  htmlFor="email"
                  className="block text-[11px] font-semibold tracking-[0.6px] text-foreground sm:text-xs"
                >
                  Work email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder={`name@${COMPANY_NAME.toLowerCase().replace(/\s+/g, '')}.com`}
                  className="mt-0.5 w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground/70 outline-none sm:text-base"
                />
              </div>
            </div>

            <div className="mt-5 flex justify-center">
              <button
                type="button"
                className="inline-flex h-10 items-center justify-center rounded-full bg-white px-6 text-sm font-medium tracking-[0.25px] text-[#c45760] transition-all hover:bg-white/90"
              >
                Request voucher code
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* How it works — storefront-style centered heading + numbered icon cards */}
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
          {HOW_IT_WORKS.map((s, i) => {
            const Icon = STEP_ICONS[i]
            return (
              <li key={s.step}>
                <span className="inline-flex items-center justify-center rounded-full border border-foreground/15 px-3 py-1 text-[11px] font-medium tracking-wide text-foreground">
                  {String(s.step).padStart(2, '0')}
                </span>
                <Icon className="mt-5 h-7 w-7 stroke-[1.5] text-foreground" />
                <p className="mt-3 text-lg font-normal leading-snug tracking-[-0.2px] sm:text-xl">
                  {s.title}
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
              </li>
            )
          })}
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
                <p className="mt-1.5 text-sm font-medium text-foreground">
                  CHF {t.priceFrom}
                </p>
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

      {/* View all CTA */}
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

function Field({
  label,
  name,
  type,
  placeholder,
}: {
  label: string
  name: string
  type: string
  placeholder: string
}) {
  return (
    <div className="relative">
      <label
        htmlFor={name}
        className="absolute left-4 top-2 text-[11px] font-medium uppercase tracking-[0.4px] text-white/70"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        className="h-[68px] w-full rounded-lg border border-white/60 bg-white/15 px-4 pb-2 pt-6 text-base text-white placeholder:text-white/55 outline-none transition-colors focus:border-white focus:bg-white/20"
      />
    </div>
  )
}

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-6">
      <span className="text-xs font-medium uppercase tracking-[0.2px] text-foreground sm:text-sm">
        {children}
      </span>
      <div className="h-px flex-1 bg-foreground/10" />
    </div>
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
    </div>
  )
}
