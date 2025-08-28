import { Role, User } from "@prisma/client";

import logger from "@/config/logger";
import prisma from "@/lib/prisma";
import { Result } from "@/types";

export const addRoleToUser = async (
  userId: string,
  role: Role,
): Promise<Result<User>> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true },
    });
    if (!user)
      return {
        success: false,
        error: { errors: ["Usuário não encontrado!"] },
        code: 404,
      };

    if (user.role.includes(role))
      return { success: true, data: user as User, code: 200 };

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role: { push: role } },
    });

    return { success: true, data: updatedUser, code: 200 };
  } catch (error) {
    logger.error("Erro ao adicionar role ao usuário:", error);
    return {
      success: false,
      error: { errors: ["Erro ao adicionar role ao usuário!"] },
      code: 500,
    };
  }
};

export const deleteRoleToUser = async (
  userId: string,
  role: Role,
): Promise<Result<User>> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true },
    });
    if (!user)
      return {
        success: false,
        error: { errors: ["Usuário não encontrado!"] },
        code: 404,
      };

    if (!user.role.includes(role))
      return { success: true, data: user as User, code: 200 };

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role: { set: user.role.filter((r) => r !== role) } },
    });

    return { success: true, data: updatedUser, code: 200 };
  } catch (error) {
    logger.error("Erro ao remover role do usuário:", error);
    return {
      success: false,
      error: { errors: ["Erro ao remover role do usuário!"] },
      code: 500,
    };
  }
};
