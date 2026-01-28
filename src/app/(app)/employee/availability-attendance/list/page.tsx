import Link from "next/link";
import { AvailabilityAttendance } from "@prisma/client";

import { BackNavigationHeader, Button } from "@/components/ui";
import AvailabilityAttendanceList from "./list";
import { getAvailabilityAttendances } from "@/services";
import { getUserIdAuthenticated } from "@/utils/auth";

export default async function AvailabilityAttendancePage() {
  const userId = await getUserIdAuthenticated();
  const availabilitiesAttendancesResult = await getAvailabilityAttendances({
    where: {
      professionalId: userId,
      attendance: null,
      startAt: { gte: new Date() },
    },
    orderBy: { startAt: "asc" },
  });
  const availabilitiesAttendances =
    availabilitiesAttendancesResult.data as AvailabilityAttendance[];

  return (
    <>
      <BackNavigationHeader
        title="Lista de horários disponíveis"
        href="/employee/availability-attendance/"
      />
      <div className="flex flex-col justify-center w-full">
        <p className="font-young">
          Confira aqui seus horários livres.
          <br className="mb-2" />
          Você também pode{" "}
          <strong>disponibilizar novos horários de atendimento</strong> em sua
          agenda.
        </p>

        <AvailabilityAttendanceList
          availabilitiesAttendances={availabilitiesAttendances}
        />

        <Link
          href="/employee/availability-attendance/add"
          className="mt-6 w-full"
        >
          <Button className="w-full">Adicionar horários</Button>
        </Link>
      </div>
    </>
  );
}
