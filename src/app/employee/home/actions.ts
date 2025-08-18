"use server";

import { sendEmail } from "@/infra";

export async function testSendEmail() {
  const result = await sendEmail({
    template: "hello-world",
    context: { title: "Teste de Email" },
    to: "karevo7294@fursee.com",
  });

  if (result.success) {
    return { success: true, message: "Email enviado com sucesso" };
  } else {
    return { success: false, message: "Erro ao enviar email" };
  }
}
