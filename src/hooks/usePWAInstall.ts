"use client";

import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}

interface DeviceInfo {
  platform: "windows" | "mac" | "linux" | "ios" | "android" | "other";
  userAgent: "chrome" | "firefox" | "safari" | "edge" | "other";
  deviceType?: "mobile" | "tablet" | "desktop";
}

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    platform: "other",
    userAgent: "other",
    deviceType: "mobile",
  });

  useEffect(() => {
    const detectDeviceInfo = (): DeviceInfo => {
      const deviceInfo: DeviceInfo = {
        platform: "other",
        userAgent: "other",
        deviceType: "mobile",
      };
      const userAgent = navigator.userAgent.toLowerCase();
      console.log(userAgent);
      const platform = navigator.platform.toLowerCase();

      // Detecção de browser
      if (/chrome/.test(userAgent) && !/edge|edg/.test(userAgent))
        deviceInfo.userAgent = "chrome";
      else if (/firefox/.test(userAgent)) deviceInfo.userAgent = "firefox";
      else if (/safari/.test(userAgent) && !/chrome/.test(userAgent))
        deviceInfo.userAgent = "safari";
      else if (/edge|edg/.test(userAgent)) deviceInfo.userAgent = "edge";

      // Detecção de sistema operacional
      if (/win/.test(platform) || /windows/.test(userAgent))
        deviceInfo.platform = "windows";
      else if (/mac/.test(platform) || /macintosh/.test(userAgent))
        deviceInfo.platform = "mac";
      else if (/linux/.test(platform) && !/android/.test(userAgent))
        deviceInfo.platform = "linux";
      else if (
        /iphone|ipad|ipod/.test(userAgent) ||
        (/mac/.test(platform) && navigator.maxTouchPoints > 1)
      )
        deviceInfo.platform = "ios";
      else if (/android/.test(userAgent)) deviceInfo.platform = "android";

      // Detecção de tipo de dispositivo
      if (
        /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
          userAgent,
        ) ||
        (navigator.maxTouchPoints > 1 && /mac/.test(platform))
      )
        deviceInfo.deviceType = "mobile";
      else if (
        /ipad/.test(userAgent) ||
        (navigator.maxTouchPoints > 1 && /mac/.test(platform)) ||
        (/android/.test(userAgent) && !/mobile/.test(userAgent))
      )
        deviceInfo.deviceType = "tablet";
      else deviceInfo.deviceType = "desktop";

      return deviceInfo;
    };

    // Verifica se o PWA já está instalado
    const checkIfInstalled = () => {
      const isStandalone = window.matchMedia(
        "(display-mode: standalone)",
      ).matches;
      const isAppInstalled =
        window.navigator && "standalone" in window.navigator;
      setIsInstalled(
        isStandalone ||
          (isAppInstalled && (window.navigator as any).standalone),
      );
    };

    setDeviceInfo(detectDeviceInfo());
    checkIfInstalled();

    // Listener para o evento beforeinstallprompt
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      // Previne o banner padrão do navegador
      e.preventDefault();

      // Salva o evento para uso posterior
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    // Listener para quando o app é instalado
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    // Adiciona os event listeners
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    // Cleanup
    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const installPWA = async () => {
    if (!deferredPrompt) return false;

    setIsInstalling(true);

    try {
      // Mostra o prompt de instalação
      await deferredPrompt.prompt();

      // Espera a escolha do usuário
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === "accepted") {
        setIsInstalled(true);
        setIsInstallable(false);
        setDeferredPrompt(null);
        return true;
      }

      return false;
    } catch (error) {
      console.error("Erro ao instalar PWA:", error);
      return false;
    } finally {
      setIsInstalling(false);
    }
  };

  const canInstall = isInstallable && !isInstalled && deferredPrompt !== null;

  return {
    canInstall,
    isInstalled,
    isInstalling,
    installPWA,
    deviceInfo,
  };
}
