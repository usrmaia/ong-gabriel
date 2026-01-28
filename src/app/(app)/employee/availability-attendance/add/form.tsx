"use client";

import { startTransition, useActionState, useState } from "react";

import { onSubmit, WorkingHours } from "./actions";
import {
  Button,
  Input,
  Label,
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui";
import { X } from "lucide-react";

export type AvailabilityType = "singlePeriod" | "fullPeriod";

export function AddAvailabilityAttendanceForm() {
  const [selectedPeriod, setSelectedPeriod] =
    useState<AvailabilityType>("singlePeriod");
  const [workingHoursList, setWorkingHours] = useState<WorkingHours[]>([
    { startTime: "", endTime: "" },
  ]);

  const [state, formAction] = useActionState(onSubmit, {
    success: false,
    error: { errors: [] },
  });

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    formData.append("workingHoursList", JSON.stringify(workingHoursList));
    startTransition(() => formAction(formData));
  };

  return (
    <form
      onSubmit={handleFormSubmit}
      className="flex flex-col items-center w-full"
    >
      <div className="flex flex-col gap-4 my-4">
        <p className="font-young text-sm">
          <strong>
            Você quer selecionar um dia específico ou um periodo completo entre
            dias distintos?
          </strong>
        </p>

        <div className="flex justify-between">
          <RadioGroup
            value={selectedPeriod}
            onValueChange={(value) =>
              setSelectedPeriod(value as AvailabilityType)
            }
            className="flex gap-4"
          >
            <div className="flex gap-2 items-center">
              <RadioGroupItem value="singlePeriod" id="singlePeriod" />
              <Label htmlFor="singlePeriod">Data única</Label>
            </div>
            <div className="flex gap-2 items-center">
              <RadioGroupItem value="fullPeriod" id="fullPeriod" />
              <Label htmlFor="fullPeriod">Período completo</Label>
            </div>
          </RadioGroup>
        </div>
      </div>

      <div className="flex flex-col justify-between gap-4 mt-6 w-full">
        <div className="flex flex-col gap-3">
          <div className="flex justify-between">
            <Label
              htmlFor="startDate"
              className="font-semibold text-foreground"
            >
              {selectedPeriod === "singlePeriod" ? "Data" : "Data inicial"}
            </Label>
            <span className="text-xs">*Obrigatório</span>
          </div>
          <Input id="startDate" type="date" name="startDate" required />
        </div>

        {selectedPeriod === "fullPeriod" && (
          <div className="flex flex-col gap-3">
            <div className="flex justify-between">
              <Label
                htmlFor="endDate"
                className="font-semibold text-foreground"
              >
                Data final
              </Label>
              <span className="text-xs">*Obrigatório</span>
            </div>
            <Input id="endDate" type="date" name="endDate" required />
          </div>
        )}
      </div>

      <div className="flex flex-col w-full mt-6 gap-4">
        {workingHoursList.map((time, index) => (
          <div
            key={index}
            className="relative flex flex-col gap-2 w-full border border-s-azure-100 rounded-2xl px-4 py-6"
          >
            <p className="font-young-serif text-s-midnight-100 text-xl mb-1">
              Horário Disponível
            </p>
            {workingHoursList.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => {
                  const newTimes = workingHoursList.filter(
                    (_, i) => i !== index,
                  );
                  setWorkingHours(newTimes);
                }}
                className="absolute top-2 right-2 text-error hover:text-error hover:bg-error/10"
              >
                <X />
              </Button>
            )}

            <div className="flex justify-between">
              <Label className="font-semibold text-foreground text-nowrap flex-1/3">
                Hora inicial
              </Label>
              <Input
                id="startTime"
                type="time"
                required
                className="flex-2/3"
                onChange={(e) => {
                  const newTimes = [...workingHoursList];
                  newTimes[index].startTime = e.target.value;
                  setWorkingHours(newTimes);
                }}
              />
            </div>
            <span
              id="startTime-error"
              role="alert"
              className="text-xs text-error h-2"
            >
              {state.error?.items?.[index]?.properties?.startAt?.errors?.[0]}
            </span>

            <div className="flex justify-between">
              <Label className="font-semibold text-foreground text-nowrap flex-1/3">
                Hora final
              </Label>
              <Input
                id="endTime"
                type="time"
                required
                className="flex-2/3"
                onChange={(e) => {
                  const newTimes = [...workingHoursList];
                  newTimes[index].endTime = e.target.value;
                  setWorkingHours(newTimes);
                }}
              />
            </div>
            <span
              id="endTime-error"
              role="alert"
              className="text-xs text-error h-2"
            >
              {state.error?.items?.[index]?.properties?.endAt?.errors?.[0]}
            </span>
          </div>
        ))}
        <Button
          variant="outline"
          className="border-s-graphite-100"
          onClick={() =>
            setWorkingHours(
              workingHoursList.concat([{ startTime: "", endTime: "" }]),
            )
          }
        >
          Adicionar Horário
        </Button>
      </div>
      <Button type="submit" className="w-full mt-4">
        Salvar
      </Button>

      <span role="alert" className="text-xs text-center h-2">
        {state.error?.errors ? (
          <span className="text-error">{state.error.errors}</span>
        ) : state.success ? (
          <span className="text-success">Sucesso!</span>
        ) : undefined}
      </span>
    </form>
  );
}
