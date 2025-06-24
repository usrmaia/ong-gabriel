import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { getPatientFormAnamnesisByUserId } from "@/services/patient.service";

// GET /api/patient/form-anamnesis/user
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id)
      return NextResponse.json(
        { error: "Usuário não autenticado" },
        { status: 401 },
      );
    const userId = session.user.id;
    const formAnamnesis = await getPatientFormAnamnesisByUserId({ userId });
    return NextResponse.json(formAnamnesis, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Erro ao buscar formulários de anamnese do usuário" },
      { status: 400 },
    );
  }
}
