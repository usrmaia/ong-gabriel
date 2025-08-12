"use client";

import { useState, useTransition } from "react";
import { Mail } from "lucide-react";

import { Button } from "@/components/ui";
import { testSendEmail } from "./actions";

export function SendEmailButton() {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string>("");
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);

  const handleSendEmail = () => {
    startTransition(async () => {
      try {
        const result = await testSendEmail();
        setMessage(result.message);
        setIsSuccess(result.success);

        // Limpar mensagem após 5 segundos
        setTimeout(() => {
          setMessage("");
          setIsSuccess(null);
        }, 5000);
      } catch {
        setMessage("Erro inesperado ao enviar email");
        setIsSuccess(false);
      }
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <Button
        onClick={handleSendEmail}
        disabled={isPending}
        className="flex items-center gap-2 bg-s-azure-web-100 hover:bg-s-verdigris text-s-van-dyke"
      >
        <Mail size={16} />
        {isPending ? "Enviando..." : "Testar Email"}
      </Button>

      {message && (
        <p
          className={`text-sm text-center ${
            isSuccess ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
