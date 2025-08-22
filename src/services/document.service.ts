import { Document, Prisma, MimeType } from "@prisma/client";

import logger from "@/config/logger";
import prisma from "@/lib/prisma";
import { Result } from "@/types";
import { validatePdf, type ValidatePDFProps } from "@/infra/documents";

/**
 * Interface for creating a new document
 */
export interface CreateDocumentInput {
  userId: string;
  name: string;
  mimeType: MimeType;
  data: Buffer;
}

/**
 * Get a document by ID
 * @param documentId - Document ID
 * @param filter - Prisma filter options
 * @returns Promise<Result<Document>>
 */
export const getDocumentById = async (
  documentId: string,
  filter?: Prisma.DocumentDefaultArgs,
): Promise<Result<Document>> => {
  try {
    const document = await prisma.document.findUnique({
      where: {
        id: documentId,
        deletedAt: null, // Only return non-deleted documents
      },
      ...filter,
    });

    if (!document) {
      return {
        success: false,
        error: { errors: ["Documento não encontrado!"] },
        code: 404,
      };
    }

    return { success: true, data: document };
  } catch (error) {
    logger.error("Erro ao buscar documento:", error);
    return {
      success: false,
      error: { errors: ["Erro ao buscar documento!"] },
      code: 500,
    };
  }
};

/**
 * Create a new document
 * @param input - Document creation data
 * @returns Promise<Result<Document>>
 */
export const createDocument = async (
  input: CreateDocumentInput,
): Promise<Result<Document>> => {
  try {
    // Validate PDF if the mime type is APPLICATION_PDF
    if (input.mimeType === MimeType.APPLICATION_PDF) {
      const fileValidation: ValidatePDFProps = {
        data: input.data,
        mimeType: "application/pdf",
        filename: input.name,
      };

      const validationResult = validatePdf(fileValidation);
      if (!validationResult.isValid) {
        return {
          success: false,
          error: { errors: validationResult.errors },
          code: 400,
        };
      }
    }

    // Validate user exists
    const userExists = await prisma.user.findUnique({
      where: { id: input.userId },
      select: { id: true },
    });

    if (!userExists) {
      return {
        success: false,
        error: { errors: ["Usuário não encontrado!"] },
        code: 404,
      };
    }

    // Create document
    const document = await prisma.document.create({
      data: {
        userId: input.userId,
        name: input.name,
        mimeType: input.mimeType,
        data: input.data,
      },
    });

    return { success: true, data: document };
  } catch (error) {
    logger.error("Erro ao criar documento:", error);
    return {
      success: false,
      error: { errors: ["Erro ao criar documento!"] },
      code: 500,
    };
  }
};

/**
 * Soft delete a document (sets deletedAt)
 * @param documentId - Document ID to delete
 * @returns Promise<Result<Document>>
 */
export const deleteDocument = async (
  documentId: string,
): Promise<Result<Document>> => {
  try {
    // Check if document exists and is not already deleted
    const existingDocument = await prisma.document.findUnique({
      where: {
        id: documentId,
        deletedAt: null,
      },
    });

    if (!existingDocument) {
      return {
        success: false,
        error: { errors: ["Documento não encontrado!"] },
        code: 404,
      };
    }

    // Soft delete document
    const deletedDocument = await prisma.document.update({
      where: { id: documentId },
      data: { deletedAt: new Date() },
    });

    return { success: true, data: deletedDocument };
  } catch (error) {
    logger.error("Erro ao excluir documento:", error);
    return {
      success: false,
      error: { errors: ["Erro ao excluir documento!"] },
      code: 500,
    };
  }
};
