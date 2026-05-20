'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AlertCircle, CheckCircle2, Loader2, Mail } from 'lucide-react'

const GoogleG = () => (
  <svg aria-hidden="true" width="16" height="16" viewBox="0 0 48 48">
    <path
      fill="#FFC107"
      d="M43.6 20.5H42V20H24v8h11.3c-1.7 4.6-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.3 29.3 4.5 24 4.5 12.7 4.5 3.5 13.7 3.5 25S12.7 45.5 24 45.5 44.5 36.3 44.5 25c0-1.5-.2-3-.5-4.5z"
    />
    <path
      fill="#FF3D00"
      d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.3 29.3 4.5 24 4.5c-7.6 0-14.2 4.3-17.7 10.2z"
    />
    <path
      fill="#4CAF50"
      d="M24 45.5c5.2 0 9.9-2 13.5-5.2l-6.2-5.1c-2 1.5-4.6 2.3-7.3 2.3-5.2 0-9.6-3.4-11.3-8.1l-6.5 5C9.7 41.2 16.3 45.5 24 45.5z"
    />
    <path
      fill="#1976D2"
      d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.2 5.7l6.2 5.1c-.4.4 6.7-4.9 6.7-13.8 0-1.5-.2-3-.5-4.5z"
    />
  </svg>
)

export default function AdminLoginPage() {
  const params = useSearchParams()
  const errorParam = params.get('error')
  const redirectedFrom = params.get('redirectedFrom')
  const nextPath =
    redirectedFrom && redirectedFrom.startsWith('/admin') ? redirectedFrom : '/admin'

  const [email, setEmail] = useState('')
  const [magicLoading, setMagicLoading] = useState(false)
  const [magicSent, setMagicSent] = useState(false)
  const [magicError, setMagicError] = useState<string | null>(null)

  const [googleLoading, setGoogleLoading] = useState(false)
  const [googleError, setGoogleError] = useState<string | null>(null)

  const sendMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setMagicError(null)
    setMagicLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}`,
      },
    })
    setMagicLoading(false)
    if (error) {
      setMagicError(error.message)
      return
    }
    setMagicSent(true)
  }

  const signInWithGoogle = async () => {
    setGoogleError(null)
    setGoogleLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}`,
      },
    })
    if (error) {
      setGoogleLoading(false)
      setGoogleError(
        error.message.toLowerCase().includes('provider')
          ? 'Google sign-in isn’t set up yet. Use the magic link above for now.'
          : error.message
      )
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 p-8">
      <div className="w-full max-w-sm rounded-xl bg-card p-8 ring-1 ring-foreground/10">
        <div className="mb-6 space-y-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo-gradient.svg"
            alt="Health Yourself"
            className="mx-auto h-8 w-auto"
            onError={(e) => {
              ;(e.currentTarget as HTMLImageElement).style.display = 'none'
            }}
          />
          <div className="space-y-1.5">
            <h1 className="text-2xl font-bold text-foreground">Corporate Health Admin</h1>
            <p className="text-sm text-muted-foreground">
              Sign in with your yourself.health email.
            </p>
          </div>
        </div>

        {errorParam === 'not_authorised' && (
          <div className="mb-4 flex items-start gap-3 rounded-lg border border-destructive/40 bg-destructive/5 p-4">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
            <p className="text-sm text-destructive">
              That account isn&apos;t on the admin list. Ask an existing admin to invite you, then try again.
            </p>
          </div>
        )}
        {errorParam === 'auth-callback-failed' && (
          <div className="mb-4 flex items-start gap-3 rounded-lg border border-destructive/40 bg-destructive/5 p-4">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
            <p className="text-sm text-destructive">
              Sign-in failed. Please try again.
            </p>
          </div>
        )}

        {magicSent ? (
          <div className="flex items-start gap-3 rounded-lg border border-green-400/40 bg-green-50 p-4 dark:border-green-800/40 dark:bg-green-950/20">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-700 dark:text-green-400" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-green-700 dark:text-green-400">
                Check your inbox
              </p>
              <p className="text-sm text-green-700/90 dark:text-green-400/90">
                We sent a sign-in link to <span className="font-medium">{email}</span>. Click it to continue.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={sendMagicLink} className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@yourself.health"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {magicError && (
              <div className="flex items-start gap-3 rounded-lg border border-destructive/40 bg-destructive/5 p-3">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                <p className="text-sm text-destructive">{magicError}</p>
              </div>
            )}

            <Button type="submit" size="lg" disabled={magicLoading} className="w-full">
              {magicLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
              <span>Email me a sign-in link</span>
            </Button>
          </form>
        )}

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs uppercase tracking-wide text-muted-foreground">or</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <Button
          variant="outline"
          size="lg"
          onClick={signInWithGoogle}
          disabled={googleLoading}
          className="w-full"
        >
          {googleLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <GoogleG />}
          <span>Continue with Google</span>
        </Button>
        {googleError && (
          <p className="mt-2 text-xs text-muted-foreground">{googleError}</p>
        )}
      </div>
    </main>
  )
}
