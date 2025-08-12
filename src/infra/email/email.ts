import nodemailer, { SendMailOptions } from "nodemailer";

import { env } from "@/config/env";
import logger from "@/config/logger";
import { applyTemplate, getTemplates } from "./template";
import { Template, TemplateContext } from "./types";

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
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

type SendEmailProps<T extends Template = Template> = {
  template: T;
  context?: TemplateContext[T];
} & SendMailOptions;

/**
 * Envia um e-mail usando o template e contexto fornecidos.
 * Aplica o template especificado com o contexto dado para gerar o conteúdo do e-mail em HTML e texto simples.
 *
 * @param props - As propriedades necessárias para enviar o e-mail, incluindo o nome do template e o contexto.
 */
export const sendEmail = (props: SendEmailProps) => {
  const { template, context } = props;
  const { templateHTML, templateTXT } = getTemplates(template);

  const htmlContent = applyTemplate(templateHTML, context);
  props.html = htmlContent;

  const textContent = applyTemplate(templateTXT, context);
  props.text = textContent;

  transporter.sendMail(
    {
      ...props,
      from: env.EMAIL_GOOGLE_USER,
    },
    (err, info) => {
      if (err)
        logger.error(
          `Error sending email: ${err.name} - ${err.message} - ${err.stack}`,
        );
      else logger.log("Email sent successfully", info.accepted);
    },
  );
};
