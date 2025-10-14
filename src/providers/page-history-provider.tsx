"use client";

import { createContext, useContext, ReactNode } from "react";
import { usePageHistory, UsePageHistoryOptions } from "@/hooks";

interface PageHistoryContextType {
  canGoBack: boolean;
  historyLength: number;
  clearHistory: () => void;
}

const PageHistoryContext = createContext<PageHistoryContextType | null>(null);

interface PageHistoryProviderProps {
  children: ReactNode;
  options?: UsePageHistoryOptions;
}

export function PageHistoryProvider({
  children,
  options = {},
}: PageHistoryProviderProps) {
  const defaultOptions: UsePageHistoryOptions = {
    maxEntries: 15,
    excludePaths: ["/auth/login", "/auth/logout", "/api", "/_next"],
    storageKey: "ong-gabriel-page-history",
    ...options,
  };

  const { canGoBack, historyLength, clearHistory } =
    usePageHistory(defaultOptions);

  const contextValue: PageHistoryContextType = {
    canGoBack,
    historyLength,
    clearHistory,
  };

  return (
    <PageHistoryContext.Provider value={contextValue}>
      {children}
    </PageHistoryContext.Provider>
  );
}

export function usePageHistoryContext(): PageHistoryContextType {
  const context = useContext(PageHistoryContext);

  if (!context)
    throw new Error(
      "usePageHistoryContext deve ser usado dentro de um PageHistoryProvider",
    );

  return context;
}
