import { NextRequest, NextResponse } from "next/server";
import { getJob } from "@/lib/jobs";

export const runtime = "nodejs";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const job = getJob(id);
  if (!job?.ebook) return NextResponse.json({ error: "Ebook não encontrado" }, { status: 404 });

  // Redirect to the ebook page with ?print=1 so browser auto-opens print dialog
  const origin = request.nextUrl.origin;
  return NextResponse.redirect(`${origin}/ebook/${id}?print=1`);
}
