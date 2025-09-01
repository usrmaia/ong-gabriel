import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ONG Gabriel - Plataforma de Atendimento",
  description:
    "Plataforma de atendimento psicológico para profissionais e pacientes.",
  openGraph: {
    title: "ONG Gabriel - Plataforma de Atendimento",
    description:
      "Plataforma de atendimento psicológico para profissionais e pacientes.",
    siteName: "ONG Gabriel",
    images: [
      {
        url: "http://url-publica/og-link-preview.jpg",
        secureUrl: "https://url-publica/og-link-preview.jpg",
        width: 1200,
        height: 630,
        alt: "Imagem da ONG Gabriel",
      },
    ],
    locale: "pt-BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ONG Gabriel - Plataforma de Atendimento",
    description:
      "Plataforma de atendimento psicológico para profissionais e pacientes.",
    images: ["/og-link-preview.jpg"],
    creator: "@ong_gabriel",
  },
};
