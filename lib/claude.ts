import Anthropic from "@anthropic-ai/sdk";
import { EbookData, SalesPageData } from "./types";

function parseJsonSafe(text: string): unknown {
  const clean = text.replace(/```json\n?|\n?```/g, "").trim();
  try {
    return JSON.parse(clean);
  } catch {
    const start = clean.indexOf("{") !== -1 ? clean.indexOf("{") : clean.indexOf("[");
    if (start === -1) throw new Error("Nenhum JSON encontrado na resposta");
    let fixed = clean.slice(start);
    const opens = (fixed.match(/\{/g) || []).length - (fixed.match(/\}/g) || []).length;
    const arrOpens = (fixed.match(/\[/g) || []).length - (fixed.match(/\]/g) || []).length;
    for (let i = 0; i < arrOpens; i++) fixed += "]";
    for (let i = 0; i < opens; i++) fixed += "}";
    return JSON.parse(fixed);
  }
}

function getClient(apiKey?: string) {
  const key = apiKey || process.env.ANTHROPIC_API_KEY;
  if (!key) throw new Error("ANTHROPIC_API_KEY não configurada");
  return new Anthropic({ apiKey: key });
}

const LANG_INSTRUCTION: Record<string, string> = {
  "pt-BR": "Escreva TODO o conteúdo em Português do Brasil.",
  "en": "Write ALL content in English.",
  "es": "Escribe TODO el contenido en Español.",
  "fr": "Rédigez TOUT le contenu en Français.",
  "de": "Schreiben Sie ALLE Inhalte auf Deutsch.",
  "it": "Scrivi TUTTO il contenuto in Italiano.",
  "ja": "すべてのコンテンツを日本語で書いてください。",
};

const CURRENCY: Record<string, string> = {
  "pt-BR": "R$",
  "en": "$",
  "es": "$",
  "fr": "€",
  "de": "€",
  "it": "€",
  "ja": "¥",
};

const CONTENT_TYPE_CONTEXT: Record<string, string> = {
  transcript: "Esta é uma transcrição de vídeo. Extraia os melhores insights, ensinamentos práticos e conhecimentos do conteúdo.",
  description: "Esta é uma descrição de produto, serviço ou curso. Use estas informações para criar conteúdo educativo e persuasivo.",
  clone: "Esta é uma referência de página de vendas ou copy. Recrie a estrutura adaptando para um produto similar com copy original.",
};

export async function generateEbook(
  content: string,
  title: string,
  apiKey?: string,
  language = "pt-BR",
  contentType = "transcript"
): Promise<EbookData> {
  const client = getClient(apiKey);
  const langInstr = LANG_INSTRUCTION[language] || LANG_INSTRUCTION["pt-BR"];
  const contentCtx = CONTENT_TYPE_CONTEXT[contentType] || CONTENT_TYPE_CONTEXT.transcript;

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 8000,
    system: `Você é um especialista em transformar conteúdo em ebooks de alto valor.
Crie ebooks estruturados, envolventes e práticos que gerem transformação real no leitor.
${langInstr}
Responda APENAS com JSON válido, sem markdown, sem explicações.`,
    messages: [{
      role: "user",
      content: `Transforme este conteúdo em um ebook profissional e completo.

Contexto: ${contentCtx}
${title ? `Título de referência: "${title}"` : ""}

Conteúdo:
${content.slice(0, 6000)}

Retorne APENAS JSON válido:
{
  "title": "título impactante do ebook",
  "subtitle": "subtítulo que promete resultado específico",
  "author": "Autor",
  "description": "3 frases descrevendo o que o leitor vai aprender",
  "chapters": [
    {
      "title": "título do capítulo",
      "content": "3 parágrafos completos com ensinamentos práticos. Seja específico, cite exemplos, explique o raciocínio.",
      "keyPoints": ["ponto prático 1", "ponto prático 2", "ponto prático 3", "ponto prático 4"],
      "quote": "frase marcante ou insight poderoso deste capítulo"
    }
  ],
  "conclusion": "3 frases de conclusão poderosa",
  "callToAction": "chamada para ação direta e urgente"
}

Crie 4 capítulos completos com profundidade real.`,
    }],
  });

  const text = response.content[0].type === "text" ? response.content[0].text : "";
  return parseJsonSafe(text) as EbookData;
}

export async function generateSalesPage(
  ebook: EbookData,
  apiKey?: string,
  language = "pt-BR",
  price?: string,
  priceOriginal?: string
): Promise<SalesPageData> {
  const client = getClient(apiKey);
  const langInstr = LANG_INSTRUCTION[language] || LANG_INSTRUCTION["pt-BR"];
  const currency = CURRENCY[language] || "R$";

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 4500,
    system: `Você é um copywriter especialista em páginas de vendas de alto impacto.
Use os frameworks: PAS (Problema-Agitação-Solução), AIDA e prova social.
Escreva copy direto, específico e que gere urgência real. Sem clichês.
${langInstr}
CRITICAL: Every single text value in the JSON output MUST be written in the language specified above. Section titles, benefits, FAQ, CTAs, guarantees — ALL in the same language. Do NOT mix languages.
Responda APENAS com JSON válido, sem texto antes ou depois.`,
    messages: [{
      role: "user",
      content: `Crie uma página de vendas completa para este ebook:

Título: ${ebook.title}
Subtítulo: ${ebook.subtitle}
Descrição: ${ebook.description}
Capítulos: ${ebook.chapters.map((c) => c.title).join(", ")}
${price ? `Preço final do produto: ${price} — USE EXATAMENTE ESTE VALOR no campo priceFinal.` : ""}
${priceOriginal ? `Preço original (riscado): ${priceOriginal} — USE EXATAMENTE ESTE VALOR no campo priceOriginal.` : ""}

Retorne JSON (nesta ordem exata):
{
  "headline": "headline principal ultra-impactante (máx 10 palavras)",
  "subheadline": "subheadline que aprofunda a promessa (1 frase)",
  "cta": "texto do botão de compra (máx 6 palavras)",
  "urgency": "elemento de urgência ou escassez (1 frase)",
  "offerItems": [
    {"name": "📦 main product item", "price": "${currency} 497"},
    {"name": "🎯 bonus item 1", "price": "${currency} 297"},
    {"name": "📋 bonus item 2", "price": "${currency} 197"}
  ],
  "priceOriginal": "sum of items above (ex: ${currency} 991)",
  "priceFinal": "promotional price (ex: ${currency} 97, ${currency} 197, ${currency} 297)",
  "guarantee": "30-day guarantee — 1 direct sentence",
  "stats": [
    {"num": 4500, "label": "emoji + relevant metric"},
    {"num": 96, "label": "% relevant result"},
    {"num": 30, "label": "number + relevant unit"}
  ],
  "benefits": ["benefit 1", "benefit 2", "benefit 3", "benefit 4", "benefit 5"],
  "faq": [
    {"question": "question 1", "answer": "direct answer"},
    {"question": "question 2", "answer": "direct answer"},
    {"question": "question 3", "answer": "direct answer"}
  ],
  "offer": "short offer presentation line",
  "problemSection": "seção que descreve a dor (2 parágrafos separados por \\n)",
  "solutionSection": "seção que apresenta a solução (2 parágrafos separados por \\n)",
  "socialProof": "seção de prova social/credibilidade (1 parágrafo)"
}
Stats.num = inteiros plausíveis para o nicho. OfferItems = 3-5 itens com preços em R$. PriceOriginal = soma dos itens, priceFinal = preço real (bem menor).

⚠️ FINAL LANGUAGE CHECK: ${langInstr} Every single value in the JSON above — headline, subheadline, cta, urgency, offer, guarantee, benefits, faq, problemSection, solutionSection, socialProof, offerItems names, stats labels — must be written EXCLUSIVELY in the required language. Zero exceptions.`,
    }],
  });

  const text = response.content[0].type === "text" ? response.content[0].text : "";
  return parseJsonSafe(text) as SalesPageData;
}

export async function generateSalesPageFromText(
  content: string,
  contentType = "transcript",
  apiKey?: string,
  language = "pt-BR",
  price?: string,
  priceOriginal?: string
): Promise<SalesPageData> {
  const client = getClient(apiKey);
  const langInstr = LANG_INSTRUCTION[language] || LANG_INSTRUCTION["pt-BR"];
  const contentCtx = CONTENT_TYPE_CONTEXT[contentType] || CONTENT_TYPE_CONTEXT.transcript;
  const currency = CURRENCY[language] || "R$";

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 4500,
    system: `Você é um copywriter especialista em páginas de vendas de alto impacto.
Use os frameworks: PAS (Problema-Agitação-Solução), AIDA e prova social.
Escreva copy direto, específico e que gere urgência real. Sem clichês.
${langInstr}
CRITICAL: Every single text value in the JSON output MUST be written in the language specified above. Section titles, benefits, FAQ, CTAs, guarantees — ALL in the same language. Do NOT mix languages.
Responda APENAS com JSON válido, sem texto antes ou depois.`,
    messages: [{
      role: "user",
      content: `Crie uma página de vendas de alta conversão baseada neste conteúdo.

Contexto: ${contentCtx}
${price ? `Preço final do produto: ${price} — USE EXATAMENTE ESTE VALOR no campo priceFinal.` : ""}
${priceOriginal ? `Preço original (riscado): ${priceOriginal} — USE EXATAMENTE ESTE VALOR no campo priceOriginal.` : ""}

Conteúdo:
${content.slice(0, 5000)}

Retorne JSON (nesta ordem exata):
{
  "headline": "headline principal ultra-impactante (máx 10 palavras)",
  "subheadline": "subheadline que aprofunda a promessa (1 frase)",
  "cta": "texto do botão de compra (máx 6 palavras)",
  "urgency": "elemento de urgência ou escassez (1 frase)",
  "offerItems": [
    {"name": "📦 main product item", "price": "${currency} 497"},
    {"name": "🎯 bonus item 1", "price": "${currency} 297"},
    {"name": "📋 bonus item 2", "price": "${currency} 197"}
  ],
  "priceOriginal": "sum of items above (ex: ${currency} 991)",
  "priceFinal": "promotional price (ex: ${currency} 97, ${currency} 197, ${currency} 297)",
  "guarantee": "30-day guarantee — 1 direct sentence",
  "stats": [
    {"num": 4500, "label": "emoji + relevant metric"},
    {"num": 96, "label": "% relevant result"},
    {"num": 30, "label": "number + relevant unit"}
  ],
  "benefits": ["benefit 1", "benefit 2", "benefit 3", "benefit 4", "benefit 5"],
  "faq": [
    {"question": "question 1", "answer": "direct answer"},
    {"question": "question 2", "answer": "direct answer"},
    {"question": "question 3", "answer": "direct answer"}
  ],
  "offer": "short offer presentation line",
  "problemSection": "seção que descreve a dor (2 parágrafos separados por \\n)",
  "solutionSection": "seção que apresenta a solução (2 parágrafos separados por \\n)",
  "socialProof": "seção de prova social/credibilidade (1 parágrafo)"
}
Stats.num = inteiros plausíveis para o nicho. OfferItems = 3-5 itens com preços em R$. PriceOriginal = soma dos itens, priceFinal = preço real (bem menor).

⚠️ FINAL LANGUAGE CHECK: ${langInstr} Every single value in the JSON above — headline, subheadline, cta, urgency, offer, guarantee, benefits, faq, problemSection, solutionSection, socialProof, offerItems names, stats labels — must be written EXCLUSIVELY in the required language. Zero exceptions.`,
    }],
  });

  const text = response.content[0].type === "text" ? response.content[0].text : "";
  return parseJsonSafe(text) as SalesPageData;
}
