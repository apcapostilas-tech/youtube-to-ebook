import { YoutubeTranscript } from "youtube-transcript";

export async function getTranscript(url: string): Promise<{ transcript: string; title: string }> {
  const videoId = extractVideoId(url);
  if (!videoId) throw new Error("URL do YouTube inválida");

  const langs = ["pt", "pt-BR", "es", "en", ""];

  let lastError: unknown;

  for (const lang of langs) {
    try {
      const opts = lang ? { lang } : undefined;
      const items = await YoutubeTranscript.fetchTranscript(videoId, opts);
      if (items && items.length > 0) {
        const transcript = items.map((i) => i.text).join(" ").replace(/\s+/g, " ").trim();
        return { transcript, title: "" };
      }
    } catch (err) {
      lastError = err;
      continue;
    }
  }

  const msg = lastError instanceof Error ? lastError.message : String(lastError);
  console.error("youtube-transcript error:", msg);
  throw new Error(`Não foi possível extrair a transcrição (${msg}). Certifique-se que o vídeo tem legendas ativadas e é público.`);
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
