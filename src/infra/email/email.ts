import nodemailer, { SendMailOptions } from "nodemailer";

import { env } from "@/config/env";
import logger from "@/config/logger";

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
  htmlTemplate?: string;
  htmlContext?: Record<string, string>;
};

/**
 * Envia um email usando as propriedades fornecidas. Se um template HTML e contexto forem fornecidos,
 * aplica o template para gerar o conteúdo HTML do email. Caso contrário, usa o HTML fornecido.
 * Registra o resultado da operação de envio do email.
 *
 * @param props - As propriedades necessárias para enviar o email, incluindo template HTML e contexto opcionais.
 */
export const sendEmail = (props: sendEmailProps) => {
  const { htmlTemplate, htmlContext } = props;

  let formattedHtml: string | undefined;
  if (htmlTemplate && htmlContext)
    formattedHtml = applyHtmlTemplate(htmlTemplate, htmlContext);

  transporter.sendMail({
    ...props,
    from: env.EMAIL_GOOGLE_USER,
    html: formattedHtml ?? props.html,
  });
};

/**
 * Aplica um objeto de contexto a um template HTML substituindo os espaços reservados pelos seus valores correspondentes.
 *
 * Cada chave no objeto `htmlContext` é usada para substituir todas as ocorrências de `{{key}}` na string `htmlTemplate`
 * pelo seu valor associado.
 *
 * @param htmlTemplate - A string do template HTML contendo espaços reservados no formato `{{key}}`.
 * @param htmlContext - Um objeto que mapeia chaves de espaços reservados para seus valores de string de substituição.
 * @returns A string HTML com todos os espaços reservados substituídos pelos seus valores correspondentes do `htmlContext`.
 */
export const applyHtmlTemplate = (
  htmlTemplate: string,
  htmlContext: Record<string, string>,
): string => {
  Object.entries(htmlContext).forEach(([key, value]) => {
    htmlTemplate = htmlTemplate.replace(new RegExp(`{{${key}}}`, "g"), value);
  });
  return htmlTemplate;
};
