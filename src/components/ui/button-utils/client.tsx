"use client";

import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { Button } from "../button";

export const ClientBackNavigationHeader = (props: {
  title: string;
  href: string;
}) => {
  const searchParams = useSearchParams();
  const backTo = searchParams.get("backTo");

  return (
    <div className="flex items-center w-full">
      <Link className="flex items-center" href={backTo ?? props.href}>
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
