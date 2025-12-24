import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (!code) {
    return NextResponse.redirect(
      new URL('/auth/login?error=oauth_error', request.url)
    )
  }

  try {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      return NextResponse.redirect(
        new URL('/auth/login?error=oauth_error', request.url)
      )
    }

    // Redirect to a client page so we can safely set localStorage (SSR-safe),
    // then send the user to the intended destination.
    return NextResponse.redirect(new URL('/auth/oauth-success?next=/dashboard', request.url))
  } catch {
    return NextResponse.redirect(
      new URL('/auth/login?error=oauth_error', request.url)
    )
  }
}

