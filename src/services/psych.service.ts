import { z } from "zod/v4";

import logger from "@/config/logger";
import { createDocument, deleteDocument } from "./document.service";
import prisma from "@/lib/prisma";
import { can } from "@/permissions";
import { Document, Prisma, Psych } from "@prisma/client";
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
    const user = await getUserAuthenticated();

    if (!can(user, "view", "psychs", { userId })) {
      return {
        success: false,
        error: {
          errors: ["Usuário não autorizado a visualizar este psicólogo!"],
        },
        code: 403,
      };
    }

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
        error: { errors: ["Usuário não autorizado!"] },
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

export const updatePsych = async (
  userId: string,
  data: Partial<Prisma.PsychUncheckedUpdateInput>,
  currentUser: { id: string; role: string[] },
): Promise<Result<Psych>> => {
  try {
    // Permitir apenas o próprio usuário ou admin
    if (userId !== currentUser.id && !currentUser.role.includes("ADMIN")) {
      return {
        success: false,
        error: { errors: ["Não autorizado!"] },
        code: 403,
      };
    }

    const psych = await prisma.psych.findUnique({ where: { userId } });
    if (!psych)
      return {
        success: false,
        error: { errors: ["Psicólogo não encontrado!"] },
        code: 404,
      };

    if (psych.status !== "ADJUSTMENT")
      return {
        success: false,
        error: { errors: ["Edição não permitida para este status!"] },
        code: 403,
      };

    const updated = await prisma.psych.update({
      where: { userId },
      data,
    });

    return { success: true, data: updated };
  } catch (error) {
    logger.error("Erro ao atualizar psicólogo:", error);
    return {
      success: false,
      error: { errors: ["Erro ao atualizar psicólogo!"] },
      code: 500,
    };
  }
};

/**
 * Atualiza um registro de psicólogo com dados básicos e documentos associados.
 * Permite edição apenas para candidatos com status ADJUSTMENT.
 */
export const updatePsychFromUser = async (
  psych: Partial<Prisma.PsychUncheckedUpdateInput>,
  proofAddress: Document,
  curriculumVitae: Document,
): Promise<Result<Psych>> => {
  try {
    const user = await getUserAuthenticated();
    if (!can(user, "update", "psychs", { userId: user.id }))
      return {
        success: false,
        error: { errors: ["Usuário não autorizado a editar este psicólogo!"] },
        code: 403,
      };

    const existingPsych = await prisma.psych.findUnique({
      include: { proofAddress: true, curriculumVitae: true },
      where: { userId: user.id },
    });
    if (!existingPsych)
      return {
        success: false,
        error: { errors: ["Psicólogo não encontrado!"] },
        code: 404,
      };

    if (existingPsych.status !== "ADJUSTMENT")
      return {
        success: false,
        error: { errors: ["Edição não permitida para este status!"] },
        code: 403,
      };

    // Validação dos dados básicos se fornecidos
    const validatedPsych = await BasePsychSchema.safeParseAsync(psych);
    if (!validatedPsych.success)
      return {
        success: false,
        error: z.treeifyError(validatedPsych.error),
        code: 400,
      };

    if (validatedPsych.data.CRP !== existingPsych.CRP) {
      const existingCRP = await prisma.psych.count({
        where: {
          CRP: validatedPsych.data.CRP as string,
          userId: { not: user.id },
          user: { role: { has: "EMPLOYEE" } },
        },
      });
      if (existingCRP > 0)
        return {
          success: false,
          error: { errors: ["Este CRP já está cadastrado!"] },
          code: 409,
        };
    }

    await prisma.psych.update({
      where: { userId: user.id },
      data: validatedPsych.data,
    });

    if (existingPsych.proofAddress.data !== proofAddress.data) {
      const createProofResult = await createDocument(proofAddress);
      if (!createProofResult.success)
        return {
          success: false,
          error: createProofResult.error,
          code: 500,
        };

      await prisma.psych.update({
        where: { userId: user.id },
        data: { proofAddressId: createProofResult.data!.id },
      });

      const deleteProofResult = await deleteDocument(
        existingPsych.proofAddressId,
      );
      if (!deleteProofResult.success)
        logger.error(
          `Erro ao deletar comprovante de endereço antigo (ID: ${existingPsych.proofAddressId}):`,
          deleteProofResult.error,
        );
    }

    if (existingPsych.curriculumVitae.data !== curriculumVitae.data) {
      const createCVResult = await createDocument(curriculumVitae);
      if (!createCVResult.success)
        return {
          success: false,
          error: createCVResult.error,
          code: 500,
        };

      await prisma.psych.update({
        where: { userId: user.id },
        data: { curriculumVitaeId: createCVResult.data!.id },
      });

      const deleteCVResult = await deleteDocument(
        existingPsych.curriculumVitaeId,
      );
      if (!deleteCVResult.success)
        logger.error(
          `Erro ao deletar currículo antigo (ID: ${existingPsych.curriculumVitaeId}):`,
          deleteCVResult.error,
        );
    }

    const updatedPsych = await prisma.psych.findUnique({
      where: { userId: user.id },
    });

    return { success: true, data: updatedPsych! };
  } catch (error) {
    logger.error("Erro ao atualizar psicólogo:", error);
    return {
      success: false,
      error: { errors: ["Erro ao atualizar psicólogo!"] },
      code: 500,
    };
  }
};
