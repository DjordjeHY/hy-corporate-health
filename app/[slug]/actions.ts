'use server'

import { createClient } from '@/lib/supabase/server'
import { sendVoucherEmail, sendLowStockAlert } from '@/lib/mailjet'

export type ClaimResult =
  | { status: 'sent' }
  | { status: 'unknown_company' }
  | { status: 'expired' }
  | { status: 'wrong_domain' }
  | { status: 'no_vouchers' }
  | { status: 'email_failed' }
  | { status: 'error' }

export async function claimVoucher(slug: string, emailRaw: string): Promise<ClaimResult> {
  const email = emailRaw.trim().toLowerCase()
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return { status: 'wrong_domain' }
  }

  const supabase = await createClient()

  const { data, error } = await supabase.rpc('claim_voucher', {
    p_slug: slug,
    p_email: email,
  })

  if (error || !data) {
    console.error('claim_voucher error', error)
    return { status: 'error' }
  }

  const r = data as {
    status: string
    code?: string
    remaining?: number
  }

  // Pass-through failure states
  if (
    r.status === 'unknown_company' ||
    r.status === 'expired' ||
    r.status === 'wrong_domain' ||
    r.status === 'no_vouchers'
  ) {
    return { status: r.status }
  }

  if ((r.status === 'issued' || r.status === 'already_claimed') && r.code) {
    // Fetch company info for the email (name + voucher value)
    const { data: cData } = await supabase.rpc('get_company_by_slug', {
      p_slug: slug,
    })
    const company = (Array.isArray(cData) ? cData[0] : cData) as
      | { name: string; voucher_value_chf: number }
      | undefined

    const ok = await sendVoucherEmail({
      to: email,
      code: r.code,
      voucherValueChf: company?.voucher_value_chf ?? 0,
      companyName: company?.name ?? 'your employer',
    })

    if (!ok) return { status: 'email_failed' }

    // Low-stock alert (newly issued only, < 3 remaining)
    if (
      r.status === 'issued' &&
      typeof r.remaining === 'number' &&
      r.remaining < 3
    ) {
      await sendLowStockAlert({
        companyName: company?.name ?? slug,
        slug,
        remaining: r.remaining,
      })
    }

    return { status: 'sent' }
  }

  return { status: 'error' }
}
