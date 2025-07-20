import { ChevronLeft } from "lucide-react";
import Link from "next/link";

import { Button } from "./button";

export const BackNavigationHeader = (props: {
  title: string;
  href: string;
}) => (
  <div className="flex items-center w-full">
    <Link className="flex items-center" href={props.href}>
      <Button size="icon" variant="ghost">
        <ChevronLeft />
      </Button>
      <p className="font-raleway font-bold text-xl !text-s-taupe-secondary">
        {props.title}
      </p>
    </Link>
  </div>
);
