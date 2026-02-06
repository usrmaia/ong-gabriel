"use server";

import { UserInput } from "@/schemas";
import { initiateRegister } from "@/services/auth.service";
import { Result } from "@/types";
import { redirect } from "next/navigation";

export async function onSubmit(
  redirectTo: string | null,
  prev: unknown,
  formData: FormData,
): Promise<Result<UserInput>> {
  const formDataObject = Object.fromEntries(
    formData.entries(),
  ) as unknown as UserInput;

  const result = await initiateRegister(formDataObject);

  if (!result.success)
    return {
      success: false,
      error: result.error,
      data: formDataObject,
    };

  redirect(
    redirectTo
      ? `/auth/register/confirmation/${result.data!.id}?redirectTo=${redirectTo}`
      : `/auth/register/confirmation/${result.data!.id}`,
  );
}
