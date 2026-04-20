import Anthropic from "@anthropic-ai/sdk";
import { EbookData, SalesPageData, AdCreative } from "./types";

function parseJsonSafe(text: string): unknown {
  const clean = text.replace(/```json\n?|\n?```/g, "").trim();
  try {
    return JSON.parse(clean);
  } catch {
    // Tenta extrair o JSON mesmo que truncado
    const start = clean.indexOf("{") !== -1 ? clean.indexOf("{") : clean.indexOf("[");
    if (start === -1) throw new Error("Nenhum JSON encontrado na resposta");
    const snippet = clean.slice(start);
    // Tenta fechar chaves/colchetes abertos
    let fixed = snippet;
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

export async function generateEbook(
  transcript: string,
  videoTitle: string,
  apiKey?: string,
  language = "pt-BR"
): Promise<EbookData> {
  const client = getClient(apiKey);
  const langInstr = LANG_INSTRUCTION[language] || LANG_INSTRUCTION["pt-BR"];

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 8000,
    system: `Você é um especialista em transformar conteúdo de vídeos em ebooks de alto valor.
Crie ebooks estruturados, envolventes e práticos que gerem transformação real no leitor.
${langInstr}
Responda APENAS com JSON válido, sem markdown, sem explicações.`,
    messages: [
      {
        role: "user",
        content: `Transforme esta transcrição em um ebook profissional e completo.

Título do vídeo: "${videoTitle}"

Transcrição:
${transcript.slice(0, 6000)}

Retorne APENAS JSON válido (sem texto fora):
{
  "title": "título impactante do ebook",
  "subtitle": "subtítulo que promete resultado específico",
  "author": "Autor",
  "description": "3 frases descrevendo o que o leitor vai aprender e transformar",
  "chapters": [
    {
      "title": "título do capítulo",
      "content": "3 parágrafos completos com ensinamentos práticos extraídos do vídeo. Seja específico, cite exemplos, explique o raciocínio por trás de cada passo.",
      "keyPoints": ["ponto prático 1", "ponto prático 2", "ponto prático 3", "ponto prático 4"],
      "quote": "frase marcante ou insight poderoso deste capítulo"
    }
  ],
  "conclusion": "3 frases de conclusão poderosa com call to action implícito",
  "callToAction": "chamada para ação direta e urgente"
}

Crie 4 capítulos completos. Cada capítulo deve ter profundidade real — extraia os melhores insights do vídeo.`,
      },
    ],
  });

  const text = response.content[0].type === "text" ? response.content[0].text : "";
  return parseJsonSafe(text) as EbookData;
}

export async function generateSalesPage(
  ebook: EbookData,
  apiKey?: string,
  language = "pt-BR"
): Promise<SalesPageData> {
  const client = getClient(apiKey);
  const langInstr = LANG_INSTRUCTION[language] || LANG_INSTRUCTION["pt-BR"];

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 3000,
    system: `Você é um copywriter especialista em páginas de vendas de alto impacto.
Use os frameworks: PAS (Problema-Agitação-Solução), AIDA e prova social.
Escreva copy direto, específico e que gere urgência real. Sem clichês.
${langInstr}
Responda APENAS com JSON válido.`,
    messages: [
      {
        role: "user",
        content: `Crie uma página de vendas completa para este ebook:

Título: ${ebook.title}
Subtítulo: ${ebook.subtitle}
Descrição: ${ebook.description}
Capítulos: ${ebook.chapters.map((c) => c.title).join(", ")}
CTA: ${ebook.callToAction}

Retorne JSON com esta estrutura:
{
  "headline": "headline principal ultra-impactante (máx 10 palavras)",
  "subheadline": "subheadline que complementa e aprofunda a promessa",
  "problemSection": "seção que descreve a dor/problema do leitor (2 parágrafos)",
  "solutionSection": "seção que apresenta o ebook como solução (2 parágrafos)",
  "benefits": ["benefício específico 1", "benefício 2", "benefício 3", "benefício 4", "benefício 5"],
  "socialProof": "seção de prova social / credibilidade (1 parágrafo)",
  "offer": "apresentação da oferta com tudo que está incluso",
  "cta": "texto do botão de chamada para ação",
  "urgency": "elemento de urgência ou escassez",
  "faq": [
    {"question": "pergunta comum 1", "answer": "resposta direta"},
    {"question": "pergunta comum 2", "answer": "resposta direta"},
    {"question": "pergunta comum 3", "answer": "resposta direta"}
  ]
}`,
      },
    ],
  });

  const text = response.content[0].type === "text" ? response.content[0].text : "";
  return parseJsonSafe(text) as SalesPageData;
}

export async function generateAdCreatives(
  ebook: EbookData,
  salesPage: SalesPageData,
  apiKey?: string,
  language = "pt-BR"
): Promise<AdCreative[]> {
  const client = getClient(apiKey);
  const langInstr = LANG_INSTRUCTION[language] || LANG_INSTRUCTION["pt-BR"];

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 2000,
    system: `Você é especialista em criação de anúncios para Meta Ads (Facebook e Instagram).
Crie anúncios que param o scroll, geram curiosidade e convertem.
${langInstr}
Responda APENAS com JSON válido.`,
    messages: [
      {
        role: "user",
        content: `Crie 3 criativos para Meta Ads para este ebook:

Título: ${ebook.title}
Headline da página de vendas: ${salesPage.headline}
Benefícios: ${salesPage.benefits.join(", ")}

Crie 1 criativo para cada formato: story (vertical 9:16), feed (quadrado 1:1), carrossel.

Retorne JSON array:
[
  {
    "format": "story",
    "headline": "texto curto e impactante (máx 6 palavras)",
    "body": "texto do anúncio (máx 3 linhas, direto ao ponto)",
    "cta": "texto do botão CTA",
    "imagePrompt": "descrição em inglês para gerar imagem fotorrealista impactante para este anúncio, sem texto na imagem, estilo cinematográfico, sem rostos famosos"
  },
  { "format": "feed", ... },
  { "format": "carrossel", ... }
]`,
      },
    ],
  });

  const text = response.content[0].type === "text" ? response.content[0].text : "";
  return parseJsonSafe(text) as AdCreative[];
}
