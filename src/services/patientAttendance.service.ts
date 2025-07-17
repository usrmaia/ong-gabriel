import z from "zod/v4";

import logger from "@/config/logger";
import { PatientAttendance, Prisma } from "@/generated/prisma";
import prisma from "@/lib/prisma";
import { can } from "@/permissions";
import { PatientAttendanceSchema } from "@/schemas";
import { Result } from "@/types";
import { getUserById } from "./user.service";
import { getUserAuthenticated } from "@/utils/auth";

export const getPatientAttendances = async (filter?: {
  where?: Prisma.PatientAttendanceWhereInput;
  include?: Prisma.PatientAttendanceInclude;
  orderBy?: Prisma.PatientAttendanceOrderByWithRelationInput;
}): Promise<Result<PatientAttendance[]>> => {
  try {
    const user = await getUserAuthenticated();
    if (!can(user, "list", "patientAttendance"))
      return {
        success: false,
        error: { errors: ["Usuário não autorizado a listar atendimentos!"] },
        code: 403,
      };

    const patientAttendances = await prisma.patientAttendance.findMany({
      include: { ...filter?.include },
      where: filter?.where,
      orderBy: { dateAt: "asc", ...filter?.orderBy },
    });
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
      await PatientAttendanceSchema.safeParseAsync(patientAttendance);
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
  patientAttendance: Prisma.PatientAttendanceUncheckedUpdateWithoutPatientInput & {
    id: string;
  },
): Promise<Result<PatientAttendance>> => {
  try {
    const user = await getUserAuthenticated();
    if (!can(user, "update", "patientAttendance"))
      return {
        success: false,
        error: { errors: ["Usuário não autorizado a atualizar atendimentos!"] },
        code: 403,
      };

    const validatedPatientAttendance =
      await PatientAttendanceSchema.safeParseAsync(patientAttendance);
    if (!validatedPatientAttendance.success)
      return {
        success: false,
        error: z.treeifyError(validatedPatientAttendance.error),
        code: 400,
      };

    const updatedPatientAttendance = await prisma.patientAttendance.update({
      data: { ...patientAttendance, ...validatedPatientAttendance },
      where: { id: patientAttendance.id },
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
