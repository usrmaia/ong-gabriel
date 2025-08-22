import { Result } from "@/types";

export interface ValidatePDFProps {
  data: Buffer;
  mimeType: string;
  filename: string;
}

export const validatePdf = (props: ValidatePDFProps): Result => {
  const result: Result = {
    success: true,
    error: { errors: [] },
  };

  const pdfSignature = Buffer.from("%PDF");
  if (!props.data.subarray(0, 4).equals(pdfSignature)) {
    result.success = false;
    result.error?.errors.push("Arquivo não possui assinatura válida de PDF!");
  }

  if (props.mimeType !== "application/pdf") {
    result.success = false;
    result.error?.errors.push("Tipo MIME deve ser application/pdf!");
  }

  if (!props.filename.toLowerCase().endsWith(".pdf")) {
    result.success = false;
    result.error?.errors.push("Arquivo deve ter extensão .pdf!");
  }

  // Check if file has content
  if (props.data.length === 0) {
    result.success = false;
    result.error?.errors.push("Arquivo não pode estar vazio!");
  }

  return result;
};
