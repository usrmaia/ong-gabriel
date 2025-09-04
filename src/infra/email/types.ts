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
  };
  "pre-psycho-adjustment": {
    nome: string;
    motivo: string;
    url: string;
  };
  "pre-psycho-failed": {
    nome: string;
    pendencias: string;
    url: string;
  };
};

export const TemplateSubject: Record<Template, string> = {
  "hello-world": "Email de Teste - ONG Gabriel",
  "pre-psycho-approved":
    "Cadastro aprovado – Bem-vindo à Plataforma da ONG Gabriel",
  "pre-psycho-adjustment": "Retorno sobre seu cadastro – ONG Gabriel",
  "pre-psycho-failed": "Ajustes necessários no seu cadastro – ONG Gabriel",
};

//  sendEmail({
//       to: "josivania0706@gmail.com",
//       template: "pre-psycho-failed",
//       context: {
//         nome: "Josivânia",
//         pendencias: "Documento ilegível\n- Comprovante de endereço ausente",
//         url: "https://onggabriel.org",
//       },
//     });
