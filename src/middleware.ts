import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import {
  checkRateLimit,
  generateRateLimitIdentifier,
  createRateLimitHeaders,
  type RateLimiterType,
} from "@/lib/rate-limit";

/**
 * Determina o tipo de rate limiter baseado na rota
 */
function getRateLimiterType(pathname: string): RateLimiterType {
  if (pathname.startsWith("/api/auth")) {
    return "auth";
  }

  if (pathname.includes("/upload") || pathname.includes("/file")) {
    return "upload";
  }

  if (pathname.includes("/search") || pathname.includes("/query")) {
    return "search";
  }

  // Default para APIs
  return "api";
}

// TODO: Use middleware = auth
// FIX: next-auth v5-beta with bug: PrismaClient is unable to run in this browser environment, or has been bundled for the browser
export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. Rate Limiting Check (sempre primeiro para proteger contra abuso)
  const rateLimiterType = getRateLimiterType(pathname);
  const identifier = generateRateLimitIdentifier(req);

  const rateLimitResult = await checkRateLimit(rateLimiterType, identifier);
  const rateLimitHeaders = createRateLimitHeaders(rateLimitResult);

  // Se rate limit foi excedido, retorna 429
  if (!rateLimitResult.success) {
    return new NextResponse(
      JSON.stringify({
        error: "Rate limit exceeded",
        message: "Too many requests. Please try again later.",
        retryAfter: Math.ceil((rateLimitResult.reset - Date.now()) / 1000),
      }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          ...Object.fromEntries(rateLimitHeaders.entries()),
        },
      },
    );
  }

  // 2. Authentication Check
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });
  const isAuthenticated = !!token;

  if (!isAuthenticated) {
    // Adiciona headers de rate limit mesmo em redirects de auth
    const loginUrl = new URL(`/auth/login?redirectTo=${pathname}`, req.url);
    const response = NextResponse.redirect(loginUrl);

    // Adiciona headers de rate limit
    rateLimitHeaders.forEach((value, key) => {
      response.headers.set(key, value);
    });

    return response;
  }

  // 3. Success - adiciona headers de rate limit e continua
  const response = NextResponse.next();

  // Adiciona headers de rate limit em todas as respostas
  rateLimitHeaders.forEach((value, key) => {
    response.headers.set(key, value);
  });

  return response;
}

// Protect routes
export const config = {
  matcher: [
    "/api/((?!auth|health).*)",
    "/auth/logout",
    "/employee/:path*",
    "/patient/:path*",
    "/user/:path*",
  ],
};
