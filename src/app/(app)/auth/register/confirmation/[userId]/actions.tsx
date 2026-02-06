"use server";

import { redirect } from "next/navigation";

import {
  confirmRegistration,
  resendConfirmationToken,
} from "@/services/auth.service";
import { Result } from "@/types";

type ConfirmationData = {
  userId: string;
  token: string;
};

export async function onSubmit(
  redirectTo: string | null,
  prev: unknown,
  formData: FormData,
): Promise<Result<ConfirmationData>> {
  const formDataObject = Object.fromEntries(
    formData.entries(),
  ) as unknown as ConfirmationData;

  const result = await confirmRegistration(
    formDataObject.userId,
    formDataObject.token,
  );
  if (!result.success)
    return {
      success: false,
      error: result.error,
      data: formDataObject,
    };

  redirect(redirectTo ? `/auth/login?redirectTo=${redirectTo}` : "/auth/login");
}

export async function onResendToken(userId: string): Promise<Result<null>> {
  const result = await resendConfirmationToken(userId);
  if (!result.success)
    return {
      success: false,
      error: result.error,
    };

  return { success: true, data: null };
}
