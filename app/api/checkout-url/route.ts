import { NextRequest, NextResponse } from "next/server";
import { getJob, saveJob } from "@/lib/jobs";

export async function POST(request: NextRequest) {
  const { jobId, checkoutUrl, pixelId } = await request.json();
  const job = getJob(jobId);
  if (!job) return NextResponse.json({ success: false, error: "Job não encontrado" }, { status: 404 });
  if (checkoutUrl !== undefined) job.checkoutUrl = checkoutUrl;
  if (pixelId !== undefined) job.pixelId = pixelId;
  saveJob(job);
  return NextResponse.json({ success: true });
}
