"use client";

import { PatientAttendance, User } from "@prisma/client";
import { useEffect, useState } from "react";

import {
  CardPatientAttendance,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui";

export const ListPatientAttendances = ({
  patientAttendances,
}: {
  patientAttendances: (PatientAttendance & { patient: User })[];
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
    const upcoming = patientAttendances.filter(
      (patient) => !!patient.dateAt && patient.dateAt >= new Date(),
    );
    setUpcomingPatientAttendaces(upcoming);

    const past = patientAttendances.filter(
      (patient) => !!patient.dateAt && patient.dateAt < new Date(),
    );
    setPastPatientAttendaces(past.reverse());

    const undefinedAttendances = patientAttendances.filter(
      (patient) => !patient.dateAt,
    );
    setUndefinedPatientAttendaces(undefinedAttendances);
  }, [patientAttendances]);

  return (
    <section className="flex flex-col items-center">
      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger
            value="upcoming"
            className="data-[state=inactive]:text-gray-500"
          >
            Próximas
          </TabsTrigger>
          <TabsTrigger
            value="past"
            className="data-[state=inactive]:text-gray-500"
          >
            Realizadas
          </TabsTrigger>
          <TabsTrigger
            value="undefined"
            className="data-[state=inactive]:text-gray-500"
          >
            Não definidas
          </TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming" className="flex flex-col gap-4">
          {upcomingPatientAttendaces.map((patientAttendance) => (
            <CardPatientAttendance
              key={patientAttendance.id}
              attendance={patientAttendance}
              backTo="/employee/patient-attendance"
            />
          ))}
        </TabsContent>
        <TabsContent value="past" className="flex flex-col gap-4">
          {pastPatientAttendaces.map((patientAttendance) => (
            <CardPatientAttendance
              key={patientAttendance.id}
              attendance={patientAttendance}
              backTo="/employee/patient-attendance"
            />
          ))}
        </TabsContent>
        <TabsContent value="undefined" className="flex flex-col gap-4">
          {undefinedPatientAttendaces.map((patientAttendance) => (
            <CardPatientAttendance
              key={patientAttendance.id}
              attendance={patientAttendance}
              backTo="/employee/patient-attendance"
            />
          ))}
        </TabsContent>
      </Tabs>
    </section>
  );
};
