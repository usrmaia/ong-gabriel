"use server";

import { redirect } from "next/navigation";
import { FormAnamnesis } from "@prisma/client";

import { createPatientFormAnamnesis } from "@/services/patient.service";
import { Result } from "@/types";

export async function onSubmit(
  prev: Result<FormAnamnesis>,
  formData: FormData,
): Promise<Result<FormAnamnesis>> {
  const formDataObject = Object.fromEntries(
    formData.entries(),
  ) as unknown as FormAnamnesis;
  const result = await createPatientFormAnamnesis(formDataObject);

  if (!result.success) return { ...result, data: formDataObject };

  redirect("/patient/form-anamnesis/success");
}
