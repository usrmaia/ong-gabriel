"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useOnlineStatus } from "@/hooks";

/**
 * Componente que monitora o status de conexão e redireciona para /offline quando necessário
 */
export function OfflineMonitor() {
  const isOnline = useOnlineStatus();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const excludedRoutes = ["/offline", "/~offline"];

    // Se está offline e não está em uma página offline, redireciona
    if (!isOnline && !excludedRoutes.includes(pathname))
      router.push("/~offline");
    // Se voltou online e está na página offline, redireciona para a página anterior
    if (isOnline && excludedRoutes.includes(pathname)) router.back();
  }, [isOnline, pathname, router]);

  return null;
}
