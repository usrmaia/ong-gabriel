import { Result } from "@/types";

export interface ValidatePDFProps {
  data: Buffer;
  mimeType: string;
  filename: string;
}

export const validatePdf = (props: ValidatePDFProps): Result => {
  const result: Result = {
    success: false,
    error: { errors: [] },
  };

  const pdfSignature = Buffer.from("%PDF");
  if (!props.data.subarray(0, 4).equals(pdfSignature))
    result.error?.errors.push("Arquivo não possui assinatura válida de PDF!");

  if (props.mimeType !== "application/pdf")
    result.error?.errors.push("Tipo MIME deve ser application/pdf!");

  if (!props.filename.toLowerCase().endsWith(".pdf"))
    result.error?.errors.push("Arquivo deve ter extensão .pdf!");

  if (props.data.length === 0)
    result.error?.errors.push("Arquivo não pode estar vazio!");

  // Check for minimum PDF size (a valid PDF needs at least header + trailer)
  if (props.data.length < 26)
    result.error?.errors.push("Arquivo PDF muito pequeno para ser válido!");

  // Check for PDF trailer (%%EOF at the end)
  const dataStr = props.data.toString("latin1");
  if (!dataStr.includes("%%EOF"))
    result.error?.errors.push(
      "Arquivo PDF não possui estrutura válida (trailer ausente)!",
    );

  // Check for essential PDF elements
  const hasXref = dataStr.includes("xref") || dataStr.includes("/Type/XRef");
  const hasTrailer = dataStr.includes("trailer");

  if (!hasXref || !hasTrailer)
    result.error?.errors.push(
      "Arquivo PDF não possui estrutura interna válida!",
    );

  result.success = result.error?.errors.length === 0;

  return result;
};
