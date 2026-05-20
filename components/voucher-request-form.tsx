'use client'

import { useState, useTransition } from 'react'
import { claimVoucher, type ClaimResult } from '@/app/[slug]/actions'

const SUPPORT_EMAIL = 'hello@yourself.health'

export function VoucherRequestForm({
  slug,
  emailDomain,
}: {
  slug: string
  companyName?: string
  emailDomain: string
}) {
  const [email, setEmail] = useState('')
  const [pending, startTransition] = useTransition()
  const [result, setResult] = useState<ClaimResult | null>(null)

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setResult(null)
    startTransition(async () => {
      setResult(await claimVoucher(slug, email))
    })
  }

  // Success — voucher emailed
  if (result?.status === 'sent') {
    return (
      <div className="mx-auto mt-7 max-w-xl rounded-[20px] bg-white p-6 text-center shadow-lg ring-1 ring-black/5 sm:mt-10 sm:p-8">
        <p className="text-base font-medium leading-relaxed text-foreground sm:text-lg">
          We have sent your personal voucher to the provided email address.
        </p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Can&apos;t find it? Also check your spam folder.
        </p>
      </div>
    )
  }

  // Error / informational states
  if (result && result.status !== 'error') {
    const messages: Record<string, string> = {
      wrong_domain:
        'Unfortunately, your employer does not currently offer check-ups with us. Alternatively, you might have made a mistake when entering your company email address.',
      unknown_company:
        'Unfortunately, your employer does not currently offer check-ups with us.',
      expired: 'Unfortunately, your employer does not currently offer check-ups with us.',
      no_vouchers: `An error occurred when issuing your voucher code. Please contact our support under ${SUPPORT_EMAIL}.`,
      email_failed: `We couldn't send your voucher email just now. Please try again in a moment, or contact ${SUPPORT_EMAIL}.`,
    }
    const msg = messages[result.status]
    if (msg) {
      return (
        <div className="mx-auto mt-7 max-w-xl rounded-[20px] bg-white/95 p-6 text-center shadow-lg ring-1 ring-black/5 sm:mt-10 sm:p-7">
          <p className="text-sm leading-relaxed text-foreground">{msg}</p>
          <button
            type="button"
            onClick={() => {
              setResult(null)
              setEmail('')
            }}
            className="mt-4 text-sm font-medium text-[#c45760] underline-offset-4 hover:underline"
          >
            Try again
          </button>
        </div>
      )
    }
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto mt-7 max-w-xl sm:mt-10">
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
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={`name@${emailDomain}`}
            className="mt-0.5 w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground/70 outline-none sm:text-base"
          />
        </div>
      </div>

      {result?.status === 'error' && (
        <p className="mt-3 text-center text-xs text-white">
          Something went wrong. Please try again.
        </p>
      )}

      <div className="mt-5 flex justify-center">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-10 items-center justify-center rounded-full bg-white px-6 text-sm font-medium tracking-[0.25px] text-[#c45760] transition-all hover:bg-white/90 disabled:opacity-70"
        >
          {pending ? 'Requesting…' : 'Request voucher code'}
        </button>
      </div>
    </form>
  )
}
