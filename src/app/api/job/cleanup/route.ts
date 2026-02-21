import { NextResponse } from "next/server"
import { runCleanup } from "@/services/cleanup.service"

export async function POST() {
  try {
    await runCleanup()
    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}