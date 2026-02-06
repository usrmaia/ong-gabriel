"use server";

import { redirect } from "next/navigation";

import { Email } from "@/schemas";
import {
  confirmResetPassword,
  initiatePasswordReset,
} from "@/services/auth.service";
import { Result } from "@/types";

type PasswordReset = {
  email: Email;
};

export const onSubmit = async (
  prev: unknown,
  formData: FormData,
): Promise<Result<PasswordReset>> => {
  const formDataObject = Object.fromEntries(
    formData.entries(),
  ) as unknown as PasswordReset;

  const result = await initiatePasswordReset(formDataObject.email);

  return { ...result, data: formDataObject };
};

type ConfirmationData = {
  email: Email;
  token: string;
  password: string;
};

export const onConfirm = async (
  redirectTo: string | null,
  prev: unknown,
  formData: FormData,
): Promise<Result<ConfirmationData>> => {
  const formDataObject = Object.fromEntries(
    formData.entries(),
  ) as unknown as ConfirmationData;

  const result = await confirmResetPassword(
    formDataObject.email,
    formDataObject.token,
    formDataObject.password,
  );
  if (!result.success)
    return {
      ...result,
      data: formDataObject,
    };

  redirect(redirectTo ? `/auth/login?redirectTo=${redirectTo}` : "/auth/login");
};
