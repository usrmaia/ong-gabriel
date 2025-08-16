import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

import { env } from "./config/env";

// TODO: Use middleware = auth
// FIX: next-auth v5-beta with bug: PrismaClient is unable to run in this browser environment, or has been bundled for the browser
export default async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // Headers para PWA
  const response = NextResponse.next();

  // Cache headers para Service Worker e assets estáticos
  if (pathname === "/sw.js") {
    response.headers.set(
      "Cache-Control",
      "no-cache, no-store, must-revalidate",
    );
    response.headers.set("Content-Type", "application/javascript");
  }

  if (pathname === "/manifest.json") {
    response.headers.set("Cache-Control", "public, max-age=31536000");
    response.headers.set("Content-Type", "application/manifest+json");
  }

  if (pathname.startsWith("/icon-") || pathname === "/apple-touch-icon.png") {
    response.headers.set("Cache-Control", "public, max-age=31536000");
  }

  const token = await getToken({
    req,
    secret: env.AUTH_SECRET,
    secureCookie: env.SECURE_COOKIES_ENABLED,
  });
  const isAuthenticated = !!token;

  if (!isAuthenticated) {
    const fullPath = `${pathname}${search}`;
    const loginUrl = new URL(
      `/auth/login?redirectTo=${encodeURIComponent(fullPath)}`,
      req.url,
    );
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

// Protect routes
export const config = {
  matcher: [
    "/api/((?!auth|health).*)",
    "/auth/logout",
    "/employee/:path*",
    "/patient/:path*",
    "/pre-psych/:path",
    "/user/:path*",
    // PWA files
    "/sw.js",
    "/manifest.json",
    "/icon-:path*",
    "/apple-touch-icon.png",
  ],
};
