import { Mail, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { PatientAttendance, User } from "@prisma/client";

import { Card, CardContent } from "@/components/ui";

export const CardPatientProfile = ({ patient }: { patient: User }) => (
  <Card className="shadow-lg w-full py-4 border-0 rounded-lg">
    <CardContent className="flex flex-col gap-2 text-s-van-dyke text-sm font-poppins">
      <div className="flex gap-2">
        <Mail />
        <span>{patient.email}</span>
      </div>
      <div className="flex gap-2">
        <Phone />
        <span>{patient.phone || "N/A"}</span>
      </div>
      <p>
        <span className="font-bold">Data de Nascimento: </span>
        {patient.date_of_birth?.toLocaleDateString("pt-BR") ?? "N/A"}
      </p>
    </CardContent>
  </Card>
);

export const CardPatientAttendance = ({
  attendance,
}: {
  attendance: PatientAttendance & { patient: User };
}) => {
  return (
    <Link href={`/employee/patient/details/${attendance.patientId}`}>
      <Card className={`shadow-lg w-full px-2 py-4 border-0`}>
        {/* <CardHeader>
        <CardTitle>[TIPO]</CardTitle>
      </CardHeader> */}
        <CardContent className="flex flex-row items-center gap-5 w-full">
          <Image
            src={attendance.patient.image ?? "/default-user.jpg"}
            alt={`${attendance.patient.name}'s avatar`}
            width={40}
            height={40}
            className="rounded-full border-1 border-p-tealwave p-0.25"
          />
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">
              {attendance.dateAt?.toLocaleString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })}
            </span>
            <p className="font-raleway font-bold text-lg text-s-van-dyke">
              {attendance.patient.name}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
