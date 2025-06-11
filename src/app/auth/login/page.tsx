import Image from "next/image";
import { SignInButton, SignOutButton } from "@/components";

export default function LoginPage() {
  return (
    <div>
      <h1>Suporte emocional para a sua vida!</h1>
      <Image
        src="/public/gabriel-logo.svg"
        alt="Logo da ONG Gabriel"
        width={200}
        height={200}
      />
      <SignInButton provider="Google" />

      <SignInButton provider="Facebook" />
      <SignOutButton />
    </div>
  );
}
