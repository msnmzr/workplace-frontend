import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// CRITICAL: Ensure 'auth_token' matches the cookie name used when you log in.
// If your cookie name is 'jwt_token', 'session_id', or something else, 
// YOU MUST CHANGE 'auth_token' below to match it exactly.
const AUTH_TOKEN_COOKIE_NAME = 'auth_token';

// Changed to 'proxy' named export to satisfy your environment's requirement.
export async function proxy(request: NextRequest) {
  const token = request.cookies.get(AUTH_TOKEN_COOKIE_NAME)?.value;
  const { pathname } = request.nextUrl;

  // --- DEBUGGING OUTPUT (Likely suppressed, but keep for completeness) ---
  console.log(`[Proxy] Running. Path: ${pathname}, Token: ${token ? 'FOUND' : 'NOT FOUND'}`);
  // ----------------------------------------------------------------------
  
  const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/register');
  const isProtectedRoute = pathname === '/' || pathname.startsWith('/settings'); 

  // 1. If user is NOT authenticated (no token)
  if (!token) {
    if (isProtectedRoute) {
      // User is trying to access dashboard routes, redirect to login
      console.log(`[Proxy] Redirecting unauthenticated user from ${pathname} to /login`);
      return NextResponse.redirect(new URL('/login', request.url)); 
    }
    // Otherwise, let them access public routes (like /login or /register)
    return NextResponse.next();
  }

  // 2. If user IS authenticated (has token)
  if (token) {
    if (isAuthRoute) {
      // User is authenticated but trying to access a login/register page, redirect to dashboard
      console.log(`[Proxy] Redirecting authenticated user from ${pathname} to /`);
      return NextResponse.redirect(new URL('/', request.url));
    }
    // Otherwise, let them access protected routes
    return NextResponse.next();
  }

  // Fallback
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|manifest.json).*)', 
  ],
}