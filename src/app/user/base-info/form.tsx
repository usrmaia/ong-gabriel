"use client";

import { useActionState } from "react";

import { onSubmit } from "./actions";
import { Button } from "@/components/ui";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "@/generated/prisma";

interface UserBaseInfoFormProps {
  user: User;
}

export function UserBaseInfoForm({ user }: UserBaseInfoFormProps) {
  const [state, formAction] = useActionState(onSubmit, {
    data: {
      name: user.name || "",
      full_name: user.full_name || "",
      date_of_birth: user.date_of_birth
        ? typeof user.date_of_birth === "string"
          ? user.date_of_birth
          : user.date_of_birth.toISOString().slice(0, 10)
        : new Date("2000-01-01").toISOString().slice(0, 10),
      phone: user.phone || "",
    },
    success: false,
    error: { errors: [] },
  });

  return (
    <form action={formAction} className="flex flex-col">
      <h3 className="text-center">
        Olá, {state.data?.name}, conte mais sobre você!
      </h3>

      <section className="flex flex-col gap-3 mt-4">
        <div className="flex justify-between items-center">
          <Label htmlFor="full_name" className="font-semibold text-foreground">
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
        <span
          id="full_name-error"
          role="alert"
          className="text-xs text-error h-2"
        >
          {state.error?.properties?.full_name?.errors}
        </span>

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
          defaultValue={state.data?.name}
          aria-describedby="name-error"
        />
        <span id="name-error" role="alert" className="text-xs text-error h-2">
          {state.error?.properties?.name?.errors}
        </span>

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
            state.data?.date_of_birth ? state.data.date_of_birth : undefined
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
          defaultValue={state.data?.phone}
          aria-describedby="phone-error"
          pattern="[\(\)\s\-\+\d]+"
        />
        <span id="phone-error" role="alert" className="text-xs text-error h-2">
          {state.error?.properties?.phone?.errors}
        </span>
      </section>

      <Button className="mt-8" type="submit">
        Continuar
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
