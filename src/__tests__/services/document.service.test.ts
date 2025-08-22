import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { MimeType } from "@prisma/client";

import prisma from "../__mock__/prisma";

vi.mock("../../lib/prisma", () => ({ default: prisma }));

import {
  getDocumentById,
  createDocument,
  deleteDocument,
  type CreateDocumentInput,
} from "@/services/document.service";

// Mock logger
vi.mock("@/config/logger", () => ({
  default: {
    error: vi.fn(),
  },
}));

// Mock PDF validator
vi.mock("@/infra/documents", () => ({
  validatePdf: vi.fn(),
}));

const mockPrisma = prisma as any;

describe("Document Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe("getDocumentById", () => {
    it("should return document by id successfully", async () => {
      const mockDocument = {
        id: "doc1",
        userId: "user1",
        name: "test.pdf",
        mimeType: MimeType.APPLICATION_PDF,
        data: Buffer.from("test"),
        createdAt: new Date(),
        deletedAt: null,
      };

      mockPrisma.document.findUnique.mockResolvedValue(mockDocument);

      const result = await getDocumentById("doc1");

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockDocument);
      expect(mockPrisma.document.findUnique).toHaveBeenCalledWith({
        where: { id: "doc1", deletedAt: null },
      });
    });

    it("should return error when document not found", async () => {
      mockPrisma.document.findUnique.mockResolvedValue(null);

      const result = await getDocumentById("nonexistent");

      expect(result.success).toBe(false);
      expect(result.error?.errors).toContain("Documento não encontrado!");
      expect(result.code).toBe(404);
    });

    it("should handle database errors", async () => {
      mockPrisma.document.findUnique.mockRejectedValue(
        new Error("Database error"),
      );

      const result = await getDocumentById("doc1");

      expect(result.success).toBe(false);
      expect(result.error?.errors).toContain("Erro ao buscar documento!");
      expect(result.code).toBe(500);
    });
  });

  describe("createDocument", () => {
    const mockCreateInput: CreateDocumentInput = {
      userId: "user1",
      name: "test.pdf",
      mimeType: MimeType.APPLICATION_PDF,
      data: Buffer.concat([Buffer.from("%PDF-1.4"), Buffer.from("content")]),
    };

    it("should create document successfully", async () => {
      const mockUser = { id: "user1" };
      const mockCreatedDocument = {
        id: "doc1",
        ...mockCreateInput,
        createdAt: new Date(),
        deletedAt: null,
      };

      // Mock PDF validation
      const { validatePdf } = await import("@/infra/documents");
      (validatePdf as any).mockReturnValue({ isValid: true, errors: [] });

      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      mockPrisma.document.create.mockResolvedValue(mockCreatedDocument);

      const result = await createDocument(mockCreateInput);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockCreatedDocument);
      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: "user1" },
        select: { id: true },
      });
      expect(mockPrisma.document.create).toHaveBeenCalledWith({
        data: mockCreateInput,
      });
    });

    it("should return error when PDF validation fails", async () => {
      const { validatePdf } = await import("@/infra/documents");
      (validatePdf as any).mockReturnValue({
        isValid: false,
        errors: ["Arquivo não possui assinatura válida de PDF"],
      });

      const result = await createDocument(mockCreateInput);

      expect(result.success).toBe(false);
      expect(result.error?.errors).toContain(
        "Arquivo não possui assinatura válida de PDF",
      );
      expect(result.code).toBe(400);
    });

    it("should return error when user not found", async () => {
      const { validatePdf } = await import("@/infra/documents");
      (validatePdf as any).mockReturnValue({ isValid: true, errors: [] });

      mockPrisma.user.findUnique.mockResolvedValue(null);

      const result = await createDocument(mockCreateInput);

      expect(result.success).toBe(false);
      expect(result.error?.errors).toContain("Usuário não encontrado!");
      expect(result.code).toBe(404);
    });

    it("should handle database errors", async () => {
      const { validatePdf } = await import("@/infra/documents");
      (validatePdf as any).mockReturnValue({ isValid: true, errors: [] });

      mockPrisma.user.findUnique.mockResolvedValue({ id: "user1" });
      mockPrisma.document.create.mockRejectedValue(new Error("Database error"));

      const result = await createDocument(mockCreateInput);

      expect(result.success).toBe(false);
      expect(result.error?.errors).toContain("Erro ao criar documento!");
      expect(result.code).toBe(500);
    });
  });

  describe("deleteDocument", () => {
    it("should soft delete document successfully", async () => {
      const mockDocument = {
        id: "doc1",
        userId: "user1",
        name: "test.pdf",
        mimeType: MimeType.APPLICATION_PDF,
        data: Buffer.from("test"),
        createdAt: new Date(),
        deletedAt: null,
      };

      const mockDeletedDocument = {
        ...mockDocument,
        deletedAt: new Date(),
      };

      mockPrisma.document.findUnique.mockResolvedValue(mockDocument);
      mockPrisma.document.update.mockResolvedValue(mockDeletedDocument);

      const result = await deleteDocument("doc1");

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockDeletedDocument);
      expect(mockPrisma.document.findUnique).toHaveBeenCalledWith({
        where: { id: "doc1", deletedAt: null },
      });
      expect(mockPrisma.document.update).toHaveBeenCalledWith({
        where: { id: "doc1" },
        data: { deletedAt: expect.any(Date) },
      });
    });

    it("should return error when document not found", async () => {
      mockPrisma.document.findUnique.mockResolvedValue(null);

      const result = await deleteDocument("nonexistent");

      expect(result.success).toBe(false);
      expect(result.error?.errors).toContain("Documento não encontrado!");
      expect(result.code).toBe(404);
    });

    it("should handle database errors", async () => {
      mockPrisma.document.findUnique.mockRejectedValue(
        new Error("Database error"),
      );

      const result = await deleteDocument("doc1");

      expect(result.success).toBe(false);
      expect(result.error?.errors).toContain("Erro ao excluir documento!");
      expect(result.code).toBe(500);
    });
  });
});
