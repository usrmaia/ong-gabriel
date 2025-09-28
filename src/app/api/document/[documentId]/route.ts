import { NextRequest, NextResponse } from "next/server";

import logger from "@/config/logger";
import { getDocumentById } from "@/services";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ documentId: string }> },
) {
  try {
    const { documentId } = await params;
    const documentResult = await getDocumentById(documentId);

    if (!documentResult.success || !documentResult.data) {
      return NextResponse.json(
        {
          error: documentResult.error || "Document not found",
        },
        { status: documentResult.code || 404 },
      );
    }

    const document = documentResult.data;

    return new NextResponse(Buffer.from(document.data), {
      headers: {
        "Content-Type": document.mimeType,
        "Content-Disposition": `inline; filename="${encodeURIComponent(document.name)}"`,
      },
    });
  } catch (error) {
    logger.error("Error serving document:", error);
    return NextResponse.json(
      { error: "Error serving document!" },
      { status: 500 },
    );
  }
}
