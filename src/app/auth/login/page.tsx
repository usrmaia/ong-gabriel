import { ButtonSignIn } from "@/components/ui";

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <h3 className="text-center px-8 py-4">
        Suporte emocional para a sua vida!
      </h3>
      <div className="flex flex-row gap-4 w-full sm:w-1/2 lg:w-130">
        <ButtonSignIn provider="Google" />
        <ButtonSignIn provider="Facebook" />
      </div>
    </div>
  );
}
