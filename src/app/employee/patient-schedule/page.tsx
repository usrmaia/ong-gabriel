import { PatientScheduleList } from "./list";
import { getPatientAttendances } from "@/services";
import { PatientAttendance, User } from "@/generated/prisma";

export default async function PatientSchedulePage() {
  const attendances = await getPatientAttendances({
    include: { patient: true },
  });
  return (
    <PatientScheduleList
      patients={
        (attendances.data as (PatientAttendance & {
          patient: User;
        })[]) || []
      }
    />
  );
}
