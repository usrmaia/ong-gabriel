import Image from "next/image";
import Link from "next/link";

import { BackNavigationHeader, Card, CardContent } from "@/components/ui";
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
          <Link
            href={`/employee/patient/details/${patient.id}`}
            key={patient.id}
          >
            <Card
              key={patient.email}
              className="shadow-lg w-full border-0 rounded-lg h-[200px] p-1 pt-6"
            >
              <CardContent className="flex flex-col gap-6">
                <Image
                  src={patient.image ?? "/default-user.jpg"}
                  alt={`${patient.name}'s avatar`}
                  width={64}
                  height={64}
                  className="rounded-full border-1 border-p-tealwave p-0.25"
                />
                <p className="text-xl font-medium text-s-van-dyke font-poppins">
                  {patient.name?.split(" ")?.slice(0, 2)?.join(" ")}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </section>
    </>
  );
}
