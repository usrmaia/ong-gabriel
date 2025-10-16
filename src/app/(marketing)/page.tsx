import Image from "next/image";
import Link from "next/link";

import { Button, RadioGroup, RadioGroupItem } from "@/components/ui";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default async function LandPage() {
  return (
    <div className="max-x-lg mx-auto">
      <header className="flex justify-between items-center p-4">
        <Image
          src="/ong-gabriel-logo.svg"
          alt="Logo ONG Gabriel"
          width={150}
          height={1024}
        />
        <Link href={"/entry"}>
          <Button
            variant="outline"
            className="text-md text-s-navy-100 border-s-navy-100"
          >
            Entrar
          </Button>
        </Link>
      </header>

      <main className="flex flex-col items-center">
        <section className="relative size-96 rounded-2xl overflow-hidden my-4">
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
        </section>

        <section className="flex flex-col items-center text-center gap-2 p-6">
          <h2>Suporte emocional para a sua vida!</h2>
          <p>
            Estamos dispostos a ajudar você, em todas as etapas do atendimento psicológico, por meio de uma plataforma segura e intuitiva de forma simples!
          </p>

          <h3>Confira as etapas de cadastro</h3>
          <div className="grid grid-cols-4 gap-2 w-full">
            <Card src="/gifs/form-patient.gif" title="Preencha o formulário" />
            <Card src="/gifs/contact-patient.gif" title="Aguarde o contato da ONG Gabriel" />
            <Card src="/gifs/calendar-check.gif" title="Disponibilize sua agenda online" />
            <Card src="/gifs/service-patient.gif" title="Fale com o Psicólogo" />
          </div>
          <Link href="/user/base-info?redirectTo=/pre-psych/form-registration" className="w-full">
            <Button className="w-96">
              Quero ajuda
            </Button>
          </Link>
        </section>

        <section className="flex flex-col items-center text-center gap-2 p-6 bg-s-powder-100">
          <h2>Transforme a vida de quem precisa de apoio</h2>
          <p>
            Nós, da ONG Gabriel, já impactamos centenas de vidas com o apoio de
            pessoas voluntárias prestando atendimento psicológico!
          </p>

          <h3>Veja como você pode ser parte dessa transformação:</h3>
          <div className="grid grid-cols-4 gap-2 w-full">
            <Card src="/gifs/list-records.gif" title="Preencha o formulário" />
            <Card src="/gifs/user-chat.gif" title="Aguarde o contato da ONG Gabriel" />
            <Card src="/gifs/calendar-check.gif" title="Disponibilize sua agenda online" />
            <Card src="/gifs/heart-hand.gif" title="Transforme a vida de uma pessoa" />
          </div>
          <Link href="/user/base-info?redirectTo=/pre-psych/form-registration" className="w-full">
            <Button className="w-96 bg-s-navy-100 text-s-butter-100">
              Quero ajudar
            </Button>
          </Link>
        </section>

        <section className="flex flex-col items-center text-center gap-4">
          <h2>Depoimentos</h2>
          <figure className="relative">
            <blockquote className="italic px-10">
              <span className="absolute left-[-5] top-[-40] text-[100px] text-primary">“</span>
              É incrível fazer parte do App Gabriel Guard! Ajudar pessoas e ver o impacto do meu trabalho foi transformador. Gratidão por essa oportunidade!
              <span className="absolute right-auto bottom-2 text-[6.25rem] text-primary">”</span>
            </blockquote>
            <figcaption className="flex flex-col items-center gap-2 mt-4">
              <Image
                src="/default-user.jpg"
                alt="Foto de um usuário"
                width="40"
                height="40"
                className="rounded-full"
              />
              <div>
                <p className="font-bold">Adriana Souza</p>
                <p className="text-sm">Psicóloga</p>
              </div>
            </figcaption>
          </figure>
          <RadioGroup className="flex justify-center mt-4">
            <RadioGroupItem value="1" />
            <RadioGroupItem value="2" />
            <RadioGroupItem value="3" />
          </RadioGroup>
        </section>

        <aside className="bg-primary p-4 rounded-lg mx-4">
          <span className="font-bold">Importante:</span> Não oferecemos atendimento imediato para crises suicidas. Em situação de crise, <span className="font-bold">ligue 188 (CVV)</span> ou acesse <a href="https://www.cvv.org.br" rel="noreferrer" target="_blank" className="underline">www.cvv.org.br</a>. Procure o hospital mais próximo em caso de emergência.
        </aside>

        <section className="flex flex-col items-center gap-4 p-6 rounded-2xl">
          <h3>Dúvidas frequentes</h3>
          <Accordion type="single" collapsible className="w-full space-y-1 rounded-lg">
            <AccordionItem value="item-1" className="bg-secondary px-8">
              <AccordionTrigger>Como é o atendimento?</AccordionTrigger>
              <AccordionContent>
                <p>Nós, da ONG Gabriel, já impactamos centenas de vidas com o apoio de pessoas voluntárias prestando atendimento psicológico!</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2" className="bg-secondary px-8">
              <AccordionTrigger>O atendimento é gratuito?</AccordionTrigger>
              <AccordionContent>
                <p>Sim, pode ser gratuito! Fazemos uma avaliação socioeconômica simples no cadastro para oferecer gratuidade. Se não for o seu caso, cobramos um valor social acessível. Queremos que o cuidado com a saúde mental chegue a todos!</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3" className="bg-secondary px-8">
              <AccordionTrigger>Pra quem é o atendimento?</AccordionTrigger>
              <AccordionContent>
                <p>Se você busca autoconhecimento ou precisa de ajuda para lidar com ansiedade, estresse, tristeza e desafios do dia a dia, aqui é o lugar certo! Oferecemos apoio psicológico contínuo. Lembre-se: não somos um serviço de emergência. Em crises, procure um pronto-atendimento ou ligue 188 (CVV).</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4" className="bg-secondary px-8">
              <AccordionTrigger>Meus dados estão seguros?</AccordionTrigger>
              <AccordionContent>
                <p>Totalmente seguros! Sua privacidade é nossa prioridade. Tudo o que você conversa com o psicólogo é confidencial, seguindo o Código de Ética. Nossa plataforma usa tecnologias para proteger seus dados e garantir um ambiente seguro para você.</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>
      </main>
    </div>
  )
}

const Card = ({ src, title }: { src: string; title: string }) => {
  return (
    <div className="flex flex-col items-center justify-center py-4 px-2 gap-2 min-w-28">
      <Image src={src} alt="Form Icon" width={512} height={512} />
      <p className="font-raleway text-center text-s-charcoal-100">{title}</p>
    </div>
  );
};
