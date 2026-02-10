import { Stethoscope, ClipboardList, LogOut } from "lucide-react";
import Link from "next/link";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui";
import { getUserAuthenticated } from "@/utils/auth";
import { CardAttendance } from "@/components/ui/patient"
import { getPatientAttendances } from "@/services";

const CardMenu = (props: {
    href: string;
    title: string;
    icon: React.ReactNode;
}) => (
    <Link href={props.href}>
        <Card className="flex flex-col items-center justify-between gap-1 w-24 h-24 pt-5 bg-s-azure-web-100 hover:bg-s-verdigris">
            <CardHeader className="justify-center text-s-van-dyke">
                <CardTitle>{props.icon}</CardTitle>
            </CardHeader>
            <CardContent>
                <CardTitle className="flex items-center text-center h-8 font-poppins text-s-liver-100 font-medium text-xs">
                    {props.title}
                </CardTitle>
            </CardContent>
        </Card>
    </Link>
);

export default async function PatientHomePage() {
    const user = await getUserAuthenticated();
    const isPatient = user.role.includes("PATIENT");


    return (
        <>
            <section className="flex flex-col gap-4">
                <h3 className="text-center">Boas vindas, {user.name?.split(" ")[0]}</h3>
                <div className="flex flex-row overflow-x-auto gap-6">
                    {isPatient && (
                        <>
                            <CardMenu
                                href="/patient/form-anamnesis/list"
                                title="Anamneses"
                                icon={< ClipboardList />}
                            />
                            <CardMenu
                                href="/patient/patient-attendance/list"
                                title="Atendimentos"
                                icon={<Stethoscope />}
                            />
                        </>
                    )}
                    <CardMenu href="/auth/logout" title="Sair" icon={<LogOut />} />
                </div>
            </section>
        </>
    )
};