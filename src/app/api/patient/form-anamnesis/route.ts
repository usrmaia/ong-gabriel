import { NextResponse } from "next/server";

import { FormAnamnesis } from "@/generated/prisma";
import {
  createPatientFormAnamnesis,
  getPatientFormAnamnesis,
} from "@/services/patient.service";
import { getParams } from "@/utils";

// GET /api/patient/form-anamnesis
export async function GET(req: Request) {
  const filter = { where: getParams(req.url) };

  const formAnamnesis = await getPatientFormAnamnesis(filter);
  return NextResponse.json(formAnamnesis);
}

// POST /api/patient/form-anamnesis
export async function POST(request: Request) {
  const formAnamnesis = (await request.json()) as FormAnamnesis;
  const result = await createPatientFormAnamnesis(formAnamnesis);

  if (!result.success)
    return NextResponse.json({ error: result.error }, { status: result.code });
  return NextResponse.json(result.data, { status: result.code });
}
