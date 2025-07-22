import { CalendarDays, ClipboardPlus, LogOut } from "lucide-react";
import Link from "next/link";
import { PatientAttendance, User } from "@prisma/client";

import {
  Card,
  CardContent,
  CardHeader,
  CardPatientAttendance,
  CardTitle,
} from "@/components/ui";
import { getPatientAttendances } from "@/services";
import { getUserAuthenticated } from "@/utils/auth";

const CardMenu = (props: {
  href: string;
  title: string;
  icon: React.ReactNode;
}) => (
  <Link href={props.href}>
    <Card className="flex flex-col items-center justify-center gap-2 p-2 w-20 h-24 bg-s-azure-web-100 hover:bg-s-verdigris">
      <CardHeader className="justify-center text-s-van-dyke">
        <CardTitle>{props.icon}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardTitle className="font-poppins text-s-liver-100 font-medium text-xs">
          {props.title}
        </CardTitle>
      </CardContent>
    </Card>
  </Link>
);

export default async function HomePage() {
  const user = await getUserAuthenticated();
  const thirtyMinutesAgo = new Date(new Date().getTime() - 30 * 60 * 1000);
  const upcomingPatientAttendancesResult = await getPatientAttendances({
    where: {
      professionalId: { equals: user.id },
      dateAt: { gte: thirtyMinutesAgo },
    },
    include: {
      patient: true,
    },
    orderBy: { dateAt: "desc" },
  });
  const upcomingPatientAttendances =
    (upcomingPatientAttendancesResult.data as (PatientAttendance & {
      patient: User;
    })[]) || [];

  return (
    <>
      <section className="flex flex-col gap-4">
        <h3 className="text-center">Boas vindas, {user.name?.split(" ")[0]}</h3>
        <div className="flex flex-row gap-6">
          <CardMenu
            href="/employee/patient/list"
            title="Pacientes"
            icon={<ClipboardPlus />}
          />
          <CardMenu
            href="/employee/patient-attendance"
            title="Agenda"
            icon={<CalendarDays />}
          />
          <CardMenu href="/auth/logout" title="Sair" icon={<LogOut />} />
        </div>
      </section>
      <section className="flex flex-col gap-2">
        <p className="font-raleway text-lg font-bold text-s-gunmetal-100">
          Próximas consultas
        </p>
        <div className="flex flex-col gap-2">
          {upcomingPatientAttendances.map((attendance) => (
            <CardPatientAttendance
              attendance={attendance}
              key={attendance.id}
            />
          ))}
        </div>
      </section>
    </>
  );
}
