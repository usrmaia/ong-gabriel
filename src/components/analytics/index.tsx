import { env } from "@/config/env";
import { Hotjar } from "./hotjar";

export function Analytics() {
  const hotjarId = env.NEXT_PUBLIC_HOTJAR_ID;
  if (!hotjarId || env.NODE_ENV !== "production") return null;

  return <Hotjar hjid={hotjarId} />;
}
