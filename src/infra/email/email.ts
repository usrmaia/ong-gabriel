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

type SendEmailProps<T extends Template = Template> = {
  to: string | string[];
  template: T;
  context?: TemplateContext[T];
};

/**
 * Envia um e-mail usando o template e contexto fornecidos.
 * Aplica o template especificado com o contexto dado para gerar o conteúdo do e-mail em HTML e texto simples.
 *
 * @param props - As propriedades necessárias para enviar o e-mail, incluindo o nome do template e o contexto.
 */
export const sendEmail = async ({
  to,
  template,
  context,
}: SendEmailProps): Promise<Result> => {
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

  if (sentMessageInfo.rejected) {
    logger.error(`Error sending email: ${sentMessageInfo.rejected}`);
    return { success: false, error: { errors: ["Erro ao enviar e-mail!"] } };
  }

  logger.info(`Email sent successfully: ${sentMessageInfo.accepted}`);
  return { success: true };
};
