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
  stats?: { num: number; label: string }[];
  faq: { question: string; answer: string }[];
}

export interface ProjectJob {
  id: string;
  youtubeUrl: string;
  videoId?: string;
  videoTitle?: string;
  thumbnail?: string;
  transcript?: string;
  anthropicKey?: string;
  youtubeApiKey?: string;
  language?: string;
  contentType?: "transcript" | "description" | "clone";
  generateMode?: "both" | "ebook" | "sales";
  salesPageTheme?: "dark" | "light" | "bold";
  ebook?: EbookData;
  salesPage?: SalesPageData;
  checkoutUrl?: string;
  status: "pending" | "extracting" | "generating" | "done" | "error";
  error?: string;
  createdAt: number;
}
