import { BackNavigationHeader, ButtonSignOut } from "@/components/ui";

export default function SignOutPage() {
  return (
    <>
      <BackNavigationHeader title="Sair" href="/employee/home" />
      <section className="flex flex-col gap-3">
        <p className="text-lg text-center font-bold">Deseja sair?</p>
        <ButtonSignOut />
      </section>
    </>
  );
}
