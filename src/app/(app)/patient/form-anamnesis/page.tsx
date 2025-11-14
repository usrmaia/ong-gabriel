import { redirect } from "next/navigation";
import { Suspense } from "react";

import { PatientFormAnamnesis } from "./form";
import { getPatientFormAnamnesisFromUser } from "@/services";

export default async function PatientFormAnamnesisPage() {
  const userAnamnesisResult = await getPatientFormAnamnesisFromUser();

  // Caso o usuário tenha preenchido um formulário de anamnese nos últimos 7 dias,
  // redireciona para a página de falha
  if (userAnamnesisResult.success) {
    const lastAnamnesisDate = userAnamnesisResult.data!.reduce(
      (prev, current) => (prev.createdAt > current.createdAt ? prev : current),
    ).createdAt;

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    if (lastAnamnesisDate > sevenDaysAgo)
      redirect("/patient/form-anamnesis/failed");
  }

  return (
    <Suspense fallback={<span>Loading...</span>}>
      <PatientFormAnamnesis />
    </Suspense>
  );
}
