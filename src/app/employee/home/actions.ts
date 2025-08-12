"use server";

import { sendEmail } from "@/infra";
import logger from "@/config/logger";

export async function testSendEmail() {
  try {
    const result = await sendEmail({
      template: "hello-world",
      context: {
        title: "Teste de Email - ONG Gabriel",
      },
      to: "yavin35794@bizmud.com", // Email de teste - substitua por um email válido
      subject: "Email de Teste - ONG Gabriel",
    });

    if (result.success) {
      logger.info("Email enviado com sucesso:", result.data);
      return { success: true, message: "Email enviado com sucesso!" };
    } else {
      logger.error("Erro ao enviar email:", result.error);
      return { success: false, message: "Erro ao enviar email" };
    }
  } catch (error) {
    logger.error("Erro inesperado ao enviar email:", error);
    return { success: false, message: "Erro inesperado ao enviar email" };
  }
}
