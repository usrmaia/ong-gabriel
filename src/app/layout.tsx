import type { Metadata } from "next";
import { Young_Serif, Raleway, Poppins } from "next/font/google";

import { Analytics } from "@/components/analytics";
import "./globals.css";

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
  display: "swap",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const youngSerif = Young_Serif({
  variable: "--font-young-serif",
  subsets: ["latin"],
  display: "swap",
  weight: ["400"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  display: "swap",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

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
        href: "/default-user.jpg",
        url: "/default-user.jpg",
        secureUrl: "/default-user.jpg",
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
    images: ["/default-user.jpg"],
    creator: "@ong_gabriel",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${raleway.variable} ${youngSerif.variable} ${poppins.variable} antialiased flex flex-col`}
      >
        <Analytics />
        {children}
        <footer className="flex items-center justify-center p-4">
          <p className="text-sm text-center font-xs text-s-gunmetal-100">
            <span className="font-bold">
              &copy; {new Date().getFullYear()} ONG Gabriel.
            </span>{" "}
            Todos os direitos reservados. Desenvolvido por PopCorns.
          </p>
        </footer>
      </body>
    </html>
  );
}
