import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { NewCompanyForm } from '@/components/company-form'

export default function NewCompanyPage() {
  return (
    <div className="p-8">
      <div className="mx-auto max-w-2xl space-y-6">
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
              New company
            </p>
            <h1 className="text-2xl font-bold">Add a corporate client</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Once created, employees at the company can request voucher codes via{' '}
              <span className="font-medium text-foreground">corporate.healthyourself.ch/&lt;slug&gt;</span>.
            </p>
          </div>
        </div>

        <NewCompanyForm />
      </div>
    </div>
  )
}
