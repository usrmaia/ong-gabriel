export type Template =
  | "hello-world"
  | "pre-psycho-approved"
  | "pre-psycho-adjustment"
  | "pre-psycho-failed";

export type TemplateContext = {
  "hello-world": {
    title: string;
  };
  "pre-psycho-approved": {
    nome: string;
    url: string;
    EMAIL_IMG_PUBLIC_URL: string;
  };
  "pre-psycho-adjustment": {
    nome: string;
    motivo: string;
    url: string;
    EMAIL_IMG_PUBLIC_URL: string;
  };
  "pre-psycho-failed": {
    nome: string;
    pendencias: string;
    url: string;
    EMAIL_IMG_PUBLIC_URL: string;
  };
};

export const TemplateSubject: Record<Template, string> = {
  "hello-world": "Email de Teste - ONG Gabriel",
  "pre-psycho-approved":
    "Cadastro aprovado – Bem-vindo à Plataforma da ONG Gabriel",
  "pre-psycho-adjustment": "Retorno sobre seu cadastro – ONG Gabriel",
  "pre-psycho-failed": "Ajustes necessários no seu cadastro – ONG Gabriel",
};
