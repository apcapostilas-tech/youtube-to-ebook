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

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 4500,
    system: `Você é um copywriter especialista em páginas de vendas de alto impacto.
Use os frameworks: PAS (Problema-Agitação-Solução), AIDA e prova social.
Escreva copy direto, específico e que gere urgência real. Sem clichês.
${langInstr}
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
    {"name": "📦 Item principal do produto", "price": "R$ 497"},
    {"name": "🎯 Bônus ou recurso extra 1", "price": "R$ 297"},
    {"name": "📋 Bônus ou recurso extra 2", "price": "R$ 197"}
  ],
  "priceOriginal": "preço original — soma dos itens acima (ex: R$ 991)",
  "priceFinal": "preço promocional coerente com o nicho e produto (ex: R$ 97, R$ 197, R$ 297 — NÃO use R$ 47 a menos que o conteúdo indique esse valor)",
  "guarantee": "garantia de 30 dias — 1 frase direta",
  "stats": [
    {"num": 4500, "label": "emoji + métrica relevante ao nicho"},
    {"num": 96, "label": "% de resultado relevante"},
    {"num": 30, "label": "número + unidade relevante"}
  ],
  "benefits": ["benefício 1", "benefício 2", "benefício 3", "benefício 4", "benefício 5"],
  "faq": [
    {"question": "pergunta 1", "answer": "resposta direta"},
    {"question": "pergunta 2", "answer": "resposta direta"},
    {"question": "pergunta 3", "answer": "resposta direta"}
  ],
  "offer": "frase curta de apresentação da oferta (1 linha)",
  "problemSection": "seção que descreve a dor (2 parágrafos separados por \\n)",
  "solutionSection": "seção que apresenta a solução (2 parágrafos separados por \\n)",
  "socialProof": "seção de prova social/credibilidade (1 parágrafo)"
}
Stats.num = inteiros plausíveis para o nicho. OfferItems = 3-5 itens com preços em R$. PriceOriginal = soma dos itens, priceFinal = preço real (bem menor).`,
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

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 4500,
    system: `Você é um copywriter especialista em páginas de vendas de alto impacto.
Use os frameworks: PAS (Problema-Agitação-Solução), AIDA e prova social.
Escreva copy direto, específico e que gere urgência real. Sem clichês.
${langInstr}
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
    {"name": "📦 Item principal do produto", "price": "R$ 497"},
    {"name": "🎯 Bônus ou recurso extra 1", "price": "R$ 297"},
    {"name": "📋 Bônus ou recurso extra 2", "price": "R$ 197"}
  ],
  "priceOriginal": "preço original — soma dos itens acima (ex: R$ 991)",
  "priceFinal": "preço promocional coerente com o nicho e produto (ex: R$ 97, R$ 197, R$ 297 — NÃO use R$ 47 a menos que o conteúdo indique esse valor)",
  "guarantee": "garantia de 30 dias — 1 frase direta",
  "stats": [
    {"num": 4500, "label": "emoji + métrica relevante ao nicho"},
    {"num": 96, "label": "% de resultado relevante"},
    {"num": 30, "label": "número + unidade relevante"}
  ],
  "benefits": ["benefício 1", "benefício 2", "benefício 3", "benefício 4", "benefício 5"],
  "faq": [
    {"question": "pergunta 1", "answer": "resposta direta"},
    {"question": "pergunta 2", "answer": "resposta direta"},
    {"question": "pergunta 3", "answer": "resposta direta"}
  ],
  "offer": "frase curta de apresentação da oferta (1 linha)",
  "problemSection": "seção que descreve a dor (2 parágrafos separados por \\n)",
  "solutionSection": "seção que apresenta a solução (2 parágrafos separados por \\n)",
  "socialProof": "seção de prova social/credibilidade (1 parágrafo)"
}
Stats.num = inteiros plausíveis para o nicho. OfferItems = 3-5 itens com preços em R$. PriceOriginal = soma dos itens, priceFinal = preço real (bem menor).`,
    }],
  });

  const text = response.content[0].type === "text" ? response.content[0].text : "";
  return parseJsonSafe(text) as SalesPageData;
}
