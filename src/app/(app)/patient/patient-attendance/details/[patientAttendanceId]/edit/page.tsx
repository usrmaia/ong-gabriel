import { PatientAttendance, User } from "@prisma/client";

import { BackNavigationHeader } from "@/components/ui";
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
    { include: { patient: true } },
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
      <BackNavigationHeader title="Editar atendimento" />
      <section>
        <PatientAttendanceEditForm patientAttendance={patientAttendance} />
      </section>
    </>
  );
}
