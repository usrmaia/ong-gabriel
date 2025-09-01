import { Young_Serif, Raleway, Poppins } from "next/font/google";

import { Analytics } from "@/components/analytics";
import "./globals.css";
import Link from "next/link";
import { env } from "@/config/env";
import { metadata } from "./metadata";

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
