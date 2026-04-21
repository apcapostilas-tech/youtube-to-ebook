import { NextRequest, NextResponse } from "next/server";
import { getJob, saveJob } from "@/lib/jobs";
import { generateEbook, generateSalesPage, generateSalesPageFromText } from "@/lib/claude";

export const runtime = "nodejs";
export const maxDuration = 120;

export async function POST(request: NextRequest) {
  const { jobId } = await request.json();

  const job = getJob(jobId);
  if (!job?.transcript) {
    return NextResponse.json({ success: false, error: "Job ou conteúdo não encontrado" }, { status: 404 });
  }

  try {
    job.status = "generating";
    saveJob(job);

    const apiKey = job.anthropicKey;
    const lang = job.language || "pt-BR";
    const mode = job.generateMode || "both";
    const contentType = job.contentType || "transcript";

    if (mode === "ebook" || mode === "both") {
      job.ebook = await generateEbook(job.transcript, job.videoTitle || "", apiKey, lang, contentType);
      saveJob(job);
    }

    if (mode === "sales") {
      // Generate sales page directly from raw content
      job.salesPage = await generateSalesPageFromText(job.transcript, contentType, apiKey, lang);
      saveJob(job);
    } else if (mode === "both" && job.ebook) {
      // Generate sales page from ebook
      job.salesPage = await generateSalesPage(job.ebook, apiKey, lang);
      saveJob(job);
    }

    job.status = "done";
    saveJob(job);

    return NextResponse.json({
      success: true,
      data: {
        jobId: job.id,
        mode,
        ebookTitle: job.ebook?.title,
        hasSalesPage: !!job.salesPage,
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
