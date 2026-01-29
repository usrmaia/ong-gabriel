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

  const availabilityAttendancesResult = await getAvailabilityAttendances({
    where: {
      startAt: { gte: new Date() },
      isBooked: false,
    },
  });

  if (
    availabilityAttendancesResult.data &&
    availabilityAttendancesResult.data.length > 0
  )
    redirect(
      redirectTo
        ? `/patient/availability-attendance?formAnamnesisId=${result.data!.id}&redirectTo=${redirectTo}`
        : `/patient/availability-attendance?formAnamnesisId=${result.data!.id}`,
    );

  redirect(
    redirectTo
      ? `${redirectTo}?redirectTo=/patient/form-anamnesis/success`
      : "/patient/form-anamnesis/success",
  );
}
