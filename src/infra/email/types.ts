export type Template = "hello-world";

export type TemplateContext = {
  "hello-world": {
    title: string;
  };
};

export const TemplateSubject: Record<Template, string> = {
  "hello-world": "Email de Teste - ONG Gabriel",
};
