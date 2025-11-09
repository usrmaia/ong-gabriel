import Image from "next/image";
import Link from "next/link";

import { BackNavigationHeader, Button } from "@/components/ui";
import { env } from "@/config/env";

export default async function FailedPage() {
  return (
    <>
      <BackNavigationHeader title="Anamnese" />
      <div className="flex w-full flex-col items-center gap-4">
        <p className="text-s-midnight-100 text-center font-young-serif text-4xl font-bold">
          Ops, não foi possível enviar seu cadastro
        </p>

        <p className="font-young text-xl text-center">
          Provavelmente{" "}
          <strong>você já preencheu o formulário nos últimos 7 dias </strong> e
          por isso não é possível fazer um novo envio.
        </p>
        <p className="font-young text-xl text-center">
          <strong>
            Em breve nosso assistente social entrará em contato com você!
          </strong>
        </p>
        <p className="font-young text-xl text-center">
          <strong> Caso não seja esse o motivo</strong> ou queira fazer alguma
          alteração em seu cadastro,{" "}
          <strong>entre em contato por e-mail.</strong>
        </p>

        <Image
          src="/form-anaminesis-failed.svg"
          alt="Banner"
          width={600}
          height={600}
          className="max-w-md md:max-w-md lg:max-w-md w-full h-auto"
        />
        <Link
          className="w-full"
          href={`mailto:${env.EMAIL_GOOGLE_USER}?subject=Desejo realizar o formulário de anaminense!`}
        >
          <Button className="mt-4 w-full">Enviar e-mail</Button>
        </Link>
      </div>
    </>
  );
}
