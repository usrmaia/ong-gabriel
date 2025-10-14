"use client";

import { useCallback, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useLocalStorage } from "./use-local-storage";

export interface PageHistoryEntry {
  path: string;
  timestamp: number;
  title?: string;
}

export interface UsePageHistoryOptions {
  maxEntries?: number;
  excludePaths?: string[];
  storageKey?: string;
}

/**
 * Hook para gerenciar histórico de páginas visitadas pelo usuário
 * @param options Opções de configuração
 * @returns Objeto com métodos e dados do histórico
 */
export function usePageHistory(options: UsePageHistoryOptions = {}) {
  const {
    maxEntries = 10,
    excludePaths = ["/auth/login", "/auth/logout"],
    storageKey = "page-history",
  } = options;

  const pathname = usePathname();

  const [history, setHistory] = useLocalStorage<PageHistoryEntry[]>(
    storageKey,
    [],
  );

  // Função para adicionar nova entrada ao histórico
  const addToHistory = useCallback(
    (path: string, title?: string) => {
      // Verificar se o path deve ser excluído
      if (excludePaths.some((excludePath) => path.startsWith(excludePath)))
        return;

      setHistory((prevHistory) => {
        const newEntry: PageHistoryEntry = {
          path,
          timestamp: Date.now(),
          title,
        };

        // Remover entrada duplicada se existir
        const filteredHistory = prevHistory.filter(
          (entry) => entry.path !== path,
        );

        // Adicionar nova entrada no início
        const newHistory = [newEntry, ...filteredHistory];

        // Limitar o número de entradas
        return newHistory.slice(0, maxEntries);
      });
    },
    [excludePaths, maxEntries, setHistory],
  );

  // Função para obter a página anterior (mais recente exceto a atual)
  const getPreviousPage = useCallback((): PageHistoryEntry | null => {
    // Filtrar a página atual do histórico
    const filteredHistory = history.filter((entry) => entry.path !== pathname);

    return filteredHistory.length > 0 ? filteredHistory[0] : null;
  }, [history, pathname]);

  // Função para limpar o histórico
  const clearHistory = useCallback(() => {
    setHistory([]);
  }, [setHistory]);

  // Adicionar página atual ao histórico quando a rota mudar
  useEffect(() => {
    if (!pathname) return;

    // Verificar se o path deve ser excluído
    if (excludePaths.some((excludePath) => pathname.startsWith(excludePath))) {
      return;
    }

    setHistory((prevHistory) => {
      // Verificar se a página atual já é a mais recente
      if (prevHistory.length > 0 && prevHistory[0].path === pathname) {
        return prevHistory;
      }

      const newEntry: PageHistoryEntry = {
        path: pathname,
        timestamp: Date.now(),
      };

      // Remover entrada duplicada se existir
      const filteredHistory = prevHistory.filter(
        (entry) => entry.path !== pathname,
      );

      // Adicionar nova entrada no início
      const newHistory = [newEntry, ...filteredHistory];

      // Limitar o número de entradas
      return newHistory.slice(0, maxEntries);
    });
  }, [pathname, excludePaths, maxEntries, setHistory]);

  const removeFromHistory = useCallback(
    (path: string) => {
      setHistory((prevHistory) =>
        prevHistory.filter((entry) => entry.path !== path),
      );
    },
    [setHistory],
  );

  return {
    // Dados
    history,
    currentPath: pathname,

    // Métodos de consulta
    getPreviousPage,

    // Métodos de gerenciamento
    addToHistory,
    removeFromHistory,
    clearHistory,

    // Estados úteis
    canGoBack: getPreviousPage() !== null,
    historyLength: history.length,
  };
}
