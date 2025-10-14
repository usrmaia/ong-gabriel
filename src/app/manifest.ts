import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ONG Gabriel - Atendimento Psicológico Gratuito",
    short_name: "ONG Gabriel",
    description:
      "Atendimento psicológico gratuito e prevenção ao suicídio. Agende sua consulta online.",
    start_url: "/",
    display: "standalone",
    background_color: "#fff8f2",
    theme_color: "#3b476d",
    orientation: "portrait-primary",
    scope: "/",
    categories: ["health", "medical", "lifestyle"],
    lang: "pt-BR",
    dir: "ltr",
    icons: [
      {
        src: "/icon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
      {
        src: "/icon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    screenshots: [
      {
        src: "/screenshot-mobile.png",
        sizes: "425x812",
        type: "image/png",
        form_factor: "narrow",
        label: "Interface mobile da ONG Gabriel",
      },
    ],
    shortcuts: [
      {
        name: "Agendar Consulta - Anamnese",
        short_name: "Agendar",
        description: "Agende uma nova consulta",
        url: "/patient/form-anamnesis",
        icons: [
          {
            src: "/icon-192x192.png",
            sizes: "192x192",
          },
        ],
      },
      {
        name: "Formulário de Cadastro - Psicólogo",
        short_name: "Cadastro",
        description: "Cadastre-se como psicólogo",
        url: "/pre-psych/form-registration",
        icons: [
          {
            src: "/icon-192x192.png",
            sizes: "192x192",
          },
        ],
      },
    ],
  };
}
