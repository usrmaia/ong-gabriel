import { Suspense } from "react";

import { PrePsychFormRegistration } from "./form";
import { getUserIdAuthenticated } from "@/utils/auth";
import { getPsychByUserId } from "@/services";
import { redirect } from "next/navigation";

export default async function PrePsychFormRegistrationPage() {
  const userId = await getUserIdAuthenticated();
  const psych = await getPsychByUserId(userId);

  // Caso ainda não tenha sido verificado
  if (psych.data?.status === "PENDING")
    redirect("/pre-psych/form-registration/success");

  return (
    <Suspense fallback={<span>Loading...</span>}>
      <PrePsychFormRegistration psych={psych.data || undefined} />
    </Suspense>
  );
}
