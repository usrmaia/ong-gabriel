"use server";

import { redirect } from "next/navigation";
import { Prisma, Psych } from "@prisma/client";

import { createPsychFromUser } from "@/services/psych.service";
import { Result } from "@/types";

export async function onSubmit(
  prev: Result<Psych>,
  formData: globalThis.FormData,
): Promise<Result<Psych>> {
  const formDataObject = Object.fromEntries(
    formData.entries(),
  ) as unknown as Psych;

  const curriculumVitaeFile = formData.get("curriculumVitae");
  const proofAddressFile = formData.get("proofAddress");

  if (!curriculumVitaeFile || !(curriculumVitaeFile instanceof File))
    return {
      success: false,
      error: {
        errors: [
          "Arquivo de currículo é obrigatório e deve ser um arquivo válido",
        ],
      },
    };

  if (!proofAddressFile || !(proofAddressFile instanceof File))
    return {
      success: false,
      error: {
        errors: [
          "Comprovante de endereço é obrigatório e deve ser um arquivo válido",
        ],
      },
    };

  const curriculumVitaeBuffer = await curriculumVitaeFile.arrayBuffer();
  const proofAddressBuffer = await proofAddressFile.arrayBuffer();

  const proofAddressDoc: Prisma.DocumentUncheckedCreateInput = {
    userId: formDataObject.userId,
    name: `Comprovante de Endereço - ${formDataObject.CRP}.pdf`,
    mimeType: "APPLICATION_PDF",
    data: new Uint8Array(proofAddressBuffer),
    category: "PROOF_ADDRESS",
  };

  const curriculumVitaeDoc: Prisma.DocumentUncheckedCreateInput = {
    userId: formDataObject.userId,
    name: `Currículo - ${formDataObject.CRP}.pdf`,
    mimeType: "APPLICATION_PDF",
    data: new Uint8Array(curriculumVitaeBuffer),
    category: "CURRICULUM_VITAE",
  };

  const result = await createPsychFromUser(
    formDataObject,
    proofAddressDoc,
    curriculumVitaeDoc,
  );

  if (!result.success) return result;

  redirect("/pre-psych/form-registration/success");
}
