'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export type CreateCompanyResult = { error: string } | { success: true; id: string }

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function normaliseDomain(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/^@+/, '')
    .replace(/^https?:\/\//, '')
    .replace(/\/.*$/, '')
}

function parseVoucherCsv(raw: string): { codes: string[]; error?: string } {
  const lines = raw
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0)
  if (lines.length < 2) {
    return { codes: [], error: 'CSV is empty or only contains a header row.' }
  }
  // Drop header row (always — Shopify export has "Gift Cards" header)
  const codes = lines.slice(1)
  const seen = new Set<string>()
  for (const code of codes) {
    if (seen.has(code)) {
      return { codes: [], error: `Duplicate code in CSV: ${code}` }
    }
    seen.add(code)
  }
  return { codes }
}

export async function createCompany(formData: FormData): Promise<CreateCompanyResult> {
  const supabase = await createClient()

  // Read + coerce fields
  const name = String(formData.get('name') ?? '').trim()
  const slug = slugify(String(formData.get('slug') ?? '') || name)
  const emailDomain = normaliseDomain(String(formData.get('email_domain') ?? ''))
  const language = String(formData.get('language') ?? 'en')
  const voucherValue = Number(formData.get('voucher_value_chf'))
  const discountPct = Number(formData.get('discount_pct'))
  const employeeCount = Number(formData.get('employee_count'))
  const startDate = String(formData.get('start_date') ?? '')
  const servicePeriodMonths = Number(formData.get('service_period_months') || 12)
  const upfrontPct = Number(formData.get('upfront_payment_pct'))
  const logoFile = formData.get('logo') as File | null
  const csvFile = formData.get('voucher_csv') as File | null

  // Basic validation
  if (!name) return { error: 'Company name is required.' }
  if (!slug) return { error: 'Slug is required.' }
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))
    return { error: 'Slug must be lowercase letters, numbers, and hyphens only.' }
  if (!emailDomain || !emailDomain.includes('.'))
    return { error: 'Email domain looks invalid (e.g. use "bmw.de").' }
  if (!['en', 'de', 'fr', 'it'].includes(language))
    return { error: 'Language must be English, German, French, or Italian.' }
  if (!Number.isFinite(voucherValue) || voucherValue <= 0)
    return { error: 'Voucher value must be a positive number.' }
  if (!Number.isFinite(discountPct) || discountPct < 0 || discountPct > 100)
    return { error: 'Discount must be between 0 and 100%.' }
  if (!Number.isInteger(employeeCount) || employeeCount <= 0)
    return { error: 'Number of employees must be a whole number greater than zero.' }
  if (!startDate) return { error: 'Start date is required.' }
  if (!Number.isInteger(servicePeriodMonths) || servicePeriodMonths <= 0)
    return { error: 'Service period must be a whole number of months.' }
  if (!Number.isFinite(upfrontPct) || upfrontPct < 0 || upfrontPct > 100)
    return { error: 'Up-front payment % must be between 0 and 100.' }
  if (!csvFile || csvFile.size === 0) return { error: 'Voucher CSV file is required.' }

  // Parse CSV first (cheap, no DB writes)
  const csvText = await csvFile.text()
  const { codes, error: csvError } = parseVoucherCsv(csvText)
  if (csvError) return { error: csvError }
  if (codes.length !== employeeCount) {
    return {
      error: `CSV contains ${codes.length} voucher codes but employee count is ${employeeCount}. They must match.`,
    }
  }

  // Uniqueness checks
  const { data: slugClash } = await supabase
    .from('companies')
    .select('id')
    .eq('slug', slug)
    .maybeSingle()
  if (slugClash) return { error: `A company with slug "${slug}" already exists.` }

  const { data: domainClash } = await supabase
    .from('companies')
    .select('id, name')
    .ilike('email_domain', emailDomain)
    .maybeSingle()
  if (domainClash)
    return { error: `Email domain "${emailDomain}" is already used by ${domainClash.name}.` }

  // Insert company (without logo first)
  const { data: company, error: insertError } = await supabase
    .from('companies')
    .insert({
      name,
      slug,
      email_domain: emailDomain,
      language,
      voucher_value_chf: voucherValue,
      discount_pct: discountPct,
      employee_count: employeeCount,
      start_date: startDate,
      service_period_months: servicePeriodMonths,
      upfront_payment_pct: upfrontPct,
    })
    .select('id')
    .single()
  if (insertError || !company) {
    return { error: insertError?.message ?? 'Failed to create company.' }
  }

  // Upload logo if provided
  if (logoFile && logoFile.size > 0) {
    const ext = (logoFile.name.split('.').pop() || 'png').toLowerCase()
    const path = `${company.id}/logo.${ext}`
    const { error: uploadError } = await supabase.storage
      .from('company-logos')
      .upload(path, logoFile, {
        upsert: true,
        contentType: logoFile.type || undefined,
      })
    if (uploadError) {
      await supabase.from('companies').delete().eq('id', company.id)
      return { error: `Logo upload failed: ${uploadError.message}` }
    }
    const {
      data: { publicUrl },
    } = supabase.storage.from('company-logos').getPublicUrl(path)
    await supabase.from('companies').update({ logo_url: publicUrl }).eq('id', company.id)
  }

  // Insert vouchers in bulk
  const voucherRows = codes.map((code) => ({ company_id: company.id, code }))
  const { error: voucherError } = await supabase.from('vouchers').insert(voucherRows)
  if (voucherError) {
    await supabase.from('companies').delete().eq('id', company.id)
    return { error: `Voucher import failed: ${voucherError.message}` }
  }

  revalidatePath('/admin')
  revalidatePath('/admin/companies')
  redirect(`/admin/companies`)
}
