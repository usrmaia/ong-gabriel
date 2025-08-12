import nodemailer, { SendMailOptions } from "nodemailer";

import { env } from "@/config/env";
import logger from "@/config/logger";
import { applyTemplate, getTemplates } from "./template";
import { Template, TemplateContext } from "./types";
import { Result } from "@/types";

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  debug: env.DEBUG,
  secure: env.SECURE_ENABLED,
  auth: {
    type: "OAuth2",
    user: env.EMAIL_GOOGLE_USER,
    serviceClient: env.EMAIL_GOOGLE_ID,
    privateKey: env.EMAIL_GOOGLE_SECRET,
    accessToken: env.EMAIL_GOOGLE_ACCESS_TOKEN,
    refreshToken: env.EMAIL_GOOGLE_REFRESH_TOKEN,
  },
});

transporter.verify((err, success) => {
  if (!err && success) logger.info("Email transporter is ready");
  else if (err) logger.error("Email transporter error", err);
});

export type sendEmailProps<T extends Template = Template> = {
  template: T;
  context?: TemplateContext[T];
} & SendMailOptions;

/**
 * Envia um email usando as propriedades fornecidas. Se um template HTML e contexto forem fornecidos,
 * aplica o template para gerar o conteúdo HTML do email. Caso contrário, usa o HTML fornecido.
 * Registra o resultado da operação de envio do email.
 *
 * @param props - As propriedades necessárias para enviar o email, incluindo template HTML e contexto opcionais.
 */
export const sendEmail = async (
  props: sendEmailProps,
): Promise<Result<string>> => {
  const { template, context } = props;
  const { templateHTML, templateTXT } = getTemplates(template);

  const htmlContent = applyTemplate(templateHTML, context);
  props.html = htmlContent;

  const textContent = applyTemplate(templateTXT, context);
  props.text = textContent;

  const sentMessageInfo = await transporter.sendMail({
    ...props,
    from: env.EMAIL_GOOGLE_USER,
  });

  return {
    error: {
      errors: sentMessageInfo.rejected.map((error) =>
        typeof error === "string" ? error : `${error.name} - ${error.address}`,
      ),
    },
    success: sentMessageInfo.accepted.length > 0,
    data: sentMessageInfo.response,
  };
};
