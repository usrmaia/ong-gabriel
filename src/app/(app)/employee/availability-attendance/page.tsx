import { HeartHandshake, Users } from "lucide-react";
import Link from "next/link";

import {
  BackNavigationHeader,
  Button,
  Card,
  CardAction,
  CardAvailabilityAttendance,
  CardContent,
  CardHeader,
  CardPatientAttendance,
  CardTitle,
} from "@/components/ui";
import {
  AvailabilityAttendance,
  PatientAttendance,
  User,
} from "@prisma/client";
import { getAvailabilityAttendances, getPatientAttendances } from "@/services";
import { getUserAuthenticated } from "@/utils/auth";

const AttendanceOverviewCard = (props: {
  number: string;
  title: string;
  icon: React.ReactNode;
}) => (
  <Card className="gap-4 flex-1 justify-between">
    <CardHeader className="flex justify-between items-center">
      <CardTitle className="font-raleway font-bold text-3xl">
        {props.number}
      </CardTitle>
      <CardAction>
        <div className="p-2 border rounded-full bg-s-glacier-100 flex items-center justify-center">
          {props.icon}
        </div>
      </CardAction>
    </CardHeader>
    <CardContent className="font-raleway text-sm">{props.title}</CardContent>
  </Card>
);

export default async function AvailabilityAttendancePage() {
  const user = await getUserAuthenticated();
  const isAdmin = user.role.includes("ADMIN");
  const patientAttendancesResult = await getPatientAttendances({
    include: { patient: true },
    where: {
      OR: isAdmin
        ? undefined
        : [{ professionalId: user.id }, { professionalId: null }],
      dateAt: { gte: new Date() },
    },
    orderBy: { dateAt: "asc" },
  });
  const patientAttendances =
    patientAttendancesResult.data as (PatientAttendance & { patient: User })[];
  const availabilitiesAttendancesResult = await getAvailabilityAttendances({
    where: {
      professionalId: user.id,
      attendance: null,
      startAt: { gte: new Date() },
    },
  });
  const availabilitiesAttendances =
    availabilitiesAttendancesResult.data as AvailabilityAttendance[];

  return (
    <>
      <BackNavigationHeader
        title="Disponibilidade de atendimento"
        href="/employee/home"
      />
      <div className="flex flex-col justify-center w-full">
        <h3>Olá, {user.name}</h3>
        <p className="font-young my-4">
          Confira aqui seus horários agendados e livres.
          <br className="mb-2" />
          Você também pode{" "}
          <strong>disponibilizar novos horários de atendimento</strong> em sua
          agenda.
        </p>

        <div className="flex gap-4">
          <AttendanceOverviewCard
            number={patientAttendances.length.toString()}
            title="Horários agendados"
            icon={<HeartHandshake />}
          />
          <AttendanceOverviewCard
            number={availabilitiesAttendances.length.toString()}
            title="Horários livres"
            icon={<Users />}
          />
        </div>

        <Link
          href="/employee/availability-attendance/add"
          className="mt-6 w-full"
        >
          <Button className="w-full">Criar novos horários</Button>
        </Link>

        <div className="flex flex-col gap-4 my-4">
          <div className="flex items-center justify-between">
            <p className="font-young-serif text-s-brass-300 text-2xl">
              Próximas consultas
            </p>
            <Link href="/employee/patient-attendance">
              <Button
                variant="outline"
                className="border-s-navy-100 text-s-navy-100"
              >
                Ver todas
              </Button>
            </Link>
          </div>
          {patientAttendances.map((attendance, index) => (
            <CardPatientAttendance key={index} attendance={attendance} />
          ))}
        </div>

        <div className="flex flex-col gap-4 my-4">
          <div className="flex items-center justify-between">
            <p className="font-young-serif text-s-brass-300 text-2xl">
              Horários disponíveis
            </p>
            <Link href="/employee/availability-attendance/list">
              <Button
                variant="outline"
                className="border-s-navy-100 text-s-navy-100"
              >
                Ver lista
              </Button>
            </Link>
          </div>

          {availabilitiesAttendances.map((availabilityAttendance, index) => (
            <CardAvailabilityAttendance
              key={index}
              availabilityAttendance={availabilityAttendance}
            />
          ))}
        </div>
      </div>
    </>
  );
}
