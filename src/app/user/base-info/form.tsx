"use client";

import { onSubmit } from "./actions";
import { Button } from "@/components/ui";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "@/generated/prisma";
import { useActionState } from "react";

interface UserBaseInfoFormProps {
  user: User;
}

export function UserBaseInfoForm({ user }: UserBaseInfoFormProps) {
  const [state, formAction] = useActionState(onSubmit, {
    success: false,
    error: { errors: [] },
  });

  return (
    <form action={formAction} className="flex flex-col items-center w-full">
      <h3 className="text-center">
        Olá, {state.data?.name || user?.name}, conte mais sobre você!
      </h3>

      <section className="flex w-full flex-col items-center gap-8 p-4 mt-8">
        <div className="grid w-full max-w-sm items-center gap-3">
          <div className="flex justify-between items-center">
            <Label
              htmlFor="full_name"
              className="font-semibold text-foreground"
            >
              Qual o seu nome completo?
            </Label>
            <span className="text-xs">*Obrigatório</span>
          </div>
          <Input
            type="text"
            id="full_name"
            name="full_name"
            placeholder="Nome completo"
            defaultValue={
              state.data?.full_name ||
              user?.full_name ||
              user?.name ||
              undefined
            }
            aria-describedby="full_name-error"
          />
          <span
            id="full_name-error"
            role="alert"
            className="text-xs text-error h-2"
          >
            {state.error?.properties?.full_name?.errors}
          </span>
        </div>

        <div className="grid w-full max-w-sm items-center gap-3">
          <div className="flex justify-between items-center">
            <Label htmlFor="name" className="font-semibold text-foreground">
              Como devemos chamar você?
            </Label>
            <span className="text-xs">*Obrigatório</span>
          </div>
          <Input
            type="text"
            id="name"
            name="name"
            placeholder="Nome social"
            defaultValue={state.data?.name || user?.name || undefined}
            aria-describedby="name-error"
          />
          <span id="name-error" role="alert" className="text-xs text-error h-2">
            {state.error?.properties?.name?.errors}
          </span>
        </div>

        <div className="grid w-full max-w-sm items-center gap-3">
          <div className="flex justify-between items-center">
            <Label
              htmlFor="date_of_birth"
              className="font-semibold text-foreground"
            >
              Data de nascimento
            </Label>
            <span className="text-xs">*Obrigatório</span>
          </div>
          <Input
            type="date"
            id="date_of_birth"
            name="date_of_birth"
            placeholder="DD/MM/AAAA"
            defaultValue={
              state.data?.date_of_birth
                ? new Date(state.data?.date_of_birth)
                    .toISOString()
                    .split("T")[0]
                : user?.date_of_birth?.toISOString().split("T")[0] || undefined
            }
            aria-describedby="date_of_birth-error"
          />
          <span
            id="date_of_birth-error"
            role="alert"
            className="text-xs text-error h-2"
          >
            {state.error?.properties?.date_of_birth?.errors}
          </span>
        </div>

        <div className="grid w-full max-w-sm items-center gap-3">
          <div className="flex justify-between items-center">
            <Label htmlFor="phone" className="font-semibold text-foreground">
              Qual o seu número de telefone?
            </Label>
            <span className="text-xs">*Obrigatório</span>
          </div>
          <Input
            type="tel"
            id="phone"
            name="phone"
            placeholder="(99) 9 9999-9999"
            defaultValue={state.data?.phone || user?.phone || undefined}
            aria-describedby="phone-error"
            pattern="[\(\)\s\-\+\d]+"
          />
          <span
            id="phone-error"
            role="alert"
            className="text-xs text-error h-2"
          >
            {state.error?.properties?.phone?.errors}
          </span>
        </div>
      </section>
      <Button className="w-screen max-w-sm mt-8" type="submit">
        Continuar
      </Button>
    </form>
  );
}
