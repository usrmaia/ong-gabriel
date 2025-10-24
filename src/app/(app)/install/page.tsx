"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { PWAInstallBanner } from "@/components/pwa-install-banner";
import { usePWAInstall } from "@/hooks/usePWAInstall";

export default function InstallAppPage() {
  const { canInstall, isInstalled, deviceInfo } = usePWAInstall();

  if (isInstalled)
    return (
      <>
        <div className="flex flex-col justify-center items-center text-center gap-4">
          <p className="text-xl font-bold text-s-charcoal-100">
            App Já Instalado!
          </p>
          <p className="text-s-brass-300">
            O app da ONG Gabriel já está instalado no seu dispositivo. Você pode
            acessá-lo diretamente da tela inicial.
          </p>
        </div>
        <Link href="/entry">
          isDismissed
          <Button className="w-full bg-s-navy-100 text-s-butter-100">
            Ir para o App
            <ArrowRight size={30} className="h-10 w-10" />
          </Button>
        </Link>
      </>
    );

  if (!canInstall || !["chrome", "safari"].includes(deviceInfo.userAgent))
    return (
      <div className="flex flex-col justify-center items-center text-center gap-4">
        <p className="text-xl text-s-charcoal-100 font-bold">
          Instalação Não Disponível
        </p>
        <p className="text-sm text-s-brass-300">
          O app da ONG Gabriel não pode ser instalado no seu dispositivo ou
          navegador no momento.
        </p>
        <p className="text-sm text-s-brass-300">
          Por favor, tente novamente usando um navegador compatível, como o
          Chrome ou Safari, em um dispositivo móvel.
        </p>
      </div>
    );

  const instructionsAndroid = [
    "Toque no botão 'Instalar' abaixo ou no ícone de menu do navegador (⋮)",
    "Selecione 'Adicionar à tela inicial' ou 'Instalar app'",
    "Confirme a instalação tocando em 'Instalar' ou 'Adicionar'",
    "O app aparecerá na sua tela inicial",
  ];

  const instructionsIOS = [
    "Abra este site no Safari do seu iPhone/iPad",
    "Toque no ícone de compartilhamento (□↗) na parte inferior",
    "Role para baixo e toque em 'Adicionar à Tela de Início'",
    "Toque em 'Adicionar' no canto superior direito",
  ];

  return (
    <>
      <div className="flex flex-col justify-center items-center text-center gap-2">
        <p className="text-xl font-bold text-s-charcoal-100">
          Instale o App da ONG Gabriel
        </p>
        <p className="text-sm text-s-brass-300">
          Tenha acesso rápido e conveniente aos seus atendimentos psicológicos.
          Instale nosso app e mantenha-se conectado com o suporte que você
        </p>
      </div>

      <div className="flex flex-col justify-center items-center gap-2">
        <PWAInstallBanner variant="button" className="mx-auto pb-2">
          <p className="text-sm text-center text-s-brass-300 mb-4">
            Seu navegador suporta instalação automática. Clique no botão abaixo:
          </p>
        </PWAInstallBanner>

        {["android", "windows", "linux"].includes(deviceInfo.platform) && (
          <>
            <p className="font-young-serif text-lg text-center mb-4 text-s-brass-300">
              Android / Chrome
            </p>
            <ol className="space-y-3">
              {instructionsAndroid.map((step, index) => (
                <li key={index} className="flex gap-2 items-center">
                  <span className="bg-s-butter-200 rounded-2xl font-raleway font-bold text-xl text-center text-s-brass-100 h-min w-min p-2">
                    {"0"}
                    {index + 1}
                  </span>
                  <span className="text-s-charcoal-100 text-sm">{step}</span>
                </li>
              ))}
            </ol>
          </>
        )}

        {["ios", "mac"].includes(deviceInfo.platform) && (
          <>
            <p className="font-young-serif text-lg text-center mb-4 text-s-brass-300">
              iPhone / iPad (Safari)
            </p>
            <ol className="space-y-3">
              {instructionsIOS.map((step, index) => (
                <li key={index} className="flex gap-2 items-center">
                  <span className="bg-s-butter-200 rounded-2xl font-raleway font-bold text-xl text-center text-s-brass-100 h-min w-min p-2">
                    {"0"}
                    {index + 1}
                  </span>
                  <span className="text-s-charcoal-100 text-sm">{step}</span>
                </li>
              ))}
            </ol>
          </>
        )}
      </div>
    </>
  );
}
