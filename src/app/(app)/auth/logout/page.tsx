import { BackNavigationHeader, ButtonSignOut } from "@/components/ui";

export default function LogoutPage() {
  return (
    <>
      <BackNavigationHeader title="Sair" />
      <section className="flex flex-col gap-3">
        <p className="text-lg text-center font-bold">Deseja sair?</p>
        <ButtonSignOut />
      </section>
    </>
  );
}
