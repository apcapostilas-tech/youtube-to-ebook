import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { saveJob } from "@/lib/jobs";
import { ProjectJob } from "@/lib/types";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const { content, contentType, generateMode, anthropicKey, language } = await request.json();

  if (!content?.trim()) {
    return NextResponse.json({ success: false, error: "Conteúdo obrigatório" }, { status: 400 });
  }

  const job: ProjectJob = {
    id: uuidv4(),
    youtubeUrl: "",
    transcript: content.trim(),
    contentType: contentType || "transcript",
    generateMode: generateMode || "both",
    anthropicKey: anthropicKey || undefined,
    language: language || "pt-BR",
    status: "pending",
    createdAt: Date.now(),
  };

  saveJob(job);

  return NextResponse.json({
    success: true,
    data: { jobId: job.id },
  });
}
