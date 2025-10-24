"use client";

import { Download, Smartphone } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { usePWAInstall } from "@/hooks/usePWAInstall";

interface PWAInstallBannerProps {
  variant?: "banner" | "button";
  className?: string;
  children?: React.ReactNode;
}

export function PWAInstallBanner({
  variant,
  className,
  children,
}: PWAInstallBannerProps) {
  const { canInstall, isInstalling, installPWA } = usePWAInstall();
  const [isDismissed, setIsDismissed] = useState(false);

  // Não mostra o componente se não pode instalar ou foi dispensado
  if (!canInstall || isDismissed) return null;

  const handleInstall = async () => await installPWA();

  const handleDismiss = () => setIsDismissed(true);

  if (variant === "button")
    return (
      <>
        {children}
        <Button
          onClick={handleInstall}
          disabled={isInstalling}
          className={`bg-s-saffron-100 hover:bg-s-saffron-200 text-s-brass-300 text-xs w-32 ${className}`}
        >
          <Download size={24} className="mr-1 w-6 h-6" />
          {isInstalling ? "Instalando..." : "Instalar"}
        </Button>
      </>
    );

  // Banner padrão
  return (
    <div className={`bg-s-butter-200 border-t border-s-brass-100 ${className}`}>
      <div className="w-full max-w-xl mx-auto">
        <div className="flex flex-col p-6 gap-2 ">
          <div className="flex justify-center items-center gap-6">
            <div className="rounded-2xl bg-s-butter-100 h-12 w-12 flex items-center justify-center">
              <Smartphone size={30} className="text-s-brass-100" />
            </div>
            <p className="font-young-serif text-2xl text-s-brass-300">
              Instale o app da ONG Gabriel
            </p>
          </div>
          <p className="text-center text-md font-raleway text-s-charcoal-100">
            Acesso rápido a nossos serviços direto, direto na sua tela inicial!
          </p>
          <div className="flex justify-center items-center gap-3 w-full">
            <Button
              onClick={handleInstall}
              disabled={isInstalling}
              className="bg-s-saffron-100 hover:bg-s-saffron-200 text-s-brass-300 text-xs w-32"
            >
              <Download size={24} className="mr-1 w-6 h-6" />
              {isInstalling ? "Instalando..." : "Instalar"}
            </Button>
            <button
              onClick={handleDismiss}
              className="font-raleway font-normal text-sm text-s-brass-200 cursor-pointer"
            >
              Agora não
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
