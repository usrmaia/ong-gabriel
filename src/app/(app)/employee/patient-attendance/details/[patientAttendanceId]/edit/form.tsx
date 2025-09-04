"use client";

import { format } from "date-fns";
import { TZDateMini } from "@date-fns/tz";
import { useActionState } from "react";
import { PatientAttendance, User } from "@prisma/client";

import { onSubmit } from "./actions";
import {
  autoResizeTextarea,
  Button,
  Input,
  Label,
  Textarea,
} from "@/components/ui";
export function PatientAttendanceEditForm({
  patientAttendance,
}: {
  patientAttendance: PatientAttendance & { patient: User };
}) {
  const [state, formAction] = useActionState(onSubmit, {
    data: patientAttendance,
    success: false,
    error: { errors: [] },
  });

  const handleSubmit = (formData: FormData) => {
    const dateAtRaw = formData.get("dateAt") as string;
    if (dateAtRaw)
      formData.set("dateAt", new TZDateMini(dateAtRaw, "UTC").toISOString());
    formAction(formData);
  };

  return (
    <form action={handleSubmit} className="flex flex-col gap-3">
      <div className="flex justify-between">
        <Label htmlFor="dateAt" className="font-semibold text-foreground">
          Data
        </Label>
        <span className="text-xs">*Obrigatório</span>
      </div>
      <Input
        id="dateAt"
        type="datetime-local"
        name="dateAt"
        defaultValue={
          state.data?.dateAt
            ? format(
                new TZDateMini(state.data.dateAt, "America/Sao_Paulo"),
                "yyyy-MM-dd'T'HH:mm",
              )
            : undefined
        }
        required
      />
      <span id="dateAt-error" role="alert" className="text-xs text-error h-2">
        {state.error?.properties?.dateAt?.errors}
      </span>

      <Label
        htmlFor="durationMinutes"
        className="font-semibold text-foreground"
      >
        Duração (minutos)
      </Label>
      <Input
        id="durationMinutes"
        type="number"
        name="durationMinutes"
        defaultValue={state.data?.durationMinutes || undefined}
      />
      <span
        id="durationMinutes-error"
        role="alert"
        className="text-xs text-error h-2"
      >
        {state.error?.properties?.durationMinutes?.errors}
      </span>

      <div className="flex justify-between">
        <Label htmlFor="note" className="font-semibold text-foreground">
          Anotações
        </Label>
      </div>
      <Textarea
        id="note"
        name="note"
        defaultValue={state.data?.note || undefined}
        onClick={autoResizeTextarea}
        onInput={autoResizeTextarea}
      />
      <span id="note-error" role="alert" className="text-xs text-error h-2">
        {state.error?.properties?.note?.errors}
      </span>

      <Button type="submit" className="mt-2">
        Salvar alterações
      </Button>

      <span role="alert" className="text-xs text-center h-2 p-2">
        {state.error?.errors ? (
          <span className="text-error">{state.error.errors}</span>
        ) : state.success ? (
          <span className="text-success">Sucesso!</span>
        ) : undefined}
      </span>
    </form>
  );
}
