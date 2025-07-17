"use client";

import Image from "next/image";
import { redirect, RedirectType } from "next/navigation";
import { useEffect, useState } from "react";
import { TbPhoneCall } from "react-icons/tb";
import {
  LuCalendarCheck,
  LuChevronLeft,
  LuMessageSquareMore,
} from "react-icons/lu";

import {
  Button,
  Card,
  CardAction,
  CardContent,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui";
import { PatientAttendance, User } from "@/generated/prisma";

const PatientAttendanceCard = ({
  attendance,
}: {
  attendance: PatientAttendance & { patient: User };
}) => {
  return (
    <Card className="shadow-lg w-67 px-2 py-4 border-0">
      {/* <CardHeader>
        <CardTitle>[TIPO]</CardTitle>
      </CardHeader> */}
      <CardContent
        className="flex flex-row items-center gap-5 w-full"
        onClick={() =>
          redirect(
            `/patient/details/${attendance.patientId}`,
            RedirectType.push,
          )
        }
      >
        {attendance.patient.image && (
          <Image
            // TODO: Imagem default caso não tenha imagem
            src={attendance.patient.image}
            alt={`${attendance.patient.name}'s avatar`}
            width={40}
            height={40}
            className="rounded-full"
          />
        )}
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
      <CardAction className="flex flex-row items-center justify-between w-full">
        <Button variant="outline" size="icon" className="rounded-full border-0">
          <TbPhoneCall />
        </Button>
        <Button variant="outline" size="icon" className="rounded-full border-0">
          <LuMessageSquareMore />
        </Button>
        <Button variant="outline" size="icon" className="rounded-full border-0">
          <LuCalendarCheck />
        </Button>
      </CardAction>
    </Card>
  );
};

export const PatientScheduleList = ({
  patients,
}: {
  patients: (PatientAttendance & { patient: User })[];
}) => {
  const [upcomingPatientAttendaces, setUpcomingPatientAttendaces] = useState<
    (PatientAttendance & { patient: User })[]
  >([]);
  const [pastPatientAttendaces, setPastPatientAttendaces] = useState<
    (PatientAttendance & { patient: User })[]
  >([]);
  const [undefinedPatientAttendaces, setUndefinedPatientAttendaces] = useState<
    (PatientAttendance & { patient: User })[]
  >([]);

  useEffect(() => {
    const upcoming = patients.filter(
      (patient) => !!patient.dateAt && patient.dateAt >= new Date(),
    );
    setUpcomingPatientAttendaces(upcoming);

    const past = patients.filter(
      (patient) => !!patient.dateAt && patient.dateAt < new Date(),
    );
    setPastPatientAttendaces(past.reverse());

    const undefinedAttendances = patients.filter((patient) => !patient.dateAt);
    setUndefinedPatientAttendaces(undefinedAttendances);
  }, [patients]);

  return (
    <section className="flex w-full flex-col items-center px-4">
      <div className="flex items-center w-full">
        <Button size="icon" variant="ghost">
          <LuChevronLeft />
        </Button>
        <p className="font-raleway font-bold text-xl !text-s-taupe-secondary">
          Agenda
        </p>
      </div>
      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger
            value="upcoming"
            className="data-[state=inactive]:text-gray-500"
          >
            Próximas consultas
          </TabsTrigger>
          <TabsTrigger
            value="past"
            className="data-[state=inactive]:text-gray-500"
          >
            Consultas realizadas
          </TabsTrigger>
          <TabsTrigger
            value="undefined"
            className="data-[state=inactive]:text-gray-500"
          >
            Não definidas
          </TabsTrigger>
        </TabsList>
        <TabsContent
          value="upcoming"
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 w-full justify-items-center"
        >
          {upcomingPatientAttendaces.map((patientAttendance) => (
            <PatientAttendanceCard
              key={patientAttendance.id}
              attendance={patientAttendance}
            />
          ))}
        </TabsContent>
        <TabsContent
          value="past"
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 w-full justify-items-center"
        >
          {pastPatientAttendaces.map((patientAttendance) => (
            <PatientAttendanceCard
              key={patientAttendance.id}
              attendance={patientAttendance}
            />
          ))}
        </TabsContent>
        <TabsContent
          value="undefined"
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 w-full justify-items-center"
        >
          {undefinedPatientAttendaces.map((patientAttendance) => (
            <PatientAttendanceCard
              key={patientAttendance.id}
              attendance={patientAttendance}
            />
          ))}
        </TabsContent>
      </Tabs>
    </section>
  );
};
