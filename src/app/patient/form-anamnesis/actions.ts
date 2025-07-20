"use server";

import { createPatientFormAnamnesis } from "@/services/patient.service";
import { Result } from "@/types";
import { FormAnamnesis } from "@/generated/prisma";
import { redirect } from "next/navigation";

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

  redirect(
    redirectTo
      ? `${redirectTo}?redirectTo=/patient/form-anamnesis/success`
      : "/patient/form-anamnesis/success",
  );
}
