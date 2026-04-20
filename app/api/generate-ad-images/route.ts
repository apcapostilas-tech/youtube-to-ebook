import { NextRequest, NextResponse } from "next/server";
import { getJob, saveJob } from "@/lib/jobs";
import { generateImage } from "@/lib/wavespeed";

export const runtime = "nodejs";
export const maxDuration = 120;

export async function POST(request: NextRequest) {
  const { jobId } = await request.json();

  const job = getJob(jobId);
  if (!job?.adCreatives?.length) {
    return NextResponse.json({ success: false, error: "Criativos não encontrados" }, { status: 404 });
  }

  const results: { index: number; url: string }[] = [];
  const errors: string[] = [];

  for (let i = 0; i < job.adCreatives.length; i++) {
    const creative = job.adCreatives[i];
    if (creative.imageUrl) continue;
    try {
      const url = await generateImage(creative.imagePrompt);
      job.adCreatives[i].imageUrl = url;
      results.push({ index: i, url });
    } catch (err) {
      errors.push(`${creative.format}: ${err instanceof Error ? err.message : "erro"}`);
    }
  }

  saveJob(job);
  return NextResponse.json({ success: true, data: { generated: results.length, errors } });
}
