import { validatePdf } from "./pdfValidator";

export interface ValidateProps {
  data: Buffer;
  mimeType: string;
  filename: string;
  maxSizeInBytes?: number;
}

export const getValidate = (mimeType: string) => {
  switch (mimeType) {
    case "application/pdf":
      return validatePdf;
    default:
      throw new Error("Unsupported MIME type");
  }
};
