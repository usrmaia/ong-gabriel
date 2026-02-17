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
  const [state, formAction] = useActionState(
    onSubmit.bind(null, patientAttendance.id),
    {
      data: patientAttendance,
      success: false,
      error: { errors: [] },
    },
  );

  return (
    <form action={formAction} className="flex flex-col gap-3">
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
        disabled
      />

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
        disabled
      />

      <Label htmlFor="feedback" className="font-semibold text-foreground">
        Feedback
      </Label>
      <Textarea
        id="feedback"
        name="feedback"
        defaultValue={state.data?.feedback || undefined}
        onClick={autoResizeTextarea}
        onInput={autoResizeTextarea}
      />
      <span id="feedback-error" role="alert" className="text-xs text-error h-2">
        {state.error?.properties?.feedback?.errors}
      </span>

      <Button type="submit" className="mt-2">
        Salvar feedback
      </Button>

      <span role="alert" className="text-xs text-center h-2 p-2">
        {state.error?.errors ? (
          <span className="text-error">{state.error.errors}</span>
        ) : state.success ? (
          <span className="text-success">Feedback salvo com sucesso!</span>
        ) : undefined}
      </span>
    </form>
  );
}
