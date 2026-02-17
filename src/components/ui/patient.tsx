import { format } from "date-fns";
import { TZDateMini } from "@date-fns/tz";
import { Edit } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FormAnamnesis, PatientAttendance, User } from "@prisma/client";

import {
  Button,
  Card,
  CardAction,
  CardContent,
  CardHeader,
} from "@/components/ui";
import {
  DifficultiesBasicSchema,
  DifficultiesEatingSchema,
  DifficultiesSleepingSchema,
  WhoLivesWithSchema,
} from "@/schemas";

export const CardPatientAttendance = ({
  attendance,
}: {
  attendance: PatientAttendance & { patient: User };
}) => {
  return (
    <Link href={`/employee/patient/details/${attendance.patientId}`}>
      <Card className={`shadow-lg w-full px-2 py-4 border-0`}>
        <CardContent className="flex flex-row items-center gap-5 w-full">
          <Image
            src={attendance.patient.image ?? "/default-user.jpg"}
            alt={`${attendance.patient.name}'s avatar`}
            width={40}
            height={40}
            className="rounded-full border-1 border-p-tealwave p-0.25"
          />
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">
              {attendance.dateAt &&
                format(
                  new TZDateMini(attendance.dateAt, "America/Sao_Paulo"),
                  "dd/MM/yyyy, HH:mm",
                )}
            </span>
            <p className="font-raleway font-bold text-lg text-s-van-dyke">
              {attendance.patient.name}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export const CardFormAnamnesis = ({
  anamnesis,
}: {
  anamnesis: FormAnamnesis;
}) => {
  return (
    <Card className="shadow-lg w-full py-4 border-0 rounded-lg">
      <CardHeader className="font-bold">
        <p className="text-sm text-right">
          {format(
            new TZDateMini(anamnesis.createdAt, "America/Sao_Paulo"),
            "dd/MM/yyyy, HH:mm",
          )}
        </p>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 text-s-van-dyke text-sm font-poppins">
        <div className="flex flex-col gap-1">
          <p className="font-bold">Quem mora com você?</p>
          <p>
            {WhoLivesWithSchema.parse(anamnesis.whoLivesWith).join(", ") ||
              "N/A"}
          </p>
        </div>
        <div className="flex flex-col gap-1">
          <p className="font-bold">Qual sua ocupação atual?</p>
          <p>{anamnesis.occupation || "N/A"}</p>
        </div>
        <div className="flex flex-col gap-1">
          <p className="font-bold">Qual a sua renda mensal?</p>
          <p>
            {Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(Number(anamnesis.monthlyIncomeCents) / 100)}
          </p>
        </div>
        <div className="flex flex-col gap-1">
          <p className="font-bold">Qual a sua renda familiar?</p>
          <p>
            {Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(Number(anamnesis.monthlyFamilyIncomeCents) / 100)}
          </p>
        </div>
        <div className="flex flex-col gap-1">
          <p className="font-bold">
            Você tem dificuldades para atender às necessidades básicas?
          </p>
          <p>{DifficultiesBasicSchema.parse(anamnesis.difficultiesBasic)}</p>
        </div>
        <div className="flex flex-col gap-1">
          <p className="font-bold">
            Recebe algum benefício do governo ou apoio social? Se sim, descreva!
          </p>
          <p>{anamnesis.socialBenefits || "N/A"}</p>
        </div>
        <div className="flex flex-col gap-1">
          <p className="font-bold">
            Como você descreveria seu estado emocional nos últimos dias?
          </p>
          <p>{anamnesis.emotionalState || "N/A"}</p>
        </div>
        <div className="flex flex-col gap-1">
          <p className="font-bold">Vocês têm dificuldades para dormir?</p>
          <p>
            {DifficultiesSleepingSchema.parse(anamnesis.difficultiesSleeping)}
          </p>
        </div>
        <div className="flex flex-col gap-1">
          <p className="font-bold">Dificuldade para se alimentar?</p>
          <p>{DifficultiesEatingSchema.parse(anamnesis.difficultyEating)}</p>
        </div>
        <div className="flex flex-col gap-1">
          <p className="font-bold">
            Você já sentiu que não consegue lidar com os seus problemas?
          </p>
          <p>{anamnesis.canNotDealWithProblems || "N/A"}</p>
        </div>
        <div className="flex flex-col gap-1">
          <p className="font-bold">Já pensou em machucar a si mesmo?</p>
          <p>{anamnesis.selfDestructiveThoughts || "N/A"}</p>
        </div>
        <div className="flex flex-col gap-1">
          <p className="font-bold">
            Você tem alguém com quem confiar e conversar?
          </p>
          <p>{anamnesis.haveSomeoneToTrust || "N/A"}</p>
        </div>
        <div className="flex flex-col gap-1">
          <p className="font-bold">
            Entre familiares ou amigos, há alguém que te apoie emocionalmente?
          </p>
          <p>{anamnesis.haveEmotionalSupport || "N/A"}</p>
        </div>
        <div className="flex flex-col gap-1">
          <p className="font-bold">
            Algum familiar ou amigo te apoia financeiramente?
          </p>
          <p>{anamnesis.haveFinancialSupport || "N/A"}</p>
        </div>
        <div className="flex flex-col gap-1">
          <p className="font-bold">
            Você tem algum diagnóstico de saúde (física ou mental) feito por um
            médico?
          </p>
          <p>{anamnesis.hasMedicalDiagnosis || "N/A"}</p>
        </div>
        <div className="flex flex-col gap-1">
          <p className="font-bold">
            Já acompanha ou trata com psicológico/psiquiátrico atualmente?
          </p>
          <p>{anamnesis.currentlyUndergoingPsychTreatment || "N/A"}</p>
        </div>
        <div className="flex flex-col gap-1">
          <p className="font-bold">Usa algum tipo de medicamento?</p>
          <p>{anamnesis.currentlyTakingMedication || "N/A"}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export const CardAttendance = ({
  patientAttendance,
  mode,
}: {
  patientAttendance: PatientAttendance;
  mode: "patient" | "employee";
}) => {
  return (
    <Card className="shadow-lg w-full py-4 border-0 rounded-lg relative">
      <CardHeader className="flex justify-center absolute top-2 right-2">
        <CardAction>
          <Link
            href={
              mode === "employee"
                ? `/employee/patient-attendance/details/${patientAttendance.id}/edit`
                : `/patient/patient-attendance/details/${patientAttendance.id}/edit`
            }
          >
            <Button size="icon" variant="ghost">
              <Edit />
            </Button>
          </Link>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <p className="font-poppins text-sm text-s-van-dyke">
          Data:{" "}
          {patientAttendance.dateAt
            ? format(
                new TZDateMini(patientAttendance.dateAt, "America/Sao_Paulo"),
                "dd/MM/yyyy, HH:mm",
              )
            : "A definir"}
        </p>
        <p className="text-sm font-poppins text-s-van-dyke">
          <span>Duração: </span>
          {patientAttendance.durationMinutes
            ? `${patientAttendance.durationMinutes} minutos`
            : "A definir"}
        </p>
        {mode === "employee" && (
          <p className="text-sm font-poppins text-s-van-dyke">
            <span className="font-bold">Anotações: </span>
            {patientAttendance.note || "Sem anotações"}
          </p>
        )}
        <p className="text-sm font-poppins text-s-van-dyke">
          <span className="font-bold">Feedback: </span>
          {patientAttendance.feedback || "Sem feedback"}
        </p>
      </CardContent>
    </Card>
  );
};
