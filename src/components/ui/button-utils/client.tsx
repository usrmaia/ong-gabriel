"use client";

import { ChevronLeft } from "lucide-react";
import Link from "next/link";

import { Button } from "../button";
import { usePageHistory } from "@/hooks";

export const ClientBackNavigationHeader = (props: {
  title: string;
  href: string;
}) => {
  const { getPreviousPage, canGoBack, removeFromHistory } = usePageHistory();

  // Prioridade: backTo > histórico > href padrão
  const getNavigationHref = () => {
    if (canGoBack) {
      const previousPage = getPreviousPage();
      removeFromHistory(previousPage?.path || "");
      return previousPage?.path || props.href;
    }

    return props.href;
  };

  return (
    <div className="flex items-center w-full">
      <Link className="flex items-center" href={getNavigationHref()}>
        <Button size="icon" variant="ghost">
          <ChevronLeft />
        </Button>
        <p className="font-raleway font-bold text-xl !text-s-taupe-secondary">
          {props.title}
        </p>
      </Link>
    </div>
  );
};

export const FallbackBackNavigationHeader = (props: { title: string }) => (
  <div className="flex items-center w-full">
    <Button size="icon" variant="ghost" disabled>
      <ChevronLeft />
    </Button>
    <p className="font-raleway font-bold text-xl !text-s-taupe-secondary">
      {props.title}
    </p>
  </div>
);
