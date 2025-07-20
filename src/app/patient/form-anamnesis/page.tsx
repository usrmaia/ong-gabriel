import { Suspense } from "react";

import { PatientFormAnamnesis } from "./form";

export default async function PatientFormAnamnesisPage() {
  return (
    <Suspense fallback={<span>Loading...</span>}>
      <PatientFormAnamnesis />
    </Suspense>
  );
}
