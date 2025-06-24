import { NextResponse } from "next/server";

import { auth } from "@/auth";
import logger from "@/config/logger";
import { getPatientFormAnamnesisByUserId } from "@/services/patient.service";

// GET /api/patient/form-anamnesis/user
export async function GET() {
  try {
    const userId = (await auth())?.user.id!;
    const formAnamnesis = await getPatientFormAnamnesisByUserId({ userId });
    return NextResponse.json(formAnamnesis, { status: 200 });
  } catch (error: any) {
    logger.error("Erro ao buscar formulários de anamnese do usuário:", error);
    return NextResponse.json(
      { error: "Erro ao buscar formulários de anamnese do usuário!" },
      { status: 500 },
    );
  }
}
