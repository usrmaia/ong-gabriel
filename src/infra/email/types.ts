import { env } from "@/config/env";

export type Template =
  | "hello-world"
  | "pre-psycho-approved"
  | "pre-psycho-adjustment"
  | "pre-psycho-failed"
  | "email-verification-registration-code"
  | "email-verification-reset-code";

export type TemplateContext = {
  "hello-world": {
    title: string;
  };
  "pre-psycho-approved": {
    userName: string;
  };
  "pre-psycho-adjustment": {
    userName: string;
    pendingNote: string;
  };
  "pre-psycho-failed": {
    userName: string;
    pendingNote: string;
  };
  "email-verification-registration-code": {
    userName: string;
    verificationCode: string;
  };
  "email-verification-reset-code": {
    userName: string;
    verificationCode: string;
  };
};

export const TemplateContextData: Record<Template, Record<string, string>> = {
  "hello-world": {},
  "pre-psycho-approved": {
    EMAIL_IMG_PUBLIC_URL: env.EMAIL_IMG_PUBLIC_URL,
    PUBLIC_URL: env.NEXT_PUBLIC_URL,
    REDIRECT_URL: `${env.NEXT_PUBLIC_URL}/employee/home`,
    FACEBOOK_URL: "https://www.facebook.com/p/ONG-Gabriel-100083766169010",
    INSTAGRAM_URL: "https://www.instagram.com/ong.gabriel_",
    LINKEDIN_URL: "https://www.linkedin.com/company/ong-gabriel",
    YOUTUBE_URL: "https://www.youtube.com/@ONGGabriel",
  },
  "pre-psycho-adjustment": {
    EMAIL_IMG_PUBLIC_URL: env.EMAIL_IMG_PUBLIC_URL,
    PUBLIC_URL: env.NEXT_PUBLIC_URL,
    REDIRECT_URL: `${env.NEXT_PUBLIC_URL}/pre-psych/form-registration`,
    FACEBOOK_URL: "https://www.facebook.com/p/ONG-Gabriel-100083766169010",
    INSTAGRAM_URL: "https://www.instagram.com/ong.gabriel_",
    LINKEDIN_URL: "https://www.linkedin.com/company/ong-gabriel",
    YOUTUBE_URL: "https://www.youtube.com/@ONGGabriel",
  },
  "pre-psycho-failed": {
    EMAIL_IMG_PUBLIC_URL: env.EMAIL_IMG_PUBLIC_URL,
    PUBLIC_URL: env.NEXT_PUBLIC_URL,
    FACEBOOK_URL: "https://www.facebook.com/p/ONG-Gabriel-100083766169010",
    INSTAGRAM_URL: "https://www.instagram.com/ong.gabriel_",
    LINKEDIN_URL: "https://www.linkedin.com/company/ong-gabriel",
    YOUTUBE_URL: "https://www.youtube.com/@ONGGabriel",
  },
  "email-verification-registration-code": {},
  "email-verification-reset-code": {},
};

export const TemplateSubject: Record<Template, string> = {
  "hello-world": "Email de Teste - ONG Gabriel",
  "pre-psycho-approved":
    "Cadastro Aprovado – Bem-vindo à Plataforma da ONG Gabriel",
  "pre-psycho-adjustment": "Ajustes Necessários no Cadastro – ONG Gabriel",
  "pre-psycho-failed": "Cadastro Não Aprovado – ONG Gabriel",
  "email-verification-registration-code": "Código de Verificação - ONG Gabriel",
  "email-verification-reset-code": "Código de Verificação - ONG Gabriel",
};
