"use server";

import { signIn, signOut } from "@/auth";

export type Provider = "Google" | "Facebook" | "Credentials";

export const login = async (
  provider: Provider,
  redirectTo?: string | null,
  formData?: FormData,
) => {
  const formDataObject = Object.fromEntries(formData || new FormData());
  await signIn(provider.toLowerCase(), {
    ...formDataObject,
    redirectTo: redirectTo || "/",
  });
};

export const logout = async (redirectTo?: string | null) => {
  await signOut({ redirectTo: redirectTo || "/" });
};
