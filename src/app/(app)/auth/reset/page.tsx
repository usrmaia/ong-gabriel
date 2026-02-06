import { Suspense } from "react";

import { BackNavigationHeader } from "@/components/ui";
import { ResetForm } from "./form";

export default function ResetPage() {
  return (
    <>
      <BackNavigationHeader title="Redefinir senha" />
      <Suspense fallback={null}>
        <ResetForm />
      </Suspense>
    </>
  );
}
