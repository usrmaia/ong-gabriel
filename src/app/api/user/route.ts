import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/auth";
import logger from "@/config/logger";
import { updateUserBaseInfo } from "@/services";

// PUT /api/user
export async function PUT(req: NextRequest) {
  try {
    const userId = (await auth())?.user.id!;
    const body = await req.json();

    const { success, data, error } = await updateUserBaseInfo(userId, body);

    if (!success) return NextResponse.json({ error }, { status: 400 });
    return NextResponse.json(data);
  } catch (error: any) {
    logger.error("Erro ao atualizar usuário:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar usuário!" },
      { status: 500 },
    );
  }
}
