"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { BookOpen, Zap, Target, ChevronDown, ChevronUp, ExternalLink, Loader, Image, Link, Check } from "lucide-react";
import { ProjectJob } from "@/lib/types";

export default function ResultPage() {
  const { id } = useParams();
  const [job, setJob] = useState<ProjectJob | null>(null);
  const [tab, setTab] = useState<"ebook" | "sales" | "ads">("ebook");
  const [openChapter, setOpenChapter] = useState<number | null>(0);
  const [checkoutUrl, setCheckoutUrl] = useState("");
  const [savingCheckout, setSavingCheckout] = useState(false);
  const [checkoutSaved, setCheckoutSaved] = useState(false);
  const [generatingImages, setGeneratingImages] = useState(false);

  const salesPageUrl = typeof window !== "undefined"
    ? `${window.location.origin}/sales/${id}`
    : `/sales/${id}`;

  useEffect(() => {
    fetch(`/api/status/${id}`).then((r) => r.json()).then((d) => {
      if (d.success) {
        setJob(d.data);
        if (d.data.checkoutUrl) setCheckoutUrl(d.data.checkoutUrl);
      }
    });
  }, [id]);

  const saveCheckout = async () => {
    setSavingCheckout(true);
    await fetch("/api/checkout-url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobId: id, checkoutUrl }),
    });
    setSavingCheckout(false);
    setCheckoutSaved(true);
    setTimeout(() => setCheckoutSaved(false), 2000);
  };

  const generateImages = async () => {
    setGeneratingImages(true);
    const res = await fetch("/api/generate-ad-images", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobId: id }),
    });
    const data = await res.json();
    if (data.success) {
      const updated = await fetch(`/api/status/${id}`).then((r) => r.json());
      if (updated.success) setJob(updated.data);
    }
    setGeneratingImages(false);
  };

  if (!job) return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
      <Loader size={32} className="animate-spin text-red-400" />
    </div>
  );

  const { ebook, salesPage, adCreatives } = job;

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white">
      <header className="border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
            <BookOpen size={16} />
          </div>
          <span className="font-bold">EbookExpress</span>
        </div>
        <a href="/" className="text-sm text-white/40 hover:text-white transition-colors">← Novo Ebook</a>
      </header>

      {ebook && (
        <div className="max-w-4xl mx-auto px-6 py-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-medium mb-4">
            ✓ Gerado com sucesso
          </div>
          <h1 className="text-3xl font-black mb-2">{ebook.title}</h1>
          <p className="text-white/50 mb-6">{ebook.subtitle}</p>

          {/* Link da página de vendas */}
          <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
            <a
              href={salesPageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg text-sm font-bold hover:opacity-90 transition-opacity"
            >
              <ExternalLink size={14} /> Ver Página de Vendas
            </a>
            <button
              onClick={() => { navigator.clipboard.writeText(salesPageUrl); }}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white/70 hover:bg-white/10 transition-colors cursor-pointer"
            >
              <Link size={14} /> Copiar Link
            </button>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-6">
        <div className="flex gap-1 bg-white/5 rounded-xl p-1 mb-8">
          {[
            { key: "ebook", label: "Ebook", icon: BookOpen },
            { key: "sales", label: "Página de Vendas", icon: Zap },
            { key: "ads", label: "Criativos Ads", icon: Target },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key as typeof tab)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                tab === key ? "bg-white/10 text-white" : "text-white/40 hover:text-white/70"
              }`}
            >
              <Icon size={14} /> {label}
            </button>
          ))}
        </div>

        {/* EBOOK TAB */}
        {tab === "ebook" && ebook && (
          <div className="space-y-4 pb-16">
            <div className="bg-white/3 border border-white/5 rounded-xl p-6 mb-6">
              <p className="text-white/60 leading-relaxed">{ebook.description}</p>
            </div>
            {ebook.chapters.map((chapter, i) => (
              <div key={i} className="bg-white/3 border border-white/5 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenChapter(openChapter === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left cursor-pointer hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-red-500/20 text-red-400 text-xs font-bold flex items-center justify-center">{i + 1}</span>
                    <span className="font-semibold">{chapter.title}</span>
                  </div>
                  {openChapter === i ? <ChevronUp size={16} className="text-white/30" /> : <ChevronDown size={16} className="text-white/30" />}
                </button>
                {openChapter === i && (
                  <div className="px-6 pb-6 space-y-4">
                    <p className="text-white/70 leading-relaxed text-sm whitespace-pre-line">{chapter.content}</p>
                    {chapter.quote && (
                      <blockquote className="border-l-2 border-red-500 pl-4 text-white/50 italic text-sm">
                        &ldquo;{chapter.quote}&rdquo;
                      </blockquote>
                    )}
                    <div>
                      <p className="text-xs text-white/40 font-semibold uppercase tracking-wider mb-2">Pontos-chave</p>
                      {chapter.keyPoints.map((point, j) => (
                        <div key={j} className="flex items-start gap-2 text-sm text-white/60 mb-1">
                          <span className="text-red-400 mt-0.5">•</span> {point}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
            <div className="bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-xl p-6">
              <p className="font-semibold mb-2">Conclusão</p>
              <p className="text-white/60 text-sm leading-relaxed">{ebook.conclusion}</p>
              <p className="mt-4 text-orange-400 font-medium text-sm">{ebook.callToAction}</p>
            </div>
          </div>
        )}

        {/* SALES PAGE TAB */}
        {tab === "sales" && salesPage && (
          <div className="space-y-6 pb-16">
            {/* Checkout URL */}
            <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-5">
              <p className="text-xs text-orange-400 uppercase tracking-wider font-semibold mb-3">Link de Checkout</p>
              <p className="text-white/50 text-sm mb-3">Cole o link do seu checkout (Hotmart, Kiwify, etc.) para ativar o botão de compra na página de vendas.</p>
              <div className="flex gap-2">
                <input
                  value={checkoutUrl}
                  onChange={(e) => setCheckoutUrl(e.target.value)}
                  placeholder="https://pay.hotmart.com/..."
                  className="flex-1 bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-orange-500/50"
                />
                <button
                  onClick={saveCheckout}
                  disabled={savingCheckout}
                  className="px-4 py-2 bg-orange-500 hover:bg-orange-600 rounded-lg text-sm font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition-colors"
                >
                  {checkoutSaved ? <><Check size={14} /> Salvo!</> : savingCheckout ? <Loader size={14} className="animate-spin" /> : "Salvar"}
                </button>
              </div>
            </div>

            {/* Preview link */}
            <div className="bg-white/3 border border-white/5 rounded-xl p-5 flex items-center justify-between">
              <div>
                <p className="text-xs text-white/30 uppercase tracking-wider mb-1">Sua página de vendas</p>
                <p className="text-sm text-white/60 font-mono truncate max-w-xs">{salesPageUrl}</p>
              </div>
              <a href={salesPageUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg text-sm font-bold hover:opacity-90 transition-opacity">
                <ExternalLink size={14} /> Abrir
              </a>
            </div>

            {[
              { label: "Headline Principal", value: salesPage.headline, accent: true },
              { label: "Subheadline", value: salesPage.subheadline },
              { label: "Seção: Problema", value: salesPage.problemSection },
              { label: "Seção: Solução", value: salesPage.solutionSection },
              { label: "Oferta", value: salesPage.offer },
              { label: "Urgência / Escassez", value: salesPage.urgency },
              { label: "CTA do Botão", value: salesPage.cta, accent: true },
            ].map(({ label, value, accent }) => (
              <div key={label} className="bg-white/3 border border-white/5 rounded-xl p-5">
                <p className="text-xs text-white/30 uppercase tracking-wider mb-2">{label}</p>
                <p className={`leading-relaxed ${accent ? "text-xl font-bold text-white" : "text-white/70 text-sm"}`}>{value}</p>
              </div>
            ))}

            <div className="bg-white/3 border border-white/5 rounded-xl p-5">
              <p className="text-xs text-white/30 uppercase tracking-wider mb-3">Benefícios</p>
              <ul className="space-y-2">
                {salesPage.benefits.map((b, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-white/70">
                    <span className="text-green-400 mt-0.5">✓</span> {b}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white/3 border border-white/5 rounded-xl p-5">
              <p className="text-xs text-white/30 uppercase tracking-wider mb-3">FAQ</p>
              <div className="space-y-4">
                {salesPage.faq.map((f, i) => (
                  <div key={i}>
                    <p className="font-semibold text-sm text-white/80">{f.question}</p>
                    <p className="text-sm text-white/50 mt-1">{f.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ADS TAB */}
        {tab === "ads" && adCreatives && (
          <div className="pb-16">
            <div className="flex items-center justify-between mb-6">
              <p className="text-white/40 text-sm">{adCreatives.filter(a => a.imageUrl).length}/{adCreatives.length} imagens geradas</p>
              <button
                onClick={generateImages}
                disabled={generatingImages}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-semibold cursor-pointer disabled:opacity-50 transition-colors"
              >
                {generatingImages ? <><Loader size={14} className="animate-spin" /> Gerando imagens...</> : <><Image size={14} /> Gerar Imagens</>}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {adCreatives.map((ad, i) => (
                <div key={i} className="bg-white/3 border border-white/5 rounded-xl overflow-hidden">
                  {ad.imageUrl ? (
                    <img src={ad.imageUrl} alt={ad.headline} className="w-full aspect-square object-cover" />
                  ) : (
                    <div className="w-full aspect-square bg-white/3 flex items-center justify-center">
                      <Image size={32} className="text-white/10" />
                    </div>
                  )}
                  <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-red-400">{ad.format}</span>
                      <span className="text-xs text-white/20">{ad.format === "story" ? "9:16" : ad.format === "feed" ? "1:1" : "múltiplo"}</span>
                    </div>
                    <div>
                      <p className="text-xs text-white/30 mb-1">Headline</p>
                      <p className="font-bold text-white">{ad.headline}</p>
                    </div>
                    <div>
                      <p className="text-xs text-white/30 mb-1">Texto</p>
                      <p className="text-sm text-white/70">{ad.body}</p>
                    </div>
                    <div className="bg-white/5 rounded-lg px-3 py-2 text-center">
                      <p className="text-sm font-semibold text-orange-400">{ad.cta}</p>
                    </div>
                    <div>
                      <p className="text-xs text-white/30 mb-1">Prompt da imagem</p>
                      <p className="text-xs text-white/40 italic">{ad.imagePrompt}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
