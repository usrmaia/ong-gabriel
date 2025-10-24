import { Young_Serif, Raleway, Poppins } from "next/font/google";
import "./globals.css";

import { Analytics } from "@/components/analytics";
import { OfflineMonitor } from "@/components/offline-monitor";
import {
  metadata,
  generateMedicalOrganizationSchema,
  generateOrganizationSchema,
  generateWebsiteSchema,
} from "./metadata";
import { PWAInstallBanner } from "@/components/pwa-install-banner";

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

export { metadata };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = generateOrganizationSchema();
  const websiteSchema = generateWebsiteSchema();
  const medicalSchema = generateMedicalOrganizationSchema();

  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <meta name="msapplication-tap-highlight" content="no" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(medicalSchema),
          }}
        />
      </head>
      <body
        className={`${raleway.variable} ${youngSerif.variable} ${poppins.variable} antialiased flex flex-col min-h-screen`}
      >
        <Analytics />
        <OfflineMonitor />
        {children}
        <footer className="flex items-center justify-center p-4">
          <p className="text-sm text-center font-xs text-s-gunmetal-100">
            <span className="font-bold">
              &copy; {new Date().getFullYear()} ONG Gabriel.
            </span>{" "}
            Todos os direitos reservados. Desenvolvido por PopCorns.
          </p>
        </footer>
        <PWAInstallBanner variant="banner" className="w-full" />
      </body>
    </html>
  );
}
