"use server";

import { eachDayOfInterval, parseISO } from "date-fns";

import { CreateAvailabilityAttendanceList } from "@/schemas";
import { createAvailabilityAttendance } from "@/services";
import { Result } from "@/types";
import { getUserIdAuthenticated } from "@/utils/auth";

export type WorkingHours = {
  startTime: string;
  endTime: string;
};

export async function onSubmit(
  prev: Result<CreateAvailabilityAttendanceList>,
  formData: FormData,
): Promise<Result<CreateAvailabilityAttendanceList>> {
  const formDataObject = Object.fromEntries(formData.entries()) as unknown as {
    startDate: string;
    endDate?: string;
    workingHoursList: WorkingHours[];
  };

  const startDate = parseISO(formDataObject.startDate);
  const endDate = formDataObject.endDate
    ? parseISO(formDataObject.endDate)
    : startDate;
  const dateRange = eachDayOfInterval({ start: startDate, end: endDate });
  const workingHoursList = JSON.parse(
    formData.get("workingHoursList") as string,
  ) as WorkingHours[];
  const userId = await getUserIdAuthenticated();
  const availabilityAttendanceList = dateRange.flatMap((date) =>
    workingHoursList.map((hours) => ({
      professionalId: userId,
      startAt: new Date(
        date.setHours(
          parseInt(hours.startTime.split(":")[0]),
          parseInt(hours.startTime.split(":")[1]),
        ),
      ),
      endAt: new Date(
        date.setHours(
          parseInt(hours.endTime.split(":")[0]),
          parseInt(hours.endTime.split(":")[1]),
        ),
      ),
    })),
  ) as CreateAvailabilityAttendanceList;

  const createdAvailabilityAttendance = await createAvailabilityAttendance(
    availabilityAttendanceList,
  );

  return {
    ...createdAvailabilityAttendance,
    data: availabilityAttendanceList,
  };
}
