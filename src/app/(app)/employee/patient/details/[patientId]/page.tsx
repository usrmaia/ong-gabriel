import Image from "next/image";
import { PatientAttendance, User } from "@prisma/client";

import {
  BackNavigationHeader,
  CardAttendance,
  CardFormAnamnesis,
  CardUserProfile,
} from "@/components/ui";
import { getPatientFormAnamnesis, getUserById } from "@/services";

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

  const formAnamnesisResult = await getPatientFormAnamnesis({
    include: { user: true },
    where: { userId: patientId },
    orderBy: { createdAt: "desc" },
  });

  const formAnamnesis = formAnamnesisResult.data || [];

  return (
    <>
      <BackNavigationHeader title="Paciente" />
      <section className="flex flex-col gap-2">
        <div className="w-full flex flex-col items-center gap-2">
          <Image
            src={patient.image ?? "/default-user.jpg"}
            alt={`${patient.name}'s avatar`}
            width={100}
            height={100}
            className="rounded-full border border-p-tealwave p-px w-14 h-14 object-cover"
          />
          <p className="font-poppins text-lg text-s-van-dyke">{patient.name}</p>
        </div>
        <CardUserProfile user={patient} />
        <p className="font-raleway font-bold text-lg text-s-van-dyke mt-2">
          Histórico de Atendimento(s)
        </p>
        {patientAttendances.map((attendance) => (
          <CardAttendance key={attendance.id} patientAttendance={attendance} mode="employee" />
        ))}
        <p className="font-raleway font-bold text-lg text-s-van-dyke mt-2">
          Histórico de Anamneses
        </p>
        {formAnamnesis.map((anamnesis) => (
          <CardFormAnamnesis key={anamnesis.id} anamnesis={anamnesis} />
        ))}
      </section>
    </>
  );
}
