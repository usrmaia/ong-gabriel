import nodemailer from "nodemailer";

import { env } from "@/config/env";
import logger from "@/config/logger";
import { applyTemplate, getTemplates } from "./template";
import { Template, TemplateContext, TemplateSubject } from "./types";
import { Result } from "@/types";

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  debug: env.DEBUG,
  secure: env.SECURE_ENABLED,
  auth: {
    type: "OAuth2",
    user: env.EMAIL_GOOGLE_USER,
    clientId: env.EMAIL_GOOGLE_ID,
    clientSecret: env.EMAIL_GOOGLE_SECRET,
    accessToken: env.EMAIL_GOOGLE_ACCESS_TOKEN,
    refreshToken: env.EMAIL_GOOGLE_REFRESH_TOKEN,
    accessUrl: "https://oauth2.googleapis.com/token",
  },
});

transporter.verify((err, success) => {
  if (!err && success) logger.info("Email transporter is ready");
  else if (err) logger.error("Email transporter error", err);
});

type SendEmailProps<T extends Template> = {
  to: string | string[];
  template: T;
  context: TemplateContext[T];
};

/**
 * Envia um e-mail usando o template e contexto fornecidos.
 *
 * @param {string} to - O endereço de e-mail do destinatário.
 * @param {Template} template - A chave do template a ser usada para o e-mail.
 * @param {TemplateContext[Template]} context - Os dados de contexto específicos do template.
 * @returns {Promise<Result>} Uma promise que resolve para um objeto de resultado indicando sucesso ou falha.
 *
 * @example
 * const result = await sendEmail({
 *   to: 'user@example.com',
 *   template: 'hello-world',
 *   context: { title: 'Bem-vindo!' }
 * });
 */
export const sendEmail = async <T extends Template>({
  to,
  template,
  context,
}: SendEmailProps<T>): Promise<Result> => {
  const { templateHTML, templateTXT } = getTemplates(template);

  const htmlContent = applyTemplate(templateHTML, context);
  const textContent = applyTemplate(templateTXT, context);
  const subject = TemplateSubject[template];

  const sentMessageInfo = await transporter.sendMail({
    to,
    subject,
    html: htmlContent,
    text: textContent,
  });

  if (sentMessageInfo.rejected.length) {
    logger.error(`Error sending email: ${sentMessageInfo.rejected}`);
    return { success: false, error: { errors: ["Erro ao enviar e-mail!"] } };
  }

  logger.info(`Email sent successfully: ${sentMessageInfo.accepted}`);
  return { success: true };
};
