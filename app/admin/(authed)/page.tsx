import Link from 'next/link'
import { Building2, Plus, Users } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'

export default async function AdminOverviewPage() {
  const supabase = await createClient()

  const [companiesRes, vouchersRes, claimsRes] = await Promise.all([
    supabase.from('companies').select('id', { count: 'exact', head: true }),
    supabase.from('vouchers').select('id', { count: 'exact', head: true }),
    supabase
      .from('vouchers')
      .select('id', { count: 'exact', head: true })
      .not('claimed_at', 'is', null),
  ])

  const companies = companiesRes.count ?? 0
  const vouchers = vouchersRes.count ?? 0
  const claimed = claimsRes.count ?? 0

  return (
    <div className="p-8">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Overview
          </p>
          <h1 className="text-2xl font-bold">Corporate vouchers</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage companies, voucher codes, and admin access.
          </p>
        </div>
        <Link href="/admin/companies/new">
          <Button>
            <Plus className="h-4 w-4" />
            New company
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Companies" value={companies} icon={Building2} />
        <StatCard label="Total vouchers" value={vouchers} icon={Users} />
        <StatCard
          label="Vouchers claimed"
          value={claimed}
          icon={Users}
          subtitle={
            vouchers > 0 ? `${Math.round((claimed / vouchers) * 100)}% of total` : undefined
          }
        />
      </div>

      {companies === 0 && (
        <div className="mt-8 rounded-xl border bg-card p-8 text-center ring-1 ring-foreground/10">
          <p className="text-sm text-muted-foreground">No companies yet.</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Once you create one, an overview of voucher usage will appear here.
          </p>
        </div>
      )}
    </div>
  )
}

function StatCard({
  label,
  value,
  subtitle,
  icon: Icon,
}: {
  label: string
  value: number
  subtitle?: string
  icon: React.ComponentType<{ className?: string }>
}) {
  return (
    <div className="rounded-xl bg-card p-5 ring-1 ring-foreground/10">
      <div className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <p className="text-3xl font-bold">{value.toLocaleString()}</p>
      {subtitle && <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>}
    </div>
  )
}
