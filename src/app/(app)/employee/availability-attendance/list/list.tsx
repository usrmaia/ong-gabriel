"use client";

import { AvailabilityAttendance } from "@prisma/client";
import { startTransition, useActionState } from "react";

import { onDelete } from "./actions";
import { CardAvailabilityAttendance } from "@/components/ui";

export default function AvailabilityAttendanceList({
  availabilitiesAttendances,
}: {
  availabilitiesAttendances: AvailabilityAttendance[];
}) {
  const [state, formAction] = useActionState(onDelete, { success: false });

  return (
    <div className="flex flex-col gap-4 my-4">
      {availabilitiesAttendances.map((availabilityAttendance) => (
        <CardAvailabilityAttendance
          key={availabilityAttendance.id}
          state={availabilityAttendance.id === state?.data ? state : undefined}
          availabilityAttendance={availabilityAttendance}
          onDelete={() =>
            startTransition(() => formAction(availabilityAttendance.id))
          }
        />
      ))}
    </div>
  );
}
