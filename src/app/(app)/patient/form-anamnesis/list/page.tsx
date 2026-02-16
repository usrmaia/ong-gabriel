import Link from "next/link";

import {
  BackNavigationHeader,
  Button,
  CardFormAnamnesis,
} from "@/components/ui";
import { getPatientFormAnamnesisFromUser } from "@/services";

export default async function FormAnamnesisList() {
  const formAnamnesisResult = await getPatientFormAnamnesisFromUser();

  if (!formAnamnesisResult.success)
    return (
      <p className="text-center text-gray-500 py-8">
        Opa! Parece que você ainda não realizou o seu anamneses!
      </p>
    );

  const formAnamnesis = formAnamnesisResult.data || [];

  return (
    <>
      <BackNavigationHeader title="Histórico de Anamneses" />

      <section className="flex flex-col gap-2">
        {formAnamnesis.map((anamnesis) => (
          <CardFormAnamnesis key={anamnesis.id} anamnesis={anamnesis} />
        ))}
      </section>

      <Link href="/patient/form-anamnesis">
        <Button className="font-semibold w-full rounded text-md">
          Realizar nova anamnese
        </Button>
      </Link>
    </>
  );
}
