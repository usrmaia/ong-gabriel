"use client";

import { ChevronLeft } from "lucide-react";
import { Button } from "./button";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export const BackNavigationHeader = (props: {
  title: string;
  href: string;
}) => {

  const pathname = usePathname();
  const historyRef = useRef<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    historyRef.current.push(pathname);
  }, [pathname]);

  const handleBack = () => {
    if (historyRef.current.length > 1) {
      router.back();
    } else {
      router.push("/employee/home");
    }
  };

  return (
    <div className="flex items-center w-full">
      <Button
        size="icon"
        variant="ghost"
        onClick={handleBack}
        aria-label="Voltar"
      >
        <ChevronLeft />
      </Button>
      <p className="font-raleway font-bold text-xl !text-s-taupe-secondary">
        {props.title}
      </p>
    </div>
  );
};
