import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth, { DefaultSession, NextAuthConfig } from "next-auth";
import CredentialProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";

import { env } from "@/config/env";
import prisma from "./lib/prisma";
import { decrypt } from "./utils";

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

const providers = [
  GoogleProvider({ allowDangerousEmailAccountLinking: true }),
  FacebookProvider,
  CredentialProvider({
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async authorize(credentials) {
      const email = credentials.email as string;
      const password = credentials.password as string;

      if (!email || !password) return null;

      const user = await prisma.user.findUnique({
        where: { email: email },
      });

      if (user && password === decrypt(user.passwordHash || ""))
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };

      return null;
    },
  }),
];
// allowDangerousEmailAccountLinking
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
  debug: env.DEBUG,
  pages: {
    signIn: "/auth/login",
    signOut: "/auth/logout",
  },
};

export const { auth, handlers, signIn, signOut } = NextAuth(authConfig);
