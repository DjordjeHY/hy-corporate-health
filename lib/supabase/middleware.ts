import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  const isAdminArea = pathname.startsWith('/admin')
  const isAdminLogin = pathname === '/admin/login' || pathname.startsWith('/admin/login/')

  if (isAdminArea && !isAdminLogin) {
    if (!user) {
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = '/admin/login'
      redirectUrl.searchParams.set('redirectedFrom', pathname)
      return NextResponse.redirect(redirectUrl)
    }

    // Allowlist check: is the signed-in user in admin_users?
    const { data: row } = await supabase
      .from('admin_users')
      .select('id')
      .ilike('email', user.email ?? '')
      .maybeSingle()

    if (!row) {
      await supabase.auth.signOut()
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = '/admin/login'
      redirectUrl.searchParams.set('error', 'not_authorised')
      return NextResponse.redirect(redirectUrl)
    }
  }

  if (isAdminLogin && user) {
    const { data: row } = await supabase
      .from('admin_users')
      .select('id')
      .ilike('email', user.email ?? '')
      .maybeSingle()
    if (row) {
      return NextResponse.redirect(new URL('/admin', request.url))
    }
  }

  return response
}
