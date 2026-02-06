"use client";

import { useSearchParams } from "next/navigation";
import { useActionState } from "react";

import { onSubmit } from "./actions";
import { Button, Input, Label } from "@/components/ui";

export default function RegisterForm() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo");
  const [state, formAction] = useActionState(onSubmit.bind(null, redirectTo), {
    success: false,
    error: { errors: [] },
  });

  return (
    <form className="flex flex-col w-full gap-2" action={formAction}>
      <Label id="name-label" htmlFor="name">
        Como você quer ser chamado?
      </Label>
      <Input
        type="text"
        id="name"
        name="name"
        placeholder="Digite seu nome"
        aria-describedby="name-error"
        defaultValue={state.data?.name}
        required
      />
      <span id="name-error" role="alert" className="text-xs text-error h-2">
        {state.error?.properties?.name?.errors}
      </span>

      <Label id="email-label" htmlFor="email">
        Endereço de email
      </Label>
      <Input
        type="email"
        id="email"
        name="email"
        placeholder="Digite seu email"
        aria-describedby="email-error"
        defaultValue={state.data?.email}
        required
      />
      <span id="email-error" role="alert" className="text-xs text-error h-2">
        {state.error?.properties?.email?.errors}
      </span>

      <Label id="password-label" htmlFor="password">
        Senha
      </Label>
      <Input
        type="password"
        id="password"
        name="password"
        placeholder="Digite sua senha"
        aria-describedby="password-error"
        defaultValue={state.data?.password}
        required
      />
      <span id="password-error" role="alert" className="text-xs text-error h-2">
        {state.error?.properties?.password?.errors}
      </span>

      <Button type="submit" className="mt-4">
        Cadastre-se
      </Button>

      <span
        id="email-error"
        role="alert"
        className="text-xs text-center text-error h-2"
      >
        {state.error?.errors}
      </span>
    </form>
  );
}
