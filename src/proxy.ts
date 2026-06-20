import { NextResponse, type NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

// Public routes that don't require authentication.
const PUBLIC_PATHS = ["/login"];

// Next.js 16 renamed the "middleware" convention to "proxy".
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Optimistic check: only reads the cookie, no DB call. The (dashboard)
  // layout performs the authoritative server-side session validation.
  const hasSession = Boolean(getSessionCookie(request));
  const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p));

  // Signed-in users shouldn't see the login page.
  if (isPublic && hasSession) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Unauthenticated users hitting a protected route -> login.
  if (!isPublic && !hasSession) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  // Run on everything except API routes, Next internals, and static assets.
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
