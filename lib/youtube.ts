import { YoutubeTranscript } from "youtube-transcript";

// Method 1: InnerTube API (most reliable - same API the YouTube web client uses)
async function fetchTranscriptInnerTube(videoId: string): Promise<string> {
  const body = {
    videoId,
    context: {
      client: {
        clientName: "WEB",
        clientVersion: "2.20240101.00.00",
        hl: "pt",
        gl: "BR",
        userAgent:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      },
    },
  };

  const playerRes = await fetch("https://www.youtube.com/youtubei/v1/player", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      "Accept-Language": "pt-BR,pt;q=0.9,en;q=0.8",
      "X-YouTube-Client-Name": "1",
      "X-YouTube-Client-Version": "2.20240101.00.00",
      Origin: "https://www.youtube.com",
      Referer: `https://www.youtube.com/watch?v=${videoId}`,
    },
    body: JSON.stringify(body),
  });

  if (!playerRes.ok) throw new Error(`InnerTube HTTP ${playerRes.status}`);
  const playerData = await playerRes.json();

  const captionTracks =
    playerData?.captions?.playerCaptionsTracklistRenderer?.captionTracks;
  if (!captionTracks?.length) throw new Error("Sem legendas disponíveis (InnerTube)");

  const track =
    captionTracks.find(
      (t: { languageCode?: string; kind?: string }) =>
        t.languageCode?.startsWith("pt") && t.kind !== "asr"
    ) ||
    captionTracks.find((t: { languageCode?: string }) =>
      t.languageCode?.startsWith("pt")
    ) ||
    captionTracks.find((t: { languageCode?: string }) =>
      t.languageCode?.startsWith("es")
    ) ||
    captionTracks.find((t: { languageCode?: string }) =>
      t.languageCode?.startsWith("en")
    ) ||
    captionTracks[0];

  if (!track?.baseUrl) throw new Error("URL da legenda não encontrada");

  const captionUrl = track.baseUrl.startsWith("http")
    ? track.baseUrl
    : `https://www.youtube.com${track.baseUrl}`;

  const captionRes = await fetch(`${captionUrl}&fmt=json3`);
  if (!captionRes.ok) throw new Error("Falha ao buscar legendas");

  const captionData = await captionRes.json();

  const text = (
    (captionData.events || []) as Array<{ segs?: Array<{ utf8?: string }> }>
  )
    .filter((e) => e.segs)
    .map((e) => e.segs!.map((s) => s.utf8 || "").join(""))
    .join(" ")
    .replace(/\[.*?\]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  if (!text) throw new Error("Transcrição vazia");
  return text;
}

// Method 2: InnerTube with TVHTML5 client (bypasses some restrictions)
async function fetchTranscriptTV(videoId: string): Promise<string> {
  const playerRes = await fetch("https://www.youtube.com/youtubei/v1/player", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      videoId,
      context: {
        client: { clientName: "TVHTML5", clientVersion: "7.20220325" },
      },
    }),
  });

  if (!playerRes.ok) throw new Error(`TV InnerTube HTTP ${playerRes.status}`);
  const playerData = await playerRes.json();

  const captionTracks =
    playerData?.captions?.playerCaptionsTracklistRenderer?.captionTracks;
  if (!captionTracks?.length) throw new Error("Sem legendas (TV client)");

  const track =
    captionTracks.find((t: { languageCode?: string }) =>
      t.languageCode?.startsWith("pt")
    ) || captionTracks[0];

  const captionUrl = track.baseUrl.startsWith("http")
    ? track.baseUrl
    : `https://www.youtube.com${track.baseUrl}`;

  const captionRes = await fetch(`${captionUrl}&fmt=json3`);
  const captionData = await captionRes.json();

  const text = (
    (captionData.events || []) as Array<{ segs?: Array<{ utf8?: string }> }>
  )
    .filter((e) => e.segs)
    .map((e) => e.segs!.map((s) => s.utf8 || "").join(""))
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();

  if (!text) throw new Error("Vazio");
  return text;
}

// Method 3: Parse page HTML directly
async function fetchTranscriptHTML(videoId: string): Promise<string> {
  const response = await fetch(
    `https://www.youtube.com/watch?v=${videoId}`,
    {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        Cookie: "CONSENT=YES+cb.20210328-17-p0.pt+FX+999",
      },
    }
  );

  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const html = await response.text();

  // Try multiple regex patterns for captionTracks
  const patterns = [
    /"captionTracks"\s*:\s*(\[[\s\S]*?\])\s*,\s*"audioTracks"/,
    /"captionTracks"\s*:\s*(\[[\s\S]*?\]),\s*"/,
    /captionTracks":([\s\S]*?\][\s\S]*?\])/,
  ];

  let captionTracks: Array<{ languageCode?: string; baseUrl?: string; kind?: string }> | null = null;
  for (const p of patterns) {
    const m = html.match(p);
    if (m) {
      try {
        captionTracks = JSON.parse(m[1]);
        if (captionTracks?.length) break;
      } catch { continue; }
    }
  }

  if (!captionTracks?.length) throw new Error("Legendas não encontradas no HTML");

  const track =
    captionTracks.find((t) => t.languageCode?.startsWith("pt") && t.kind !== "asr") ||
    captionTracks.find((t) => t.languageCode?.startsWith("pt")) ||
    captionTracks[0];

  if (!track?.baseUrl) throw new Error("baseUrl não encontrado");

  const captionUrl = track.baseUrl.startsWith("http")
    ? track.baseUrl
    : `https://www.youtube.com${track.baseUrl}`;

  const captionRes = await fetch(`${captionUrl}&fmt=json3`);
  const captionData = await captionRes.json();

  const text = (
    (captionData.events || []) as Array<{ segs?: Array<{ utf8?: string }> }>
  )
    .filter((e) => e.segs)
    .map((e) => e.segs!.map((s) => s.utf8 || "").join(""))
    .join(" ")
    .replace(/\[.*?\]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  if (!text) throw new Error("Vazio");
  return text;
}

export async function getTranscript(
  url: string
): Promise<{ transcript: string; title: string }> {
  const videoId = extractVideoId(url);
  if (!videoId) throw new Error("URL do YouTube inválida");

  const methods = [
    { name: "InnerTube WEB", fn: () => fetchTranscriptInnerTube(videoId) },
    { name: "InnerTube TV", fn: () => fetchTranscriptTV(videoId) },
    { name: "HTML parse", fn: () => fetchTranscriptHTML(videoId) },
  ];

  for (const method of methods) {
    try {
      const transcript = await method.fn();
      console.log(`✓ Transcrição via ${method.name}: ${transcript.length} chars`);
      return { transcript, title: "" };
    } catch (err) {
      console.error(
        `✗ ${method.name} falhou:`,
        err instanceof Error ? err.message : err
      );
    }
  }

  // Last resort: youtube-transcript library
  const langs = ["pt", "pt-BR", "es", "en", ""];
  for (const lang of langs) {
    try {
      const opts = lang ? { lang } : undefined;
      const items = await YoutubeTranscript.fetchTranscript(videoId, opts);
      if (items?.length) {
        const transcript = items
          .map((i) => i.text)
          .join(" ")
          .replace(/\s+/g, " ")
          .trim();
        console.log(`✓ Transcrição via youtube-transcript (${lang}): ${transcript.length} chars`);
        return { transcript, title: "" };
      }
    } catch {
      continue;
    }
  }

  throw new Error(
    "Não foi possível extrair a transcrição automaticamente. Cole o texto do vídeo manualmente no campo \"Transcrição Manual\"."
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
