"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

import { login, logout, Provider } from "@/lib/auth";

const SignInButtonContent = ({ provider }: { provider: Provider }) => {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo");

  return (
    <button
      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      onClick={() => login(provider, redirectTo)}
    >
      Sign in with {provider}
    </button>
  );
};

export const SignInButton = ({ provider }: { provider: Provider }) => {
  return (
    <Suspense fallback={<span>Loading...</span>}>
      <SignInButtonContent provider={provider} />
    </Suspense>
  );
};

export const SignOutButton = () => {
  return (
    <button
      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      onClick={() => logout()}
    >
      Sign out
    </button>
  );
};
