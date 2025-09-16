"use server";

import { Psych } from "@prisma/client";
import { evaluateCandidatePsych } from "@/services/psych.service";
import { EvaluatePsychInput } from "@/schemas";
import { Result } from "@/types";

export async function onSubmit(
  prev: Result<Psych>,
  formData: FormData,
): Promise<Result<Psych>> {
  const formDataObject = Object.fromEntries(
    formData.entries(),
  ) as unknown as EvaluatePsychInput;
  const psychId = formData.get("id") as string;

  const result = await evaluateCandidatePsych(psychId, {
    ...formDataObject,
    interviewed: Boolean(formDataObject.interviewed),
  });

  return result;
}
