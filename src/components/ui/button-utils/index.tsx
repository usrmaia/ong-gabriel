"use client";

import { Suspense } from "react";
import {
  ClientBackNavigationHeader,
  FallbackBackNavigationHeader,
} from "./client";

export const BackNavigationHeader = (props: {
  title: string;
  href: string;
}) => (
  <Suspense fallback={<FallbackBackNavigationHeader {...props} />}>
    <ClientBackNavigationHeader {...props} />
  </Suspense>
);
