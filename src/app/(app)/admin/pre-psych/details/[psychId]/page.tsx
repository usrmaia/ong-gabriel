import { format } from "date-fns";
import { TZDateMini } from "@date-fns/tz";
import { Download, FileText } from "lucide-react";
import Image from "next/image";
import { User, Psych, Document } from "@prisma/client";

import {
  BackNavigationHeader,
  Badge,
  ButtonDownloadDocument,
  Label,
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui";
import { PrePsychDetailsForm } from "./form";
import { getPsychById } from "@/services";

export default async function PrePsychDetailsPage({
  params,
}: {
  params: Promise<{ psychId: string }>;
}) {
  const { psychId } = await params;
  const psychResult = await getPsychById(psychId, {
    include: {
      user: true,
      curriculumVitae: { select: { name: true, createdAt: true } },
      proofAddress: { select: { name: true, createdAt: true } },
    },
  });

  if (!psychResult.success || !psychResult.data)
    return (
      <p>
        Erro ao carregar detalhes do pré-psicólogo. {psychResult.error?.errors}
      </p>
    );

  const psych = psychResult.data as Psych & {
    user: User;
    curriculumVitae: Document;
    proofAddress: Document;
  };

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
          <p className="font-bold text-s-brass-300">{psych.user.full_name}</p>
          <p className="my-1">
            <span className="font-bold">CRP: </span>
            {psych.CRP.replace(/^(\d{2})(\d{6})$/, "$1/$2")}
          </p>
          <div>
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
            {psych.status == "APPROVED" && (
              <Badge className="text-s-charcoal-100 bg-success">Aprovado</Badge>
            )}
            {psych.status == "FAILED" && (
              <Badge className="text-s-charcoal-100 bg-error">Reprovado</Badge>
            )}
          </div>
        </div>
      </section>

      {/* Dados Pessoais */}
      <section className="flex flex-col gap-4">
        <Label className="font-young-serif text-3xl text-p-xanthous">
          Dados Pessoais
        </Label>
        <div className="border-b-2 border-s-slate-100 pb-2">
          <p className="font-bold text-s-brass-300">Nome</p>
          <p>{psych.user.full_name}</p>
        </div>
        <div className="border-b-2 border-s-slate-100 pb-2">
          <p className="font-bold text-s-brass-300">Data de nascimento</p>
          <p>
            {psych.user.date_of_birth
              ? format(
                  new TZDateMini(psych.user.date_of_birth, "America/Sao_Paulo"),
                  "dd/MM/yyyy, HH:mm",
                )
              : "Não informado"}
          </p>
        </div>
        <div className="border-b-2 border-s-slate-100 pb-2">
          <p className="font-bold text-s-brass-300">E-mail</p>
          <p>{psych.user.email.toLowerCase()}</p>
        </div>
        <div className="border-b-2 border-s-slate-100 pb-2">
          <p className="font-bold text-s-brass-300">Telefone</p>
          <p>
            {psych.user.phone
              ? psych.user.phone.replace(
                  /^(\+?55)?(\d{2})(\d{4,5})(\d{4})$/,
                  "+55 ($2) $3-$4",
                )
              : psych.user.phone}
          </p>
        </div>
      </section>

      {/* Informações Residenciais */}
      <section className="flex flex-col gap-4">
        <Label className="font-young-serif text-3xl text-p-xanthous">
          Informações Residenciais
        </Label>
        <div className="border-b-2 border-s-slate-100 pb-2">
          <p className="font-bold text-s-brass-300">CEP</p>
          <p>{psych.zipCode}</p>
        </div>
        <div className="border-b-2 border-s-slate-100 pb-2">
          <p className="font-bold text-s-brass-300">Endereço</p>
          <p>{psych.street}</p>
        </div>
        <div className="border-b-2 border-s-slate-100 pb-2 flex gap-2">
          <div>
            <p className="font-bold text-s-brass-300">Número</p>
            <p>{psych.number}</p>
          </div>
          <div className="w-full">
            <p className="font-bold text-s-brass-300">Complemento</p>
            <p>{psych.complement}</p>
          </div>
        </div>
        <div className="border-b-2 border-s-slate-100 pb-2">
          <p className="font-bold text-s-brass-300">Bairro</p>
          <p>{psych.district}</p>
        </div>
        <div className="border-b-2 border-s-slate-100 pb-2 flex gap-5">
          <div>
            <p className="font-bold text-s-brass-300">Estado</p>
            <p>{psych.state}</p>
          </div>
          <div className="w-full">
            <p className="font-bold text-s-brass-300">Cidade</p>
            <p>{psych.city}</p>
          </div>
        </div>
      </section>

      {/* Informações Profissionais */}
      <section className="flex flex-col gap-4">
        <Label className="font-young-serif text-3xl text-p-xanthous">
          Informações Profissionais
        </Label>

        <div>
          <p className="font-bold text-s-brass-300 mb-2">
            Experiência na prevenção e suicídio
          </p>
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

        <div className="border-b-2 border-s-slate-100 pb-2">
          <p className="font-bold text-s-brass-300">CRP</p>
          <p>{psych.CRP.replace(/^(\d{2})(\d{6})$/, "$1/$2")}</p>
        </div>

        <div className="border-b-2 border-s-slate-100 pb-2">
          <p className="font-bold text-s-brass-300">Observações adicionais</p>
          <p>{psych.note}</p>
        </div>
      </section>

      {/* Anexos */}
      <section className="flex flex-col gap-4">
        <Label className="font-young-serif text-3xl text-p-xanthous">
          Anexos
        </Label>

        <ButtonDownloadDocument documentId={psych.curriculumVitaeId}>
          <div className="rounded-lg p-3 border-s-butter-200 border-1">
            <div className="flex gap-2 items-center">
              <FileText size={24} className="text-success flex-shrink-0" />
              <div className="font-bold text-nowrap overflow-hidden text-ellipsis">
                {psych.curriculumVitae.name}
              </div>
            </div>

            <div className="flex justify-between gap-4 items-center mt-2 text-xs">
              <p className="text-right w-full">
                Criado em:{" "}
                <span>
                  {format(
                    new TZDateMini(
                      psych.curriculumVitae.createdAt,
                      "America/Sao_Paulo",
                    ),
                    "dd/MM/yyyy, HH:mm",
                  )}
                </span>
              </p>
              <Download className="text-s-navy-100" />
            </div>
          </div>
        </ButtonDownloadDocument>

        <ButtonDownloadDocument documentId={psych.proofAddressId}>
          <div className="rounded-lg p-3 border-s-butter-200 border-1">
            <div className="flex gap-2 items-center">
              <FileText size={24} className="text-success flex-shrink-0" />
              <div className="font-bold text-nowrap overflow-hidden text-ellipsis">
                {psych.proofAddress.name}
              </div>
            </div>

            <div className="flex justify-between gap-4 items-center mt-2 text-xs">
              <p className="text-right w-full">
                Criado em:{" "}
                <span>
                  {format(
                    new TZDateMini(
                      psych.curriculumVitae.createdAt,
                      "America/Sao_Paulo",
                    ),
                    "dd/MM/yyyy, HH:mm",
                  )}
                </span>
              </p>
              <Download className="text-s-navy-100" />
            </div>
          </div>
        </ButtonDownloadDocument>
      </section>

      <PrePsychDetailsForm psych={psych} />
    </>
  );
}
