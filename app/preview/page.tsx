import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function PreviewIndex() {
  return (
    <main className="mx-auto min-h-screen max-w-3xl px-5 py-12 sm:py-16">
      <div className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Design preview
        </p>
        <h1 className="text-2xl font-bold sm:text-3xl">Customer landing page</h1>
        <p className="text-sm text-muted-foreground sm:text-base">
          Aligned with the yourself.health visual system (dusty purple hero, light-weight type,
          rounded inset cards, gradient pill CTAs). Fully responsive.
        </p>
      </div>

      <Link
        href="/preview/option-b"
        className="group mt-8 block rounded-xl border bg-card p-5 ring-1 ring-foreground/10 transition-colors hover:bg-muted/40 sm:p-6"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Recommended
            </p>
            <h2 className="mt-1 text-lg font-bold sm:text-xl">yourself.health storefront</h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Editorial hero card with co-branding, integrated email form on the gradient, product
              cards in your existing site style.
            </p>
          </div>
          <ArrowRight className="mt-1 h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
        </div>
      </Link>

      <details className="mt-6">
        <summary className="cursor-pointer text-xs text-muted-foreground hover:text-foreground">
          Earlier mockups (off-brand — kept for reference)
        </summary>
        <div className="mt-3 space-y-2 pl-3 text-sm">
          <Link
            href="/preview/option-a"
            className="block text-muted-foreground hover:text-foreground hover:underline"
          >
            Option A — Direct & focused
          </Link>
          <Link
            href="/preview/option-c"
            className="block text-muted-foreground hover:text-foreground hover:underline"
          >
            Option C — Product showcase first
          </Link>
        </div>
      </details>

      <p className="mt-10 text-xs text-muted-foreground">
        Product card art is still placeholder gradient blocks — real product imagery from Shopify
        will replace these at build time.
      </p>
    </main>
  )
}
