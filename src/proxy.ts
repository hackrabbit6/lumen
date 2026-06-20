import { NextResponse, type NextRequest } from "next/server";

const PUBLIC_PATHS = ["/login"];
const SESSION_COOKIE = "lumen_demo_session";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = request.cookies.get(SESSION_COOKIE)?.value === "1";
  const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p));

  if (isPublic && hasSession) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (!isPublic && !hasSession) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
