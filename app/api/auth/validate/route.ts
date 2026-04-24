import { NextRequest, NextResponse } from "next/server";
import { validateToken } from "@/lib/users";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("mccl_session")?.value || "";
  return NextResponse.json({ ok: validateToken(token) });
}
