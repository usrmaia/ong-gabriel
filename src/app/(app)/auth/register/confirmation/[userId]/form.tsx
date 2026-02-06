"use client";

import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useActionState, useState } from "react";

import { Button, InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui";
import { onSubmit, onResendToken } from "./actions";
import { useSearchParams } from "next/navigation";

export default function RegisterConfirmationForm({
  userId,
}: {
  userId: string;
}) {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo");
  const [token, setToken] = useState("");
  const [state, formAction] = useActionState(onSubmit.bind(null, redirectTo), {
    success: false,
    error: { errors: [] },
  });

  const handleSubmit = async (formData: FormData) => {
    formData.set("token", token);
    formData.set("userId", userId);
    return formAction(formData);
  };

  return (
    <>
      <form className="flex flex-col w-full gap-2" action={handleSubmit}>
        <div className="flex justify-center">
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
          id="token-code-error"
          role="alert"
          className="text-xs text-error h-2"
        >
          {state.error?.properties?.token?.errors}
        </span>

        <Button type="submit" className="mt-4">
          Confirmar
        </Button>
        <span
          id="email-error"
          role="alert"
          className="text-xs text-center text-error h-2"
        >
          {state.error?.errors}
        </span>
      </form>
      <p className="text-xs text-center mt-8">
        Se você não recebeu o email, verifique sua pasta de spam ou lixo
        eletrônico. Caso ainda não o encontre, clique em &quot;Reenviar
        código&quot; para receber um novo código de confirmação.
      </p>
      <Button
        variant="outline"
        className="mt-4 border-s-silver-100 w-full"
        onClick={() => onResendToken(userId)}
      >
        Reenviar código
      </Button>
    </>
  );
}
