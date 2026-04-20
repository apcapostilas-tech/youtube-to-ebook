export async function generateImage(prompt: string): Promise<string> {
  const apiKey = process.env.WAVESPEED_API_KEY;
  if (!apiKey) throw new Error("WAVESPEED_API_KEY não configurada");

  const res = await fetch("https://api.wavespeed.ai/api/v3/wavespeed-ai/z-image/turbo", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, size: "576*1024", num_inference_steps: 4, guidance_scale: 3.5, seed: -1 }),
  });

  if (!res.ok) throw new Error(`WaveSpeed error: ${await res.text()}`);
  const data = await res.json();

  if (data.data?.id) return await pollResult(data.data.id, apiKey);

  const url = data.data?.outputs?.[0] || data.data?.images?.[0];
  if (!url) throw new Error("Nenhuma imagem retornada");
  return url;
}

async function pollResult(id: string, apiKey: string): Promise<string> {
  for (let i = 0; i < 30; i++) {
    await new Promise((r) => setTimeout(r, 1500));
    const res = await fetch(`https://api.wavespeed.ai/api/v2/predictions/${id}/result`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    if (!res.ok) continue;
    const data = await res.json();
    if (data.data?.status === "completed") return data.data.outputs[0];
    if (data.data?.status === "failed") throw new Error("WaveSpeed falhou");
  }
  throw new Error("Timeout WaveSpeed");
}
