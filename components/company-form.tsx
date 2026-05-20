'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { AlertCircle, Loader2, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createCompany } from '@/app/admin/(authed)/companies/actions'

function autoSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const selectClasses =
  'h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 outline-none transition-colors'

export function NewCompanyForm() {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [slugTouched, setSlugTouched] = useState(false)
  const [slug, setSlug] = useState('')
  const [logoName, setLogoName] = useState<string | null>(null)
  const [csvName, setCsvName] = useState<string | null>(null)
  const [csvRowCount, setCsvRowCount] = useState<number | null>(null)

  const handleNameChange = (v: string) => {
    setName(v)
    if (!slugTouched) setSlug(autoSlug(v))
  }

  const handleCsvSelected = async (file: File | null) => {
    if (!file) {
      setCsvName(null)
      setCsvRowCount(null)
      return
    }
    setCsvName(file.name)
    const text = await file.text()
    const lines = text
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter((l) => l.length > 0)
    setCsvRowCount(Math.max(0, lines.length - 1))
  }

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    const fd = new FormData(e.currentTarget)
    startTransition(async () => {
      const result = await createCompany(fd)
      if (result && 'error' in result) {
        setError(result.error)
      } else {
        router.push('/admin/companies')
      }
    })
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {error && (
        <div className="flex items-start gap-3 rounded-lg border border-destructive/40 bg-destructive/5 p-4">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      <Section title="Company">
        <Field label="Company name" htmlFor="name">
          <Input
            id="name"
            name="name"
            required
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="e.g. BMW Schweiz AG"
          />
        </Field>

        <Field
          label="URL slug"
          htmlFor="slug"
          hint="Used in the company-specific landing page URL: corporate.healthyourself.ch/your-slug"
        >
          <Input
            id="slug"
            name="slug"
            required
            value={slug}
            onChange={(e) => {
              setSlugTouched(true)
              setSlug(e.target.value)
            }}
            placeholder="e.g. bmw-schweiz"
          />
        </Field>

        <Field
          label="Email domain"
          htmlFor="email_domain"
          hint="Employees must sign up with an email at this domain — e.g. bmw.de"
        >
          <Input
            id="email_domain"
            name="email_domain"
            required
            placeholder="bmw.de"
          />
        </Field>

        <Field
          label="Language"
          htmlFor="language"
          hint="Used for emails and the company landing page."
        >
          <select id="language" name="language" defaultValue="en" className={selectClasses}>
            <option value="en">English</option>
            <option value="de">German</option>
            <option value="fr">French</option>
            <option value="it">Italian</option>
          </select>
        </Field>
      </Section>

      <Section title="Voucher details">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Voucher value (CHF)" htmlFor="voucher_value_chf">
            <Input
              id="voucher_value_chf"
              name="voucher_value_chf"
              type="number"
              min="0"
              step="0.01"
              required
              placeholder="200.00"
            />
          </Field>

          <Field label="Discount (%)" htmlFor="discount_pct">
            <Input
              id="discount_pct"
              name="discount_pct"
              type="number"
              min="0"
              max="100"
              step="0.01"
              required
              placeholder="100"
            />
          </Field>

          <Field
            label="Number of employees"
            htmlFor="employee_count"
            hint="Must equal the number of codes in your CSV."
          >
            <Input
              id="employee_count"
              name="employee_count"
              type="number"
              min="1"
              step="1"
              required
              placeholder="250"
            />
          </Field>

          <Field label="Up-front payment (%)" htmlFor="upfront_payment_pct" hint="Once this % of vouchers is redeemed, monthly invoicing kicks in.">
            <Input
              id="upfront_payment_pct"
              name="upfront_payment_pct"
              type="number"
              min="0"
              max="100"
              step="0.01"
              required
              defaultValue="100"
            />
          </Field>

          <Field label="Start date" htmlFor="start_date">
            <Input id="start_date" name="start_date" type="date" required />
          </Field>

          <Field
            label="Service period (months)"
            htmlFor="service_period_months"
            hint="How long employees can request codes for. Default: 12 months."
          >
            <Input
              id="service_period_months"
              name="service_period_months"
              type="number"
              min="1"
              step="1"
              required
              defaultValue="12"
            />
          </Field>
        </div>
      </Section>

      <Section title="Files">
        <Field
          label="Company logo"
          htmlFor="logo"
          hint="White on transparent (SVG or PNG). Shown on the company landing page hero."
        >
          <FileInput
            id="logo"
            name="logo"
            accept="image/png,image/svg+xml,image/jpeg,image/webp"
            value={logoName}
            onChange={(f) => setLogoName(f?.name ?? null)}
          />
        </Field>

        <Field
          label="Voucher codes CSV"
          htmlFor="voucher_csv"
          hint="The CSV file exported from Shopify (header row 'Gift Cards' + one code per row)."
        >
          <FileInput
            id="voucher_csv"
            name="voucher_csv"
            accept=".csv,text/csv"
            value={csvName}
            onChange={handleCsvSelected}
            extra={
              csvRowCount !== null ? (
                <p className="mt-1 text-xs text-muted-foreground">
                  {csvRowCount} {csvRowCount === 1 ? 'code' : 'codes'} detected in CSV.
                </p>
              ) : null
            }
          />
        </Field>
      </Section>

      <div className="flex items-center justify-end gap-2 border-t pt-4">
        <Button type="button" variant="outline" onClick={() => router.push('/admin/companies')}>
          Cancel
        </Button>
        <Button type="submit" size="lg" disabled={pending}>
          {pending && <Loader2 className="h-4 w-4 animate-spin" />}
          <span>{pending ? 'Creating…' : 'Create company'}</span>
        </Button>
      </div>
    </form>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4 rounded-xl bg-card p-6 ring-1 ring-foreground/10">
      <h2 className="text-base font-semibold">{title}</h2>
      <div className="space-y-4">{children}</div>
    </section>
  )
}

function Field({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string
  htmlFor: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  )
}

function FileInput({
  id,
  name,
  accept,
  value,
  onChange,
  extra,
}: {
  id: string
  name: string
  accept: string
  value: string | null
  onChange: (file: File | null) => void
  extra?: React.ReactNode
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="flex cursor-pointer items-center gap-3 rounded-md border border-dashed border-input bg-background px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted/50"
      >
        <Upload className="h-4 w-4 shrink-0" />
        <span className="truncate">
          {value ? <span className="text-foreground">{value}</span> : 'Choose file…'}
        </span>
      </label>
      <input
        id={id}
        name={name}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => onChange(e.target.files?.[0] ?? null)}
      />
      {extra}
    </div>
  )
}
