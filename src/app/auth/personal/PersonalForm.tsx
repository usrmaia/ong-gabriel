"use client";

import { Button } from "@/components/ui";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { onSubmit } from "./actions";
import { User } from "next-auth";
import { useActionState } from "react";

interface PersonalFormProps {
  user: User;
}

export function PersonalForm({ user }: PersonalFormProps) {
  const [state, formAction] = useActionState(onSubmit, {
    success: false,
    error: { errors: [] },
  });

  return (
    <form action={formAction} className="flex flex-col items-center w-full">
      <h1 className="text-center">
        Olá, {state.data?.name || user?.name}, conte mais sobre você!
      </h1>

      <section className="flex w-full flex-col items-center gap-8 p-4 mt-8">
        <div className="grid w-full max-w-sm items-center gap-3">
          <div className="flex justify-between items-center">
            <Label htmlFor="full_name" className="font-semibold">
              Qual o seu nome completo?
            </Label>
            <span className="text-xs">*Obrigatório</span>
          </div>
          <Input
            type="text"
            id="full_name"
            name="full_name"
            placeholder="Nome completo"
            defaultValue={state.data?.full_name}
            aria-describedby="full_name-error"
          />
          {state.error?.properties?.full_name && (
            <span
              id="full_name-error"
              role="alert"
              className="text-xs text-red-500"
            >
              {state.error.properties.full_name.errors}
            </span>
          )}
        </div>

        <div className="grid w-full max-w-sm items-center gap-3">
          <Label htmlFor="name" className="font-semibold">
            Como devemos chamar você?
          </Label>
          <Input
            type="text"
            id="name"
            name="name"
            placeholder="Nome social"
            defaultValue={state.data?.name || user?.name || undefined}
            aria-describedby="name-error"
          />
          {state.error?.properties?.name && (
            <span id="name-error" role="alert" className="text-xs text-red-500">
              {state.error.properties.name.errors}
            </span>
          )}
        </div>

        <div className="grid w-full max-w-sm items-center gap-3">
          <div className="flex justify-between items-center">
            <Label htmlFor="date_of_birth" className="font-semibold">
              Data de nascimento
            </Label>
            <span className="text-xs">*Obrigatório</span>
          </div>
          <Input
            type="date"
            id="date_of_birth"
            name="date_of_birth"
            placeholder="DD/MM/AAAA"
            defaultValue={state.data?.date_of_birth}
            aria-describedby="date_of_birth-error"
          />
          {state.error?.properties?.date_of_birth && (
            <span
              id="date_of_birth-error"
              role="alert"
              className="text-xs text-red-500"
            >
              {state.error.properties.date_of_birth.errors}
            </span>
          )}
        </div>

        <div className="grid w-full max-w-sm items-center gap-3">
          <Label htmlFor="phone" className="font-semibold">
            Qual o seu número de telefone?
          </Label>
          <Input
            type="tel"
            id="phone"
            name="phone"
            placeholder="(99) 9 9999-9999"
            defaultValue={state.data?.phone}
            aria-describedby="phone-error"
            pattern="[\(\)\s\-\+\d]+"
          />
          {state.error?.properties?.phone && (
            <span
              id="phone-error"
              role="alert"
              className="text-xs text-red-500"
            >
              {state.error.properties.phone.errors}
            </span>
          )}
        </div>
      </section>
      <Button className="w-screen max-w-sm mt-8" type="submit">
        Continuar
      </Button>
    </form>
  );
}
