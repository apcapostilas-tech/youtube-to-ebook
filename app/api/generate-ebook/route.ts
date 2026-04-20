import { NextRequest, NextResponse } from "next/server";
import { getJob, saveJob } from "@/lib/jobs";
import { generateEbook, generateSalesPage, generateAdCreatives } from "@/lib/claude";

export const runtime = "nodejs";
export const maxDuration = 120;

export async function POST(request: NextRequest) {
  const { jobId } = await request.json();

  const job = getJob(jobId);
  if (!job?.transcript) {
    return NextResponse.json({ success: false, error: "Job ou transcrição não encontrada" }, { status: 404 });
  }

  try {
    job.status = "generating";
    saveJob(job);

    const apiKey = job.anthropicKey;
    const lang = job.language || "pt-BR";

    job.ebook = await generateEbook(job.transcript, job.videoTitle || "", apiKey, lang);
    saveJob(job);

    job.salesPage = await generateSalesPage(job.ebook, apiKey, lang);
    saveJob(job);

    job.adCreatives = await generateAdCreatives(job.ebook, job.salesPage, apiKey, lang);

    job.status = "done";
    saveJob(job);

    return NextResponse.json({
      success: true,
      data: {
        jobId: job.id,
        ebookTitle: job.ebook.title,
        chaptersCount: job.ebook.chapters.length,
        adsCount: job.adCreatives.length,
      },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Erro ao gerar conteúdo";
    job.status = "error";
    job.error = msg;
    saveJob(job);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
