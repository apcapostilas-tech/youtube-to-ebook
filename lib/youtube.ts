import { YoutubeTranscript } from "youtube-transcript";

async function fetchTranscriptDirect(videoId: string): Promise<string> {
  const response = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    },
  });

  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const html = await response.text();

  const captionMatch = html.match(/"captionTracks"\s*:\s*(\[[\s\S]*?\])\s*,\s*"audioTracks"/);
  if (!captionMatch) throw new Error("Legendas não disponíveis neste vídeo");

  const captionTracks = JSON.parse(captionMatch[1]);
  if (!captionTracks.length) throw new Error("Nenhuma legenda encontrada");

  const track =
    captionTracks.find((t: { languageCode?: string; kind?: string }) => t.languageCode?.startsWith("pt") && t.kind !== "asr") ||
    captionTracks.find((t: { languageCode?: string }) => t.languageCode?.startsWith("pt")) ||
    captionTracks.find((t: { languageCode?: string }) => t.languageCode?.startsWith("es")) ||
    captionTracks.find((t: { languageCode?: string }) => t.languageCode?.startsWith("en")) ||
    captionTracks[0];

  if (!track?.baseUrl) throw new Error("URL da legenda não encontrada");

  const captionUrl = track.baseUrl.startsWith("http")
    ? track.baseUrl
    : `https://www.youtube.com${track.baseUrl}`;

  const captionRes = await fetch(`${captionUrl}&fmt=json3`);
  if (!captionRes.ok) throw new Error("Falha ao buscar legendas");

  const captionData = await captionRes.json();

  const text = ((captionData.events || []) as Array<{ segs?: Array<{ utf8?: string }> }>)
    .filter((e) => e.segs)
    .map((e) => e.segs!.map((s) => s.utf8 || "").join(""))
    .join(" ")
    .replace(/\[.*?\]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  if (!text) throw new Error("Transcrição vazia");
  return text;
}

export async function getTranscript(url: string): Promise<{ transcript: string; title: string }> {
  const videoId = extractVideoId(url);
  if (!videoId) throw new Error("URL do YouTube inválida");

  try {
    const transcript = await fetchTranscriptDirect(videoId);
    console.log("Transcrição obtida via método direto:", transcript.length, "chars");
    return { transcript, title: "" };
  } catch (directErr) {
    console.error("Método direto falhou:", directErr instanceof Error ? directErr.message : directErr);
  }

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
  console.error("youtube-transcript fallback error:", msg);
  throw new Error(
    `Não foi possível extrair a transcrição automaticamente. Cole o texto do vídeo manualmente no campo "Transcrição Manual".`
  );
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
