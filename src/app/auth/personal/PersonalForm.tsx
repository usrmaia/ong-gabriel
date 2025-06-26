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
      <h1 className="text-center">Olá, {user?.name}, conte mais sobre você!</h1>
      <section className="flex w-full flex-col items-center gap-8 p-4 mt-8">
        {/* Name */}
        <div className="grid w-full max-w-sm items-center gap-3">
          <div className="flex justify-between items-center">
            <Label htmlFor="name" className="font-semibold">
              Qual o seu nome completo?
            </Label>
            <span className="text-xs">*Obrigatório</span>
          </div>
          <Input
            type="text"
            id="name"
            name="name"
            placeholder="Nome completo"
            defaultValue={state.data?.name || user?.name || undefined}
          />
          {state.error?.properties?.name && (
            <span className="text-xs text-red-500">
              {state.error.properties.name.errors.toString()}
            </span>
          )}
        </div>

        {/* Apelido */}
        <div className="grid w-full max-w-sm items-center gap-3">
          <Label htmlFor="alias" className="font-semibold">
            Como devemos chamar você?
          </Label>
          <Input
            type="text"
            id="full_name"
            name="full_name"
            placeholder="Nome social"
            defaultValue={state.data?.full_name}
          />
          {state.error?.properties?.full_name && (
            <span className="text-xs text-red-500">
              {state.error.properties.full_name.errors.toString()}
            </span>
          )}
        </div>

        {/* Date of Birth */}
        <div className="grid w-full max-w-sm items-center gap-3">
          <div className="flex justify-between items-center">
            <Label htmlFor="dateBirth" className="font-semibold">
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
          />
          {state.error?.properties?.date_of_birth && (
            <span className="text-xs text-red-500">
              {state.error.properties.date_of_birth.errors[0].toString()}
            </span>
          )}
        </div>

        {/* Phone Number */}
        <div className="grid w-full max-w-sm items-center gap-3">
          <Label htmlFor="phone" className="font-semibold">
            Qual o seu número de telefone?
          </Label>
          <Input
            type="text"
            id="phone"
            name="phone"
            placeholder="Ex.: (99) 9 9999-9999"
            defaultValue={state.data?.phone}
          />
          {state.error?.properties?.phone && (
            <span className="text-xs text-red-500">
              {state.error.properties.phone.errors.toString()}
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
