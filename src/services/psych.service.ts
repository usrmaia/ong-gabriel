import { Prisma, Psych } from "@prisma/client";
import { z } from "zod/v4";

import logger from "@/config/logger";
import { createDocument, deleteDocument } from "./document.service";
import prisma from "@/lib/prisma";
import { can } from "@/permissions";
import { CreatePsychSchema } from "@/schemas";
import { Result } from "@/types";
import { getUserAuthenticated } from "@/utils/auth";

export async function createPsychFromUser(
  psych: Prisma.PsychCreateInput,
): Promise<Result<Psych>> {
  try {
    const validatedPsych = await CreatePsychSchema.safeParseAsync(psych);
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

    if (!psych.proofAddress || !psych.curriculumVitae)
      return {
        success: false,
        error: { errors: ["É necessário enviar todos os documentos."] },
        code: 400,
      };

    const [proofAddressResult, curriculumVitaeResult] = await Promise.all([
      createDocument(validatedPsych.data.proofAddress),
      createDocument(validatedPsych.data.curriculumVitae),
    ]);

    if (!proofAddressResult.success) {
      deleteDocument(curriculumVitaeResult.data!.id);
      return {
        success: false,
        error: proofAddressResult.error,
        code: 400,
      };
    }

    if (!curriculumVitaeResult.success) {
      deleteDocument(proofAddressResult.data!.id);
      return {
        success: false,
        error: curriculumVitaeResult.error,
        code: 400,
      };
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { proofAddress, curriculumVitae, ...otherDetails } =
      validatedPsych.data;

    const psycho = await prisma.psych.create({
      data: {
        ...otherDetails,
        proofAddressId: proofAddressResult.data!.id,
        curriculumVitaeId: curriculumVitaeResult.data!.id,
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
}
