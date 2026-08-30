import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE } from "./lib/constants";

const publicApiRoutes = ["/api/auth"];

const protectedPages = ["/results", "/onboarding"];

export function proxy(request: NextRequest) {
  const session = request.cookies.get(SESSION_COOKIE)?.value;
  const { pathname } = request.nextUrl;

  const isApiRoute = pathname.startsWith("/api/");

  if (isApiRoute) {
    const isPublicApi = publicApiRoutes.some((route) =>
      pathname.startsWith(route),
    );
    if (!isPublicApi && !session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.next();
  }

  const isProtectedPage = protectedPages.some((route) =>
    pathname.startsWith(route),
  );
  if (isProtectedPage && !session) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*", "/results/:path*", "/onboarding/:path*"],
};
