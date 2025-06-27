"use server";

import { auth } from "@/auth";
import logger from "@/config/logger";
import { UserBaseInfo } from "@/schemas";
import { updateUserBaseInfo } from "@/services";
import { Result } from "@/types";

export async function onSubmit(
  prev: Result<UserBaseInfo>,
  formData: FormData,
): Promise<Result<UserBaseInfo>> {
  try {
    const userId = (await auth())?.user.id!;
    const formDataObject = Object.fromEntries(
      formData.entries(),
    ) as unknown as UserBaseInfo;

    const { success, data, error } = await updateUserBaseInfo(
      userId,
      formDataObject,
    );

    if (!success) return { success, data: formDataObject, error };
    return { success, data: data as UserBaseInfo };
  } catch (error: any) {
    logger.error("Erro ao atualizar usuário:", error);
    return {
      success: false,
      error: { errors: ["Erro ao atualizar usuário!"] },
    };
  }
}
