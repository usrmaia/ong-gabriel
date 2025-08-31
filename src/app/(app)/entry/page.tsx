import Link from "next/link";

import { BackNavigationHeader, Button } from "@/components/ui";

export default function SelectRole() {
  return (
    <>
      <BackNavigationHeader title="Entrar" href="/" />

      <section className="flex flex-col gap-4">
        <Link href="/patient/form-anamnesis?redirectTo=/user/base-info">
          <Button
            variant="default"
            className="font-semibold w-full rounded text-md"
          >
            Busco atendimento psicológico
          </Button>
        </Link>

        <Link href="/auth/login?redirectTo=/employee/home">
          <Button
            variant="outline"
            className="font-semibold w-full rounded text-md text-s-navy-100 border-s-navy-100"
          >
            Sou voluntário/funcionário
          </Button>
        </Link>
      </section>
    </>
  );
}
