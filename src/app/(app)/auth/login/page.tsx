import Link from "next/link";

import { ButtonSignIn, Separator } from "@/components/ui";
import { env } from "@/config/env";
import LoginForm from "./form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const redirectTo = params.redirectTo as string | undefined;

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <h3 className="text-center px-4 py-4">
        Suporte emocional para a sua vida!
      </h3>
      <div className="flex flex-row gap-4 w-full">
        {env.AUTH_GOOGLE_ID && env.AUTH_GOOGLE_SECRET && (
          <ButtonSignIn
            provider="Google"
            variant="sign_outline"
            size="lg"
            className="flex-1"
          />
        )}
        {env.AUTH_FACEBOOK_ID && env.AUTH_FACEBOOK_SECRET && (
          <ButtonSignIn
            provider="Facebook"
            variant="sign_outline"
            size="lg"
            className="flex-1"
          />
        )}
      </div>
      <div className="w-full max-w-sm">
        <div className="relative flex items-center gap-2">
          <Separator className="flex-1 bg-s-silver-100" />
          <span className="shrink-0 px-2 font-poppins text-xs text-s-silver-100">
            ou continue com email
          </span>
          <Separator className="flex-1 bg-s-silver-100" />
        </div>
      </div>
      <div className="flex flex-col w-full">
        <LoginForm />
        <Link
          href={
            redirectTo ? `/auth/reset?redirectTo=${redirectTo}` : "/auth/reset"
          }
          className=" text-center text-s-royal-100"
        >
          Esqueci minha senha
        </Link>
        <Link
          href={
            redirectTo
              ? `/auth/register?redirectTo=${redirectTo}`
              : "/auth/register"
          }
          className="text-center mt-4"
        >
          Não tem uma conta?{" "}
          <span className="font-semibold text-s-royal-100">
            Cadastre-se aqui
          </span>
        </Link>
      </div>
    </div>
  );
}
