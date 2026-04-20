"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Link2, BookOpen, Zap, ShieldCheck, Loader, ChevronRight, Key, FileText, ChevronDown } from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [manualTranscript, setManualTranscript] = useState("");
  const [showManual, setShowManual] = useState(false);
  const [language, setLanguage] = useState("pt-BR");
  const [youtubeKey, setYoutubeKey] = useState("");
  const [showYtKey, setShowYtKey] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState<"idle" | "extracting" | "generating">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() && !manualTranscript.trim()) return;
    setLoading(true);
    setError("");
    setStep("extracting");

    try {
      const extractRes = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: url || "https://youtube.com",
          transcript: manualTranscript || undefined,
          anthropicKey: apiKey || undefined,
          youtubeApiKey: youtubeKey || undefined,
          language,
        }),
      });
      const extractText = await extractRes.text();
      let extractData: { success: boolean; error?: string; data?: { jobId: string } };
      try { extractData = JSON.parse(extractText); }
      catch { throw new Error(`Servidor indisponível. Aguarde e tente novamente.`); }
      if (!extractData.success) throw new Error(extractData.error);

      setStep("generating");

      const genRes = await fetch("/api/generate-ebook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId: extractData.data!.jobId }),
      });
      const genText = await genRes.text();
      let genData: { success: boolean; error?: string };
      try { genData = JSON.parse(genText); }
      catch { throw new Error(`Erro ao gerar conteúdo. Tente novamente em instantes.`); }
      if (!genData.success) throw new Error(genData.error);

      router.push(`/result/${extractData.data.jobId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro inesperado");
      setStep("idle");
      setLoading(false);
    }
  };

  const stepLabel = step === "extracting"
    ? "Extraindo transcrição do YouTube..."
    : step === "generating"
    ? "Gerando ebook, página de vendas e criativos com IA..."
    : "";

  const canSubmit = !loading && (url.trim().length > 0 || manualTranscript.trim().length > 0);

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white flex flex-col">
      <header className="border-b border-white/5 px-6 py-4 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
          <BookOpen size={16} />
        </div>
        <span className="font-bold text-lg">EbookExpress</span>
        <span className="text-xs text-white/30 ml-2">YouTube → Ebook em minutos</span>
      </header>

      <section className="flex-1 flex flex-col items-center justify-center px-4 py-20">
        <div className="max-w-2xl w-full text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium mb-6">
            <Zap size={10} />
            Powered by Claude AI
          </div>
          <h1 className="text-5xl font-black mb-4 leading-tight">
            Transforme qualquer vídeo do<br />
            <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
              YouTube em Ebook
            </span>
          </h1>
          <p className="text-white/50 text-lg mb-2">
            Cole o link → receba ebook completo, página de vendas pronta e criativos para Meta Ads.
          </p>
          <p className="text-white/30 text-sm">Em menos de 2 minutos. Sem esforço.</p>
        </div>

        <form onSubmit={handleSubmit} className="max-w-2xl w-full space-y-4">
          {/* URL do YouTube */}
          <div className="flex gap-3">
            <div className="flex-1 flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus-within:border-red-500/50 transition-colors">
              <Link2 size={18} className="text-red-400 flex-shrink-0" />
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="flex-1 bg-transparent text-white placeholder-white/30 outline-none text-sm"
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              disabled={!canSubmit}
              className="px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl font-bold text-sm flex items-center gap-2 hover:opacity-90 disabled:opacity-50 transition-all cursor-pointer"
            >
              {loading ? <Loader size={16} className="animate-spin" /> : <>Gerar <ChevronRight size={16} /></>}
            </button>
          </div>

          {/* Transcript manual */}
          <div className="border border-white/5 rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={() => setShowManual(!showManual)}
              className="w-full flex items-center justify-between px-4 py-3 bg-white/3 hover:bg-white/5 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2 text-white/40 text-sm">
                <FileText size={14} />
                {showManual ? "Ocultar transcript manual" : "Vídeo sem legendas? Cole o transcript aqui"}
              </div>
              <ChevronDown size={14} className={`text-white/30 transition-transform ${showManual ? "rotate-180" : ""}`} />
            </button>
            {showManual && (
              <textarea
                value={manualTranscript}
                onChange={(e) => setManualTranscript(e.target.value)}
                placeholder="Cole aqui o texto/transcrição do vídeo..."
                rows={6}
                disabled={loading}
                className="w-full bg-white/3 px-4 py-3 text-sm text-white/70 placeholder-white/20 outline-none resize-none border-t border-white/5"
              />
            )}
          </div>

          {/* Idioma */}
          <div className="flex items-center gap-3 bg-white/3 border border-white/5 rounded-xl px-4 py-3">
            <span className="text-white/30 text-sm flex-shrink-0">🌐 Idioma:</span>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              disabled={loading}
              className="flex-1 outline-none text-sm cursor-pointer"
              style={{ background: "#0a0a0f", color: "rgba(255,255,255,0.7)", colorScheme: "dark" }}
            >
              <option value="pt-BR">🇧🇷 Português (Brasil)</option>
              <option value="en">🇺🇸 English</option>
              <option value="es">🇪🇸 Español</option>
              <option value="fr">🇫🇷 Français</option>
              <option value="de">🇩🇪 Deutsch</option>
              <option value="it">🇮🇹 Italiano</option>
              <option value="ja">🇯🇵 日本語</option>
            </select>
          </div>

          {/* YouTube API Key */}
          <div className="flex items-center gap-3 bg-white/3 border border-white/5 rounded-xl px-4 py-3">
            <span className="text-red-400/60 text-xs flex-shrink-0">▶</span>
            <input
              type={showYtKey ? "text" : "password"}
              value={youtubeKey}
              onChange={(e) => setYoutubeKey(e.target.value)}
              placeholder="YouTube Data API Key (opcional — melhora extração)"
              className="flex-1 bg-transparent text-white/70 placeholder-white/20 outline-none text-xs"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowYtKey(!showYtKey)}
              className="text-white/20 hover:text-white/50 text-xs transition-colors cursor-pointer"
            >
              {showYtKey ? "ocultar" : "mostrar"}
            </button>
          </div>

          {/* Anthropic API Key */}
          <div className="flex items-center gap-3 bg-white/3 border border-white/5 rounded-xl px-4 py-3">
            <Key size={14} className="text-white/30 flex-shrink-0" />
            <input
              type={showKey ? "text" : "password"}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Anthropic API Key (opcional)"
              className="flex-1 bg-transparent text-white/70 placeholder-white/20 outline-none text-xs"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="text-white/20 hover:text-white/50 text-xs transition-colors cursor-pointer"
            >
              {showKey ? "ocultar" : "mostrar"}
            </button>
          </div>

          {loading && (
            <div className="flex items-center gap-3 px-4 py-3 bg-orange-500/10 border border-orange-500/20 rounded-xl">
              <Loader size={14} className="animate-spin text-orange-400" />
              <span className="text-orange-300 text-sm">{stepLabel}</span>
            </div>
          )}

          {error && (
            <div className="px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}
        </form>

        <div className="max-w-2xl w-full mt-16 grid grid-cols-3 gap-4">
          {[
            { icon: BookOpen, title: "Ebook Completo", desc: "Capítulos, pontos-chave e conclusão estruturados pelo Claude" },
            { icon: Zap, title: "Página de Vendas", desc: "Copy persuasivo com headline, benefícios, FAQ e CTA" },
            { icon: ShieldCheck, title: "Criativos Meta Ads", desc: "3 formatos prontos: Story, Feed e Carrossel" },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-white/3 border border-white/5 rounded-xl p-4">
              <Icon size={20} className="text-red-400 mb-3" />
              <div className="font-semibold text-sm mb-1">{title}</div>
              <div className="text-white/40 text-xs leading-relaxed">{desc}</div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
