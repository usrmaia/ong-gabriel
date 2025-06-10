"use server";

import { signIn, signOut } from "@/auth";

export type Provider = "Google" | "Facebook";

export const login = async (provider: Provider, redirectTo?: any) => {
  await signIn(provider.toLowerCase(), {
    redirectTo: redirectTo || "/",
  });
};

export const logout = async () => {
  await signOut({
    redirectTo: "/auth/login",
  });
};
