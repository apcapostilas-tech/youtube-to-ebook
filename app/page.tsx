"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Zap, Key, Loader, ChevronRight, ChevronDown } from "lucide-react";

type ContentType = "transcript" | "description" | "clone";
type GenerateMode = "both" | "ebook" | "sales";
type SalesTheme = "dark" | "light" | "bold";

const CONTENT_TYPES: Record<ContentType, { label: string; icon: string; placeholder: string }> = {
  transcript: {
    label: "Transcrição de vídeo",
    icon: "🎬",
    placeholder: "Cole aqui a transcrição ou legendas do vídeo...\n\nDica: No YouTube, clique nos 3 pontinhos → \"Abrir transcrição\" → selecione todo o texto e copie.",
  },
  description: {
    label: "Descrição do produto",
    icon: "📦",
    placeholder: "Descreva seu produto, serviço ou curso:\n\n• O que é?\n• Para quem é?\n• Qual problema resolve?\n• Principais benefícios?\n• Diferenciais em relação à concorrência?",
  },
  clone: {
    label: "Clonar página de vendas",
    icon: "📋",
    placeholder: "Cole aqui o texto de uma página de vendas que você quer usar como referência ou clonar...\n\nUsaremos a estrutura e estilo para criar uma versão original para o seu produto.",
  },
};

const GENERATE_MODES: Record<GenerateMode, { label: string; icon: string }> = {
  both: { label: "Ebook + Página de Vendas", icon: "⚡" },
  ebook: { label: "Só o Ebook", icon: "📖" },
  sales: { label: "Só Página de Vendas", icon: "🛒" },
};

const SALES_THEMES: Record<SalesTheme, { label: string; icon: string; preview: string }> = {
  dark: { label: "Dark Moderno", icon: "🌑", preview: "#080810" },
  light: { label: "Claro Pro", icon: "☀️", preview: "#f5f5fa" },
  bold: { label: "Bold Impacto", icon: "⚡", preview: "#06030f" },
};

export default function HomePage() {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [contentType, setContentType] = useState<ContentType>("transcript");
  const [generateMode, setGenerateMode] = useState<GenerateMode>("both");
  const [salesTheme, setSalesTheme] = useState<SalesTheme>("dark");
  const [language, setLanguage] = useState("pt-BR");
  const [apiKey, setApiKey] = useState("");
  const [keySaved, setKeySaved] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("anthropic_key");
    if (saved) setApiKey(saved);
  }, []);

  const handleKeyChange = (val: string) => {
    setApiKey(val);
    setKeySaved(false);
    if (val.trim()) {
      localStorage.setItem("anthropic_key", val.trim());
      setKeySaved(true);
    } else {
      localStorage.removeItem("anthropic_key");
    }
  };
  const [showKey, setShowKey] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState<"idle" | "generating">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    setLoading(true);
    setError("");
    setStep("generating");

    try {
      const extractRes = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
          contentType,
          generateMode,
          salesPageTheme: salesTheme,
          anthropicKey: apiKey || undefined,
          language,
        }),
      });
      const extractText = await extractRes.text();
      let extractData: { success: boolean; error?: string; data?: { jobId: string } };
      try { extractData = JSON.parse(extractText); }
      catch { throw new Error("Servidor indisponível. Aguarde e tente novamente."); }
      if (!extractData.success || !extractData.data?.jobId) throw new Error(extractData.error || "Erro ao processar conteúdo");

      const jobId = extractData.data.jobId;

      const genRes = await fetch("/api/generate-ebook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId }),
      });
      const genText = await genRes.text();
      let genData: { success: boolean; error?: string };
      try { genData = JSON.parse(genText); }
      catch { throw new Error("Erro ao gerar conteúdo. Tente novamente em instantes."); }
      if (!genData.success) throw new Error(genData.error);

      router.push(`/result/${jobId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro inesperado");
      setStep("idle");
      setLoading(false);
    }
  };

  const canSubmit = !loading && content.trim().length > 20 && apiKey.trim().length > 10;

  const stepLabel = generateMode === "ebook"
    ? "Gerando ebook com IA..."
    : generateMode === "sales"
    ? "Gerando página de vendas com IA..."
    : "Gerando ebook e página de vendas com IA...";

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white flex flex-col">
      <header className="border-b border-white/5 px-6 py-4 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
          <BookOpen size={16} />
        </div>
        <span className="font-bold text-lg">Método CCL</span>
        <span className="text-xs text-white/30 ml-2">Copie, Cole e Lucre</span>
      </header>

      <section className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        <div className="max-w-2xl w-full text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium mb-6">
            <Zap size={10} /> Powered by Claude AI
          </div>
          <h1 className="text-4xl font-black mb-3 leading-tight">
            Transforme qualquer conteúdo em<br />
            <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
              Infoproduto Pronto
            </span>
          </h1>
          <p className="text-white/50 text-base">
            Cole sua transcrição, descrição ou copy — receba ebook completo e página de vendas.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="max-w-2xl w-full space-y-3">

          {/* Content Type Selector */}
          <div className="flex gap-2">
            {(Object.entries(CONTENT_TYPES) as [ContentType, typeof CONTENT_TYPES[ContentType]][]).map(([key, cfg]) => (
              <button
                key={key}
                type="button"
                onClick={() => setContentType(key)}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                  contentType === key
                    ? "bg-white/10 border-white/20 text-white"
                    : "bg-white/3 border-white/5 text-white/40 hover:text-white/70"
                }`}
              >
                {cfg.icon} {cfg.label}
              </button>
            ))}
          </div>

          {/* Text Area */}
          <div className="bg-white/3 border border-white/10 rounded-xl focus-within:border-red-500/40 transition-colors">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={CONTENT_TYPES[contentType].placeholder}
              rows={9}
              disabled={loading}
              className="w-full bg-transparent px-4 py-4 text-sm text-white/80 placeholder-white/20 outline-none resize-none"
            />
            <div className="px-4 pb-3 text-xs text-white/20 text-right">
              {content.length} caracteres {content.length < 20 && content.length > 0 && "— mínimo 20"}
            </div>
          </div>

          {/* Generation Mode */}
          <div className="bg-white/3 border border-white/5 rounded-xl p-3">
            <p className="text-xs text-white/30 mb-2 font-medium uppercase tracking-wider">O que gerar:</p>
            <div className="flex gap-2">
              {(Object.entries(GENERATE_MODES) as [GenerateMode, typeof GENERATE_MODES[GenerateMode]][]).map(([key, cfg]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setGenerateMode(key)}
                  className={`flex-1 py-2 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    generateMode === key
                      ? "bg-gradient-to-r from-red-500/80 to-orange-500/80 text-white"
                      : "bg-white/5 text-white/40 hover:text-white/70"
                  }`}
                >
                  {cfg.icon} {cfg.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sales Page Theme — only when sales is included */}
          {generateMode !== "ebook" && (
            <div className="bg-white/3 border border-white/5 rounded-xl p-3">
              <p className="text-xs text-white/30 mb-2 font-medium uppercase tracking-wider">Design da página de vendas:</p>
              <div className="flex gap-2">
                {(Object.entries(SALES_THEMES) as [SalesTheme, typeof SALES_THEMES[SalesTheme]][]).map(([key, cfg]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSalesTheme(key)}
                    className={`flex-1 py-2 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
                      salesTheme === key
                        ? "bg-white/10 border-white/20 text-white"
                        : "bg-white/3 border-white/5 text-white/40 hover:text-white/70"
                    }`}
                  >
                    <span
                      className="inline-block w-3 h-3 rounded-full mr-1.5 align-middle border border-white/20"
                      style={{ background: cfg.preview }}
                    />
                    {cfg.icon} {cfg.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Anthropic API Key — obrigatória */}
          <div className="bg-white/3 border border-white/10 rounded-xl px-4 py-3 focus-within:border-red-500/40 transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <Key size={12} className="text-red-400 flex-shrink-0" />
              <span className="text-xs font-semibold text-white/70">Chave da API Anthropic</span>
              <span className="text-xs text-red-400 ml-1">obrigatória</span>
              <a
                href="https://console.anthropic.com/settings/keys"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto text-xs text-orange-400 hover:text-orange-300 underline underline-offset-2 transition-colors"
              >
                Criar minha chave →
              </a>
            </div>
            <div className="flex items-center gap-2">
              <input
                type={showKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => handleKeyChange(e.target.value)}
                placeholder="sk-ant-..."
                className="flex-1 bg-transparent text-white/80 placeholder-white/20 outline-none text-sm"
                disabled={loading}
              />
              {keySaved && <span className="text-green-400 text-xs flex-shrink-0">✓ salva</span>}
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="text-white/20 hover:text-white/50 text-xs transition-colors cursor-pointer flex-shrink-0"
              >
                {showKey ? "ocultar" : "mostrar"}
              </button>
            </div>
            <p className="text-xs text-white/30 mt-1.5">
              Sua chave fica apenas na sua sessão — nunca armazenamos.
            </p>
          </div>

          {/* Advanced Settings */}
          <div className="border border-white/5 rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full flex items-center justify-between px-4 py-3 bg-white/3 hover:bg-white/5 transition-colors cursor-pointer"
            >
              <span className="text-white/40 text-xs font-medium">⚙ Configurações avançadas</span>
              <ChevronDown size={13} className={`text-white/30 transition-transform ${showAdvanced ? "rotate-180" : ""}`} />
            </button>
            {showAdvanced && (
              <div className="space-y-2 p-3 border-t border-white/5">
                {/* Language */}
                <div className="flex items-center gap-3 bg-white/3 border border-white/5 rounded-lg px-3 py-2">
                  <span className="text-white/30 text-xs">🌐</span>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    disabled={loading}
                    className="flex-1 outline-none text-xs cursor-pointer"
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
              </div>
            )}
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex items-center gap-3 px-4 py-3 bg-orange-500/10 border border-orange-500/20 rounded-xl">
              <Loader size={14} className="animate-spin text-orange-400" />
              <span className="text-orange-300 text-sm">{stepLabel}</span>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={!canSubmit}
            className="w-full py-4 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl font-bold text-base flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-40 transition-all cursor-pointer"
          >
            {loading
              ? <><Loader size={18} className="animate-spin" /> Gerando...</>
              : <>Gerar {GENERATE_MODES[generateMode].icon} {GENERATE_MODES[generateMode].label} <ChevronRight size={18} /></>
            }
          </button>
        </form>

        {/* Features */}
        <div className="max-w-2xl w-full mt-12 grid grid-cols-3 gap-4">
          {[
            { icon: BookOpen, title: "Ebook Completo", desc: "4 capítulos com conteúdo profundo, pontos-chave e conclusão" },
            { icon: Zap, title: "Página de Vendas", desc: "Copy persuasivo com headline, benefícios, FAQ e CTA pronto" },
            { icon: Key, title: "Sua API Key", desc: "Use sua chave Anthropic — os créditos de IA são seus, não cobramos por geração" },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-white/3 border border-white/5 rounded-xl p-4">
              <Icon size={18} className="text-red-400 mb-3" />
              <div className="font-semibold text-sm mb-1">{title}</div>
              <div className="text-white/40 text-xs leading-relaxed">{desc}</div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
