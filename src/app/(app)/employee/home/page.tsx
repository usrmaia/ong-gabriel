import {
  CalendarClock,
  CalendarDays,
  ClipboardPlus,
  LogOut,
  Stethoscope,
  UserSearch,
  UserRound,
} from "lucide-react";
import { PatientAttendance, User } from "@prisma/client";

import { CardMenu, CardPatientAttendance } from "@/components/ui";
import { getPatientAttendances } from "@/services";
import { getUserAuthenticated } from "@/utils/auth";

export default async function HomePage() {
  const user = await getUserAuthenticated();
  const isAdmin = user.role.includes("ADMIN");
  const thirtyMinutesAgo = new Date(new Date().getTime() - 30 * 60 * 1000);
  const upcomingPatientAttendancesResult = await getPatientAttendances({
    where: {
      professionalId: isAdmin ? undefined : { equals: user.id },
      dateAt: { gte: thirtyMinutesAgo },
    },
    include: {
      patient: true,
    },
    orderBy: { dateAt: "asc" },
  });
  const upcomingPatientAttendances =
    (upcomingPatientAttendancesResult.data as (PatientAttendance & {
      patient: User;
    })[]) || [];

  return (
    <>
      <section className="flex flex-col gap-4">
        <h3 className="text-center">Boas vindas, {user.name?.split(" ")[0]}</h3>
        <div className="flex flex-row overflow-x-auto gap-6">
          {isAdmin && (
            <>
              <CardMenu
                href="/admin/pre-psych/list"
                title="Candidatos"
                icon={<Stethoscope />}
              />
              <CardMenu
                href="/admin/user/list"
                title="Usuários"
                icon={<UserSearch />}
              />
            </>
          )}
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
          <CardMenu
            href="/employee/availability-attendance"
            title="Horários Disponíveis"
            icon={<CalendarClock />}
          />
          <CardMenu
            href="/user/profile"
            title="Meu Perfil"
            icon={<UserRound />}
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
              key={attendance.id}
              attendance={attendance}
            />
          ))}
        </div>
      </section>
    </>
  );
}
