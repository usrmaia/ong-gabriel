"use client";

import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useSearchParams } from "next/navigation";
import { useActionState, useState } from "react";

import { onConfirm, onSubmit } from "./actions";
import {
  Button,
  Input,
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  Label,
} from "@/components/ui";

export function ResetForm() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo");
  const [initialState, initialFormAction] = useActionState(onSubmit, {
    success: false,
    error: { errors: [] },
  });

  const [token, setToken] = useState("");
  const [confirmState, confirmFormAction] = useActionState(
    onConfirm.bind(null, redirectTo),
    {
      success: false,
      error: { errors: [] },
    },
  );

  const handleConfirme = async (formData: FormData) => {
    formData.set("email", initialState.data?.email || "");
    formData.set("token", token);
    return confirmFormAction(formData);
  };

  return (
    <>
      <form action={initialFormAction} className="flex flex-col gap-2">
        <Label htmlFor="email">E-mail</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="Digite seu e-mail"
          required
          defaultValue={initialState.data?.email}
          autoComplete="email"
        />
        <span id="email-error" role="alert" className="text-xs text-error h-2">
          {initialState.error?.properties?.email?.errors}
        </span>

        <Button type="submit" className="mt-2">
          Enviar link de recuperação
        </Button>
        <span id="email-error" role="alert" className="text-xs text-error h-2">
          {initialState.error?.errors}
        </span>
      </form>
      {initialState.success && (
        <form action={handleConfirme} className="flex flex-col gap-2">
          <p className="text-center">
            Enviamos um email com um código de confirmação para o endereço{" "}
            {confirmState.data?.email}. Digite o código abaixo para redefinir
            sua senha.
          </p>
          <div className="flex justify-center py-2">
            <InputOTP
              id="token-code"
              name="token"
              aria-describedby="token-code-error"
              maxLength={6}
              pattern={REGEXP_ONLY_DIGITS}
              value={token}
              onChange={(newValue) => setToken(newValue)}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>
          <span
            id="token-error"
            role="alert"
            className="text-xs text-error h-2"
          >
            {confirmState.error?.properties?.token?.errors}
          </span>

          <Label htmlFor="password">Nova senha</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Digite a nova senha"
            required
            defaultValue={confirmState.data?.password}
          />
          <span
            id="password-error"
            role="alert"
            className="text-xs text-error h-2"
          >
            {confirmState.error?.properties?.password?.errors}
          </span>

          <Button type="submit" className="mt-2">
            Confirmar nova senha
          </Button>
          <span id="form-error" role="alert" className="text-xs text-error h-2">
            {confirmState.error?.errors}
          </span>
        </form>
      )}
    </>
  );
}
