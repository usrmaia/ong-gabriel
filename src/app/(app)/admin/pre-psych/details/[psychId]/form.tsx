"use client";

import { Psych, PsychStatus } from "@prisma/client";
import { useActionState, useState } from "react";

import { onSubmit } from "./actions";
import {
  Button,
  Label,
  RadioGroup,
  RadioGroupItem,
  Textarea,
} from "@/components/ui";
import { useScrollToTop } from "@/hooks";

export function PrePsychDetailsForm({ psych }: { psych: Psych }) {
  const [state, formAction] = useActionState(onSubmit, {
    data: psych,
    success: false,
    error: { errors: [] },
  });

  const isCandidate = state.data?.status !== PsychStatus.APPROVED;

  const handleSubmit = (formData: FormData) => {
    formData.append("id", psych.id);
    formAction(formData);
  };

  const [requiredPendingNote, setRequiredPendingNote] = useState(
    state.data?.status &&
      !(
        state.data.status === PsychStatus.ADJUSTMENT ||
        state.data.status === PsychStatus.FAILED
      ),
  );

  useScrollToTop(state.success);

  return (
    <form
      action={handleSubmit}
      className="flex flex-col gap-4 font-poppins text-s-charcoal-100"
    >
      <p>Profissional foi entrevistado?</p>
      <RadioGroup
        name="interviewed"
        defaultValue={psych.interviewed.toString()}
        className="flex gap-4"
      >
        <div className="flex gap-2 items-center">
          <RadioGroupItem value="true" id="yesInterviewed" />
          <Label htmlFor="yesInterviewed">Sim</Label>
        </div>
        <div className="flex gap-2 items-center">
          <RadioGroupItem value="false" id="noInterviewed" />
          <Label htmlFor="noInterviewed">Não</Label>
        </div>
      </RadioGroup>
      <span
        id="interviewed-error"
        role="alert"
        className="text-xs text-error h-2"
      >
        {state.error?.properties?.interviewed?.errors}
      </span>

      <div>
        <p className="mb-2">
          {state.data?.evaluatedAt
            ? "Status da avaliação"
            : "Aprovar candidatura?"}
        </p>
        <RadioGroup
          name="status"
          defaultValue={psych.status.toString()}
          onValueChange={(value) =>
            setRequiredPendingNote(
              value === PsychStatus.ADJUSTMENT || value === PsychStatus.FAILED,
            )
          }
          className="flex gap-8"
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem value={PsychStatus.APPROVED} id="yesstatus" />
            <Label htmlFor="yesstatus">Sim</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value={PsychStatus.FAILED} id="nostatus" />
            <Label htmlFor="nostatus">Não</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem
              value={PsychStatus.ADJUSTMENT}
              id="adjustmentstatus"
            />
            <Label htmlFor="adjustmentstatus">Ajuste</Label>
          </div>
        </RadioGroup>
        <span id="status-error" role="alert" className="text-xs text-error h-2">
          {state.error?.properties?.status?.errors}
        </span>
      </div>

      {requiredPendingNote && (
        <>
          <Label
            id="pendingNote-label"
            htmlFor="pendingNote"
            className="text-foreground"
          >
            Motivo
          </Label>
          <Textarea
            id="pendingNote"
            name="pendingNote"
            placeholder="Descreva o motivo da pendência ou reprovação"
            rows={4}
            maxLength={2048}
            defaultValue={state.data?.pendingNote || undefined}
          />
          <span
            id="pendingNote-error"
            role="alert"
            className="text-xs text-error h-2"
          >
            {state.error?.properties?.pendingNote?.errors}
          </span>
        </>
      )}
      <Button
        variant="outline"
        className="mt-4 text-s-brass-300 border-s-graphite-100 hover:bg-[#fdeddd]"
        disabled={!isCandidate || !!state.data?.evaluatedAt}
      >
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
