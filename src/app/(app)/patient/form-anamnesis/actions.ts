"use server";

import { redirect } from "next/navigation";
import { FormAnamnesis } from "@prisma/client";

import {
  createPatientFormAnamnesis,
  getAvailabilityAttendances,
} from "@/services";
import { Result } from "@/types";

export async function onSubmit(
  redirectTo: string | null,
  prev: Result<FormAnamnesis>,
  formData: FormData,
): Promise<Result<FormAnamnesis>> {
  const formDataObject = Object.fromEntries(
    formData.entries(),
  ) as unknown as FormAnamnesis;
  const result = await createPatientFormAnamnesis(formDataObject);

  if (!result.success) return { ...result, data: formDataObject };

  const patientAttendanceId = result.data!.PatientAttendance.id;

  const availabilityAttendancesResult = await getAvailabilityAttendances({
    where: {
      startAt: { gte: new Date() },
      isBooked: false,
    },
  });

  const hasAvailableAttendances =
    availabilityAttendancesResult.data &&
    availabilityAttendancesResult.data.length > 0;

  if (hasAvailableAttendances)
    redirect(
      redirectTo
        ? `${redirectTo}?redirectTo=/patient/availability-attendance/${patientAttendanceId}`
        : `/patient/availability-attendance/${patientAttendanceId}`,
    );

  redirect(
    redirectTo
      ? `${redirectTo}?redirectTo=/patient/form-anamnesis/success`
      : "/patient/form-anamnesis/success",
  );
}
