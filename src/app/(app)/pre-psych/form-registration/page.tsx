import { Suspense } from "react";
import { redirect } from "next/navigation";

import { PrePsychFormRegistration } from "./form";
import { Psych } from "@prisma/client";
import { getPsychByUserId } from "@/services";
import { getUserIdAuthenticated } from "@/utils/auth";

export default async function PrePsychFormRegistrationPage() {
  const userId = await getUserIdAuthenticated();
  const psychResult = await getPsychByUserId(userId, {
    include: { user: { select: { role: true } } },
  });
  const psych = psychResult.data as
    | (Psych & { user: { role: string[] } })
    | null;

  // Caso ainda não tenha sido verificado
  if (psych?.status === "PENDING")
    redirect("/pre-psych/form-registration/success");

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
