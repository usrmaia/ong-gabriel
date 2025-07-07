import { NextRequest, NextResponse } from "next/server";

import logger from "@/config/logger";
import { updateUserBaseInfo } from "@/services";

// PUT /api/user
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await updateUserBaseInfo(body);

    if (!result.success)
      return NextResponse.json({ error: result.error }, { status: 400 });
    return NextResponse.json(result.data);
  } catch (error: any) {
    logger.error("Erro ao atualizar usuário:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar usuário!" },
      { status: 500 },
    );
  }
}
