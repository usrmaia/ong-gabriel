import { Metadata } from "next";
import { env } from "@/config/env";

export const metadata: Metadata = {
  title: {
    default: "ONG Gabriel - Plataforma de Atendimento",
    template: "%s | ONG Gabriel",
  },
  applicationName: "ONG Gabriel",
  generator: "Next.js",
  formatDetection: {
    telephone: false,
  },
  keywords: [
    "prevenção ao suicídio",
    "prevencao ao suicidio",
    "saúde mental",
    "saude mental",
    "apoio emocional",
    "apoio psicológico",
    "apoio psicologico",
    "atendimento psicológico",
    "atendimento psicologico",
    "psicologia",
    "psicoterapia",
    "bem-estar emocional",
    "bem estar emocional",
    "ajuda psicológica gratuita",
    "ajuda psicologica gratuita",
    "ajuda para depressão",
    "ajuda para depressao",
    "crise emocional",
    "pensamentos suicidas",
    "ideação suicida",
    "como buscar ajuda psicológica",
    "como buscar ajuda psicologica",
    "onde procurar ajuda emocional",
    "ONG de saúde mental",
    "ong de saude mental",
    "projeto social saúde mental",
    "projeto social saude mental",
    "atendimento online psicologia",
    "escuta ativa",
    "acolhimento psicológico",
    "acolhimento psicologico",
    "ONG Gabriel",
    "Ong Gabriel",
    "organização sem fins lucrativos",
    "organizacao sem fins lucrativos",
    "terceiro setor",
    "voluntariado",
    "doações",
    "doacoes",
    "Brasil",
    "serviço gratuito",
    "servico gratuito",
  ],
  description:
    "ONG Gabriel oferece atendimento psicológico e prevenção ao suicídio. Conectamos profissionais qualificados a pessoas que precisam de apoio emocional. Agende sua consulta online agora.",
  alternates: {
    canonical: env.NEXT_PUBLIC_URL,
  },
  authors: [{ name: "PopCorners", url: `${env.NEXT_PUBLIC_URL}/about-dev` }],
  creator: "PopCorners",
  publisher: "PopCorners",
  openGraph: {
    title: "ONG Gabriel - Plataforma de Atendimento",
    description:
      "Oferecemos atendimento psicológico e programas de prevenção ao suicídio. Nossa plataforma conecta profissionais qualificados a pessoas que precisam de apoio emocional. Agende sua consulta online.",
    siteName: "ONG Gabriel",
    images: [
      {
        url: `${env.NEXT_PUBLIC_URL}/og-link-preview.jpg`,
        secureUrl: `${env.NEXT_PUBLIC_URL}/og-link-preview.jpg`,
        width: 1200,
        height: 630,
        alt: "ONG Gabriel - Plataforma de Atendimento",
      },
    ],
    locale: "pt-BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ONG Gabriel - Plataforma de Atendimento",
    description:
      "Oferecemos atendimento psicológico e programas de prevenção ao suicídio. Agende sua consulta online agora.",
    images: [
      {
        url: `${env.NEXT_PUBLIC_URL}/og-link-preview.jpg`,
        secureUrl: `${env.NEXT_PUBLIC_URL}/og-link-preview.jpg`,
        width: 1200,
        height: 630,
        alt: "ONG Gabriel - Plataforma de Atendimento",
      },
    ],
    creator: `${env.NEXT_PUBLIC_URL}/about-dev`,
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  appleWebApp: {
    capable: true,
    title: "ONG Gabriel",
    statusBarStyle: "default",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      { rel: "icon", url: "/favicon.ico" },
      { rel: "mask-icon", url: "/safari-pinned-tab.svg", color: "#000000" },
    ],
  },
  manifest: "/manifest.json",
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
  other: {
    "msapplication-TileColor": "#1e40af",
    "theme-color": "#1e40af",
  },
};

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "ONG Gabriel",
    alternateName: "Organização Não Governamental Gabriel",
    description:
      "ONG dedicada ao atendimento psicológico e prevenção ao suicídio no Brasil",
    url: env.NEXT_PUBLIC_URL,
    logo: `${env.NEXT_PUBLIC_URL}/ong-gabriel-logo.svg`,
    image: `${env.NEXT_PUBLIC_URL}/og-link-preview.jpg`,
    foundingDate: "2024",
    nonprofitStatus: "NonprofitType",
    areaServed: {
      "@type": "Country",
      name: "Brasil",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: "Portuguese",
    },
    sameAs: [
      "https://www.facebook.com/onggabriel",
      "https://www.instagram.com/ong_gabriel",
      "https://www.youtube.com/@onggabriel",
      "https://www.linkedin.com/company/ong-gabriel",
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Serviços de Saúde Mental",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Atendimento Psicológico",
            description:
              "Consultas psicológicas online gratuitas com profissionais qualificados",
            provider: {
              "@type": "Organization",
              name: "ONG Gabriel",
            },
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Programa de Prevenção ao Suicídio",
            description:
              "Programa especializado na prevenção ao suicídio e apoio emocional",
            provider: {
              "@type": "Organization",
              name: "ONG Gabriel",
            },
          },
        },
      ],
    },
  };
}

export function generateWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "ONG Gabriel",
    url: env.NEXT_PUBLIC_URL,
    description:
      "Plataforma de atendimento psicológico e prevenção ao suicídio",
    inLanguage: "pt-BR",
    isAccessibleForFree: true,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${env.NEXT_PUBLIC_URL}/buscar?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function generateMedicalOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalOrganization",
    name: "ONG Gabriel",
    description:
      "Organização especializada em saúde mental e prevenção ao suicídio",
    url: env.NEXT_PUBLIC_URL,
    medicalSpecialty: ["Psychology", "Mental Health", "Suicide Prevention"],
    serviceArea: {
      "@type": "Country",
      name: "Brasil",
    },
    hasCredential: {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "Registro em Conselho de Psicologia",
    },
  };
}
