"use server";

import { cookies } from "next/headers";
import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";

import { signIn, signOut } from "@/auth";
import { env } from "@/config/env";

export type Provider = "Google" | "Facebook" | "Credentials";

// Duração da sessão: 7 dias para "lembrar-me", sessão do navegador caso contrário
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 dias em segundos

export const login = async (
  provider: Provider,
  redirectTo?: string | null,
  formData?: FormData,
) => {
  const formDataObject = Object.fromEntries(formData || new FormData());
  const rememberMe = formDataObject.rememberMe === "on";

  // Define cookie de preferência de sessão antes do signIn
  const cookieStore = await cookies();
  cookieStore.set("session-preference", rememberMe ? "persistent" : "session", {
    httpOnly: true,
    secure: env.SECURE_COOKIES_ENABLED,
    sameSite: "lax", // Proteção CSRF básica
    maxAge: rememberMe ? SESSION_MAX_AGE : undefined, // undefined = cookie de sessão
    path: "/",
  } as ResponseCookie);

  await signIn(provider.toLowerCase(), {
    ...formDataObject,
    redirectTo: redirectTo || "/",
  });
};

export const logout = async (redirectTo?: string | null) => {
  await signOut({ redirectTo: redirectTo || "/" });
};
