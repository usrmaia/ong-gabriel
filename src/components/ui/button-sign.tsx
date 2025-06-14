"use client";

import { VariantProps } from "class-variance-authority";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa6";

import { login, logout, Provider } from "@/lib/auth";
import { Button, buttonVariants } from "./button";

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    provider: Provider;
  };

const ButtonSignInContent = (props: ButtonProps) => {
  const redirectTo = useSearchParams().get("redirectTo");
  const facebookColor = "#0866FF";

  return (
    <Button {...props} onClick={() => login(props.provider, redirectTo)}>
      {props.provider === "Google" && <FcGoogle className="inline-block" />}
      {props.provider === "Facebook" && (
        <FaFacebook className="inline-block" color={facebookColor} />
      )}
      {props.provider}
    </Button>
  );
};

export const ButtonSignIn = (props: ButtonProps) => {
  return (
    <Suspense fallback={<span>Loading...</span>}>
      <ButtonSignInContent {...props} />
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
