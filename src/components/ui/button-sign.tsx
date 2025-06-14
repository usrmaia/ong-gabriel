"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa6";

import { login, logout, Provider } from "@/lib/auth";
import { Button } from "./button";

const ButtonSignInContent = ({ provider }: { provider: Provider }) => {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo");

  return (
    <Button
      variant="sign_outline"
      size="lg"
      className="flex-1"
      onClick={() => login(provider, redirectTo)}
    >
      {provider === "Google" && <FcGoogle className="inline-block" />}
      {provider === "Facebook" && (
        <FaFacebook className="inline-block" color="#0866FF" />
      )}
      {provider}
    </Button>
  );
};

export const ButtonSignIn = ({ provider }: { provider: Provider }) => {
  return (
    <Suspense fallback={<span>Loading...</span>}>
      <ButtonSignInContent provider={provider} />
    </Suspense>
  );
};

export const ButtonSignOut = () => {
  return (
    <button
      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      onClick={() => logout()}
    >
      Sign out
    </button>
  );
};
