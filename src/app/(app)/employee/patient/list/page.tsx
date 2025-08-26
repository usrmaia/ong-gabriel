import { BackNavigationHeader, CardUserAvatar } from "@/components/ui";
import { getUsers } from "@/services";
import { getUserAuthenticated } from "@/utils/auth";

export default async function PatientListPage() {
  const user = await getUserAuthenticated();
  const isAdmin = user.role.includes("ADMIN");
  const patientsResult = await getUsers({
    where: {
      role: { has: "PATIENT" },
      PatientAttendancePatient: {
        some: isAdmin ? undefined : { professionalId: user.id },
      },
    },
  });
  const patients = patientsResult.data || [];

  return (
    <>
      <BackNavigationHeader title="Pacientes" href="/employee/home" />
      <section className="grid grid-cols-2 gap-6">
        {patients.map((patient) => (
          <CardUserAvatar
            user={patient}
            href={`/employee/patient/details/${patient.id}`}
            key={patient.id}
          />
        ))}
      </section>
    </>
  );
}
