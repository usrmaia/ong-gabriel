import { Suspense } from "react";

import { BackNavigationHeader } from "@/components/ui";
import RegisterForm from "./form";

export default function RegisterPage() {
  return (
    <>
      <BackNavigationHeader title="Cadastre-se" />
      <Suspense fallback={null}>
        <RegisterForm />
      </Suspense>
    </>
  );
}
