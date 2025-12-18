// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Cookie name must match what your client sets (login page uses 'auth_token')
const AUTH_TOKEN_COOKIE_NAME = "auth_token";

export function middleware(request: NextRequest) {
    const token = request.cookies.get(AUTH_TOKEN_COOKIE_NAME)?.value || null;
    const { pathname } = request.nextUrl;

    // Protected routes: root dashboard and settings (adjust if you have more)
    const isProtectedRoute = pathname === "/dashboard" || pathname.startsWith("/settings");

    // If no token and trying to access a protected route -> redirect to /login
    if (!token && isProtectedRoute) {
        const url = request.nextUrl.clone();
        url.pathname = "/login";
        return NextResponse.redirect(url);
    }

    // If token exists and trying to access login page -> redirect to dashboard (root)
    if (token && pathname === "/login") {
        const url = request.nextUrl.clone();
        url.pathname = "/dashboard";
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard", "/settings/:path*", "/login"],
};
