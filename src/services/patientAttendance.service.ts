import { PatientAttendance, Prisma } from "@prisma/client";
import z from "zod/v4";

import logger from "@/config/logger";
import prisma from "@/lib/prisma";
import { can } from "@/permissions";
import {
  CreatePatientAttendanceSchema,
  UpdatePatientAttendanceSchema,
} from "@/schemas";
import { Result } from "@/types";
import { getUserById } from "./user.service";
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

export const createPatientAttendance = async (
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
    if (!patientUser || !patientUser.data?.role.includes("PATIENT"))
      return {
        success: false,
        error: { errors: ["Usuário paciente não encontrado ou inválido."] },
        code: 404,
      };

    // professionalId não é obrigatório, mas se fornecido, deve ser um usuário válido
    if (!!patientAttendance.professionalId) {
      const professionalUser = await getUserById(
        patientAttendance.professionalId,
      );
      if (
        !professionalUser ||
        !professionalUser.data?.role.includes("EMPLOYEE")
      )
        return {
          success: false,
          error: {
            errors: ["Usuário profissional não encontrado ou inválido."],
          },
          code: 404,
        };
    }

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
    patientAttendance.professionalId ||= user.id;

    const validatedPatientAttendance =
      await UpdatePatientAttendanceSchema.safeParseAsync(patientAttendance);
    if (!validatedPatientAttendance.success)
      return {
        success: false,
        error: z.treeifyError(validatedPatientAttendance.error),
        code: 400,
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
