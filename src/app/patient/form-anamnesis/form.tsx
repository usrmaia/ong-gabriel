"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { onSubmit } from "./actions";
import { $Enums } from "@/generated/prisma";
import { useActionState } from "react";

const WHO_LIVES_WITH_OPTIONS: { value: $Enums.WhoLivesWith; label: string }[] =
  [
    { value: "familia", label: "Família" },
    { value: "amigos", label: "Amigos" },
    { value: "outras_pessoas", label: "Outras pessoas" },
    { value: "sozinho", label: "Sozinho(a)" },
  ];

const DIFFICULTIES_BASIC_OPTIONS: {
  value: $Enums.DifficultiesBasic;
  label: string;
}[] = [
  { value: "sim", label: "Sim" },
  { value: "as_vezes", label: "Às vezes" },
  { value: "nao", label: "Não" },
];

const EMOTIONAL_STATE_OPTIONS: {
  value: $Enums.EmotionalState;
  label: string;
}[] = [
  { value: "feliz", label: "Feliz" },
  { value: "neutro", label: "Neutro" },
  { value: "triste", label: "Triste" },
  { value: "raiva", label: "Raiva" },
  { value: "ansioso", label: "Ansioso(a)" },
  { value: "choroso", label: "Choroso(a)" },
];

const DIFFICULTIES_SLEEPING_OPTIONS = DIFFICULTIES_BASIC_OPTIONS;
const DIFFICULTIES_EATING_OPTIONS = DIFFICULTIES_BASIC_OPTIONS;

export function PatientFormAnamnesis() {
  const [selected, setSelected] = useState<string[]>([]);
  const [state, formAction] = useActionState(onSubmit, {
    success: false,
    error: { errors: [] },
  });
  const [loading, setLoading] = useState(false);
  const [difficultiesBasic, setDifficultiesBasic] = useState<string>("");
  const [difficultiesSleeping, setDifficultiesSleeping] = useState<string>("");
  const [difficultiesEating, setDifficultiesEating] = useState<string>("");
  const [emotionalState, setEmotionalState] = useState<string>("");

  const handleCheckbox = (value: string) => {
    if (selected.includes(value)) {
      setSelected(selected.filter((v) => v !== value));
    } else {
      setSelected([...selected, value]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("whoLivesWith", JSON.stringify(selected));
    formData.append("difficultiesBasic", difficultiesBasic);
    formData.append("difficultiesSleeping", difficultiesSleeping);
    formData.append("difficultiesEating", difficultiesEating);
    formData.append("emotionalState", emotionalState);
    const result = await onSubmit(state, formData);
    // setState(result);
    setLoading(false);
    // if (result.success) setStep(step + 1); // Avança para próxima etapa
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center w-full">
      <h3 className="text-center">Como está seu financeiro?</h3>

      <section className="flex w-full flex-col items-center gap-8 p-4 mt-8">
        <div className="grid w-full max-w-sm items-center gap-3">
          <p className="text-lg font-bold mb-4">Com quem você mora?</p>
          <div className="flex flex-col gap-3 w-full max-w-sm">
            {WHO_LIVES_WITH_OPTIONS.map((opt) => (
              <label key={opt.value} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="whoLivesWith"
                  value={opt.value}
                  checked={selected.includes(opt.value)}
                  onChange={() => handleCheckbox(opt.value)}
                  className="accent-primary"
                />
                {opt.label}
              </label>
            ))}
          </div>
          <span className="text-xs text-red-500 mt-2">
            {state.error?.properties?.whoLivesWith?.errors}
          </span>

          <div className="flex flex-col gap-3 w-full max-w-sm">
            <div className="flex justify-between items-center">
              <Label htmlFor="occupation" className="font-semibold">
                Qual sua ocupação atual?
              </Label>
            </div>
            <Input
              type="text"
              id="occupation"
              name="occupation"
              placeholder="Ex.: autônomo(a), estudante, etc."
              aria-describedby="occupation-error"
            />
            <span
              id="occupation-error"
              role="alert"
              className="text-xs text-red-500"
            >
              {state.error?.properties?.occupation?.errors}
            </span>
          </div>

          <div className="flex flex-col gap-3 w-full max-w-sm">
            <div className="flex justify-between items-center">
              <Label htmlFor="monthlyIncomeCents" className="font-semibold">
                Qual a sua renda mensal?
              </Label>
            </div>
            <Input
              type="text"
              id="monthlyIncomeCents"
              name="monthlyIncomeCents"
              placeholder="Ex.: R$ 2000,00"
              aria-describedby="monthlyIncomeCents-error"
            />
            <span
              id="monthlyIncomeCents-error"
              role="alert"
              className="text-xs text-red-500"
            >
              {state.error?.properties?.monthlyIncomeCents?.errors}
            </span>
          </div>

          <div className="flex flex-col gap-3 w-full max-w-sm">
            <div className="flex justify-between items-center">
              <Label
                htmlFor="monthlyFamilyIncomeCents"
                className="font-semibold"
              >
                Qual a sua renda familiar?
              </Label>
            </div>
            <Input
              type="text"
              id="monthlyFamilyIncomeCents"
              name="monthlyFamilyIncomeCents"
              placeholder="Ex.: R$ 3000,00"
              aria-describedby="monthlyFamilyIncomeCents-error"
            />
            <span
              id="monthlyFamilyIncomeCents-error"
              role="alert"
              className="text-xs text-red-500"
            >
              {state.error?.properties?.monthlyFamilyIncomeCents?.errors}
            </span>
          </div>

          <div className="flex flex-col gap-3 w-full max-w-sm">
            <div className="flex justify-between items-center">
              <Label htmlFor="expenses" className="font-semibold">
                Você tem dificuldades para atender às necessidades básicas?
              </Label>
            </div>
            {DIFFICULTIES_BASIC_OPTIONS.map((opt) => (
              <label key={opt.value} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="difficultiesBasic"
                  value={opt.value}
                  checked={difficultiesBasic === opt.value}
                  onChange={() => setDifficultiesBasic(opt.value)}
                />
                {opt.label}
              </label>
            ))}
          </div>

          <div className="flex flex-col gap-3 w-full max-w-sm">
            <div className="flex justify-between items-center">
              <Label htmlFor="socialBenefits" className="font-semibold">
                Recebe algum benefício do governo ou apoio social? Se sim,
                descreva!
              </Label>
            </div>
            <Input
              type="text"
              id="socialBenefits"
              name="socialBenefits"
              placeholder="Ex.: Sim, Bolsa Família"
              aria-describedby="socialBenefits-error"
            />
            <span
              id="socialBenefits-error"
              role="alert"
              className="text-xs text-red-500"
            >
              {state.error?.properties?.socialBenefits?.errors}
            </span>
          </div>
        </div>
      </section>

      <h3 className="text-center">Como está seu momento emocional?</h3>

      <section className="flex w-full flex-col items-center gap-8 p-4 mt-8">
        <div className="grid w-full max-w-sm items-center gap-3">
          <div className="flex justify-between items-center">
            <Label htmlFor="full_name" className="font-semibold">
              Como você descreveria seu estado emocional nos últimos dias?
            </Label>
          </div>
        </div>
        <div className="flex flex-col gap-3 w-full max-w-sm">
          {EMOTIONAL_STATE_OPTIONS.map((opt) => (
            <label key={opt.value} className="flex items-center gap-2">
              <input
                type="radio"
                name="emotionalState"
                value={opt.value}
                checked={emotionalState === opt.value}
                onChange={() => setEmotionalState(opt.value)}
              />
              {opt.label}
            </label>
          ))}
        </div>

        <div className="grid w-full max-w-sm items-center gap-3">
          <div className="flex justify-between items-center">
            <Label htmlFor="name" className="font-semibold">
              Você tem tido dificuldades para dormir?
            </Label>
          </div>
          {DIFFICULTIES_SLEEPING_OPTIONS.map((opt) => (
            <label key={opt.value} className="flex items-center gap-2">
              <input
                type="radio"
                name="difficultiesSleeping"
                value={opt.value}
                checked={difficultiesSleeping === opt.value}
                onChange={() => setDifficultiesSleeping(opt.value)}
              />
              {opt.label}
            </label>
          ))}
        </div>

        <div className="grid w-full max-w-sm items-center gap-3">
          <div className="flex justify-between items-center">
            <Label htmlFor="name" className="font-semibold">
              Dificuldade para se alimentar?
            </Label>
          </div>
          {DIFFICULTIES_EATING_OPTIONS.map((opt) => (
            <label key={opt.value} className="flex items-center gap-2">
              <input
                type="radio"
                name="difficultiesEating"
                value={opt.value}
                checked={difficultiesEating === opt.value}
                onChange={() => setDifficultiesEating(opt.value)}
              />
              {opt.label}
            </label>
          ))}
        </div>
        <span className="text-xs text-red-500 mt-2">
          {state.error?.properties?.difficultiesBasic?.errors}
        </span>

        <div className="grid w-full max-w-sm items-center gap-3">
          <div className="flex justify-between items-center">
            <Label htmlFor="name" className="font-semibold">
              Você já sentiu que não consegue lidar com os seus problemas?
            </Label>
          </div>
          <Input
            type="text"
            id="canNotDealWithProblems"
            name="canNotDealWithProblems"
            placeholder="Descreva brevemente"
            aria-describedby="canNotDealWithProblems-error"
          />
          <span
            id="canNotDealWithProblems-error"
            role="alert"
            className="text-xs text-red-500"
          >
            {state.error?.properties?.canNotDealWithProblems?.errors}
          </span>
        </div>

        <div className="grid w-full max-w-sm items-center gap-3">
          <div className="flex justify-between items-center">
            <Label htmlFor="name" className="font-semibold">
              Já pensou em machucar a si mesmo?
            </Label>
          </div>
          <Input
            type="text"
            id="selfDestructiveThoughts"
            name="selfDestructiveThoughts"
            placeholder="Descreva brevemente"
            aria-describedby="selfDestructiveThoughts-error"
          />
          <span
            id="selfDestructiveThoughts-error"
            role="alert"
            className="text-xs text-red-500"
          >
            {state.error?.properties?.selfDestructiveThoughts?.errors}
          </span>
        </div>
      </section>

      <h3 className="text-center">Qual a sua rede de apoio?</h3>

      <section className="flex w-full flex-col items-center gap-8 p-4 mt-8">
        <div className="grid w-full max-w-sm items-center gap-3">
          <div className="flex justify-between items-center">
            <Label htmlFor="haveSomeoneToTrust" className="font-semibold">
              Você tem alguém com quem confiar e conversar?
            </Label>
          </div>
          <Input
            type="text"
            id="haveSomeoneToTrust"
            name="haveSomeoneToTrust"
            placeholder="Ex.: amigos, familiares, terapeuta, etc."
            aria-describedby="haveSomeoneToTrust-error"
          />
          <span
            id="haveSomeoneToTrust-error"
            role="alert"
            className="text-xs text-red-500"
          >
            {state.error?.properties?.haveSomeoneToTrust?.errors}
          </span>
        </div>

        <div className="grid w-full max-w-sm items-center gap-3">
          <div className="flex justify-between items-center">
            <Label htmlFor="haveEmotionalSupport" className="font-semibold">
              Entre familiares ou amigos, há alguém que te apoie emocionalmente?
            </Label>
          </div>
          <Input
            type="text"
            id="haveEmotionalSupport"
            name="haveEmotionalSupport"
            placeholder="Descreva brevemente"
            aria-describedby="haveEmotionalSupport-error"
          />
          <span
            id="haveEmotionalSupport-error"
            role="alert"
            className="text-xs text-red-500"
          >
            {state.error?.properties?.haveEmotionalSupport?.errors}
          </span>
        </div>

        <div className="grid w-full max-w-sm items-center gap-3">
          <div className="flex justify-between items-center">
            <Label htmlFor="haveFinancialSupport" className="font-semibold">
              Algum familiar ou amigo te apoia financeiramente?
            </Label>
          </div>
          <Input
            type="text"
            id="haveFinancialSupport"
            name="haveFinancialSupport"
            placeholder="Descreva brevemente"
            aria-describedby="haveFinancialSupport-error"
          />
          <span
            id="haveFinancialSupport-error"
            role="alert"
            className="text-xs text-red-500"
          >
            {state.error?.properties?.haveFinancialSupport?.errors}
          </span>
        </div>
      </section>

      <h3 className="text-center">Como está sua saúde?</h3>

      <section className="flex w-full flex-col items-center gap-8 p-4 mt-8">
        <div className="grid w-full max-w-sm items-center gap-3">
          <div className="flex justify-between items-center">
            <Label htmlFor="hasMedicalDiagnosis" className="font-semibold">
              Você tem algum diagnóstico de saúde (física ou mental) feito por
              um médico?
            </Label>
          </div>
          <Input
            type="text"
            id="hasMedicalDiagnosis"
            name="hasMedicalDiagnosis"
            placeholder="Descreva brevemente"
            aria-describedby="hasMedicalDiagnosis-error"
          />
          <span
            id="hasMedicalDiagnosis-error"
            role="alert"
            className="text-xs text-red-500"
          >
            {state.error?.properties?.hasMedicalDiagnosis?.errors}
          </span>
        </div>

        <div className="grid w-full max-w-sm items-center gap-3">
          <div className="flex justify-between items-center">
            <Label
              htmlFor="currentlyUndergoingPsychTreatment"
              className="font-semibold"
            >
              Já acompanha ou trata com psicológico/psiquiátrico atualmente?
            </Label>
          </div>
          <Input
            type="text"
            id="currentlyUndergoingPsychTreatment"
            name="currentlyUndergoingPsychTreatment"
            placeholder="Descreva brevemente"
            aria-describedby="currentlyUndergoingPsychTreatment-error"
          />
          <span
            id="currentlyUndergoingPsychTreatment-error"
            role="alert"
            className="text-xs text-red-500"
          >
            {state.error?.properties?.currentlyUndergoingPsychTreatment?.errors}
          </span>
        </div>

        <div className="grid w-full max-w-sm items-center gap-3">
          <div className="flex justify-between items-center">
            <Label
              htmlFor="currentlyTakingMedication"
              className="font-semibold"
            >
              Usa algum tipo de medicamento?
            </Label>
          </div>
          <Input
            type="text"
            id="currentlyTakingMedication"
            name="currentlyTakingMedication"
            placeholder="Descreva brevemente"
            aria-describedby="currentlyTakingMedication-error"
          />
          <span
            id="currentlyTakingMedication-error"
            role="alert"
            className="text-xs text-red-500"
          >
            {state.error?.properties?.currentlyTakingMedication?.errors}
          </span>
        </div>
      </section>

      <Button className="w-screen max-w-sm mt-8" type="submit">
        Continuar
      </Button>
    </form>
  );
}
