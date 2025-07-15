"use client";

import { Button } from "@/components/ui";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { User } from "@/generated/prisma";
import { PatientAttendance } from "@/generated/prisma";
import Image from "next/image";
import { TbPhoneCall } from "react-icons/tb";
import { LuCalendarCheck, LuMessageSquareMore } from "react-icons/lu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const PatientCard = ({ patient }: { patient: User }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>[TIPO]</CardTitle>
      </CardHeader>
      <CardContent>
        <Image
          src={patient.image || "/images/default-avatar.png"}
          alt={`${patient.name}'s avatar`}
          width={100}
          height={100}
          className="rounded-full"
        />
        <h2>{patient.name}</h2>
      </CardContent>
      <CardAction>
        <Button variant="outline" size="sm">
          <TbPhoneCall className="mr-2" />
        </Button>
        <Button variant="outline" size="sm">
          <LuMessageSquareMore className="mr-2" />
        </Button>
        <Button variant="outline" size="sm">
          <LuCalendarCheck className="mr-2" />
        </Button>
      </CardAction>
    </Card>
  );
};
export const PatientScheduleList = ({
  patients,
}: {
  patients: (User & { PatientAttendancePatient: PatientAttendance[] })[];
}) => {
  const upcomingPatients = patients.filter((patient) =>
    patient.PatientAttendancePatient.some(
      (attendance) => !!attendance.dateAt && attendance.dateAt >= new Date(),
    ),
  );
  const pastPatients = patients.filter((patient) =>
    patient.PatientAttendancePatient.some(
      (attendance) => !!attendance.dateAt && attendance.dateAt < new Date(),
    ),
  );

  return (
    <>
      <h3>Agenda</h3>
      <Tabs defaultValue="upcoming" className="w-[400px]">
        <TabsList>
          <TabsTrigger value="upcoming">Próximas consultas</TabsTrigger>
          <TabsTrigger value="past">Consultas realizadas</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming">
          {upcomingPatients.map((patient) => (
            <PatientCard key={patient.id} patient={patient} />
          ))}
        </TabsContent>
        <TabsContent value="past">
          {pastPatients.map((patient) => (
            <PatientCard key={patient.id} patient={patient} />
          ))}
        </TabsContent>
      </Tabs>
    </>
  );
};
