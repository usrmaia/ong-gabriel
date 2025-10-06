import Image from "next/image";
import { User, PsychStatus, Psych, Document } from "@prisma/client";

import {
  BackNavigationHeader,
  Badge,
  Button,
  ButtonDownloadDocument,
  Label,
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui";
import { getPsychById } from "@/services";
import prisma from "@/lib/prisma";
import { Download, FileText } from "lucide-react";
import { redirect } from "next/navigation";

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

  return (
    <>
      <BackNavigationHeader
        title="Cadastro Psicólogo"
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
          <p className="my-1">
            <span className="font-bold">CRP: </span>
            {psych.CRP.replace(/^(\d{2})(\d{6})$/, "$1/$2")}
          </p>
          <p>
            {psych.status == "ADJUSTMENT" && (
              <Badge className="text-s-charcoal-100 bg-amber-500">
                Atualizado
              </Badge>
            )}
            {psych.status == "PENDING" && (
              <Badge className="text-s-charcoal-100 bg-available">
                Aguardando
              </Badge>
            )}
          </p>
        </div>
      </section>

      {/* Dados Pessoais */}
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
                "+55 ($2) $3-$4",
              )
              : "Não informado"}
          </p>
        </div>
      </section>

      {/* Informações Residenciais */}
      <section className="flex flex-col gap-2">
        <h2 style={{ color: "var(--color-p-xanthous)" }}>
          Informações Residenciais
        </h2>
        <div className="border-b-2 pb-2">
          <p className="font-bold">CEP</p>
          <p>{psych.zipCode}</p>
        </div>
        <div className="border-b-2 pb-2">
          <p className="font-bold">Endereço</p>
          <p>{psych.street}</p>
        </div>
        <div className="border-b-2 pb-2 flex gap-2">
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
        <div className="border-b-2 pb-2 flex gap-5">
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

      {/* Informações Profissionais */}
      <section className="flex flex-col gap-3">
        <h2 style={{ color: "var(--color-p-xanthous)" }}>
          Informações Profissionais
        </h2>

        <div>
          <p className="font-bold mb-2">Experiência na prevenção e suicídio</p>
          <RadioGroup
            name="hasXpSuicidePrevention"
            value={psych.hasXpSuicidePrevention.toString()}
            className="flex gap-8"
            disabled
          >
            <div className="flex gap-2 items-center">
              <RadioGroupItem value="true" />
              <Label>Sim</Label>
            </div>
            <div className="flex gap-2 items-center">
              <RadioGroupItem value="false" />
              <Label>Não</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="border-b-2 pb-2">
          <p className="font-bold">CRP</p>
          <p>{psych.CRP}</p>
        </div>

        <div className="border-b-2 pb-2">
          <p className="font-bold">Observações adicionais</p>
          <p>{psych.note}</p>
        </div>
      </section>

      {/* Anexos */}
      <section className="flex flex-col gap-3">
        <h2 style={{ color: "var(--color-p-xanthous)" }}>Anexos</h2>

        <ButtonDownloadDocument documentId={curriculumVitae.id}>
          <div
            style={{ border: "var(--color-p-xanthous) .0625rem solid" }}
            className="rounded-lg p-3"
          >
            <div className="flex gap-2 align-items-center font-bold">
              <FileText style={{ color: "var(--color-success)" }} />
              <span>{psych.curriculumVitae.name}</span>
            </div>

            <div className="flex justify-between items-center mt-2">
              <p>
                Criado em:{" "}
                <span>
                  {psych.curriculumVitae.createdAt
                    ? new Date(
                      psych.curriculumVitae.createdAt,
                    ).toLocaleDateString("pt-BR")
                    : "Não informado"}
                </span>
              </p>
              <Download style={{ color: "var(--color-p-indigo)" }} />
            </div>
          </div>
        </ButtonDownloadDocument>

        <form
          className="flex flex-col gap-3"
          action={async (formData: FormData) => {
            "use server";
            const status = formData.get("approval") as PsychStatus;
            const interviewed = formData.get("interviewed") === "true";

            await prisma.psych.update({
              where: { userId: psych.user.id },
              data: { status, interviewed },
            });
            redirect(`/admin/pre-psych/list/`);
          }}
        >

          <p className="font-bold">Profissional foi entrevistado?</p>
          <RadioGroup
            name="interviewed"
            defaultValue={psych.interviewed.toString()}
            className="flex gap-8"
          >
            <div className="flex gap-2 items-center">
              <RadioGroupItem value="true" id="yesInterviewed" />
              <Label htmlFor="yesInterviewed">Sim</Label>
            </div>
            <div className="flex gap-2 items-center">
              <RadioGroupItem value="false" id="noInterviewed" />
              <Label htmlFor="noInterviewed">Não</Label>
            </div>
          </RadioGroup>

          <div>
            <p className="font-bold mb-2">Aprovar candidatura?</p>
            <RadioGroup
              name="approval"
              defaultValue={psych.status.toString()}
              className="flex gap-8"
            >
              <div className="flex items-center gap-3">
                <RadioGroupItem value={PsychStatus.APPROVED} id="yesApproval" />
                <Label htmlFor="yesApproval">Sim</Label>
              </div>
              <div className="flex items-center gap-3">
                <RadioGroupItem value={PsychStatus.FAILED} id="noApproval" />
                <Label htmlFor="noApproval">Não</Label>
              </div>
            </RadioGroup>
          </div>
          <Button
            type="submit"
            className="mt-4 bg-transparent hover:bg-[#fdeddd]"
            style={{ border: "var(--color-p-terracotta) .0625rem solid" }}
          >
            Salvar
          </Button>
          <Button>
            Avançar
          </Button>
        </form>

      </section>
    </>
  );
}