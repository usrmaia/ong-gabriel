import { describe, it, expect } from "vitest";

import { validatePdf, type ValidatePDFProps } from "@/infra/documents";

const mockDocument: ValidatePDFProps = {
  data: Buffer.concat([
    Buffer.from("%PDF-1.4"),
    Buffer.from("some pdf content"),
  ]),
  mimeType: "application/pdf",
  filename: "test.pdf",
};

describe("PDF Validator", () => {
  describe("validatePdf", () => {
    it("deve validar um arquivo PDF correto", () => {
      const result = validatePdf(mockDocument);

      expect(result.success).toBe(true);
      expect(result.error?.errors).toHaveLength(0);
    });

    it("deve rejeitar arquivo sem assinatura PDF", () => {
      const invalidData = Buffer.from("not a pdf");
      const fileInput: ValidatePDFProps = {
        ...mockDocument,
        data: invalidData,
      };

      const result = validatePdf(fileInput);

      expect(result.success).toBe(false);
      expect(result.error?.errors).toHaveLength(1);
      expect(result.error?.errors).toContain(
        "Arquivo não possui assinatura válida de PDF!",
      );
    });

    it("deve rejeitar arquivo com tipo MIME incorreto", () => {
      const fileInput: ValidatePDFProps = {
        ...mockDocument,
        mimeType: "text/plain",
      };

      const result = validatePdf(fileInput);

      expect(result.success).toBe(false);
      expect(result.error?.errors).toContain(
        "Tipo MIME deve ser application/pdf!",
      );
    });

    it("deve rejeitar arquivo com extensão incorreta", () => {
      const fileInput: ValidatePDFProps = {
        ...mockDocument,
        filename: "test.txt",
      };

      const result = validatePdf(fileInput);

      expect(result.success).toBe(false);
      expect(result.error?.errors).toContain("Arquivo deve ter extensão .pdf!");
    });

    it("deve rejeitar arquivo vazio", () => {
      const fileInput: ValidatePDFProps = {
        ...mockDocument,
        data: Buffer.alloc(0),
      };

      const result = validatePdf(fileInput);

      expect(result.success).toBe(false);
      expect(result.error?.errors).toContain("Arquivo não pode estar vazio!");
    });

    it("deve tratar a insensibilidade a maiúsculas no nome do arquivo", () => {
      const fileInput: ValidatePDFProps = {
        ...mockDocument,
        filename: "test.PDF",
      };

      const result = validatePdf(fileInput);

      expect(result.success).toBe(true);
      expect(result.error?.errors).toHaveLength(0);
    });

    it("deve acumular múltiplos erros", () => {
      const invalidData = Buffer.alloc(0);

      const fileInput: ValidatePDFProps = {
        data: invalidData,
        mimeType: "text/plain",
        filename: "test.txt",
      };

      const result = validatePdf(fileInput);

      expect(result.success).toBe(false);
      expect(result.error?.errors).toHaveLength(4);
      expect(result.error?.errors).toContain(
        "Arquivo não possui assinatura válida de PDF!",
      );
      expect(result.error?.errors).toContain(
        "Tipo MIME deve ser application/pdf!",
      );
      expect(result.error?.errors).toContain("Arquivo deve ter extensão .pdf!");
      expect(result.error?.errors).toContain("Arquivo não pode estar vazio!");
    });
  });
});
