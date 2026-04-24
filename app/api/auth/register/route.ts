import { NextRequest, NextResponse } from "next/server";
import { registerUser } from "@/lib/users";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  if (!email || !password) return NextResponse.json({ ok: false, error: "Preencha todos os campos." });
  if (password.length < 6) return NextResponse.json({ ok: false, error: "Senha mínima de 6 caracteres." });
  const result = registerUser(email, password);
  return NextResponse.json(result);
}
