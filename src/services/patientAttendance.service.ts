import { PatientAttendance, Prisma } from "@prisma/client";
import z from "zod/v4";

import { getAvailabilityAttendances, getUserById } from ".";
import logger from "@/config/logger";
import prisma from "@/lib/prisma";
import { can } from "@/permissions";
import {
  CreatePatientAttendanceSchema,
  UpdatePatientAttendanceSchema,
} from "@/schemas";
import { Result } from "@/types";
import { getUserAuthenticated } from "@/utils/auth";

export const getPatientAttendances = async (
  filter?: Prisma.PatientAttendanceFindManyArgs,
): Promise<Result<PatientAttendance[]>> => {
  try {
    const user = await getUserAuthenticated();
    if (!can(user, "list", "patientAttendance"))
      return {
        success: false,
        error: { errors: ["Usuário não autorizado a listar atendimentos!"] },
        code: 403,
      };

    const patientAttendances = await prisma.patientAttendance.findMany(filter);
    return { success: true, data: patientAttendances };
  } catch (error) {
    logger.error("Erro ao buscar lista de atendimentos:", error);
    return {
      success: false,
      error: { errors: ["Erro ao buscar lista de atendimentos!"] },
      code: 500,
    };
  }
};

export const getPatientAttendanceById = async (
  patientAttendanceId: string,
  filter?: Prisma.PatientAttendanceDefaultArgs,
): Promise<Result<PatientAttendance>> => {
  try {
    const user = await getUserAuthenticated();
    if (!can(user, "view", "patientAttendance"))
      return {
        success: false,
        error: {
          errors: ["Usuário não autorizado a visualizar atendimentos!"],
        },
        code: 403,
      };

    const patientAttendance = await prisma.patientAttendance.findUnique({
      where: { id: patientAttendanceId },
      ...filter,
    });
    if (!patientAttendance)
      return {
        success: false,
        error: { errors: ["Atendimento não encontrado!"] },
        code: 404,
      };

    return { success: true, data: patientAttendance };
  } catch (error) {
    logger.error("Erro ao buscar atendimento do paciente:", error);
    return {
      success: false,
      error: { errors: ["Erro ao buscar atendimento do paciente!"] },
      code: 500,
    };
  }
};

/**
 * Cria um novo registro de atendimento de paciente a partir de um funcionário.
 *
 * Esta função realiza os seguintes passos:
 * - Autentica o usuário e verifica se ele tem permissão para criar um atendimento de paciente.
 * - Valida os dados de entrada usando o `CreatePatientAttendanceSchema`.
 * - Verifica se o paciente existe e possui o papel "PATIENT".
 * - Garante que o ID do profissional foi informado e que o profissional possui o papel "EMPLOYEE".
 * - Cria o registro de atendimento do paciente no banco de dados.
 *
 * @param patientAttendance - Os dados necessários para criar um atendimento de paciente, conforme o schema do Prisma.
 * @returns Uma promise que resolve para um objeto `Result<PatientAttendance>`, indicando sucesso ou falha com mensagens de erro apropriadas e códigos de status HTTP.
 */
export const createPatientAttendanceFromEmployee = async (
  patientAttendance: Prisma.PatientAttendanceUncheckedCreateInput,
): Promise<Result<PatientAttendance>> => {
  try {
    const user = await getUserAuthenticated();
    if (!can(user, "create", "patientAttendance"))
      return {
        success: false,
        error: { errors: ["Usuário não autorizado a criar atendimentos!"] },
        code: 403,
      };

    const validatedPatientAttendance =
      await CreatePatientAttendanceSchema.safeParseAsync(patientAttendance);
    if (!validatedPatientAttendance.success)
      return {
        success: false,
        error: z.treeifyError(validatedPatientAttendance.error),
        code: 400,
      };

    const patientUser = await getUserById(patientAttendance.patientId);
    if (!patientUser.data?.role.includes("PATIENT"))
      return {
        success: false,
        error: { errors: ["Usuário paciente não encontrado ou inválido."] },
        code: 404,
      };

    const professionalUser = await getUserById(
      validatedPatientAttendance.data.professionalId,
    );
    if (!professionalUser.data?.role.includes("EMPLOYEE"))
      return {
        success: false,
        error: {
          errors: ["Usuário profissional não encontrado ou inválido."],
        },
        code: 404,
      };

    const createdPatientAttendance = await prisma.patientAttendance.create({
      data: { ...patientAttendance, ...validatedPatientAttendance.data },
    });
    return { success: true, data: createdPatientAttendance };
  } catch (error) {
    logger.error("Erro ao criar atendimento do paciente:", error);
    return {
      success: false,
      error: { errors: ["Erro ao criar atendimento do paciente!"] },
      code: 500,
    };
  }
};

/**
 * Sinaliza um novo registro de atendimento para o paciente autenticado.
 *
 * Esta função verifica se o usuário autenticado tem permissão para sinalizar um atendimento.
 * Se autorizado, sinaliza a necessidade de um novo registro de atendimento no banco de dados usando o ID do usuário como patientId.
 * Retorna um resultado de sucesso com o atendimento sinalizado ou um erro caso não autorizado ou ocorra algum problema.
 *
 * @returns {Promise<Result<PatientAttendance>>} Uma promise que resolve para um objeto de resultado contendo o atendimento criado ou um erro.
 */
export const createPatientAttendanceFromPatient = async (): Promise<
  Result<PatientAttendance>
> => {
  try {
    const user = await getUserAuthenticated();
    if (!can(user, "simpleCreate", "patientAttendance"))
      return {
        success: false,
        error: { errors: ["Usuário não autorizado a criar atendimentos!"] },
        code: 403,
      };

    const createdPatientAttendance = await prisma.patientAttendance.create({
      data: { patientId: user.id },
    });
    return { success: true, data: createdPatientAttendance };
  } catch (error) {
    logger.error("Erro ao criar atendimento do paciente:", error);
    return {
      success: false,
      error: { errors: ["Erro ao criar atendimento do paciente!"] },
      code: 500,
    };
  }
};

export const updatePatientAttendance = async (
  patientAttendanceId: string,
  patientAttendance: Prisma.PatientAttendanceUncheckedUpdateWithoutPatientInput,
): Promise<Result<PatientAttendance>> => {
  try {
    const user = await getUserAuthenticated();
    if (!can(user, "update", "patientAttendance"))
      return {
        success: false,
        error: { errors: ["Usuário não autorizado a atualizar atendimentos!"] },
        code: 403,
      };

    // Se professionalId não for fornecido, use o ID do usuário autenticado
    const professionalId =
      patientAttendance.professionalId?.toString() || user.id;
    patientAttendance.professionalId = professionalId;

    const validatedPatientAttendance =
      await UpdatePatientAttendanceSchema.safeParseAsync(patientAttendance);
    if (!validatedPatientAttendance.success)
      return {
        success: false,
        error: z.treeifyError(validatedPatientAttendance.error),
        code: 400,
      };

    const existingAttendance = await prisma.patientAttendance.findUnique({
      where: { id: patientAttendanceId },
      select: { availabilityId: true, professionalId: true },
    });
    if (!existingAttendance)
      return {
        success: false,
        error: { errors: ["Atendimento do paciente não encontrado!"] },
        code: 404,
      };

    const updatedPatientAttendance = await prisma.patientAttendance.update({
      data: { ...patientAttendance, ...validatedPatientAttendance.data },
      where: { id: patientAttendanceId },
    });
    return { success: true, data: updatedPatientAttendance };
  } catch (error) {
    logger.error("Erro ao atualizar atendimento do paciente:", error);
    return {
      success: false,
      error: { errors: ["Erro ao atualizar atendimento do paciente!"] },
      code: 500,
    };
  }
};

export const updatePatientAttendanceFromAvailability = async (
  patientAttendanceId: string,
  { availabilityId }: { availabilityId: string },
): Promise<Result<PatientAttendance>> => {
  try {
    const user = await getUserAuthenticated();

    const existingAttendance = await prisma.patientAttendance.findUnique({
      select: { availabilityId: true, patientId: true },
      where: { id: patientAttendanceId },
    });
    if (!existingAttendance)
      return {
        success: false,
        error: { errors: ["Atendimento do paciente não encontrado!"] },
        code: 404,
      };

    if (!can(user, "simpleUpdate", "patientAttendance", existingAttendance))
      return {
        success: false,
        error: { errors: ["Usuário não autorizado a atualizar atendimentos!"] },
        code: 403,
      };

    let patientAttendanceDateAt: Date | undefined = undefined;

    if (availabilityId !== existingAttendance.availabilityId) {
      const availability = await getAvailabilityAttendances({
        select: { id: true, startAt: true },
        where: {
          id: availabilityId,
          isBooked: false,
        },
      });

      if (!availability.success)
        return {
          success: false,
          error: {
            errors: ["Horário de atendimento não encontrado ou já reservado."],
          },
          code: 404,
        };

      patientAttendanceDateAt = availability.data![0].startAt;
    }

    const updatedPatientAttendance = await prisma.$transaction(
      async (transaction) => {
        try {
          const updatedPatientAttendance =
            await transaction.patientAttendance.update({
              data: { availabilityId, dateAt: patientAttendanceDateAt },
              where: { id: patientAttendanceId },
            });
          await transaction.availabilityAttendance.update({
            data: { isBooked: true },
            where: { id: availabilityId },
          });
          return updatedPatientAttendance;
        } catch (error) {
          logger.warn(
            "Erro ao atualizar atendimento/disponibilidade do paciente na transação:",
            error,
          );
          throw new Error(
            "Erro ao atualizar atendimento/disponibilidade do paciente!",
          );
        }
      },
    );
    return { success: true, data: updatedPatientAttendance };
  } catch (error) {
    logger.error(
      "Erro ao atualizar atendimento/disponibilidade do paciente:",
      error,
    );
    return {
      success: false,
      error: {
        errors: ["Erro ao atualizar atendimento/disponibilidade do paciente!"],
      },
      code: 500,
    };
  }
};
