"use client";

import { Button, Checkbox, Input, Label } from "@/components/ui";
import { useActionState } from "react";
import { onSubmit } from "./actions";
import { useSearchParams } from "next/navigation";

export default function LoginForm() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo");
  const [state, formAction] = useActionState(onSubmit.bind(null, redirectTo), {
    data: {
      email: "",
      password: "",
      rememberMe: true,
    },
    success: false,
    error: { errors: [] },
  });

  return (
    <form className="flex flex-col gap-4 w-full" action={formAction}>
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
      <div className="flex items-center gap-2">
        <Checkbox
          id="rememberMe"
          name="rememberMe"
          defaultChecked={state.data?.rememberMe}
        />
        <Label htmlFor="rememberMe">Salvar acesso</Label>
      </div>
      <Button className="mt-4" type="submit">
        Entrar
      </Button>

      <span id="email-error" role="alert" className="text-xs text-error h-2">
        {state.error?.errors}
      </span>
    </form>
  );
}
