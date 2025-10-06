import { PatientAttendance, User } from "@prisma/client";

import { BackNavigationHeader } from "@/components/ui";
import { ListPatientAttendances } from "./list";
import { getPatientAttendances } from "@/services";
import { getUserAuthenticated } from "@/utils/auth";

export default async function PatientAttendancesPage() {
  const user = await getUserAuthenticated();
  const isAdmin = user.role.includes("ADMIN");
  const patientAttendancesResult = await getPatientAttendances({
    include: { patient: true },
    where: {
      OR: isAdmin
        ? undefined
        : [{ professionalId: user.id }, { professionalId: null }],
    },
    orderBy: { dateAt: "asc" },
  });
  const patientAttendances =
    patientAttendancesResult.data as (PatientAttendance & { patient: User })[];

  return (
    <>
      <BackNavigationHeader title="Agenda de Consultas" href="/employee/home" />
      <ListPatientAttendances patientAttendances={patientAttendances} />;
    </>
  );
}
