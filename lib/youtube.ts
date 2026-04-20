import { YoutubeTranscript } from "youtube-transcript";

export async function getTranscript(url: string): Promise<{ transcript: string; title: string }> {
  const videoId = extractVideoId(url);
  if (!videoId) throw new Error("URL do YouTube inválida");

  try {
    const items = await YoutubeTranscript.fetchTranscript(videoId);
    const transcript = items.map((i) => i.text).join(" ").replace(/\s+/g, " ").trim();
    return { transcript, title: "" };
  } catch {
    throw new Error("Não foi possível extrair a transcrição. Verifique se o vídeo tem legendas ativadas.");
  }
}

export function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/shorts\/([^&\n?#]+)/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

export function getVideoThumbnail(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
}
