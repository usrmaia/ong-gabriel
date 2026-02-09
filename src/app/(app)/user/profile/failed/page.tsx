import Link from "next/link";

import { BackNavigationHeader, Button } from "@/components/ui";
import { getUserAuthenticated } from "@/utils/auth";

export default async function ProfileFailedPage() {
  const user = await getUserAuthenticated();
  const isEmployee =
    user.role.includes("EMPLOYEE") || user.role.includes("ADMIN");

  return (
    <>
      <BackNavigationHeader title="Perfil" />
      <section className="flex flex-col gap-4 items-center text-center">
        <h3 className="font-semibold">Usuário não encontrado</h3>
        <p className="text-sm">
          Não foi possível carregar o perfil solicitado.
        </p>
        <Link
          href={isEmployee ? "/employee/home" : "/patient/home"}
          className="w-full"
        >
          <Button className="w-full">Voltar para minha home</Button>
        </Link>
      </section>
    </>
  );
}
