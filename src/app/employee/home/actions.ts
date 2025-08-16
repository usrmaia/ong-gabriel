"use server";

import { sendEmail } from "@/infra";
import logger from "@/config/logger";

export async function testSendEmail() {
  try {
    sendEmail({
      template: "hello-world",
      context: {
        title: "Teste de Email - ONG Gabriel",
      },
      to: "karevo7294@fursee.com", // Email de teste - substitua por um email válido
    });
    return { success: true, message: "Email enviado com sucesso" };
  } catch (error) {
    logger.error("Erro inesperado ao enviar email:", error);
    return { success: false, message: "Erro inesperado ao enviar email" };
  }
}
