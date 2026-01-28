"use server";

import { revalidatePath } from "next/cache";

import { Result } from "@/types";
import { deleteAvailabilityAttendance } from "@/services";

export async function onDelete(
  prev: Result,
  availabilityAttendanceId: string,
): Promise<Result<string>> {
  const availabilityAttendanceDeletionResult =
    await deleteAvailabilityAttendance(availabilityAttendanceId);

  revalidatePath("/employee/availability-attendance/list");

  return {
    ...availabilityAttendanceDeletionResult,
    data: availabilityAttendanceId,
  };
}
