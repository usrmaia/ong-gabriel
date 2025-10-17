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
  // PWA = true; Web = false
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

      // Mostrar prompt após 0,5 segundos na página (apenas se não estiver instalado)
      if (!isStandalone)
        setTimeout(() => {
          setShowInstallPrompt(true);
        }, 500);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, [isStandalone]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") console.log("PWA instalada com sucesso");

    setDeferredPrompt(null);
    setShowInstallPrompt(false);
  };

  /**
   * Define a visibilidade do prompt como falsa e armazena o estado de rejeição
   * no armazenamento de sessão para evitar mostrar o prompt novamente durante a sessão atual.
   */
  const handleDismiss = () => {
    setShowInstallPrompt(false);
    sessionStorage.setItem("pwa-prompt-dismissed", "true");
    sessionStorage.setItem("pwa-prompt-timestamp", Date.now().toString());
  };

  // Não mostrar se já foi dispensado nesta sessão
  const wasDismissed =
    typeof window !== "undefined" &&
    // Verifica se o prompt foi dispensado e se está dentro do limite de 24 horas
    sessionStorage.getItem("pwa-prompt-dismissed") === "true" &&
    Date.now() -
      parseInt(sessionStorage.getItem("pwa-prompt-timestamp") || "0") <
      24 * 60 * 60 * 1000; // 24 horas

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
