import { BackNavigationHeader, CardFormAnamnesis } from "@/components/ui";
import { getPatientFormAnamnesisFromUser } from "@/services";

export default async function FormAnamnesisList() {
  const formAnamnesisResult = await getPatientFormAnamnesisFromUser();

  // Order by createdAt descending
  const formAnamnesis = (formAnamnesisResult.data || []).sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <>
      <BackNavigationHeader title="Histórico de Anamneses" />
      <section className="flex flex-col gap-2">
        {formAnamnesis.length > 0 ? (
          formAnamnesis.map((anamnesis) => (
            <CardFormAnamnesis key={anamnesis.id} anamnesis={anamnesis} />
          ))
        ) : (
          <p className="text-center text-gray-500 py-8">
            Nenhuma anamnese encontrada.
          </p>
        )}
      </section>
    </>
  );
}