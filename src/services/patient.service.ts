import z from "zod/v4";

import { auth } from "@/auth";
import logger from "@/config/logger";
import { FormAnamnesis, Prisma } from "@/generated/prisma";
import prisma from "@/lib/prisma";
import { can } from "@/permissions";
import { PatientFormAnamnesisSchema } from "@/schemas";
import { Result } from "@/types";
import { addRoleToUser } from "./role.service";
import { Role } from "@/generated/prisma";

export const getPatientFormAnamnesis = async (filter: {
  where?: Prisma.FormAnamnesisWhereInput;
}): Promise<Result<FormAnamnesis[]>> => {
  try {
    const user = (await auth())?.user!;
    if (!can(user, "list", "formAnamnesis"))
      return {
        success: false,
        error: { errors: ["Usuário não autorizado a listar anamnese!"] },
        code: 403,
      };

    const formAnamnesis = await prisma.formAnamnesis.findMany({
      where: filter.where,
    });

    if (formAnamnesis.length === 0)
      return {
        success: false,
        error: { errors: ["Nenhum registro de anamnese encontrado!"] },
        code: 404,
      };
    return { success: true, data: formAnamnesis };
  } catch (error) {
    logger.error("Erro ao buscar anamneses do paciente:", error);
    return {
      success: false,
      error: { errors: ["Erro ao buscar anamneses do paciente!"] },
      code: 500,
    };
  }
};

/**
 * Recupera todos os registros de anamnese associados ao usuário autenticado.
 *
 * @returns Um array de registros de anamnese para o usuário autenticado.
 * @throws Lança um erro se a autenticação falhar ou se o ID do usuário não estiver disponível.
 */
export const getPatientFormAnamnesisFromUser = async (): Promise<
  Result<FormAnamnesis[]>
> => {
  const userId = (await auth())?.user.id!;
  const userAnamnesisForms = await prisma.formAnamnesis.findMany({
    where: { userId },
  });

  if (userAnamnesisForms.length === 0)
    return {
      success: false,
      error: {
        errors: ["Nenhum registro de anamnese encontrado para o usuário!"],
      },
      code: 404,
    };
  return { success: true, data: userAnamnesisForms };
};

/**
 * Cria um novo registro de anamneses do paciente associado ao usuário autenticado.
 *
 * @param formAnamnesis - Os dados da anamneses do formulário a serem validados e criados.
 * @returns Os dados da anamneses criados ou um erro.
 */
export const createPatientFormAnamnesis = async (
  formAnamnesis: FormAnamnesis,
): Promise<Result<FormAnamnesis>> => {
  try {
    const validatedAnamnesis =
      await PatientFormAnamnesisSchema.safeParseAsync(formAnamnesis);
    if (!validatedAnamnesis.success)
      return {
        success: false,
        error: z.treeifyError(validatedAnamnesis.error),
        code: 400,
      };

    formAnamnesis.userId = (await auth())?.user.id!;

    const createdFormAnamnesis = await prisma.formAnamnesis.create({
      data: { ...formAnamnesis, ...validatedAnamnesis.data },
    });

    if (formAnamnesis.userId) {
      const roleResult = await addRoleToUser(
        formAnamnesis.userId,
        Role.PATIENT,
      );
      if (!roleResult.success) {
        logger.warn(
          "Erro ao adicionar role Patient ao usuário:",
          roleResult.error,
        );
      }
    }

    return { success: true, data: createdFormAnamnesis, code: 201 };
  } catch (error) {
    logger.error("Erro ao criar anamneses do paciente:", error);
    return {
      success: false,
      error: { errors: ["Erro ao criar anamneses do paciente!"] },
      code: 500,
    };
  }
};
