import { ClipboardList, LogOut, CalendarDays } from "lucide-react";
import { PatientAttendance, User } from "@prisma/client";

import { CardMenu, CardAttendance } from "@/components/ui";
import { getUserAuthenticated } from "@/utils/auth";
import { getPatientAttendances } from "@/services";

export default async function PatientHomePage() {
    const user = await getUserAuthenticated();
    const thirtyMinutesAgo = new Date(new Date().getTime() - 30 * 60 * 1000);
    const upcomingPatientAttendancesResult = await getPatientAttendances({
        where: {
            patientId: user.id,
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
                            <CardMenu
                                href="/patient/form-anamnesis/list"
                                title="Anamneses"
                                icon={< ClipboardList />}
                            />        
                            <CardMenu
                                href="/patient/patient-attendance/list"
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
                        <CardAttendance
                            key={attendance.id}
                            patientAttendance={attendance}
                            mode="patient"
                        />
                    ))}
                </div>
            </section>
        </>
    )
};