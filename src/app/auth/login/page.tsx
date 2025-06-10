import { SignInButton, SignOutButton } from "@/components";

export default function LoginPage() {
  return (
    <div>
      <h1>Login</h1>
      <SignInButton provider="Google" />
      <SignInButton provider="Facebook" />
      <SignOutButton />
    </div>
  );
}
