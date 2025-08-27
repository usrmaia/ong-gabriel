import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui";
import { getSession, getUserAuthenticated } from "@/utils/auth";

const Card = ({ src, title }: { src: string; title: string }) => {
  return (
    <div className="flex flex-col items-center justify-center py-4 px-2 gap-2 min-w-28">
      <Image src={src} alt="Form Icon" width={512} height={512} />
      <p className="font-raleway text-center text-s-charcoal-100">{title}</p>
    </div>
  );
};

export default async function Home() {
  // Caso não haja sessão, o usuário deve ser redirecionado para a página de anamnese
  // Caso haja sessão e o usuário seja um funcionário, ele deve ser redirecionado para a página inicial do funcionário
  let redirectTo = "/patient/form-anamnesis?redirectTo=/user/base-info";
  const session = await getSession();
  if (session) {
    const user = await getUserAuthenticated();
    const isEmployee = user?.role.includes("EMPLOYEE");
    if (isEmployee) redirectTo = "/employee/home";
  }

  return (
    <>
      <div className="flex justify-between items-center p-6">
        <div className="w-35.5 h-16">
          <Image
            src="/ong-gabriel-logo.svg"
            alt="Logo ONG Gabriel"
            width={1024}
            height={1024}
          />
        </div>
        <Link href={redirectTo}>
          <Button
            variant="outline"
            className="text-md text-s-navy-100 border-s-navy-100"
          >
            Entrar
          </Button>
        </Link>
      </div>
      <div className="flex flex-col py-12 px-4 gap-6 bg-s-powder-100">
        <h2 className="font-raleway text-center">
          Transforme a vida de quem precisa de apoio
        </h2>
        <p className="text-center">
          Nós, da ONG Gabriel, já impactamos centenas de vidas com o apoio de
          pessoas voluntárias prestando atendimento psicológico!
        </p>
        <h3 className="text-center ">
          Veja como você pode ser parte dessa transformação:
        </h3>
        {/* Carousel */}
        <div className="flex overflow-x-auto py-4 gap-6">
          <Card src="/gifs/list-records.gif" title="Preencha o formulário" />
          <Card
            src="/gifs/user-chat.gif"
            title="Aguarde o contado da ONG Gabriel"
          />
          <Card
            src="/gifs/calendar-check.gif"
            title="Disponibilize sua agenda online"
          />
          <Card
            src="/gifs/heart-hand.gif"
            title="Transforme a vida de uma pessoa"
          />
        </div>
        <Link href="/user/base-info?redirectTo=/pre-psych/form-registration">
          <Button className="w-full bg-s-navy-100 text-md text-s-butter-100">
            Quero ajudar
          </Button>
        </Link>
      </div>
    </>
  );
}
