"use client";

import { useState, useEffect } from "react";
import { useServiceWorker } from "@/hooks/useServiceWorker";
import { InstallPWA } from "./install-pwa";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function PWAProvider({ children }: { children: React.ReactNode }) {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useServiceWorker();

  useEffect(() => {
    setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent));
    setIsStandalone(
      window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as any).standalone === true,
    );
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);

      // Mostrar prompt após 30 segundos na página (apenas se não for iOS e não estiver instalado)
      if (!isIOS && !isStandalone) {
        setTimeout(() => {
          setShowInstallPrompt(true);
        }, 30000);
      }
    };

    window.addEventListener("beforeinstallprompt", handler);

    // Para iOS, mostrar prompt após 1 minuto
    if (isIOS && !isStandalone) {
      setTimeout(() => {
        setShowInstallPrompt(true);
      }, 60000);
    }

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, [isIOS, isStandalone]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      console.log("PWA instalada com sucesso");
    }

    setDeferredPrompt(null);
    setShowInstallPrompt(false);
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    // Não mostrar novamente nesta sessão
    sessionStorage.setItem("pwa-prompt-dismissed", "true");
  };

  // Não mostrar se já foi dispensado nesta sessão
  const wasDismissed =
    typeof window !== "undefined" &&
    sessionStorage.getItem("pwa-prompt-dismissed") === "true";

  return (
    <>
      {children}
      {showInstallPrompt && !wasDismissed && !isStandalone && (
        <>
          {deferredPrompt && !isIOS ? (
            <div className="fixed bottom-4 left-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-gray-900">
                    Instalar ONG Gabriel
                  </h3>
                  <p className="text-xs text-gray-600 mt-1">
                    Adicione o app à sua tela inicial para acesso rápido
                  </p>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={handleDismiss}
                    className="px-3 py-1 text-xs text-gray-600 hover:text-gray-800"
                  >
                    Agora não
                  </button>
                  <button
                    onClick={handleInstallClick}
                    className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Instalar
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="fixed bottom-4 left-4 right-4 z-50">
              <InstallPWA onClose={handleDismiss} />
            </div>
          )}
        </>
      )}
    </>
  );
}
