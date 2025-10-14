"use client";

import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "./button";

export const BackNavigationHeader = (props: {
  title: string;
  href: string;
}) => {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    router.back();
    e.preventDefault();
  };

  return (
    <div className="flex items-center w-full">
      <Link
        className="flex items-center"
        href={props.href}
        onClick={handleClick}
      >
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
