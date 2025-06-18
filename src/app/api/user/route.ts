import { NextRequest, NextResponse } from "next/server";
import logger from "@/config/logger";

import { updateUserBaseInfo } from "@/services";
import { auth } from "@/auth";

export async function PUT(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id)
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

    const body = await req.json();

    const updatedUser = await updateUserBaseInfo(session.user.id, body);

    return NextResponse.json(updatedUser);
  } catch (error: any) {
    logger.error("Erro ao atualizar usuário:", error);
    return NextResponse.json(
      { error: error.message || "Erro ao atualizar usuário" },
      { status: 400 },
    );
  }
}
