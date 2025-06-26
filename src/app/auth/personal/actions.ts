"use server";

import { UserBaseInfo, UserBaseInfoSchema } from "@/schemas";
import { Result } from "@/types";
import z from "zod/v4";

export async function onSubmit(
  prev: Result<UserBaseInfo>,
  formData: FormData,
): Promise<Result<UserBaseInfo>> {
  const data = Object.fromEntries(formData.entries());
  const result = await UserBaseInfoSchema.safeParseAsync(data);

  if (!result.success)
    return { success: false, error: z.treeifyError(result.error) };

  return { success: true, data: result.data };
}
