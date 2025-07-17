import z from "zod/v4";

import { auth } from "@/auth";
import { User, Prisma } from "@/generated/prisma";
import logger from "@/config/logger";
import prisma from "@/lib/prisma";
import { UserBaseInfo, UserBaseInfoSchema } from "@/schemas";
import { Result } from "@/types";

export const getUsers = async (filter?: {
  include?: Prisma.UserInclude;
  where?: Prisma.UserWhereInput;
  orderBy?: Prisma.UserOrderByWithRelationInput;
}): Promise<Result<User[]>> => {
  try {
    const usersData = await prisma.user.findMany({
      include: { ...filter?.include },
      where: filter?.where,
      orderBy: { createdAt: "asc", ...filter?.orderBy },
    });
    return { success: true, data: usersData };
  } catch (error) {
    logger.error("Erro ao buscar usuários:", error);
    return {
      success: false,
      error: { errors: ["Erro ao buscar usuários!"] },
      code: 500,
    };
  }
};

export const getUserById = async (
  userId: string,
  filter?: {
    include?: Prisma.UserInclude;
  },
): Promise<Result<User>> => {
  try {
    const userData = await prisma.user.findUnique({
      where: { id: userId },
      include: { ...filter?.include },
    });

    if (!userData)
      return {
        success: false,
        error: { errors: ["Usuário não encontrado!"] },
        code: 404,
      };

    return { success: true, data: userData };
  } catch (error) {
    logger.error("Erro ao buscar usuário autenticado:", error);
    return {
      success: false,
      error: { errors: ["Erro ao buscar usuário autenticado!"] },
      code: 500,
    };
  }
};

export const updateUserBaseInfo = async (
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

    const userId = (await auth())?.user.id!;

    const updatedUser = await prisma.user.update({
      data: validatedUserBaseInfo.data,
      where: { id: userId },
    });

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
