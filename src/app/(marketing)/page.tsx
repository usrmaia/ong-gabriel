import Image from "next/image";
import Link from "next/link";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
} from "@/components/ui";
import { TestimonialsCarousel } from "@/components/testimonials-carousel";

export default async function LandPage() {
  const testimonials = [
    {
      id: 1,
      text: "A ONG Gabriel mudou minha vida! Estava passando por um momento muito difícil e encontrei acolhimento e profissionalismo. O atendimento online é prático e os psicólogos são incríveis. Me sinto mais forte e confiante hoje!",
      author: "Mariana Costa",
      role: "Paciente",
      image: "/default-user.jpg",
    },
    {
      id: 2,
      text: "É incrível fazer parte da ONG! Ajudar pessoas e ver o impacto do meu trabalho foi transformador. A plataforma é intuitiva e facilita muito o acompanhamento dos pacientes. Gratidão por essa oportunidade!",
      author: "Adriana Souza",
      role: "Psicóloga Voluntária",
      image: "/default-user.jpg",
    },
    {
      id: 3,
      text: "Nunca imaginei que seria tão fácil ter acesso a terapia de qualidade. O cadastro foi simples, a equipe é atenciosa e o atendimento superou minhas expectativas. Recomendo de olhos fechados para quem precisa de apoio emocional!",
      author: "Roberto Silva",
      role: "Paciente",
      image: "/default-user.jpg",
    },
  ];

  return (
    <>
      <header className="flex justify-between items-center p-6">
        <Image
          src="/ong-gabriel-logo.svg"
          alt="Logo ONG Gabriel"
          width={150}
          height={1024}
        />
        <Link href={"/entry"}>
          <Button
            variant="outline"
            className="text-md text-s-navy-100 border-s-navy-100 cursor-pointer"
          >
            Entrar
          </Button>
        </Link>
      </header>

      <main className="flex flex-col items-center">
        <div className="w-full px-4">
          <section className="relative w-full h-89 rounded-2xl overflow-hidden">
            <Image
              src="/landing-page-pessoa-sorrindo.jpg"
              alt="Nossa missão"
              width={600}
              height={600}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <p className="absolute bottom-10 left-8 right-8 leading-10 font-young-serif text-center text-3xl text-s-butter-100">
              Nossa missão é transformar a vida de pessoas
            </p>
          </section>
        </div>

        <section className="flex flex-col items-center w-full text-center px-4 py-12 gap-6">
          <div className="w-full text-center">
            <h3>Suporte emocional para a sua vida!</h3>
            <p className="text-sm pt-4">
              Estamos dispostos a ajudar você, em todas as etapas do atendimento psicológico, por meio de uma plataforma segura e intuitiva de forma simples!
            </p>
          </div>

          <h3>Confira as etapas de cadastro</h3>
          <div className="flex overflow-x-auto gap-2 w-full">
            <Card src="/gifs/form-patient.gif" title="Preencha o formulário" />
            <Card src="/gifs/contact-patient.gif" title="Aguarde o contato da ONG Gabriel" />
            <Card src="/gifs/calendar-check.gif" title="Disponibilize sua agenda online" />
            <Card src="/gifs/service-patient.gif" title="Fale com o Psicólogo" />
          </div>

          <Link href="/patient/form-anamnesis?redirectTo=/user/base-info" className="w-full">
            <Button className="cursor-pointer w-full">
              Quero ajuda
            </Button>
          </Link>
        </section>

        <section className="flex flex-col items-center w-full text-center px-4 py-12 gap-6 bg-s-powder-100">
          <div className="w-full text-center">
            <h3 className="text-sm">Transforme a vida de quem precisa de apoio</h3>
            <p className="text-sm pt-4">
              Nós, da ONG Gabriel, já impactamos centenas de vidas com o apoio de
              pessoas voluntárias prestando atendimento psicológico!
            </p>
          </div>

          <h3>Veja como você pode ser parte dessa transformação:</h3>
          <div className="flex overflow-x-auto gap-2 w-full">
            <Card src="/gifs/list-records.gif" title="Preencha o formulário" />
            <Card src="/gifs/user-chat.gif" title="Aguarde o contato da ONG Gabriel" />
            <Card src="/gifs/calendar-check.gif" title="Disponibilize sua agenda online" />
            <Card src="/gifs/heart-hand.gif" title="Transforme a vida de uma pessoa" />
          </div>
          <Link href="/user/base-info?redirectTo=/pre-psych/form-registration" className="w-full">
            <Button className="cursor-pointer w-full bg-s-navy-100 text-s-butter-100">
              Quero ajudar
            </Button>
          </Link>
        </section>

        <section className="flex flex-col items-center text-center gap-4 my-12">
          <h2>Depoimentos</h2>
          <TestimonialsCarousel testimonials={testimonials} />
        </section>

        <aside className="bg-primary p-4 rounded-lg mx-4">
          <span className="font-bold">Importante:</span> Não oferecemos atendimento imediato para crises suicidas. Em situação de crise, <span className="font-bold">ligue 188 (CVV)</span> ou acesse <a href="https://www.cvv.org.br" rel="noreferrer" target="_blank" className="underline">www.cvv.org.br</a>. Procure o hospital mais próximo em caso de emergência.
        </aside>

        <section className="flex flex-col items-center rounded-2xl p-4 w-full gap-6">
          <h3>Dúvidas frequentes</h3>
          <Accordion type="single" collapsible className="w-full space-y-1">
            <AccordionItem value="item-1" className="bg-secondary px-8 rounded-lg">
              <AccordionTrigger className="text-sm font-semibold font-raleway text-s-onyx-100">Como é o atendimento?</AccordionTrigger>
              <AccordionContent>
                <p className="text-s-onyx-100">Nós, da ONG Gabriel, já impactamos centenas de vidas com o apoio de pessoas voluntárias prestando atendimento psicológico!</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2" className="bg-secondary px-8 rounded-lg">
              <AccordionTrigger className="text-sm font-semibold font-raleway text-s-onyx-100">O atendimento é gratuito?</AccordionTrigger>
              <AccordionContent>
                <p className="text-s-onyx-100">Sim, pode ser gratuito! Fazemos uma avaliação socioeconômica simples no cadastro para oferecer gratuidade. Se não for o seu caso, cobramos um valor social acessível. Queremos que o cuidado com a saúde mental chegue a todos!</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3" className="bg-secondary px-8 rounded-lg">
              <AccordionTrigger className="text-sm font-semibold font-raleway text-s-onyx-100">Pra quem é o atendimento?</AccordionTrigger>
              <AccordionContent>
                <p className="text-s-onyx-100">Se você busca autoconhecimento ou precisa de ajuda para lidar com ansiedade, estresse, tristeza e desafios do dia a dia, aqui é o lugar certo! Oferecemos apoio psicológico contínuo. Lembre-se: não somos um serviço de emergência. Em crises, procure um pronto-atendimento ou ligue 188 (CVV).</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4" className="bg-secondary px-8 rounded-lg">
              <AccordionTrigger className="text-sm font-semibold font-raleway text-s-onyx-100">Meus dados estão seguros?</AccordionTrigger>
              <AccordionContent>
                <p className="text-s-onyx-100">Totalmente seguros! Sua privacidade é nossa prioridade. Tudo o que você conversa com o psicólogo é confidencial, seguindo o Código de Ética. Nossa plataforma usa tecnologias para proteger seus dados e garantir um ambiente seguro para você.</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>
      </main>
    </>
  )
}

const Card = ({ src, title }: { src: string; title: string }) => {
  return (
    <div className="flex flex-col items-center justify-center py-4 px-2 gap-2 min-w-28">
      <Image src={src} alt="Form Icon" width={512} height={512} className="w-16 h-16" />
      <p className="font-raleway text-center text-sm text-s-charcoal-100">{title}</p>
    </div>
  );
};
