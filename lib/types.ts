export interface EbookChapter {
  title: string;
  content: string;
  keyPoints: string[];
  quote?: string;
}

export interface EbookData {
  title: string;
  subtitle: string;
  author: string;
  description: string;
  chapters: EbookChapter[];
  conclusion: string;
  callToAction: string;
}

export interface SalesPageData {
  headline: string;
  subheadline: string;
  problemSection: string;
  solutionSection: string;
  benefits: string[];
  socialProof: string;
  offer: string;
  cta: string;
  urgency: string;
  faq: { question: string; answer: string }[];
}

export interface AdCreative {
  format: "story" | "feed" | "carrossel";
  headline: string;
  body: string;
  cta: string;
  imagePrompt: string;
  imageUrl?: string;
}

export interface ProjectJob {
  id: string;
  youtubeUrl: string;
  videoId?: string;
  videoTitle?: string;
  thumbnail?: string;
  transcript?: string;
  anthropicKey?: string;
  ebook?: EbookData;
  salesPage?: SalesPageData;
  adCreatives?: AdCreative[];
  checkoutUrl?: string;
  pdfUrl?: string;
  salesPageUrl?: string;
  status: "pending" | "extracting" | "generating" | "done" | "error";
  error?: string;
  createdAt: number;
}
