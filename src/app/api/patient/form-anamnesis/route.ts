import { NextResponse } from "next/server";

import { auth } from "@/auth";
import logger from "@/config/logger";
import { FormAnamnesis } from "@/generated/prisma";
import {
  createPatientFormAnamnesis,
  getPatientFormAnamnesis,
} from "@/services/patient.service";
import { getParams } from "@/utils";

// GET /api/patient/form-anamnesis
export async function GET(req: Request) {
  try {
    const filter = { where: getParams(req.url) };

    const formAnamnesis = await getPatientFormAnamnesis(filter);
    return NextResponse.json(formAnamnesis, { status: 200 });
  } catch (error: any) {
    logger.error("Erro ao buscar formulários de anamnese:", error);
    return NextResponse.json(
      { error: "Erro ao buscar formulários de anamnese!" },
      { status: 500 },
    );
  }
}

// POST /api/patient/form-anamnesis
export async function POST(request: Request) {
  try {
    const formAnamnesis = (await request.json()) as FormAnamnesis;
    formAnamnesis.userId = (await auth())?.user.id!;

    const { success, data, error } =
      await createPatientFormAnamnesis(formAnamnesis);

    if (!success) return NextResponse.json({ error }, { status: 400 });
    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    logger.error("Erro ao criar formulário de anamnese:", error);
    return NextResponse.json(
      { error: "Erro ao criar formulário de anamnese!" },
      { status: 500 },
    );
  }
}
