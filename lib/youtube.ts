import { YoutubeTranscript } from "youtube-transcript";
import ytdl from "ytdl-core";

interface CaptionTrack {
  baseUrl?: string;
  languageCode?: string;
  kind?: string;
}

function parseCaptionEvents(
  events: Array<{ segs?: Array<{ utf8?: string }> }>
): string {
  return events
    .filter((e) => e.segs)
    .map((e) => e.segs!.map((s) => s.utf8 || "").join(""))
    .join(" ")
    .replace(/\[.*?\]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

async function fetchCaptionUrl(url: string): Promise<string> {
  const captionRes = await fetch(url.includes("fmt=") ? url : `${url}&fmt=json3`);
  if (!captionRes.ok) throw new Error("Falha ao baixar legenda");
  const data = await captionRes.json();
  const text = parseCaptionEvents(data.events || []);
  if (!text) throw new Error("Transcrição vazia");
  return text;
}

function pickTrack(tracks: CaptionTrack[]): CaptionTrack {
  return (
    tracks.find((t) => t.languageCode?.startsWith("pt") && t.kind !== "asr") ||
    tracks.find((t) => t.languageCode?.startsWith("pt")) ||
    tracks.find((t) => t.languageCode?.startsWith("es")) ||
    tracks.find((t) => t.languageCode?.startsWith("en")) ||
    tracks[0]
  );
}

// Method 1: ytdl-core (most reliable, updated frequently to bypass YouTube)
async function fetchViaYtdl(videoId: string): Promise<string> {
  const info = await ytdl.getInfo(`https://www.youtube.com/watch?v=${videoId}`);
  const tracks: CaptionTrack[] =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (info as any).player_response?.captions?.playerCaptionsTracklistRenderer
      ?.captionTracks || [];
  if (!tracks.length) throw new Error("Sem legendas (ytdl)");
  const track = pickTrack(tracks);
  if (!track.baseUrl) throw new Error("baseUrl ausente");
  return fetchCaptionUrl(`${track.baseUrl}&fmt=json3`);
}

// Method 2: InnerTube WEB client
async function fetchViaInnerTube(videoId: string): Promise<string> {
  const res = await fetch("https://www.youtube.com/youtubei/v1/player", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      "X-YouTube-Client-Name": "1",
      "X-YouTube-Client-Version": "2.20240101.00.00",
      Origin: "https://www.youtube.com",
      Referer: `https://www.youtube.com/watch?v=${videoId}`,
    },
    body: JSON.stringify({
      videoId,
      context: {
        client: {
          clientName: "WEB",
          clientVersion: "2.20240101.00.00",
          hl: "pt",
          gl: "BR",
        },
      },
    }),
  });
  if (!res.ok) throw new Error(`InnerTube HTTP ${res.status}`);
  const data = await res.json();
  const tracks: CaptionTrack[] =
    data?.captions?.playerCaptionsTracklistRenderer?.captionTracks || [];
  if (!tracks.length) throw new Error("Sem legendas (InnerTube)");
  const track = pickTrack(tracks);
  if (!track.baseUrl) throw new Error("baseUrl ausente");
  return fetchCaptionUrl(`${track.baseUrl}&fmt=json3`);
}

// Method 3: InnerTube TV client
async function fetchViaTV(videoId: string): Promise<string> {
  const res = await fetch("https://www.youtube.com/youtubei/v1/player", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      videoId,
      context: { client: { clientName: "TVHTML5", clientVersion: "7.20220325" } },
    }),
  });
  if (!res.ok) throw new Error(`TV InnerTube HTTP ${res.status}`);
  const data = await res.json();
  const tracks: CaptionTrack[] =
    data?.captions?.playerCaptionsTracklistRenderer?.captionTracks || [];
  if (!tracks.length) throw new Error("Sem legendas (TV)");
  const track = pickTrack(tracks);
  if (!track.baseUrl) throw new Error("baseUrl ausente");
  return fetchCaptionUrl(`${track.baseUrl}&fmt=json3`);
}

// Method 4: youtube-transcript library fallback
async function fetchViaLibrary(videoId: string): Promise<string> {
  const langs = ["pt", "pt-BR", "es", "en", ""];
  for (const lang of langs) {
    try {
      const opts = lang ? { lang } : undefined;
      const items = await YoutubeTranscript.fetchTranscript(videoId, opts);
      if (items?.length) {
        return items.map((i) => i.text).join(" ").replace(/\s+/g, " ").trim();
      }
    } catch { continue; }
  }
  throw new Error("youtube-transcript falhou em todos os idiomas");
}

export async function getTranscript(
  url: string
): Promise<{ transcript: string; title: string }> {
  const videoId = extractVideoId(url);
  if (!videoId) throw new Error("URL do YouTube inválida");

  const methods = [
    { name: "ytdl-core", fn: () => fetchViaYtdl(videoId) },
    { name: "InnerTube WEB", fn: () => fetchViaInnerTube(videoId) },
    { name: "InnerTube TV", fn: () => fetchViaTV(videoId) },
    { name: "youtube-transcript", fn: () => fetchViaLibrary(videoId) },
  ];

  for (const m of methods) {
    try {
      const transcript = await m.fn();
      console.log(`✓ Transcript via ${m.name}: ${transcript.length} chars`);
      return { transcript, title: "" };
    } catch (err) {
      console.error(`✗ ${m.name}:`, err instanceof Error ? err.message : err);
    }
  }

  throw new Error(
    'Não foi possível extrair a transcrição automaticamente. Cole o texto do vídeo manualmente no campo "Transcrição Manual".'
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
