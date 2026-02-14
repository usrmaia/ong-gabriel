import { PatientAttendance, User } from "@prisma/client";

import { BackNavigationHeader, CardAttendance } from "@/components/ui";
import { getPatientAttendances } from "@/services";
import { getUserAuthenticated } from "@/utils/auth";

export default async function PatientAttendanceListPage() {
  const user = await getUserAuthenticated();
  const patientAttendancesResult = await getPatientAttendances({
    include: { patient: true },
    where: { patientId: user.id },
    orderBy: { dateAt: "asc" },
  });
  const patientAttendances =
    patientAttendancesResult.data as (PatientAttendance & { patient: User })[];

  return (
    <>
      <BackNavigationHeader
        title="Histórico de atendimentos"
        href="/patient/home"
      />
      <div className="flex flex-col gap-4">
        {patientAttendances.map((attendance) => (
          <CardAttendance
            key={attendance.id}
            patientAttendance={attendance}
            mode="patient"
          />
        ))}
      </div>
    </>
  );
}
