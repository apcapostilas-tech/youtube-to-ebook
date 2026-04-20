import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { getTranscript, extractVideoId, getVideoThumbnail } from "@/lib/youtube";
import { saveJob } from "@/lib/jobs";
import { ProjectJob } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  const { url, transcript: manualTranscript, anthropicKey } = await request.json();

  if (!url && !manualTranscript) {
    return NextResponse.json({ success: false, error: "URL ou transcript obrigatório" }, { status: 400 });
  }

  const videoId = url ? extractVideoId(url) : null;

  try {
    let transcript: string;
    let title = "";

    if (manualTranscript?.trim()) {
      transcript = manualTranscript.trim();
    } else {
      const result = await getTranscript(url);
      transcript = result.transcript;
      title = result.title;
    }

    const job: ProjectJob = {
      id: uuidv4(),
      youtubeUrl: url || "",
      videoId: videoId || undefined,
      videoTitle: title || "Conteúdo do Vídeo",
      thumbnail: videoId ? getVideoThumbnail(videoId) : undefined,
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
