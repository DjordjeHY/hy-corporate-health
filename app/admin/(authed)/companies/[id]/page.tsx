import Link from 'next/link'
import { notFound } from 'next/navigation'
import { AlertTriangle, ArrowLeft, CheckCircle2, ExternalLink, Globe, Mail, Tag } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

const LANGUAGE_LABEL: Record<string, string> = {
  en: 'English',
  de: 'German',
  fr: 'French',
  it: 'Italian',
}

function formatDate(d: string | null | undefined) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-CH', { day: 'numeric', month: 'short', year: 'numeric' })
}

function formatMonth(d: string) {
  return new Date(d).toLocaleDateString('en-CH', { month: 'long', year: 'numeric' })
}

function addMonths(date: Date, months: number): Date {
  const d = new Date(date)
  d.setMonth(d.getMonth() + months)
  return d
}

export default async function CompanyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: company } = await supabase
    .from('companies')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (!company) notFound()

  const { data: vouchers } = await supabase
    .from('vouchers')
    .select('id, code, claimed_by_email, claimed_at, email_sent_at')
    .eq('company_id', id)
    .order('claimed_at', { ascending: false, nullsFirst: false })

  const total = vouchers?.length ?? 0
  const claimed = vouchers?.filter((v) => v.claimed_at).length ?? 0
  const remaining = total - claimed
  const upfrontThreshold = Math.floor((company.employee_count * company.upfront_payment_pct) / 100)
  const aboveThreshold = Math.max(0, claimed - upfrontThreshold)

  // Monthly breakdown of claims
  const byMonth = new Map<string, number>()
  for (const v of vouchers ?? []) {
    if (!v.claimed_at) continue
    const monthKey = v.claimed_at.slice(0, 7) // YYYY-MM
    byMonth.set(monthKey, (byMonth.get(monthKey) ?? 0) + 1)
  }
  const monthRows = Array.from(byMonth.entries()).sort((a, b) => b[0].localeCompare(a[0]))

  const startDate = new Date(company.start_date)
  const endDate = addMonths(startDate, company.service_period_months)
  const today = new Date()
  const expired = today > endDate
  const lowStock = remaining < 3

  return (
    <div className="p-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <div>
          <Link
            href="/admin/companies"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Companies
          </Link>
          <div className="mt-2">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Company
            </p>
            <h1 className="text-2xl font-bold">{company.name}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Employees redeem at{' '}
              <a
                href={`/${company.slug}`}
                target="_blank"
                className="inline-flex items-center gap-1 font-medium text-foreground hover:underline"
              >
                corporate.healthyourself.ch/{company.slug}
                <ExternalLink className="h-3 w-3" />
              </a>
            </p>
          </div>
        </div>

        {(expired || lowStock || aboveThreshold > 0) && (
          <div className="space-y-2">
            {aboveThreshold > 0 && (
              <Banner
                tone="warning"
                icon={AlertTriangle}
                title={`Invoice due — ${aboveThreshold} ${aboveThreshold === 1 ? 'voucher' : 'vouchers'} above the prepaid threshold.`}
                body={`${claimed} claimed vs. ${upfrontThreshold} prepaid (${company.upfront_payment_pct}% of ${company.employee_count} employees).`}
              />
            )}
            {lowStock && remaining > 0 && (
              <Banner
                tone="warning"
                icon={AlertTriangle}
                title={`Only ${remaining} ${remaining === 1 ? 'voucher' : 'vouchers'} left to issue.`}
                body="Consider importing more codes before this company runs out."
              />
            )}
            {remaining === 0 && (
              <Banner
                tone="error"
                icon={AlertTriangle}
                title="No vouchers left to issue."
                body="Employees attempting to claim will see an error."
              />
            )}
            {expired && (
              <Banner
                tone="error"
                icon={AlertTriangle}
                title="Service period has ended."
                body={`Ended ${formatDate(endDate.toISOString())}. Employees attempting to claim see the 'employer doesn't offer' message.`}
              />
            )}
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard label="Total vouchers" value={total} />
          <StatCard label="Claimed" value={claimed} subtitle={total > 0 ? `${Math.round((claimed / total) * 100)}% of total` : undefined} />
          <StatCard label="Remaining" value={remaining} />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <section className="rounded-xl bg-card p-6 ring-1 ring-foreground/10">
            <h2 className="text-base font-semibold">Details</h2>
            {company.logo_url ? (
              <div className="mt-4 space-y-1.5">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Landing-page logo
                </p>
                <div
                  className="flex h-20 items-center justify-center rounded-lg"
                  style={{ backgroundImage: 'var(--brand-gradient)' }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={company.logo_url} alt={company.name} className="h-8 w-auto" />
                </div>
              </div>
            ) : (
              <div className="mt-4 space-y-1.5">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Landing-page logo
                </p>
                <div className="flex h-20 items-center justify-center rounded-lg border border-dashed bg-muted/30 text-xs text-muted-foreground">
                  No logo uploaded
                </div>
              </div>
            )}
            <dl className="mt-5 space-y-2.5 text-sm">
              <Row icon={Mail} label="Email domain" value={company.email_domain} />
              <Row icon={Globe} label="Language" value={LANGUAGE_LABEL[company.language] ?? company.language} />
              <Row icon={Tag} label="Voucher value" value={`CHF ${Number(company.voucher_value_chf).toFixed(2)}`} />
              <Row icon={Tag} label="Discount" value={`${Number(company.discount_pct).toFixed(0)}%`} />
              <Row icon={CheckCircle2} label="Employees" value={String(company.employee_count)} />
              <Row icon={CheckCircle2} label="Up-front payment" value={`${Number(company.upfront_payment_pct).toFixed(0)}% (${upfrontThreshold} vouchers)`} />
              <Row icon={CheckCircle2} label="Service period" value={`${formatDate(company.start_date)} → ${formatDate(endDate.toISOString())}`} />
            </dl>
          </section>

          <section className="rounded-xl bg-card p-6 ring-1 ring-foreground/10">
            <h2 className="text-base font-semibold">Vouchers redeemed by month</h2>
            {monthRows.length === 0 ? (
              <p className="mt-4 text-sm text-muted-foreground">No vouchers redeemed yet.</p>
            ) : (
              <div className="mt-4 overflow-hidden rounded-lg border">
                <div className="grid grid-cols-[1fr_80px] gap-3 border-b bg-muted/30 px-4 py-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  <span>Month</span>
                  <span className="text-right">Codes</span>
                </div>
                <div className="divide-y">
                  {monthRows.map(([month, count]) => (
                    <div key={month} className="grid grid-cols-[1fr_80px] items-center gap-3 px-4 py-2.5">
                      <span className="text-sm">{formatMonth(month + '-01')}</span>
                      <span className="text-right text-sm font-medium">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>

        <section className="rounded-xl bg-card p-6 ring-1 ring-foreground/10">
          <h2 className="text-base font-semibold">All vouchers</h2>
          <div className="mt-4 overflow-hidden rounded-lg border">
            <div className="grid grid-cols-[1.4fr_1.6fr_1fr_120px] gap-3 border-b bg-muted/30 px-4 py-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              <span>Code</span>
              <span>Claimed by</span>
              <span>Claimed</span>
              <span className="text-right">Status</span>
            </div>
            <div className="divide-y">
              {(vouchers ?? []).map((v) => (
                <div key={v.id} className="grid grid-cols-[1.4fr_1.6fr_1fr_120px] items-center gap-3 px-4 py-2.5">
                  <span className="font-mono text-sm">{v.code}</span>
                  <span className="text-sm text-muted-foreground">
                    {v.claimed_by_email ?? '—'}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {v.claimed_at ? formatDate(v.claimed_at) : '—'}
                  </span>
                  <div className="text-right">
                    {v.claimed_at ? (
                      <span className="inline-block rounded-4xl bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-950 dark:text-green-300">
                        Claimed
                      </span>
                    ) : (
                      <span className="inline-block rounded-4xl bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                        Available
                      </span>
                    )}
                  </div>
                </div>
              ))}
              {(!vouchers || vouchers.length === 0) && (
                <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                  No vouchers uploaded.
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

function StatCard({
  label,
  value,
  subtitle,
}: {
  label: string
  value: number
  subtitle?: string
}) {
  return (
    <div className="rounded-xl bg-card p-5 ring-1 ring-foreground/10">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-2 text-3xl font-bold">{value.toLocaleString()}</p>
      {subtitle && <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>}
    </div>
  )
}

function Row({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <dt className="flex items-center gap-2 text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </dt>
      <dd className="text-right font-medium">{value}</dd>
    </div>
  )
}

function Banner({
  tone,
  icon: Icon,
  title,
  body,
}: {
  tone: 'warning' | 'error'
  icon: React.ComponentType<{ className?: string }>
  title: string
  body: string
}) {
  const styles =
    tone === 'error'
      ? 'border-destructive/40 bg-destructive/5 text-destructive'
      : 'border-orange-300/60 bg-orange-50 text-orange-700 dark:border-orange-800/40 dark:bg-orange-950/20 dark:text-orange-400'
  return (
    <div className={`flex items-start gap-3 rounded-lg border p-4 ${styles}`}>
      <Icon className="mt-0.5 h-4 w-4 shrink-0" />
      <div className="space-y-0.5">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-sm opacity-90">{body}</p>
      </div>
    </div>
  )
}
