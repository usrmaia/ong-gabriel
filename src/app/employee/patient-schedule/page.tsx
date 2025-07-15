import { PatientScheduleList } from "./list";
import { getUsers } from "@/services";
import { PatientAttendance, User } from "@/generated/prisma";

export default async function PatientSchedulePage() {
  const patients = await getUsers({
    include: { PatientAttendancePatient: true },
  });
  return (
    <PatientScheduleList
      patients={
        (patients.data as (User & {
          PatientAttendancePatient: PatientAttendance[];
        })[]) || []
      }
    />
  );
}
