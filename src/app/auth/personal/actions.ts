"use server";

import { env } from "@/config/env";
import { UserBaseInfo, UserBaseInfoSchema } from "@/schemas";
import { Result } from "@/types";
import { cookies } from "next/headers";
import z from "zod/v4";

export async function onSubmit(
  prev: Result<UserBaseInfo>,
  formData: FormData,
): Promise<Result<UserBaseInfo>> {
  const formDataObject = Object.fromEntries(
    formData.entries(),
  ) as unknown as UserBaseInfo;
  const validatedFormData =
    await UserBaseInfoSchema.safeParseAsync(formDataObject);

  if (!validatedFormData.success)
    return {
      success: false,
      data: formDataObject,
      error: z.treeifyError(validatedFormData.error),
    };

  try {
    const res = await fetch(`${env.NEXT_PUBLIC_APP_URL}/api/user`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookies().toString(),
      },
      credentials: "include",
      body: JSON.stringify(validatedFormData.data),
    });
    if (!res.ok) {
      const error = await res.json();
      return { success: false, data: formDataObject, error };
    }
    const data = await res.json();
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      data: formDataObject,
      error: {
        errors: [error instanceof Error ? error.message : String(error)],
      },
    };
  }
}
