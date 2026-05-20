import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/admin'

  if (!code) {
    return NextResponse.redirect(`${origin}/admin/login?error=auth-callback-failed`)
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    return NextResponse.redirect(`${origin}/admin/login?error=auth-callback-failed`)
  }

  // Allowlist enforcement: only admin_users may proceed to /admin
  if (next.startsWith('/admin')) {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.redirect(`${origin}/admin/login?error=auth-callback-failed`)
    }

    const { data: row } = await supabase
      .from('admin_users')
      .select('id')
      .ilike('email', user.email ?? '')
      .maybeSingle()

    if (!row) {
      await supabase.auth.signOut()
      return NextResponse.redirect(`${origin}/admin/login?error=not_authorised`)
    }
  }

  return NextResponse.redirect(`${origin}${next}`)
}
