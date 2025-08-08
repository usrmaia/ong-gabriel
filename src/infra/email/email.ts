import nodemailer, { SendMailOptions } from "nodemailer";

import { env } from "@/config/env";
import logger from "@/config/logger";
import { applyHtmlTemplate } from "./template";
import { Template } from "./types";

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

export type sendEmailProps = SendMailOptions & {
  template?: Template;
  context?: Record<string, string>;
};

/**
 * Envia um email usando as propriedades fornecidas. Se um template HTML e contexto forem fornecidos,
 * aplica o template para gerar o conteúdo HTML do email. Caso contrário, usa o HTML fornecido.
 * Registra o resultado da operação de envio do email.
 *
 * @param props - As propriedades necessárias para enviar o email, incluindo template HTML e contexto opcionais.
 */
export const sendEmail = (props: sendEmailProps) => {
  const { template, context } = props;

  let formattedHtml: string | undefined;
  if (template && context) formattedHtml = applyHtmlTemplate(template, context);

  transporter
    .sendMail({
      ...props,
      from: env.EMAIL_GOOGLE_USER,
      html: formattedHtml ?? props.html,
    })
    .catch((error) => {
      logger.error("Error sending email", error);
    });
};
