import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default async function DashboardPage() {
  const supabase = await createClient()

  // Always use getUser() in Server Components — validates with Supabase's servers.
  // Never use getSession() — it only reads cookies and can be spoofed.
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/login')
  }

  return (
    <main className="container mx-auto max-w-4xl p-8">
      <h1 className="mb-6 text-3xl font-bold">Dashboard</h1>

      <Card>
        <CardHeader>
          <CardTitle>Welcome back!</CardTitle>
          <CardDescription>You are signed in as {user.email}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            Your user ID:{' '}
            <code className="rounded bg-gray-100 px-1 font-mono text-xs">
              {user.id}
            </code>
          </p>

          <p className="text-sm text-gray-500">
            This is a protected page. Edit{' '}
            <code className="rounded bg-gray-100 px-1 font-mono">
              app/dashboard/page.tsx
            </code>{' '}
            to build your app here.
          </p>

          {/* Logout uses a form POST so it works without JavaScript */}
          <form action="/auth/logout" method="POST">
            <Button type="submit" variant="outline">
              Sign out
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}
