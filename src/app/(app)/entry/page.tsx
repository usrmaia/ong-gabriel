import Link from "next/link";

import { BackNavigationHeader, Button } from "@/components/ui";
import { getFullUserAuthenticated } from "@/utils/auth";

export default async function SelectRole() {
  const user = await getFullUserAuthenticated();
  const isUserDetailsComplete =
    user.date_of_birth && user.full_name && user.phone;

  return (
    <>
      <BackNavigationHeader title="Entrar" href="/" />

      <section className="flex flex-col gap-4">
        <Link
          href={
            isUserDetailsComplete
              ? `/patient/form-anamnesis`
              : `/patient/form-anamnesis?redirectTo=/user/base-info`
          }
        >
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
