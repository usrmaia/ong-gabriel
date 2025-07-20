"use server";

import logger from "@/config/logger";
import { UserBaseInfo } from "@/schemas";
import { updateUserBaseInfo } from "@/services";
import { Result } from "@/types";

export async function onSubmit(
  initialState: Result<UserBaseInfo>,
  formData: FormData,
): Promise<Result<UserBaseInfo>> {
  try {
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
    return {
      success: true,
      data: updatedUserResult.data as unknown as UserBaseInfo,
    };
  } catch (error: any) {
    logger.error("Erro ao atualizar usuário:", error);
    return {
      success: false,
      error: { errors: ["Erro ao atualizar usuário!"] },
    };
  }
}
