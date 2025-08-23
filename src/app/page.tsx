import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { getUserAuthenticated } from "@/utils/auth";

import Image from "next/image";
import { Button } from "@/components/ui";

const Card = ({ icon, title }: { icon: React.ReactNode; title: string }) => {
  return (
    <div className="flex flex-col items-center justify-center p-4 border rounded-lg">
      <div className="mb-2">{icon}</div>
      <p className="font-raleway text-center text-s-charcoal-100">{title}</p>
    </div>
  );
};

export default async function Home() {
  // const session = await auth();

  // if (!session) redirect("/auth/login");

  // const user = await getUserAuthenticated();

  // if (user.role.includes("EMPLOYEE")) redirect("/employee/home");
  // redirect("/patient/form-anamnesis?redirectTo=/user/base-info");

  return (
    <>
      <div>
        <Image
          src="/ong-gabriel-logo.svg"
          alt="Logo ONG Gabriel"
          width={100}
          height={100}
        />
        <Button>Entrar</Button>
      </div>
      <div className="flex flex-col py-12 px-4 gap-6 bg-s-powder-100">
        <h2 className="font-raleway text-center">
          Transforme a vida de quem precisa de apoio
        </h2>
        <p className="text-center">
          Nós, da ONG Gabriel, já impactamos centenas de vidas com o apoio de
          pessoas voluntárias prestando atendimento psicológico!
        </p>
        <h4 className="text-center">
          Veja como você pode ser parte dessa transformação:
        </h4>
        {/* Carousel */}
        <div className="flex overflow-x-auto py-4">
          <div className="flex-shrink-0 w-64 h-64 bg-gray-200 rounded-lg mx-2">
            <Card
              icon={
                <Image
                  src="/icons/form.svg"
                  alt="Form Icon"
                  width={24}
                  height={24}
                />
              }
              title="Preencha o formulário"
            />
          </div>
          <div className="flex-shrink-0 w-64 h-64 bg-gray-200 rounded-lg mx-2">
            <Card
              icon={
                <Image
                  src="/icons/volunteer.svg"
                  alt="Volunteer Icon"
                  width={24}
                  height={24}
                />
              }
              title="Seja um voluntário"
            />
          </div>
          <div className="flex-shrink-0 w-64 h-64 bg-gray-200 rounded-lg mx-2">
            <Card
              icon={
                <Image
                  src="/icons/donate.svg"
                  alt="Donate Icon"
                  width={24}
                  height={24}
                />
              }
              title="Doe agora"
            />
          </div>
        </div>
        <Button>Quero ajudar</Button>
      </div>
    </>
  );
}
