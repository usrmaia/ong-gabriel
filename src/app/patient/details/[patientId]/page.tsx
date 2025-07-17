import { LuChevronLeft, LuMail, LuPhone } from "react-icons/lu";
import Image from "next/image";

import { Button, Card, CardContent } from "@/components/ui";
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
    if (a.dateAt && b.dateAt) return a.dateAt.getTime() - b.dateAt.getTime();
    if (a.dateAt && !b.dateAt) return -1;
    if (!a.dateAt && b.dateAt) return 1;
    return 0;
  });

  return (
    <section className="flex w-full flex-col items-center px-4">
      <div className="flex items-center w-full">
        <Link href="/patient/list">
          <Button size="icon" variant="ghost">
            <LuChevronLeft />
          </Button>
        </Link>
        <p className="font-raleway font-bold text-xl !text-s-taupe-secondary">
          Pacientes
        </p>
      </div>
      <div className="w-full flex flex-col items-center gap-2 pt-6">
        {patient.image && (
          <Image
            src={patient.image}
            alt={`${patient.name}'s avatar`}
            width={100}
            height={100}
            className="rounded-full border-1 border-s-verdigris max-w-16 md:w-md lg:w-md w-full h-auto"
          />
        )}
        <p className="font-poppins text-lg text-center text-s-van-dyke">
          {patient.name}
        </p>
      </div>
      <Card className="shadow-lg w-full py-4 border-0 rounded-lg">
        <CardContent className="flex flex-col gap-3">
          <div className="flex flex-row gap-2 text-center">
            <LuMail />
            <span className="text-sm font-poppins text-s-van-dyke">
              {patient.email}
            </span>
          </div>
          <div className="flex flex-row gap-2 text-center">
            <LuPhone />
            <span className="text-sm font-poppins text-s-van-dyke">
              {patient.phone || "N/A"}
            </span>
          </div>
          <p className="text-sm font-poppins text-s-van-dyke">
            <span className="font-bold">Data de Nascimento: </span>
            {patient.date_of_birth?.toLocaleDateString("pt-BR") ?? "N/A"}
          </p>
        </CardContent>
      </Card>
      <p className="font-raleway font-bold text-lg text-s-van-dyke mt-4">
        Histórico de Atendimento
      </p>
      {patientAttendances.map((attendance) => (
        <Card
          key={attendance.id}
          className="shadow-lg w-full mt-2 md:mt-4 py-4 border-0 rounded-lg"
        >
          <CardContent className="flex flex-col gap-3">
            <p className="font-poppins text-sm text-s-van-dyke">
              Data:{" "}
              {attendance.dateAt?.toLocaleDateString("pt-BR") ?? "A definir"}
            </p>
            <p className="text-sm font-poppins text-s-van-dyke">
              <span className="font-bold">Anotações: </span>
              {attendance.note}
            </p>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}
