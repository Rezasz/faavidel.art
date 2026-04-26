// middleware.ts
import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const isAdminPath = req.nextUrl.pathname.startsWith('/admin')
  const isLoginPage = req.nextUrl.pathname === '/admin'
  const isAuthenticated = !!req.auth

  if (isAdminPath && !isLoginPage && !isAuthenticated) {
    return NextResponse.redirect(new URL('/admin', req.url))
  }

  if (isLoginPage && isAuthenticated) {
    return NextResponse.redirect(new URL('/admin/dashboard', req.url))
  }
})

export const config = {
  matcher: ['/admin/:path*'],
}
