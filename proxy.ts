import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

import {
  allowedApiRoutes,
  apiAuthPrefix,
  DEFAULT_REDIRECT_URL,
} from "@/lib/route";
import { isAuthRoute, isPublicRoute } from "@/lib/util";

export async function proxy(req: NextRequest) {
  const { nextUrl } = req;
  const pathname = nextUrl.pathname;

  const isApiAuthRoute = pathname.startsWith(apiAuthPrefix);
  const isAllowedApiRoute = allowedApiRoutes.includes(pathname);
  const isPublic = isPublicRoute(pathname);
  const isAuth = isAuthRoute(pathname);

  const session = getSessionCookie(req);
  const isLoggedIn = !!session;

  if (isApiAuthRoute || isAllowedApiRoute) {
    return NextResponse.next(); // Let auth APIs always pass
  }

  if (pathname === "/admin" && isLoggedIn) {
    return NextResponse.redirect(new URL("/admin/dashboard", req.url));
  }

  if (isAuth) {
    if (isLoggedIn) {
      console.log("Redirecting logged-in user away from auth page", isLoggedIn);
      if (pathname === "/complete-profile") {
        return NextResponse.next();
      }

      return NextResponse.redirect(new URL(DEFAULT_REDIRECT_URL, req.url));
    }

    return NextResponse.next(); // Allow access to login/register
  }

  if (!isLoggedIn && !isPublic) {
    if (pathname === "/30-minute-strategy-session") {
      return NextResponse.redirect(
        new URL(`/sign-up?redirectTo=${encodeURIComponent(pathname)}`, req.url),
      );
    }

    return NextResponse.redirect(new URL(DEFAULT_REDIRECT_URL, req.url));
  }

  return NextResponse.next(); // All good
}
export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
