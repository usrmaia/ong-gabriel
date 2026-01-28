import { AvailabilityAttendance, Prisma } from "@prisma/client";
import z from "zod/v4";

import logger from "@/config/logger";
import prisma from "@/lib/prisma";
import { can } from "@/permissions";
import {
  CreateAvailabilityAttendanceList,
  CreateAvailabilityAttendanceListSchema,
} from "@/schemas";
import { Result } from "@/types";
import { getUserAuthenticated } from "@/utils/auth";

export const getAvailabilityAttendances = async (
  filter?: Prisma.AvailabilityAttendanceFindManyArgs,
): Promise<Result<AvailabilityAttendance[]>> => {
  try {
    const availabilities = await prisma.availabilityAttendance.findMany(filter);
    return { success: true, data: availabilities };
  } catch (error) {
    logger.error("Erro ao buscar horários de atendimento:", error);
    return {
      success: false,
      error: { errors: ["Erro ao buscar horários de atendimento!"] },
      code: 500,
    };
  }
};

/**
 * Cria múltiplos horários de atendimento
 * Apenas usuários com roles EMPLOYEE e ADMIN podem criar
 * Verifica duplicação de horários por profissional via constraint única do banco
 */
export const createAvailabilityAttendance = async (
  availabilities: CreateAvailabilityAttendanceList,
): Promise<Result<AvailabilityAttendance[]>> => {
  try {
    const user = await getUserAuthenticated();
    if (!can(user, "create", "availabilityAttendance"))
      return {
        success: false,
        error: {
          errors: ["Usuário não autorizado a criar horários de atendimento!"],
        },
        code: 403,
      };

    const validatedAvailabilities =
      await CreateAvailabilityAttendanceListSchema.safeParseAsync(
        availabilities,
      );

    if (!validatedAvailabilities.success)
      return {
        success: false,
        error: z.treeifyError(validatedAvailabilities.error),
        code: 400,
      };

    const otherAvailabilities = await prisma.availabilityAttendance.findMany({
      where: { professionalId: user.id },
    });

    if (otherAvailabilities.length > 0) {
      const overlapping = validatedAvailabilities.data.filter(
        (newAvailability) =>
          otherAvailabilities.some(
            (existingAvailability) =>
              (newAvailability.startAt < existingAvailability.endAt &&
                newAvailability.endAt > existingAvailability.startAt) ||
              (newAvailability.startAt > existingAvailability.startAt &&
                newAvailability.startAt < existingAvailability.endAt) ||
              (newAvailability.endAt > existingAvailability.startAt &&
                newAvailability.endAt < existingAvailability.endAt),
          ),
      );

      if (overlapping.length > 0) {
        logger.warn(
          "Alguns horários de atendimento se sobrepõem a horários já existentes.",
        );
        return {
          success: false,
          error: {
            errors: [
              "Alguns horários de atendimento se sobrepõem a horários já existentes.",
            ],
          },
          code: 409,
        };
      }
    }

    // Usar transação para garantir atomicidade
    const createdAvailabilities = await prisma.$transaction(
      async (transaction) => {
        try {
          const createAvailabilitiesBatch =
            await transaction.availabilityAttendance.createManyAndReturn({
              data: validatedAvailabilities.data.map((availability) => ({
                ...availability,
                professionalId: user.id,
              })),
            });

          return createAvailabilitiesBatch;
        } catch (error: any) {
          if (error.code === "P2002") {
            logger.warn(
              "Já existe uma disponibilidade no horário informado.",
              error,
            );
            throw new Error(
              "Já existe uma disponibilidade no horário informado!",
            );
          }
          throw error;
        }
      },
    );

    return { success: true, data: createdAvailabilities, code: 201 };
  } catch (error: any) {
    logger.error("Erro ao criar disponibilidades de atendimento:", error);

    // Retornar mensagem específica para erros de constraint
    if (
      error.message &&
      error.message.includes("Já existe uma disponibilidade")
    )
      return {
        success: false,
        error: { errors: [error.message] },
        code: 409,
      };

    return {
      success: false,
      error: { errors: ["Erro ao criar disponibilidades de atendimento!"] },
      code: 500,
    };
  }
};

/**
 * Remove um horário de atendimento por ID
 * Apenas usuários com roles EMPLOYEE e ADMIN podem remover
 * Não permite remover horários que já estão reservados
 */
export const deleteAvailabilityAttendance = async (
  availabilityId: string,
): Promise<Result<AvailabilityAttendance>> => {
  try {
    const existingAvailability = await prisma.availabilityAttendance.findUnique(
      {
        where: { id: availabilityId },
        include: {
          attendance: true,
        },
      },
    );

    if (!existingAvailability)
      return {
        success: false,
        error: { errors: ["Disponibilidade não encontrada!"] },
        code: 404,
      };

    const user = await getUserAuthenticated();
    if (!can(user, "delete", "availabilityAttendance", existingAvailability))
      return {
        success: false,
        error: {
          errors: ["Usuário não autorizado a remover horário de atendimento!"],
        },
        code: 403,
      };

    if (existingAvailability.isBooked || existingAvailability.attendance)
      return {
        success: false,
        error: {
          errors: ["Não é possível remover um horário que já foi reservado!"],
        },
        code: 400,
      };

    const deletedAvailability = await prisma.availabilityAttendance.delete({
      where: { id: availabilityId },
    });

    return { success: true, data: deletedAvailability, code: 200 };
  } catch (error) {
    logger.error("Erro ao remover horário de atendimento:", error);
    return {
      success: false,
      error: { errors: ["Erro ao remover horário de atendimento!"] },
      code: 500,
    };
  }
};
