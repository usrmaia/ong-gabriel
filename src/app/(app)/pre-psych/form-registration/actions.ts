"use server";

import { redirect } from "next/navigation";

import { Prisma, Psych } from "@prisma/client";
import {
  createPsychFromUser,
  updatePsychFromUser,
} from "@/services/psych.service";
import { PsychProfile } from "./type";
import { Result } from "@/types";

export async function onSubmit(
  prev: Result<Psych>,
  formData: globalThis.FormData,
): Promise<Result<PsychProfile>> {
  const formDataObject = Object.fromEntries(
    formData.entries(),
  ) as unknown as Psych;

  const curriculumVitaeFile = formData.get("curriculumVitae");
  const proofAddressFile = formData.get("proofAddress");

  const isCurriculumVitaeRequired =
    !formDataObject.id && // required
    (!curriculumVitaeFile || !(curriculumVitaeFile instanceof File));
  if (isCurriculumVitaeRequired)
    return {
      success: false,
      error: {
        errors: [
          "Arquivo de currículo é obrigatório e deve ser um arquivo válido",
        ],
      },
    };

  const isProofAddressRequired =
    !formDataObject.id && // required
    (!proofAddressFile || !(proofAddressFile instanceof File));
  if (isProofAddressRequired)
    return {
      success: false,
      error: {
        errors: [
          "Comprovante de endereço é obrigatório e deve ser um arquivo válido",
        ],
      },
    };

  let proofAddressDoc: Prisma.DocumentUncheckedCreateInput | undefined;
  if (proofAddressFile instanceof File && proofAddressFile.size) {
    const proofAddressBuffer = await proofAddressFile.arrayBuffer();

    proofAddressDoc = {
      userId: formDataObject.userId,
      name: `Comprovante de Endereço - ${formDataObject.CRP}.pdf`,
      mimeType: "APPLICATION_PDF",
      data: new Uint8Array(proofAddressBuffer),
      category: "PROOF_ADDRESS",
    };
  }

  let curriculumVitaeDoc: Prisma.DocumentUncheckedCreateInput | undefined;
  if (curriculumVitaeFile instanceof File && curriculumVitaeFile.size) {
    const curriculumVitaeBuffer = await curriculumVitaeFile.arrayBuffer();

    curriculumVitaeDoc = {
      userId: formDataObject.userId,
      name: `Currículo - ${formDataObject.CRP}.pdf`,
      mimeType: "APPLICATION_PDF",
      data: new Uint8Array(curriculumVitaeBuffer),
      category: "CURRICULUM_VITAE",
    };
  }

  const result = (
    formDataObject.id
      ? await updatePsychFromUser(
          formDataObject,
          proofAddressDoc,
          curriculumVitaeDoc,
        )
      : await createPsychFromUser(
          formDataObject,
          proofAddressDoc!,
          curriculumVitaeDoc!,
          // ! pois existe no caso de criação
        )
  ) as Result<PsychProfile>;

  if (!result.success) return result;

  redirect("/pre-psych/form-registration/success");
}
