import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth, { DefaultSession, NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";

import { env } from "@/config/env";
import prisma from "./lib/prisma";

declare module "next-auth" {
  interface User {
    role: string[];
  }

  interface Session {
    user: {
      role: string[];
    } & DefaultSession["user"];
  }
}

const providers = [GoogleProvider, FacebookProvider];

const authConfig: NextAuthConfig = {
  providers: providers,
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 7 }, // 7 days
  adapter: PrismaAdapter(prisma),
  useSecureCookies: env.SECURE_COOKIES_ENABLED,
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role || ["USER"];
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id as string;
      session.user.role = token.role as string[];
      return session;
    },
  },
  debug: env.NODE_ENV === "development",
  pages: {
    signIn: "/auth/login",
  },
};

export const { auth, handlers, signIn, signOut } = NextAuth(authConfig);
