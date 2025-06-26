"use server";

import { UserBaseInfo, UserBaseInfoSchema } from "@/schemas";
import { Result } from "@/types";
import z from "zod/v4";

export async function onSubmit(
  prev: Result<UserBaseInfo>,
  formData: FormData,
): Promise<Result<UserBaseInfo>> {
  const formDataObject = Object.fromEntries(formData.entries());
  const validatedFormData =
    await UserBaseInfoSchema.safeParseAsync(formDataObject);

  if (!validatedFormData.success)
    return {
      success: false,
      data: formDataObject as UserBaseInfo,
      error: z.treeifyError(validatedFormData.error),
    };

  return { success: true, data: validatedFormData.data };
}
