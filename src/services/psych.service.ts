import { Prisma, Psych } from "@prisma/client";
import { z } from "zod/v4";

import logger from "@/config/logger";
import { createDocument, deleteDocument } from "./document.service";
import prisma from "@/lib/prisma";
import { can } from "@/permissions";
import { addRoleToUser } from "./role.service";
import { BasePsychSchema } from "@/schemas";
import { Result } from "@/types";
import { getUserAuthenticated } from "@/utils/auth";

export const getPsychs = async (
  filter?: Prisma.PsychFindManyArgs,
): Promise<Result<Psych[]>> => {
  try {
    const user = await getUserAuthenticated();
    if (!can(user, "list", "psychs"))
      return {
        success: false,
        error: { errors: ["Usuário não autorizado!"] },
        code: 403,
      };
    const psychData = await prisma.psych.findMany(filter);
    return { success: true, data: psychData };
  } catch (error) {
    logger.error("Erro ao buscar candidatos a psicólogos:", error);
    return {
      success: false,
      error: { errors: ["Erro ao buscar candidatos a psicólogos!"] },
      code: 500,
    };
  }
};

export const getPsychByUserId = async (
  userId: string,
  filter?: Prisma.PsychDefaultArgs,
): Promise<Result<Psych | null>> => {
  try {
    const psychData = await prisma.psych.findUnique({
      where: { userId },
      ...filter,
    });

    if (!psychData)
      return {
        success: false,
        error: { errors: ["Psicólogo não encontrado!"] },
        code: 404,
      };

    return { success: true, data: psychData };
  } catch (error) {
    logger.error("Erro ao buscar psicólogo:", error);
    return {
      success: false,
      error: { errors: ["Erro ao buscar psicólogo!"] },
      code: 500,
    };
  }
};

/**
 * Cria um novo registro de psicólogo a partir de dados básicos do usuário com documentos associados.
 */
export const createPsychFromUser = async (
  psych: Prisma.PsychUncheckedCreateInput,
  proofAddress: Prisma.DocumentUncheckedCreateInput,
  curriculumVitae: Prisma.DocumentUncheckedCreateInput,
): Promise<Result<Psych>> => {
  try {
    const validatedPsych = await BasePsychSchema.safeParseAsync(psych);
    if (!validatedPsych.success)
      return {
        success: false,
        error: z.treeifyError(validatedPsych.error),
        code: 400,
      };

    const user = await getUserAuthenticated();
    if (!can(user, "simpleCreate", "psychs"))
      return {
        success: false,
        error: { errors: ["O usuário já é um psicologo!"] },
        code: 409,
      };

    const existingCRP = await prisma.psych.count({
      where: {
        CRP: validatedPsych.data.CRP,
        user: { role: { has: "EMPLOYEE" } },
      },
    });
    if (existingCRP > 0)
      return {
        success: false,
        error: { errors: ["Este CRP já está cadastrado!"] },
        code: 409,
      };

    const documentsResult = await createPsychDocuments(
      proofAddress,
      curriculumVitae,
    );
    if (!documentsResult.success)
      return {
        success: false,
        error: {
          errors: documentsResult.error?.errors || [],
          properties: {
            proofAddressId: documentsResult.error?.properties?.proofAddressId,
            curriculumVitaeId:
              documentsResult.error?.properties?.curriculumVitaeId,
          },
        },
        code: documentsResult.code,
      };

    addRoleToUser(user.id, "PREPSYCHO");

    const psycho = await prisma.psych.create({
      data: {
        ...validatedPsych.data,
        proofAddressId: documentsResult.data!.proofAddressId,
        curriculumVitaeId: documentsResult.data!.curriculumVitaeId,
        userId: user.id,
      },
    });

    return {
      success: true,
      data: psycho,
    };
  } catch (error) {
    logger.error("Erro ao criar psicólogo:", error);
    return {
      success: false,
      error: { errors: ["Erro ao criar psicólogo!"] },
      code: 500,
    };
  }
};

export const createPsychDocuments = async (
  proofAddress: Prisma.DocumentUncheckedCreateInput,
  curriculumVitae: Prisma.DocumentUncheckedCreateInput,
): Promise<Result<{ proofAddressId: string; curriculumVitaeId: string }>> => {
  const [proofAddressResult, curriculumVitaeResult] = await Promise.all([
    createDocument(proofAddress),
    createDocument(curriculumVitae),
  ]);

  if (!proofAddressResult.success) {
    if (curriculumVitaeResult.success)
      deleteDocument(curriculumVitaeResult.data!.id);
    return {
      success: false,
      error: {
        errors: proofAddressResult.error?.errors || [],
        properties: {
          proofAddressId: proofAddressResult.error,
        },
      },
    };
  }

  if (!curriculumVitaeResult.success) {
    if (proofAddressResult.success) deleteDocument(proofAddressResult.data!.id);

    return {
      success: false,
      error: {
        errors: curriculumVitaeResult.error?.errors || [],
        properties: {
          curriculumVitaeId: curriculumVitaeResult.error,
        },
      },
      code: 400,
    };
  }

  return {
    success: true,
    data: {
      proofAddressId: proofAddressResult.data!.id,
      curriculumVitaeId: curriculumVitaeResult.data!.id,
    },
    code: 200,
  };
};
