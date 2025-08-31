import { ButtonSignIn } from "@/components/ui";
import { env } from "@/config/env";

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center">
      <h3 className="text-center px-8 py-4">
        Suporte emocional para a sua vida!
      </h3>
      <div className="flex flex-row gap-4 w-full sm:w-1/2 lg:w-130">
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
    </div>
  );
}
