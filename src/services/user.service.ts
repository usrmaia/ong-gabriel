import z from "zod/v4";

import { User } from "@/generated/prisma";
import logger from "@/config/logger";
import { UserRepository } from "@/repositories";
import { UserBaseInfo, UserBaseInfoSchema } from "@/schemas";
import { Result } from "@/types";

export const updateUserBaseInfo = async (
  userId: string,
  userBaseInfo: UserBaseInfo,
): Promise<Result<User>> => {
  try {
    const validatedUserBaseInfo =
      await UserBaseInfoSchema.safeParseAsync(userBaseInfo);
    if (!validatedUserBaseInfo.success)
      return {
        success: false,
        error: z.treeifyError(validatedUserBaseInfo.error),
        code: 400,
      };

    const updatedUser = await UserRepository.updateUserById(
      { id: userId },
      validatedUserBaseInfo.data,
    );

    return { success: true, data: updatedUser };
  } catch (error) {
    logger.error("Erro ao atualizar informações do usuário:", error);
    return {
      success: false,
      error: { errors: ["Erro ao atualizar informações do usuário!"] },
      code: 500,
    };
  }
};
