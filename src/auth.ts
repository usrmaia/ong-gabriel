import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth, { DefaultSession, NextAuthConfig } from "next-auth";
import { cookies } from "next/headers";
import CredentialProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";

import { env } from "@/config/env";
import prisma from "./lib/prisma";
import { decrypt } from "./utils";

// Constantes de duração de sessão
const SESSION_MAX_AGE_PERSISTENT = 60 * 60 * 24 * 7; // 7 dias

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
  session: { strategy: "jwt", maxAge: SESSION_MAX_AGE_PERSISTENT }, // Padrão: 7 dias
  adapter: PrismaAdapter(prisma),
  useSecureCookies: env.SECURE_COOKIES_ENABLED,
  cookies: {
    sessionToken: {
      name: env.SECURE_COOKIES_ENABLED
        ? "__Secure-authjs.session-token"
        : "authjs.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: env.SECURE_COOKIES_ENABLED,
      },
    },
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;

        // Verificar preferência de sessão
        try {
          const cookieStore = await cookies();
          const sessionPreference =
            cookieStore.get("session-preference")?.value;
          token.rememberMe = sessionPreference === "persistent";
        } catch {
          token.rememberMe = true; // Padrão: manter sessão
        }
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
