import { Suspense } from "react";
import { redirect } from "next/navigation";

import { PrePsychFormRegistration } from "./form";
import { getPsychByUserId } from "@/services";
import { PsychProfile } from "./type";
import { getUserIdAuthenticated } from "@/utils/auth";

export default async function PrePsychFormRegistrationPage() {
  const userId = await getUserIdAuthenticated();
  const psychResult = await getPsychByUserId(userId, {
    include: {
      user: { select: { role: true } },
      curriculumVitae: { select: { id: true, name: true } },
      proofAddress: { select: { id: true, name: true } },
    },
  });
  const psych = psychResult.data as PsychProfile;

  // Caso ainda não tenha sido verificado
  if (psych?.status === "PENDING")
    redirect("/pre-psych/form-registration/success");

  if (psych?.status === "FAILED")
    return (
      <p>
        Agradecemos seu interesse em atuar como psicólogo voluntário na ONG
        Gabriel. Após análise dos dados e documentos enviados, infelizmente seu
        cadastro foi reprovado neste momento.
      </p>
    );

  if (psych?.user.role.includes("EMPLOYEE"))
    return (
      <p>Você já é um funcionário, não pode se registrar como psicólogo.</p>
    );

  return (
    <Suspense fallback={<span>Loading...</span>}>
      <PrePsychFormRegistration psych={psych || undefined} />
    </Suspense>
  );
}
