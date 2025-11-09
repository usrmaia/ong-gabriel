import Image from "next/image";

import { BackNavigationHeader } from "@/components/ui";
import { getUserAuthenticated } from "@/utils/auth";

export default async function SuccessPage() {
  const user = await getUserAuthenticated();

  return (
    <>
      <BackNavigationHeader title="Anamnese" href="/" />
      <div className="flex w-full flex-col items-center gap-4">
        <h2 className="!text-success text-center">
          {user?.name}, estamos com você!
        </h2>
        <p className="font-young-serif text-xl text-center">
          Já já entraremos em contato, aguarde.
        </p>
        <Image
          src="/agendado.svg"
          alt="Banner"
          width={1200}
          height={500}
          className="max-w-md md:max-w-md lg:max-w-md w-full h-auto"
        />
        <p className="text-center font-semibold text-sm">
          Vamos reservar um horário na agenda. Nossa equipe de assistência
          social irá falar com você o quanto antes!
        </p>
      </div>
    </>
  );
}
