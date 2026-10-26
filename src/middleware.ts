// src/middleware.ts
import { NextResponse, type NextRequest } from 'next/server'
import { isValidAdminToken } from '@/lib/admin-auth'

// Protected admin API endpoints that require valid admin token
const PUBLIC_ADMIN_APIS = ['/api/admin/login', '/api/admin/logout']

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const method = req.method

  // 1. CSRF Protection for state-changing API requests
  if (pathname.startsWith('/api/') && ['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
    const origin = req.headers.get('origin')
    const host = req.headers.get('host')

    if (origin && host) {
      try {
        const originUrl = new URL(origin)
        // Check if origin host matches the request host
        if (originUrl.host !== host) {
          // Allow localhost in development
          const isDev = process.env.NODE_ENV !== 'production' && originUrl.hostname === 'localhost'
          if (!isDev) {
            return NextResponse.json(
              { error: 'Cross-origin request blocked (CSRF protection).' },
              { status: 403 }
            )
          }
        }
      } catch {
        return NextResponse.json({ error: 'Invalid origin header.' }, { status: 400 })
      }
    }
  }

  // 2. Protect Admin API Routes (/api/admin/*)
  if (pathname.startsWith('/api/admin')) {
    const isPublicAdminApi = PUBLIC_ADMIN_APIS.some((path) => pathname === path || pathname.startsWith(path + '/'))
    if (!isPublicAdminApi) {
      const adminCookie = req.cookies.get('atmodesk_admin_session')?.value
      const isAuth = await isValidAdminToken(adminCookie)

      if (!isAuth) {
        return NextResponse.json(
          { error: 'Unauthorized: Admin privileges required to access this endpoint.' },
          { status: 401 }
        )
      }
    }
  }

  // 3. Add security headers to all responses
  const response = NextResponse.next()
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), browsing-topics=()')

  return response
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/:path*',
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
