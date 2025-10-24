"use client";

import { useEffect, useState } from "react";

/**
 * Hook para detectar se o usuário está online ou offline
 * @returns boolean - true se online, false se offline
 */
export function useOnlineStatus(): boolean {
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof window !== "undefined" ? navigator.onLine : true,
  );

  useEffect(() => {
    // Verifica o status inicial
    setIsOnline(navigator.onLine);

    // Função para atualizar o status
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    // Adiciona os event listeners
    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);

    // Cleanup
    return () => {
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
    };
  }, []);

  return isOnline;
}
