"use server";

import { redirect } from "next/navigation";

import { UserBaseInfo } from "@/schemas";
import { updateUserBaseInfo } from "@/services";
import { Result } from "@/types";

export async function onSubmit(
  redirectTo: string | null,
  initialState: Result<UserBaseInfo>,
  formData: FormData,
): Promise<Result<UserBaseInfo>> {
  const formDataObject = Object.fromEntries(
    formData.entries(),
  ) as unknown as UserBaseInfo;

  const updatedUserResult = await updateUserBaseInfo(formDataObject);

  if (!updatedUserResult.success)
    return {
      success: false,
      data: formDataObject,
      error: updatedUserResult.error,
    };

  if (redirectTo) redirect(redirectTo);

  return {
    success: true,
    data: updatedUserResult.data as unknown as UserBaseInfo,
  };
}
