import { AvailabilityAttendance, User } from "@prisma/client";

import PatientAvailabilityAttendanceForm from "./form";
import { getAvailabilityAttendances, getPatientAttendances } from "@/services";
import { getUserIdAuthenticated } from "@/utils/auth";

export default async function PatientAvailabilityAttendancePage({
  params,
}: {
  params: Promise<{ patientAttendanceId: string }>;
}) {
  const { patientAttendanceId } = await params;
  const userId = await getUserIdAuthenticated();

  // Valida se o patientAttendanceId pertence ao userId
  const patientAttendanceResult = await getPatientAttendances({
    select: { id: true, dateAt: true },
    where: {
      id: patientAttendanceId,
      patientId: userId,
    },
  });

  if (!patientAttendanceResult.success)
    return (
      <p className="text-center text-error">
        {patientAttendanceResult.error?.errors}
      </p>
    );

  if (patientAttendanceResult.data![0].dateAt != null)
    return (
      <p className="text-center text-error">
        Agendamento já realizado. Não é possível alterar o horário.
      </p>
    );

  const availabilityAttendancesResult = await getAvailabilityAttendances({
    select: {
      id: true,
      startAt: true,
      endAt: true,
      professionalId: true,
      professional: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
    where: {
      startAt: { gte: new Date() },
      isBooked: false,
      professional: { role: { hasSome: ["EMPLOYEE"] } },
    },
    orderBy: { startAt: "asc" },
  });

  const availabilityAttendances = (availabilityAttendancesResult.data ||
    []) as (AvailabilityAttendance & {
    professional: User;
  })[];
  availabilityAttendances.sort((a, b) =>
    (a.professional.name || "").localeCompare(b.professional.name || ""),
  );

  return (
    <>
      <h2 className="text-center">Vamos reservar um horário na agenda?</h2>
      <p className="font-young-serif text-xl text-center">
        Para um agendamento mais ágil e acessível, nossa equipe de assistentes
        sociais precisa falar com você!
      </p>
      <PatientAvailabilityAttendanceForm
        availabilityAttendances={availabilityAttendances}
        patientAttendanceId={patientAttendanceId}
      />
    </>
  );
}
