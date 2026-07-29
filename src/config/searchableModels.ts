export type SearchableModelType = "text" | "image" | "video" | "audio";

export interface SearchableModel {
  id: string;
  name: string;
  provider: string;
  type: SearchableModelType;
  credits: string;
  icon?: string;
  isNew?: boolean;
}

export const searchableModels: SearchableModel[] = [
  { id: "chatgpt", name: "ChatGPT", provider: "OpenAI", type: "text", credits: "6" },
  { id: "claude", name: "Claude", provider: "Anthropic", type: "text", credits: "3" },
  { id: "gemini", name: "Gemini", provider: "Google", type: "text", credits: "3" },
  { id: "grok", name: "Grok", provider: "xAI", type: "text", credits: "7" },
  { id: "deepseek", name: "DeepSeek", provider: "DeepSeek", type: "text", credits: "3" },
  { id: "perplexity", name: "Perplexity", provider: "Perplexity", type: "text", credits: "15" },
  { id: "qwen", name: "Qwen", provider: "Alibaba", type: "text", credits: "3" },
  { id: "nb-2-1k", name: "Nano Banana 2", provider: "Google", type: "image", credits: "45", isNew: true },
  { id: "seedream", name: "Seedream 5.0 Lite", provider: "ByteDance", type: "image", credits: "30", isNew: true },
  { id: "flux", name: "Flux-2 Pro", provider: "Black Forest", type: "image", credits: "40", isNew: true },
  { id: "gpt-image", name: "GPT Image 2", provider: "OpenAI", type: "image", credits: "35", isNew: true },
  { id: "grok-imagine", name: "Grok Imagine", provider: "xAI", type: "image", credits: "25" },
  { id: "qwen-image", name: "Qwen Image", provider: "Alibaba", type: "image", credits: "55" },
  { id: "kling-3", name: "Kling 3.0", provider: "Kling", type: "video", credits: "115", isNew: true },
  { id: "veo-fast-720p", name: "Veo Fast 720p", provider: "Google", type: "video", credits: "355", isNew: true },
  { id: "sora-2", name: "Sora 2", provider: "OpenAI", type: "video", credits: "160" },
  { id: "seedance-2", name: "Seedance 2.0", provider: "ByteDance", type: "video", credits: "330" },
  { id: "hailuo", name: "Hailuo 2.3", provider: "MiniMax", type: "video", credits: "200" },
  { id: "wan-2-7", name: "Wan 2.7", provider: "Alibaba", type: "video", credits: "130" },
  { id: "suno", name: "Suno", provider: "Suno", type: "audio", credits: "80" },
  { id: "eleven-labs", name: "ElevenLabs", provider: "ElevenLabs", type: "audio", credits: "95" },
];

export const modelTypeToRoute: Record<SearchableModelType, string> = {
  text: "/text",
  image: "/design",
  video: "/video",
  audio: "/audio",
};
