import { BackNavigationHeader, Button } from "@/components/ui";
import Link from "next/link";

export default function ProfileFailedPage() {
  return (
    <>
      <BackNavigationHeader title="Perfil" href="/employee/home" />
      <section className="flex flex-col gap-4 items-center text-center">
        <h3 className="font-semibold">Usuário não encontrado</h3>
        <p className="text-sm text-muted-foreground">
          Não foi possível carregar o perfil solicitado.
        </p>
        <Link href="/user/profile">
          <Button>Voltar para meu perfil</Button>
        </Link>
      </section>
    </>
  );
}
