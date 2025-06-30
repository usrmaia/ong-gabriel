import z from "zod/v4";

import { auth } from "@/auth";
import logger from "@/config/logger";
import { FormAnamnesis, Prisma } from "@/generated/prisma";
import { PatientRepository } from "@/repositories";
import { PatientFormAnamnesisSchema } from "@/schemas";
import { Result } from "@/types";

export const getPatientFormAnamnesis = async (filter: {
  where?: Prisma.FormAnamnesisWhereInput;
}) => {
  return await PatientRepository.getPatientFormAnamnesis(filter);
};

/**
 * Recupera todos os registros de anamnese associados ao usuário autenticado.
 *
 * @returns Um array de registros de anamnese para o usuário autenticado.
 * @throws Lança um erro se a autenticação falhar ou se o ID do usuário não estiver disponível.
 */
export const getPatientFormAnamnesisFromUser = async () => {
  const userId = (await auth())?.user.id!;
  return await PatientRepository.getPatientFormAnamnesis({ where: { userId } });
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

    const createdFormAnamnesis =
      await PatientRepository.createPatientFormAnamnesis(formAnamnesis);
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
