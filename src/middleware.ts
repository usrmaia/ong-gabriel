import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// TODO: Use middleware = auth
// FIX: next-auth v5-beta with bug: PrismaClient is unable to run in this browser environment, or has been bundled for the browser
export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
  });
  const isAuthenticated = !!token;

  if (!isAuthenticated) {
    const loginUrl = new URL(`/auth/login?redirectTo=${pathname}`, req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Protect routes
export const config = {
  matcher: [
    "/api/((?!auth|health).*)",
    "/employee/:path",
    "/patient/:path",
    "/user/:path*",
  ],
};
