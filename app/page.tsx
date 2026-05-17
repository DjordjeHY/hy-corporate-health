import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 text-center">
      <h1 className="mb-4 text-4xl font-bold">Welcome to My App</h1>
      <p className="mb-8 max-w-md text-gray-600">
        This is your starting point. Edit{' '}
        <code className="rounded bg-gray-100 px-1 font-mono">app/page.tsx</code>{' '}
        to customize this page.
      </p>
      <div className="flex gap-4">
        <Link href="/login">
          <Button>Sign in</Button>
        </Link>
        <Link href="/signup">
          <Button variant="outline">Create account</Button>
        </Link>
      </div>
    </main>
  )
}
