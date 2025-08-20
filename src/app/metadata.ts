import { Metadata } from "next";
import { env } from "@/config/env";

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
        url: `${env.NEXT_PUBLIC_URL}/og-link-preview.jpg`,
        secureUrl: `${env.NEXT_PUBLIC_URL}/og-link-preview.jpg`,
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
    images: [
      {
        url: `${env.NEXT_PUBLIC_URL}/og-link-preview.jpg`,
        secureUrl: `${env.NEXT_PUBLIC_URL}/og-link-preview.jpg`,
        width: 1200,
        height: 630,
        alt: "Imagem da ONG Gabriel",
      },
    ],
    creator: "@ong_gabriel",
  },
};
