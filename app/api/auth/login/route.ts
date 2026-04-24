import { NextRequest, NextResponse } from "next/server";
import { loginUser } from "@/lib/users";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  if (!email || !password) return NextResponse.json({ ok: false, error: "Preencha todos os campos." });
  const result = loginUser(email, password);
  if (!result.ok) return NextResponse.json(result);
  const res = NextResponse.json({ ok: true });
  res.cookies.set("mccl_session", result.token!, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });
  return res;
}
