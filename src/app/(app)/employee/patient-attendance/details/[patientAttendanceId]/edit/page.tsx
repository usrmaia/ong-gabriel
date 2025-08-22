import { PatientAttendance, User } from "@prisma/client";

import { BackNavigationHeader, CardUserProfile } from "@/components/ui";
import { PatientAttendanceEditForm } from "./form";
import { getPatientAttendanceById } from "@/services";

export default async function PatientAttendanceEditPage({
  params,
}: {
  params: Promise<{ patientAttendanceId: string }>;
}) {
  const { patientAttendanceId } = await params;
  const patientAttendanceResult = await getPatientAttendanceById(
    patientAttendanceId,
    {
      include: { patient: true },
    },
  );

  if (!patientAttendanceResult.success || !patientAttendanceResult.data)
    return (
      <p className="text-center text-error">
        {patientAttendanceResult.error?.errors}
      </p>
    );

  const patientAttendance =
    patientAttendanceResult.data as PatientAttendance & {
      patient: User;
    };

  return (
    <>
      <BackNavigationHeader
        title="Editar agendamento"
        href={`/employee/patient/details/${patientAttendance.patientId}`}
      />
      <section className="flex flex-col gap-4">
        <CardUserProfile user={patientAttendance.patient} />
        <PatientAttendanceEditForm patientAttendance={patientAttendance} />
      </section>
    </>
  );
}
