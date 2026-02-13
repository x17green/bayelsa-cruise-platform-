import { NextResponse } from 'next/server'

import { createClient } from '@/src/lib/supabase/server'

/**
 * Auth callback handler for OAuth providers and email confirmation
 * Exchanges auth code for session
 */
export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const origin = requestUrl.origin
  const redirectTo = requestUrl.searchParams.get('redirect_to')?.toString()

  if (code) {
    const supabase = await createClient()
    const { data } = await supabase.auth.exchangeCodeForSession(code)
    
    // If we have a session, check user role for redirect
    if (data.user) {
      const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', data.user.id)
        .maybeSingle()
      
      const userRole = userData?.role || 'customer'
      
      // If no redirect specified, use role-based routing
      if (!redirectTo) {
        const defaultRedirect = (userRole === 'operator' || userRole === 'staff' || userRole === 'admin')
          ? '/operator/dashboard'
          : '/dashboard'
        return NextResponse.redirect(`${origin}${defaultRedirect}`)
      }
    }
  }

  // Redirect to provided URL or fallback to customer dashboard
  return NextResponse.redirect(redirectTo ? `${origin}${redirectTo}` : `${origin}/dashboard`)
}
