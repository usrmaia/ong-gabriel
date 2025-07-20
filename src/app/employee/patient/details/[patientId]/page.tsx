import { Edit } from "lucide-react";
import Image from "next/image";

import {
  BackNavigationHeader,
  Button,
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardPatientProfile,
} from "@/components/ui";
import { PatientAttendance, User } from "@/generated/prisma";
import { getUserById } from "@/services";
import Link from "next/link";

export default async function PatientDetailsPage({
  params,
}: {
  params: Promise<{ patientId: string }>;
}) {
  const { patientId } = await params;
  const patientResult = await getUserById(patientId, {
    include: { PatientAttendancePatient: true },
  });

  if (!patientResult.success) return <p>Error loading patient details.</p>;

  const patient = patientResult.data as User & {
    PatientAttendancePatient: PatientAttendance[];
  };

  const patientAttendances = patient.PatientAttendancePatient.sort((a, b) => {
    if (a.dateAt && b.dateAt) return b.dateAt.getTime() - a.dateAt.getTime();
    if (a.dateAt && !b.dateAt) return 1;
    if (!a.dateAt && b.dateAt) return -1;
    return 0;
  });

  return (
    <>
      <BackNavigationHeader title="Paciente" href="/employee/patient/list" />
      <section className="flex flex-col gap-2">
        <div className="w-full flex flex-col items-center gap-2">
          <Image
            src={patient.image ?? "/default-user.jpg"}
            alt={`${patient.name}'s avatar`}
            width={100}
            height={100}
            className="rounded-full border-1 border-p-tealwave p-0.25 w-14 h-14 object-cover"
          />
          <p className="font-poppins text-lg text-s-van-dyke">{patient.name}</p>
        </div>
        <CardPatientProfile patient={patient} />
        <p className="font-raleway font-bold text-lg text-s-van-dyke mt-2">
          Histórico de Atendimento(s)
        </p>
        {patientAttendances.map((attendance) => (
          <Card
            key={attendance.id}
            className="shadow-lg w-full py-4 border-0 rounded-lg relative"
          >
            <CardHeader className="flex justify-center absolute top-2 right-2">
              <CardAction>
                <Link
                  href={`/employee/patient-attendance/details/${attendance.id}/edit`}
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
                {attendance.dateAt?.toLocaleString("pt-BR", {
                  dateStyle: "short",
                  timeStyle: "short",
                }) ?? "A definir"}
              </p>
              <p className="text-sm font-poppins text-s-van-dyke">
                <span>Duração: </span>
                {attendance.durationMinutes
                  ? `${attendance.durationMinutes} minutos`
                  : "A definir"}
              </p>
              <p className="text-sm font-poppins text-s-van-dyke">
                <span className="font-bold">Anotações: </span>
                {attendance.note}
              </p>
            </CardContent>
          </Card>
        ))}
      </section>
    </>
  );
}
