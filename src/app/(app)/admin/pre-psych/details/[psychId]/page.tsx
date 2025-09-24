import Image from "next/image";
import { User, PsychStatus, Psych, Document } from "@prisma/client";

import { BackNavigationHeader, Badge, CardUserProfile } from "@/components/ui";
import { getPsychById } from "@/services";
import prisma from "@/lib/prisma";

export default async function PrePsychDetailsPage({
  params,
}: {
  params: { psychId: string };
}) {
  const { psychId } = params;
  const psychResult = await getPsychById(psychId, {
    include: { user: true, curriculumVitae: true, proofAddress: true },
  });

  if (!psychResult.success || !psychResult.data)
    return (
      <p>
        Erro ao carregar detalhes do pré-psicólogo. {psychResult.error?.errors}
      </p>
    );

  const isCandidate = psychResult.data.status !== PsychStatus.APPROVED;
  if (!isCandidate)
    return <p className="text-center">Psicólogo já aprovado.</p>;

  const psych = psychResult.data as Psych & {
    user: User;
    curriculumVitae: Document;
    proofAddress: Document;
  };
  const curriculumVitae = psych.curriculumVitae;
  const proofAddress = psych.proofAddress;

  return (
    <>
      <h2 className="text-center">Cadastro Psicólogo</h2>

      <BackNavigationHeader
        title="Pré-Psicólogo"
        href="/admin/pre-psych/list"
      />

      <section className="flex gap-4">
        <Image
          src={psych.user.image ?? "/default-user.jpg"}
          alt={`Avatar de ${psych.user.name}`}
          width={100}
          height={100}
          className="rounded-full border-1 border-p-tealwave p-0.25 w-14 h-14 object-cover"
        />
        <div>
          <p className="font-bold">{psych.user.full_name}</p>
          <p className="my-1"><span className="font-bold">CRP: </span>{psych.CRP.replace(/^(\d{2})(\d{6})$/, "$1/$2")}</p>
          <p>{psych.status == "ADJUSTMENT" && (
            <Badge className="text-s-charcoal-100 bg-amber-500">
              Atualizado
            </Badge>
          )}
            {psych.status == "PENDING" && (
              <Badge className="text-s-charcoal-100 bg-available">
                Aguardando
              </Badge>
            )}</p>
        </div>
      </section>

      <section className="flex flex-col gap-2">
        <h2 style={{ color: "var(--color-p-xanthous)" }}>Dados Pessoais</h2>
        <div className="border-b-2 pb-2">
          <p className="font-bold">Nome</p>
          <p>{psych.user.full_name}</p>
        </div>
        <div className="border-b-2 pb-2">
          <p className="font-bold">Data de nascimento</p>
          <p>
            {psych.user.date_of_birth
              ? new Date(psych.user.date_of_birth).toLocaleDateString("pt-BR")
              : "Não informado"}
          </p>
        </div>
        <div className="border-b-2 pb-2">
          <p className="font-bold">E-mail</p>
          <p>{psych.user.email.toLowerCase()}</p>
        </div>
        <div className="border-b-2 pb-2">
          <p className="font-bold">Telefone</p>
          <p>
            {psych.user.phone
              ? psych.user.phone.replace(
                /^(\+?55)?(\d{2})(\d{4,5})(\d{4})$/,
                "+55 ($2) $3-$4"
              )
              : "Não informado"}
          </p>
        </div>
      </section>

      <section className="flex flex-col gap-2">
        <h2 style={{ color: "var(--color-p-xanthous)" }}>Informações Residenciais</h2>
        <div className="border-b-2 pb-2">
          <p className="font-bold">CEP</p>
          <p>{psych.zipCode}</p>
        </div>
        <div className="border-b-2 pb-2">
          <p className="font-bold">Endereço</p>
          <p>{psych.street}</p>
        </div>
        <div className="border-b-2 pb-2 flex gap-8">
          <div>
            <p className="font-bold">Número</p>
            <p>{psych.number}</p>
          </div>
          <div className="w-full">
            <p className="font-bold">Complemento</p>
            <p>{psych.complement}</p>
          </div>
        </div>
        <div className="border-b-2 pb-2">
          <p className="font-bold">Bairro</p>
          <p>{psych.district}</p>
        </div>
        <div className="border-b-2 pb-2 flex gap-8">
          <div>
            <p className="font-bold">Estado</p>
            <p>{psych.state}</p>
          </div>
          <div className="w-full">
            <p className="font-bold">Cidade</p>
            <p>{psych.city}</p>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-2">
        <div className="w-full flex flex-col items-center gap-2">

          <p className="font-poppins text-lg text-s-van-dyke">
            {psych.user.name}
          </p>
        </div>
        <CardUserProfile user={psych.user} />
        <h2 className="text-center">Documentos</h2>
        <a
          href={curriculumVitae.id}
          rel="noreferrer"
          download={curriculumVitae.data}
        >
          {curriculumVitae?.name ?? "Sem currículo cadastrado."}
        </a>
        <a
          href={proofAddress.id}
          rel="noreferrer"
          download={proofAddress.data}
        >
          {proofAddress.name ?? "Sem endereço cadastrado."}
        </a>
      </section>
      <div className="mt-6 flex gap-4 justify-center">
        <form
          action={async () => {
            "use server";
            await prisma.psych.update({
              where: { userId: psych.user.id },
              data: { status: PsychStatus.APPROVED },
            });
          }}
        >
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Aprovar
          </button>
        </form>
        <form
          action={async () => {
            "use server";
            await prisma.psych.update({
              where: { userId: psych.user.id },
              data: { status: PsychStatus.FAILED },
            });
          }}
        >
          <button
            type="submit"
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Reprovar
          </button>
        </form>
        <form
          action={async () => {
            "use server";
            await prisma.psych.update({
              where: { userId: psych.user.id },
              data: { status: PsychStatus.ADJUSTMENT },
            });
          }}
        >
          <button
            type="submit"
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
          >
            Ajustar
          </button>
        </form>
      </div>
      <div className="mt-4 text-center">
        <span className="font-semibold">Status atual: </span>
        <span>
          {psych?.status
            ? psych.status === PsychStatus.APPROVED
              ? "Aprovado"
              : psych.status === PsychStatus.FAILED
                ? "Reprovado"
                : psych.status === PsychStatus.ADJUSTMENT
                  ? "Ajuste necessário"
                  : psych.status === PsychStatus.PENDING
                    ? "Pendente"
                    : "Desconhecido"
            : "Indefinido"}
        </span>
      </div>
    </>
  );
}
