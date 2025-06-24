import { auth } from "@/auth";
import { FormAnamnesis } from "@/generated/prisma";
import {
  createPatientFormAnamnesis,
  getPatientFormAnamnesis,
} from "@/services/patient.service";
import { NextResponse } from "next/server";

// GET /api/patient/form-anamnesis
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const where = url.searchParams.get("where");
    const filter = where ? JSON.parse(where) : {};

    const formAnamnesis = await getPatientFormAnamnesis({ where: filter });
    return NextResponse.json(formAnamnesis, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Erro ao buscar formulários de anamnese" },
      { status: 400 },
    );
  }
}

// POST /api/patient/form-anamnesis
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id)
      return NextResponse.json(
        { error: "Usuário não autenticado" },
        { status: 401 },
      );

    const data = (await request.json()) as FormAnamnesis;
    data.userId = session.user.id;

    const formAnamnesis = await createPatientFormAnamnesis(data);
    return NextResponse.json(formAnamnesis, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
