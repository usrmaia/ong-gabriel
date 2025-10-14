import Image from "next/image";
import Link from "next/link";

import { Button, RadioGroup, RadioGroupItem } from "@/components/ui";

export default async function LandPage() {
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
        <Link href={"/entry"}>
          <Button
            variant="outline"
            className="text-md text-s-navy-100 border-s-navy-100"
          >
            Entrar
          </Button>
        </Link>
      </div>

      <div className="relative w-80 h-80 rounded-2xl overflow-hidden">
        <Image
          src="/landing-page-pessoa-sorrindo.jpg"
          alt="Nossa missão"
          width={1024}
          height={1024}
          className="absolute inset-0 w-full h-full object-cover"
        />

        <h3 className="absolute bottom-6 left-8 right-8 leading-10" style={{ color: "white" }}>
          Nossa missão é transformar a vida de pessoas
        </h3>
      </div>

      <div>
        <h2 className="text-center">Suporte emocional para a sua vida!</h2>
        <p>
          Estamos dispostos a ajudar você, em todas as etapas do atendimento psicológico, por meio de uma plataforma segura e intuitiva de forma simples!
        </p>

        <h3>Confira as etapas de cadastro</h3>
        <div className="border-2 p-4">
          Ícones
        </div>
        <Button className="w-64">Quero ajuda</Button>
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
            title="Aguarde o contato da ONG Gabriel"
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

      <div>
        <h3>Depoimentos</h3>
        <p>
          É incrível fazer parte do App Gabriel Guard! Ajudar pessoas e ver o impacto do meu trabalho foi transformador. Gratidão por essa oportunidade!
        </p>
        <div className="flex gap-2 justify-center items-center">
          <Image
            src="/default-user.jpg"
            alt="Depoimento"
            width={40}
            height={40}
            className="rounded-full"
          />

          <div>
            <p className="font-bold">Adriana Souza</p>
            <p>Psicólogo</p>
          </div>
        </div>
        <RadioGroup className="flex">
          <RadioGroupItem value="1" />
          <RadioGroupItem value="2" />
          <RadioGroupItem value="3" />
        </RadioGroup>
      </div>

      <div className="bg-amber-300 p-3 rounded-lg">
        <span className="font-bold">Importante:</span> Não oferecemos atendimento imediato para crises suicidas. Em situação de crise, <span className="font-bold">ligue 188 (CVV)</span> ou acesse <a href="https://www.cvv.org.br" rel="noreferrer" target="_blank" className="underline">www.cvv.org.br</a>. Procure o hospital mais próximo em caso de emergência.
      </div>
    </>
  );
}

const Card = ({ src, title }: { src: string; title: string }) => {
  return (
    <div className="flex flex-col items-center justify-center py-4 px-2 gap-2 min-w-28">
      <Image src={src} alt="Form Icon" width={512} height={512} />
      <p className="font-raleway text-center text-s-charcoal-100">{title}</p>
    </div>
  );
};
