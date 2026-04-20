import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { getTranscript, extractVideoId, getVideoThumbnail } from "@/lib/youtube";
import { saveJob } from "@/lib/jobs";
import { ProjectJob } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  const { url, anthropicKey } = await request.json();

  if (!url) return NextResponse.json({ success: false, error: "URL obrigatória" }, { status: 400 });

  const videoId = extractVideoId(url);
  if (!videoId) return NextResponse.json({ success: false, error: "URL do YouTube inválida" }, { status: 400 });

  try {
    const { transcript, title } = await getTranscript(url);

    const job: ProjectJob = {
      id: uuidv4(),
      youtubeUrl: url,
      videoId,
      videoTitle: title || "Vídeo do YouTube",
      thumbnail: getVideoThumbnail(videoId),
      transcript,
      anthropicKey: anthropicKey || undefined,
      status: "pending",
      createdAt: Date.now(),
    };

    saveJob(job);

    return NextResponse.json({
      success: true,
      data: {
        jobId: job.id,
        videoTitle: job.videoTitle,
        thumbnail: job.thumbnail,
        transcriptLength: transcript.length,
      },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Erro ao extrair transcrição";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
