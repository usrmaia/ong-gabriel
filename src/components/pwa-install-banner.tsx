"use client";

import { X, Download, Smartphone } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { usePWAInstall } from "@/hooks/use-pwa-install";

interface PWAInstallBannerProps {
  variant?: "banner" | "button" | "card";
  className?: string;
  onInstallSuccess?: () => void;
  onDismiss?: () => void;
  showDismiss?: boolean;
}

export function PWAInstallBanner({
  variant = "banner",
  className = "",
  onInstallSuccess,
  onDismiss,
  showDismiss = true,
}: PWAInstallBannerProps) {
  const { canInstall, isInstalling, installPWA } = usePWAInstall();
  const [isDismissed, setIsDismissed] = useState(false);

  // Não mostra o componente se não pode instalar ou foi dispensado
  if (!canInstall || isDismissed) {
    return null;
  }

  const handleInstall = async () => {
    const success = await installPWA();
    if (success && onInstallSuccess) {
      onInstallSuccess();
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    if (onDismiss) {
      onDismiss();
    }
  };

  if (variant === "button") {
    return (
      <Button
        onClick={handleInstall}
        disabled={isInstalling}
        className={`flex items-center gap-2 ${className}`}
      >
        <Download size={16} />
        {isInstalling ? "Instalando..." : "Instalar App"}
      </Button>
    );
  }

  if (variant === "card") {
    return (
      <div
        className={`bg-gradient-to-r from-s-saffron-100 to-s-xanthous border border-s-brass-200 rounded-lg p-4 shadow-sm ${className}`}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="bg-white/80 p-2 rounded-lg">
              <Smartphone size={20} className="text-s-brass-300" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-s-brass-300 text-sm">
                Instale o App da ONG Gabriel
              </h3>
              <p className="text-xs text-s-brass-200 mt-1">
                Tenha acesso rápido aos seus atendimentos e agendamentos
              </p>
            </div>
          </div>
          {showDismiss && (
            <button
              onClick={handleDismiss}
              className="text-s-brass-200 hover:text-s-brass-300 p-1"
            >
              <X size={16} />
            </button>
          )}
        </div>
        <div className="flex gap-2 mt-3">
          <Button
            onClick={handleInstall}
            disabled={isInstalling}
            size="sm"
            className="bg-s-brass-300 hover:bg-s-brass-200 text-white text-xs"
          >
            <Download size={14} className="mr-1" />
            {isInstalling ? "Instalando..." : "Instalar"}
          </Button>
        </div>
      </div>
    );
  }

  // Banner padrão
  return (
    <div
      className={`bg-gradient-to-r from-s-saffron-100 to-s-xanthous border-b border-s-brass-200 p-3 ${className}`}
    >
      <div className="flex items-center justify-between max-w-4xl mx-auto">
        <div className="flex items-center gap-3">
          <Smartphone size={20} className="text-s-brass-300" />
          <div className="flex-1">
            <p className="text-sm font-medium text-s-brass-300">
              Instale o app da ONG Gabriel no seu dispositivo
            </p>
            <p className="text-xs text-s-brass-200">
              Acesso mais rápido e conveniente aos seus atendimentos
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleInstall}
            disabled={isInstalling}
            size="sm"
            className="bg-s-brass-300 hover:bg-s-brass-200 text-white text-xs"
          >
            <Download size={14} className="mr-1" />
            {isInstalling ? "Instalando..." : "Instalar"}
          </Button>
          {showDismiss && (
            <button
              onClick={handleDismiss}
              className="text-s-brass-200 hover:text-s-brass-300 p-1"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
