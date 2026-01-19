import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public paths that don't require authentication
  const publicPaths = ["/", "/auth", "/auth/v1/login", "/auth/v1/register", "/auth/v2/login", "/auth/v2/register"];

  // Check if the current path is public
  const isPublicPath = publicPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`));

  if (isPublicPath) {
    return NextResponse.next();
  }

  // Check for session cookie
  const sessionCookie = request.cookies.get("session");

  if (!sessionCookie) {
    // Redirect to login if no session
    const loginUrl = new URL("/auth/v1/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files with extensions
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)",
  ],
};
