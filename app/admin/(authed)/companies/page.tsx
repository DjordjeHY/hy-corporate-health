import Link from 'next/link'
import { Building2, Plus } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'

const LANGUAGE_LABEL: Record<string, string> = {
  en: 'English',
  de: 'German',
  fr: 'French',
  it: 'Italian',
}

export default async function CompaniesPage() {
  const supabase = await createClient()

  // Pull companies with voucher counts
  const { data: companies } = await supabase
    .from('companies')
    .select('id, name, slug, email_domain, language, voucher_value_chf, discount_pct, employee_count, start_date')
    .order('created_at', { ascending: false })

  let countsByCompany: Record<string, { total: number; claimed: number }> = {}
  if (companies && companies.length > 0) {
    const ids = companies.map((c) => c.id)
    const { data: vouchers } = await supabase
      .from('vouchers')
      .select('company_id, claimed_at')
      .in('company_id', ids)
    if (vouchers) {
      for (const row of vouchers) {
        const c = (countsByCompany[row.company_id] ??= { total: 0, claimed: 0 })
        c.total += 1
        if (row.claimed_at) c.claimed += 1
      }
    }
  }

  return (
    <div className="p-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Companies
            </p>
            <h1 className="text-2xl font-bold">Corporate clients</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {companies?.length ?? 0} {companies?.length === 1 ? 'company' : 'companies'} configured.
            </p>
          </div>
          <Link href="/admin/companies/new">
            <Button>
              <Plus className="h-4 w-4" />
              New company
            </Button>
          </Link>
        </div>

        {(!companies || companies.length === 0) ? (
          <div className="rounded-xl border bg-card p-12 text-center ring-1 ring-foreground/10">
            <Building2 className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-3 text-sm font-medium">No companies yet</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Add your first corporate client to start issuing voucher codes.
            </p>
            <Link href="/admin/companies/new" className="mt-4 inline-block">
              <Button variant="outline">
                <Plus className="h-4 w-4" />
                New company
              </Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border">
            <div className="grid grid-cols-[1.4fr_1fr_120px_180px_140px] gap-3 border-b bg-muted/30 px-4 py-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              <span>Company</span>
              <span>Email domain</span>
              <span>Language</span>
              <span>Vouchers</span>
              <span className="text-right">Voucher value</span>
            </div>
            <div className="divide-y">
              {companies.map((c) => {
                const counts = countsByCompany[c.id] ?? { total: 0, claimed: 0 }
                return (
                  <Link
                    key={c.id}
                    href={`/admin/companies/${c.id}`}
                    className="grid grid-cols-[1.4fr_1fr_120px_180px_140px] items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/40"
                  >
                    <div>
                      <p className="font-medium">{c.name}</p>
                      <p className="text-xs text-muted-foreground">/{c.slug}</p>
                    </div>
                    <span className="text-sm text-muted-foreground">{c.email_domain}</span>
                    <span className="text-sm">{LANGUAGE_LABEL[c.language] ?? c.language}</span>
                    <div>
                      <span className="text-sm font-medium">
                        {counts.claimed} / {counts.total}
                      </span>
                      <p className="text-xs text-muted-foreground">claimed</p>
                    </div>
                    <span className="text-right text-sm">
                      CHF {Number(c.voucher_value_chf).toFixed(2)}
                    </span>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
