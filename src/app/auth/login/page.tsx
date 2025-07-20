import { ButtonSignIn } from "@/components/ui";

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center">
      <h3 className="text-center px-8 py-4">
        Suporte emocional para a sua vida!
      </h3>
      <div className="flex flex-row gap-4 w-full sm:w-1/2 lg:w-130">
        <ButtonSignIn
          provider="Google"
          variant="sign_outline"
          size="lg"
          className="flex-1"
        />
        <ButtonSignIn
          provider="Facebook"
          variant="sign_outline"
          size="lg"
          className="flex-1"
        />
      </div>
    </div>
  );
}
