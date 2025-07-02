"use client";

import React, { startTransition, useActionState, useState } from "react";

import { onSubmit } from "./actions";
import {
  Button,
  Checkbox,
  Input,
  Label,
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui";
import { $Enums } from "@/generated/prisma";

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
  icon: string;
  label: string;
}[] = [
  { value: "feliz", icon: "🙂", label: "Feliz" },
  { value: "neutro", icon: "😐", label: "Neutro" },
  { value: "triste", icon: "🙁", label: "Triste" },
  { value: "raiva", icon: "😡", label: "Raiva" },
  { value: "ansioso", icon: "😟", label: "Ansioso" },
  { value: "choroso", icon: "😭", label: "Choroso" },
];

const DIFFICULTIES_SLEEPING_OPTIONS = DIFFICULTIES_BASIC_OPTIONS;
const DIFFICULTIES_EATING_OPTIONS = DIFFICULTIES_BASIC_OPTIONS;

export function PatientFormAnamnesis() {
  const [state, formAction] = useActionState(onSubmit, {
    success: false,
    error: { errors: [] },
  });
  const [whoLivesWith, setWhoLivesWith] = useState<string[]>([]);
  const [emotionalState, setEmotionalState] = useState<string>("");

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    formData.append("whoLivesWith", whoLivesWith.join(","));
    console.log("Form Data:", Object.fromEntries(formData.entries()));
    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <form
      onSubmit={handleFormSubmit}
      className="flex flex-col items-center w-full"
    >
      <h3 className="text-center">Como está seu financeiro?</h3>

      <section className="flex w-full flex-col items-center gap-8 p-4 mt-4">
        <div className="grid w-full max-w-sm items-center gap-3">
          <div className="flex justify-between items-center">
            <Label
              htmlFor="whoLivesWith"
              className="font-semibold text-foreground"
            >
              Com quem você mora?
            </Label>
          </div>
          <div className="flex flex-col gap-3 w-full max-w-sm">
            <div className="flex flex-col gap-4">
              {WHO_LIVES_WITH_OPTIONS.map((opt) => (
                <div key={opt.value} className="flex items-center gap-2">
                  <Checkbox
                    name="whoLivesWith"
                    value={opt.value}
                    checked={whoLivesWith.includes(opt.value)}
                    onCheckedChange={(checked: boolean) => {
                      if (checked) {
                        setWhoLivesWith((prev) => [...prev, opt.value]);
                      } else {
                        setWhoLivesWith((prev) =>
                          prev.filter((value) => value !== opt.value),
                        );
                      }
                    }}
                  />
                  <Label htmlFor={opt.value}>{opt.label}</Label>
                </div>
              ))}
            </div>
          </div>
          <span
            id="whoLivesWith-error"
            role="alert"
            className="text-xs text-error h-2"
          >
            {state.error?.properties?.whoLivesWith?.errors}
          </span>

          <div className="flex flex-col gap-3 w-full max-w-sm">
            <div className="flex justify-between items-center">
              <Label
                htmlFor="occupation"
                className="font-semibold text-foreground"
              >
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
              className="text-xs text-error h-2"
            >
              {state.error?.properties?.occupation?.errors}
            </span>
          </div>

          <div className="flex flex-col gap-3 w-full max-w-sm">
            <div className="flex justify-between items-center">
              <Label
                htmlFor="monthlyIncomeCents"
                className="font-semibold text-foreground"
              >
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
              className="text-xs text-error h-2"
            >
              {state.error?.properties?.monthlyIncomeCents?.errors}
            </span>
          </div>

          <div className="flex flex-col gap-3 w-full max-w-sm">
            <div className="flex justify-between items-center">
              <Label
                htmlFor="monthlyFamilyIncomeCents"
                className="font-semibold text-foreground"
              >
                Qual a sua renda familiar?
              </Label>
            </div>
            <Input
              type="text"
              id="monthlyFamilyIncomeCents"
              name="monthlyFamilyIncomeCents"
              placeholder="Ex.: R$ 4000,00"
              aria-describedby="monthlyFamilyIncomeCents-error"
            />
            <span
              id="monthlyFamilyIncomeCents-error"
              role="alert"
              className="text-xs text-error h-2"
            >
              {state.error?.properties?.monthlyFamilyIncomeCents?.errors}
            </span>
          </div>

          <div className="flex flex-col gap-3 w-full max-w-sm">
            <div className="flex flex-col gap-1">
              <Label
                htmlFor="difficultiesBasic"
                className="font-semibold text-foreground items-center"
              >
                Você tem dificuldades para atender às necessidades básicas?
              </Label>
              <span>
                <Label className="font-poppins text-xs text-s-liver-100">
                  Ex.: moradia, alimentação, transporte, etc
                </Label>
              </span>
            </div>
            <RadioGroup
              name="difficultiesBasic"
              className="flex flex-row justify-between"
            >
              {DIFFICULTIES_BASIC_OPTIONS.map((opt) => (
                <div key={opt.value} className="flex items-center gap-2">
                  <RadioGroupItem value={opt.value} />
                  <Label htmlFor={opt.value}>{opt.label}</Label>
                </div>
              ))}
            </RadioGroup>
            <span
              id="difficultiesBasic-error"
              role="alert"
              className="text-xs text-error h-2"
            >
              {state.error?.properties?.difficultiesBasic?.errors}
            </span>
          </div>

          <div className="flex flex-col gap-3 w-full max-w-sm mt-2">
            <div className="flex justify-between items-center">
              <Label
                htmlFor="socialBenefits"
                className="font-semibold text-foreground"
              >
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
              className="text-xs text-error h-2"
            >
              {state.error?.properties?.socialBenefits?.errors}
            </span>
          </div>
        </div>
      </section>

      <h3 className="text-center">Como está seu momento emocional?</h3>

      <section className="flex w-full flex-col items-center gap-8 p-4 mt-4">
        <div className="flex flex-col gap-3 w-full max-w-sm">
          <div className="flex flex-col gap-1 items-center">
            <Label
              htmlFor="full_name"
              className="font-semibold text-foreground"
            >
              Como você descreveria seu estado emocional nos últimos dias?
            </Label>
          </div>
          <RadioGroup
            name="emotionalState"
            onValueChange={setEmotionalState}
            className="flex flex-row justify-between"
          >
            {EMOTIONAL_STATE_OPTIONS.map((opt) => (
              <div key={opt.value}>
                <RadioGroupItem
                  id={opt.value}
                  value={opt.value}
                  className="sr-only"
                />
                <Label
                  htmlFor={opt.value}
                  // className="flex flex-col items-center gap-2 w-14 p-2 rounded-md cursor-pointer transition-all bg-s-azure-web-100 hover:bg-s-azure-web-200 focus-visible:bg-primary focus-visible:text-primary-foreground focus-visible:shadow-lg focus-visible:scale-105 focus-visible:border-2 focus-visible:border-primary"
                  className={`flex flex-col items-center gap-2 w-14 p-2 rounded-md cursor-pointer transition-all ${
                    emotionalState === opt.value
                      ? "bg-primary text-primary-foreground shadow-md scale-100 border border-p-xanthous"
                      : "bg-s-azure-web-100 hover:bg-s-azure-web-200"
                  }`}
                >
                  <span className="w-6 h-6 flex items-center justify-center text-2xl">
                    {opt.icon}
                  </span>
                  <Label className="text-xs">{opt.label}</Label>
                </Label>
              </div>
            ))}
          </RadioGroup>
          <span
            id="emotionalState-error"
            role="alert"
            className="text-xs text-error h-2"
          >
            {state.error?.properties?.emotionalState?.errors}
          </span>
        </div>

        <div className="flex flex-col gap-3 w-full max-w-sm">
          <div className="flex flex-col gap-1">
            <Label
              htmlFor="difficultiesSleeping"
              className="font-semibold text-foreground"
            >
              Você tem tido dificuldades para dormir?
            </Label>
          </div>
          <RadioGroup
            name="difficultiesSleeping"
            className="flex flex-row justify-between"
          >
            {DIFFICULTIES_SLEEPING_OPTIONS.map((opt) => (
              <div key={opt.value} className="flex items-center gap-2">
                <RadioGroupItem value={opt.value} />
                <Label>{opt.label}</Label>
              </div>
            ))}
          </RadioGroup>
          <span
            id="difficultiesSleeping-error"
            role="alert"
            className="text-xs text-error h-2"
          >
            {state.error?.properties?.difficultiesSleeping?.errors}
          </span>
        </div>

        <div className="flex flex-col gap-3 w-full max-w-sm">
          <div className="flex flex-col gap-1">
            <Label htmlFor="name" className="font-semibold text-foreground">
              Dificuldade para se alimentar?
            </Label>
          </div>
          <RadioGroup
            name="difficultyEating"
            className="flex flex-row justify-between"
          >
            {DIFFICULTIES_EATING_OPTIONS.map((opt) => (
              <div key={opt.value} className="flex items-center gap-2">
                <RadioGroupItem value={opt.value} />
                <Label>{opt.label}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        <span
          id="difficultyEating-error"
          role="alert"
          className="text-xs text-error h-2"
        >
          {state.error?.properties?.difficultyEating?.errors}
        </span>

        <div className="flex flex-col gap-3 w-full max-w-sm">
          <div className="flex justify-between items-center">
            <Label
              htmlFor="canNotDealWithProblems"
              className="font-semibold text-foreground"
            >
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
            className="text-xs text-error h-2"
          >
            {state.error?.properties?.canNotDealWithProblems?.errors}
          </span>
        </div>

        <div className="flex flex-col gap-3 w-full max-w-sm">
          <div className="flex justify-between items-center">
            <Label
              htmlFor="selfDestructiveThoughts"
              className="font-semibold text-foreground"
            >
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
            className="text-xs text-error h-2"
          >
            {state.error?.properties?.selfDestructiveThoughts?.errors}
          </span>
        </div>
      </section>

      <h3 className="text-center">Qual a sua rede de apoio?</h3>

      <section className="flex w-full flex-col items-center gap-8 p-4 mt-4">
        <div className="flex flex-col gap-3 w-full max-w-sm">
          <div className="flex justify-between items-center">
            <Label
              htmlFor="haveSomeoneToTrust"
              className="font-semibold text-foreground"
            >
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
            className="text-xs text-error h-2"
          >
            {state.error?.properties?.haveSomeoneToTrust?.errors}
          </span>
        </div>

        <div className="flex flex-col gap-3 w-full max-w-sm">
          <div className="flex justify-between items-center">
            <Label
              htmlFor="haveEmotionalSupport"
              className="font-semibold text-foreground"
            >
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
            className="text-xs text-error h-2"
          >
            {state.error?.properties?.haveEmotionalSupport?.errors}
          </span>
        </div>

        <div className="flex flex-col gap-3 w-full max-w-sm">
          <div className="flex justify-between items-center">
            <Label
              htmlFor="haveFinancialSupport"
              className="font-semibold text-foreground"
            >
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
            className="text-xs text-error h-2"
          >
            {state.error?.properties?.haveFinancialSupport?.errors}
          </span>
        </div>
      </section>

      <h3 className="text-center">Como está sua saúde?</h3>

      <section className="flex w-full flex-col items-center gap-8 p-4 mt-4">
        <div className="flex flex-col gap-3 w-full max-w-sm">
          <div className="flex justify-between items-center">
            <Label
              htmlFor="hasMedicalDiagnosis"
              className="font-semibold text-foreground"
            >
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
            className="text-xs text-error h-2"
          >
            {state.error?.properties?.hasMedicalDiagnosis?.errors}
          </span>
        </div>

        <div className="flex flex-col gap-3 w-full max-w-sm">
          <div className="flex justify-between items-center">
            <Label
              htmlFor="currentlyUndergoingPsychTreatment"
              className="font-semibold text-foreground"
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
            className="text-xs text-error h-2"
          >
            {state.error?.properties?.currentlyUndergoingPsychTreatment?.errors}
          </span>
        </div>

        <div className="flex flex-col gap-3 w-full max-w-sm">
          <div className="flex justify-between items-center">
            <Label
              htmlFor="currentlyTakingMedication"
              className="font-semibold text-foreground"
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
            className="text-xs text-error h-2"
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
