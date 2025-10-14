import Image from "next/image";

import Link from "next/link";
import { env } from "@/config/env";
import { PageHistoryProvider } from "@/providers";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <PageHistoryProvider>
      <header className="w-full p-4">
        <Image
          className="mx-auto"
          src="/ong-gabriel-logo.svg"
          alt="Logo da ONG Gabriel"
          width={180}
          height={38}
          priority
        />
        {env.FEEDBACK_FORM && (
          <p className="text-center text-sm font-semibold">
            Esta é uma versão de desenvolvimento. Possui algum feedback para
            nós?{" "}
            <Link
              className="text-blue-600 hover:underline"
              href={env.FEEDBACK_FORM}
              target="_blank"
              rel="noopener noreferrer"
            >
              Clique aqui!
            </Link>
          </p>
        )}
      </header>
      <main className="flex flex-1 flex-col self-center max-w-sm w-full gap-10 px-6">
        {children}
      </main>
    </PageHistoryProvider>
  );
}
