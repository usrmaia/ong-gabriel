import { BackNavigationHeader } from "@/components/ui";
import { AddAvailabilityAttendanceForm } from "./form";

export default function AddAvailabilityAttendancePage() {
  return (
    <>
      <BackNavigationHeader
        title="Adicionar disponibilidade de atendimento"
        href="/employee/availability-attendance"
      />
      <div className="flex flex-col items-center justify-center w-full">
        <h3 className="text-center py-4">Quais seus horários disponíveis?</h3>
        <p className="font-young my-4">
          <strong>Disponibilize novos horários</strong> de atendimento,
          selecionando dias únicos ou um período completo
          <br className="mb-2" />
          <strong>Importante:</strong> Ao selecionar período completo, os
          horários serão disponibilizados de forma recorrente no período
          selecionado!
        </p>

        <AddAvailabilityAttendanceForm />
      </div>
    </>
  );
}
