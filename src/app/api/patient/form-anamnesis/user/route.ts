import { NextResponse } from "next/server";

import { getPatientFormAnamnesisFromUser } from "@/services/patient.service";

// GET /api/patient/form-anamnesis/user
export async function GET() {
  const formAnamnesis = await getPatientFormAnamnesisFromUser();
  return NextResponse.json(formAnamnesis);
}
