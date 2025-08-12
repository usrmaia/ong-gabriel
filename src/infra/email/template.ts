import { readFileSync, existsSync } from "fs";
import { join } from "path";

import logger from "@/config/logger";
import { Template } from "./types";

export const getTemplates = (
  templateName: Template,
): { templateHTML: string; templateTXT: string } => {
  const templatesPath = join(__dirname, "..", "..", "assets", "templates");

  const templateHTMLPath = join(templatesPath, `${templateName}.html`);

  if (!existsSync(templateHTMLPath)) {
    logger.error(`Template HTML not found: ${templateHTMLPath}`);
    throw new Error(`Template HTML not found: ${templateHTMLPath}`);
  }

  const templateHTML = readFileSync(templateHTMLPath, "utf-8");

  const templateTXTPath = join(templatesPath, `${templateName}.txt`);

  if (!existsSync(templateTXTPath)) {
    logger.error(`Template TXT not found: ${templateTXTPath}`);
    throw new Error(`Template TXT not found: ${templateTXTPath}`);
  }

  const templateTXT = readFileSync(templateTXTPath, "utf-8");

  return { templateHTML, templateTXT };
};

/**
 * Aplica um objeto de contexto a um template substituindo os espaços reservados pelos seus valores correspondentes.
 *
 * Cada chave no objeto `context` é usada para substituir todas as ocorrências de `{{key}}` na string `template`
 * pelo seu valor associado.
 *
 * @param template - A string do template contendo espaços reservados no formato `{{key}}`.
 * @param context - Um objeto que mapeia chaves de espaços reservados para seus valores de string de substituição.
 * @returns A string com todos os espaços reservados substituídos pelos seus valores correspondentes do `context`.
 */
export const applyTemplate = (
  template: string,
  context?: Record<string, string>,
): string => {
  Object.entries(context || {}).forEach(([key, value]) => {
    template = template.replace(new RegExp(`{{${key}}}`, "g"), value);
  });
  return template;
};
