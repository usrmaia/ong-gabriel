import { Document, MimeType, Prisma } from "@prisma/client";
import z from "zod/v4";

import logger from "@/config/logger";
import { getValidate } from "@/infra/documents";
import prisma from "@/lib/prisma";
import { can } from "@/permissions";
import { DocumentSchema, MimeTypeSchema } from "@/schemas";
import { Result } from "@/types";
import { getUserAuthenticated } from "@/utils/auth";

export const getDocumentById = async (
  documentId: string,
  filter?: Prisma.DocumentDefaultArgs,
): Promise<Result<Document>> => {
  try {
    const document = await prisma.document.findUnique({
      where: {
        id: documentId,
        deletedAt: null,
      },
      ...filter,
    });

    const user = await getUserAuthenticated();
    if (!can(user, "view", "documents", document))
      return {
        success: false,
        error: { errors: ["Usuário não autorizado a visualizar documentos!"] },
        code: 403,
      };

    if (!document)
      return {
        success: false,
        error: { errors: ["Documento não encontrado!"] },
        code: 404,
      };

    return { success: true, data: document, code: 200 };
  } catch (error) {
    logger.error("Erro ao buscar documento:", error);
    return {
      success: false,
      error: { errors: ["Erro ao buscar documento!"] },
      code: 500,
    };
  }
};

export const createDocument = async (
  document: Prisma.DocumentUncheckedCreateWithoutUserInput,
): Promise<Result<Document>> => {
  try {
    const user = await getUserAuthenticated();
    if (!can(user, "create", "documents"))
      return {
        success: false,
        error: { errors: ["Usuário não autorizado a criar documentos!"] },
        code: 403,
      };

    const validatedDocument = await DocumentSchema.safeParseAsync(document);
    if (!validatedDocument.success)
      return {
        success: false,
        error: z.treeifyError(validatedDocument.error),
        code: 400,
      };

    const mimeType = MimeTypeSchema.parse(document.mimeType);
    const dataBuffer = Buffer.isBuffer(document.data)
      ? document.data
      : Buffer.from(document.data);
    const maxSizeInBytes = getMaxSizeInBytes(document.mimeType);

    const validate = getValidate(mimeType);
    const validatedResult = validate({
      data: dataBuffer,
      mimeType,
      filename: document.name,
      maxSizeInBytes,
    });
    if (!validatedResult.success)
      return {
        success: false,
        error: validatedResult.error,
        code: 400,
      };

    const createdDocument = await prisma.document.create({
      data: {
        ...validatedDocument.data,
        userId: user.id,
      },
    });

    return { success: true, data: createdDocument, code: 201 };
  } catch (error) {
    logger.error("Erro ao criar documento:", error);
    return {
      success: false,
      error: { errors: ["Erro ao criar documento!"] },
      code: 500,
    };
  }
};

export const deleteDocument = async (
  documentId: string,
): Promise<Result<Document>> => {
  try {
    const user = await getUserAuthenticated();
    if (!can(user, "delete", "documents"))
      return {
        success: false,
        error: { errors: ["Usuário não autorizado a excluir documentos!"] },
        code: 403,
      };

    const document = await prisma.document.findUnique({
      where: {
        id: documentId,
        userId: user.id,
        deletedAt: null,
      },
    });

    if (!document)
      return {
        success: false,
        error: { errors: ["Documento não encontrado!"] },
        code: 404,
      };

    const deletedDocument = await prisma.document.update({
      where: { id: documentId },
      data: { deletedAt: new Date() },
    });

    return { success: true, data: deletedDocument, code: 200 };
  } catch (error) {
    logger.error("Erro ao excluir documento:", error);
    return {
      success: false,
      error: { errors: ["Erro ao excluir documento!"] },
      code: 500,
    };
  }
};

const MAX_PDF_SIZE_IN_BYTES = 500 * 1024; // 500 KB

const getMaxSizeInBytes = (mimeType: MimeType): number => {
  switch (mimeType) {
    case "APPLICATION_PDF":
      return MAX_PDF_SIZE_IN_BYTES;
    default:
      return 0;
  }
};
