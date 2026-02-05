import { randomInt } from "crypto";
import { User, Prisma, UserToken } from "@prisma/client";
import z from "zod/v4";

import logger from "@/config/logger";
import prisma from "@/lib/prisma";
import {
  UserBaseInfo,
  UserBaseInfoSchema,
  UserTokenInput,
  UserTokenInputSchema,
} from "@/schemas";
import { Result } from "@/types";
import { getUserIdAuthenticated } from "@/utils/auth";

export const getUsers = async (
  filter?: Prisma.UserFindManyArgs,
): Promise<Result<User[]>> => {
  try {
    const usersData = await prisma.user.findMany(filter);
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
  filter?: Prisma.UserDefaultArgs,
): Promise<Result<User>> => {
  try {
    const userData = await prisma.user.findUnique({
      where: { id: userId },
      ...filter,
    });

    if (!userData)
      return {
        success: false,
        error: { errors: ["Usuário não encontrado!"] },
        code: 404,
      };

    return { success: true, data: userData };
  } catch (error) {
    logger.error("Erro ao buscar usuário:", error);
    return {
      success: false,
      error: { errors: ["Erro ao buscar usuário!"] },
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

    const userId = await getUserIdAuthenticated();

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

export const createToken = async (
  userToken: UserTokenInput,
): Promise<Result<UserToken>> => {
  try {
    const validatedUserToken =
      await UserTokenInputSchema.safeParseAsync(userToken);
    if (!validatedUserToken.success)
      return {
        success: false,
        error: z.treeifyError(validatedUserToken.error),
        code: 400,
      };

    const user = await prisma.user.findUnique({
      select: { id: true },
      where: { id: validatedUserToken.data.userId },
    });

    if (!user)
      return {
        success: false,
        error: { errors: ["Usuário não encontrado para criar token!"] },
        code: 404,
      };

    const token = randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutos
    const userTokenCreated = await prisma.userToken.create({
      data: { ...validatedUserToken.data, expiresAt, token },
    });
    return { success: true, data: userTokenCreated };
  } catch (error) {
    logger.error("Erro ao criar token:", error);
    return {
      success: false,
      error: { errors: ["Erro ao criar token!"] },
      code: 500,
    };
  }
};

export const deleteToken = async (id: string): Promise<Result<null>> => {
  try {
    await prisma.userToken.delete({
      where: { id },
    });
    return { success: true, data: null };
  } catch (error) {
    logger.error("Erro ao deletar token:", error);
    return {
      success: false,
      error: { errors: ["Erro ao deletar token!"] },
      code: 500,
    };
  }
};
