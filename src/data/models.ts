export type ModelCategory = "text" | "image" | "video" | "audio";

export interface SubModel {
  id: string;
  name: string;
  credits: number;
  isNew?: boolean;
}

export interface AIModel {
  id: string;
  name: string;
  provider: string;
  category: ModelCategory;
  subModels?: SubModel[];
  credits: number;
  description: string;
  icon: string;
  isNew?: boolean;
  slug: string;
}

export const models: AIModel[] = [
  // === TEXT ===
  {
    id: "chatgpt",
    name: "ChatGPT",
    provider: "OpenAI",
    category: "text",
    credits: 1,
    description: "Семейство моделей GPT от OpenAI для генерации текста, кода и анализа данных.",
    icon: "🤖",
    slug: "chatgpt",
    subModels: [
      { id: "gpt-5-6-luna", name: "GPT-5.6 Luna", credits: 4 },
      { id: "gpt-5-2", name: "GPT 5.2", credits: 6 },
      { id: "gpt-5-4", name: "GPT 5.4", credits: 10 },
      { id: "gpt-5-6-terra", name: "GPT-5.6 Terra", credits: 10 },
      { id: "gpt-5-5", name: "GPT 5.5", credits: 18 },
      { id: "gpt-5-6-sol", name: "GPT-5.6 Sol", credits: 18, isNew: true },
    ],
  },
  {
    id: "claude",
    name: "Claude",
    provider: "Anthropic",
    category: "text",
    credits: 1,
    description: "Модели Anthropic Claude для безопасной генерации текста и анализа документов.",
    icon: "🧠",
    slug: "claude",
    subModels: [
      { id: "claude-haiku-4-5", name: "Haiku 4.5", credits: 3 },
      { id: "claude-sonnet-4-6", name: "Sonnet 4.6", credits: 10 },
      { id: "claude-sonnet-5", name: "Sonnet 5", credits: 10, isNew: true },
      { id: "claude-opus-4-7", name: "Opus 4.7", credits: 18 },
      { id: "claude-opus-4-8", name: "Opus 4.8", credits: 20 },
      { id: "claude-fable-5", name: "Fable 5", credits: 40, isNew: true },
    ],
  },
  {
    id: "gemini",
    name: "Gemini",
    provider: "Google",
    category: "text",
    credits: 1,
    description: "Мультимодальные модели Google для текста, кода и анализа изображений.",
    icon: "💎",
    slug: "gemini",
    subModels: [
      { id: "gemini-2-5-flash", name: "Gemini 2.5 Flash", credits: 3 },
      { id: "gemini-3-flash", name: "Gemini 3 Flash", credits: 3 },
      { id: "gemini-3-5-flash", name: "Gemini 3.5 Flash", credits: 6, isNew: true },
      { id: "gemini-2-5-pro", name: "Gemini 2.5 Pro", credits: 6 },
      { id: "gemini-3-pro", name: "Gemini 3 Pro", credits: 6 },
      { id: "gemini-3-1-pro", name: "Gemini 3.1 Pro", credits: 6, isNew: true },
    ],
  },
  {
    id: "grok",
    name: "Grok",
    provider: "xAI",
    category: "text",
    credits: 2,
    description: "Модели Grok от xAI для рассуждений, поиска и генерации текста.",
    icon: "⚡",
    slug: "grok",
    subModels: [
      { id: "grok-4-3", name: "Grok 4.3", credits: 7 },
      { id: "grok-4-5", name: "Grok 4.5", credits: 13, isNew: true },
    ],
  },
  {
    id: "deepseek",
    name: "DeepSeek",
    provider: "DeepSeek",
    category: "text",
    credits: 1,
    description: "Открытые модели DeepSeek для генерации текста и сложных рассуждений.",
    icon: "🔍",
    slug: "deepseek",
    subModels: [
      { id: "deepseek-v4-flash", name: "DeepSeek V4-Flash", credits: 3 },
      { id: "deepseek-v4-pro", name: "DeepSeek V4-Pro", credits: 10 },
    ],
  },
  {
    id: "perplexity",
    name: "Perplexity",
    provider: "Perplexity",
    category: "text",
    credits: 3,
    description: "Модели Perplexity для поиска и анализа информации в реальном времени.",
    icon: "🌐",
    slug: "perplexity",
    subModels: [
      { id: "sonar", name: "Perplexity Sonar", credits: 15 },
      { id: "sonar-pro", name: "Perplexity Sonar Pro", credits: 35 },
      { id: "sonar-reasoning-pro", name: "Sonar Reasoning Pro", credits: 25 },
      { id: "sonar-deep-research", name: "Sonar Deep Research", credits: 150 },
    ],
  },
  {
    id: "qwen",
    name: "Qwen",
    provider: "Alibaba",
    category: "text",
    credits: 1,
    description: "Модели Qwen от Alibaba для многоязычной генерации текста и рассуждений.",
    icon: "🔮",
    slug: "qwen",
    subModels: [
      { id: "qwen-3-6-flash", name: "Qwen 3.6 Flash", credits: 3 },
      { id: "qwen-3-7-plus", name: "Qwen 3.7 Plus", credits: 3 },
      { id: "qwen-3-7-max", name: "Qwen 3.7 Max", credits: 18, isNew: true },
    ],
  },

  // === IMAGE ===
  {
    id: "nano-banana",
    name: "Nano Banana",
    provider: "Google",
    category: "image",
    credits: 45,
    description: "Генерация изображений от Google с фотореалистичным качеством. Цена за изображение.",
    icon: "🍌",
    slug: "nano-banana",
    subModels: [
      { id: "nb-2-1k", name: "Nano Banana 2 · 1K", credits: 45, isNew: true },
      { id: "nb-2-2k", name: "Nano Banana 2 · 2K", credits: 70, isNew: true },
      { id: "nb-2-4k", name: "Nano Banana 2 · 4K", credits: 105, isNew: true },
      { id: "nb-2-lite", name: "Nano Banana 2 Lite", credits: 25 },
      { id: "nb-pro", name: "Nano Banana Pro", credits: 145 },
    ],
  },
  {
    id: "seedream",
    name: "Seedream",
    provider: "ByteDance",
    category: "image",
    credits: 30,
    description: "Мультимодальная модель ByteDance для генерации и редактирования изображений. Цена за изображение.",
    icon: "🌱",
    slug: "seedream",
    isNew: true,
    subModels: [
      { id: "seedream-5-lite", name: "Seedream 5.0 Lite", credits: 30 },
      { id: "seedream-4-5", name: "Seedream 4.5", credits: 35 },
      { id: "seedream-5-pro-1k", name: "Seedream 5 Pro · 1K", credits: 40, isNew: true },
      { id: "seedream-5-pro-2k", name: "Seedream 5 Pro · 2K", credits: 80, isNew: true },
    ],
  },
  {
    id: "flux",
    name: "Flux",
    provider: "Black Forest Labs",
    category: "image",
    credits: 40,
    description: "Семейство моделей Flux для SOTA-генерации изображений. Цена за изображение.",
    icon: "⚡",
    slug: "flux",
    subModels: [
      { id: "flux-2-pro-1k", name: "Flux-2 Pro · 1K", credits: 40, isNew: true },
      { id: "flux-2-pro-2k", name: "Flux-2 Pro · 2K", credits: 55, isNew: true },
      { id: "flux-2-flex-1k", name: "Flux-2 Flex · 1K", credits: 115 },
    ],
  },
  {
    id: "gpt-image",
    name: "GPT Image",
    provider: "OpenAI",
    category: "image",
    credits: 35,
    description: "Генерация изображений от OpenAI. Цена за изображение.",
    icon: "🎨",
    slug: "gpt-image",
    subModels: [
      { id: "gpt-image-2-1k", name: "GPT Image 2 · 1K", credits: 35, isNew: true },
      { id: "gpt-image-2-2k", name: "GPT Image 2 · 2K", credits: 55, isNew: true },
      { id: "gpt-image-2-4k", name: "GPT Image 2 · 4K", credits: 90, isNew: true },
      { id: "gpt-image-1-5-medium", name: "GPT Image 1.5 Medium", credits: 20 },
    ],
  },
  {
    id: "grok-imagine",
    name: "Grok Imagine",
    provider: "xAI",
    category: "image",
    credits: 25,
    description: "Генерация изображений от xAI на базе Grok. Цена за изображение.",
    icon: "⚡",
    slug: "grok-imagine",
    subModels: [
      { id: "grok-imagine", name: "Grok Imagine", credits: 25 },
      { id: "grok-quality-1k", name: "Grok Quality · 1K", credits: 80 },
      { id: "grok-quality-2k", name: "Grok Quality · 2K", credits: 115 },
    ],
  },
  {
    id: "qwen-image",
    name: "Qwen Image",
    provider: "Alibaba",
    category: "image",
    credits: 55,
    description: "Мультимодальная генерация изображений от Alibaba. Цена за изображение.",
    icon: "🔮",
    slug: "qwen-image",
    subModels: [
      { id: "qwen-image", name: "Qwen Image", credits: 55 },
      { id: "qwen-image-edit", name: "Qwen Image Edit", credits: 70 },
      { id: "qwen-z-image", name: "Qwen Z-Image", credits: 20 },
    ],
  },
  {
    id: "topaz",
    name: "Topaz Upscale",
    provider: "Topaz Labs",
    category: "image",
    credits: 80,
    description: "Апскейл изображений до 8K. Цена за изображение.",
    icon: "🔺",
    slug: "topaz",
    subModels: [
      { id: "topaz-upscale-2k", name: "Topaz Upscale · 2K", credits: 80 },
      { id: "topaz-upscale-4k", name: "Topaz Upscale · 4K", credits: 160 },
      { id: "topaz-upscale-8k", name: "Topaz Upscale · 8K", credits: 320 },
    ],
  },
  {
    id: "recraft",
    name: "Recraft",
    provider: "Recraft",
    category: "image",
    credits: 5,
    description: "Утилитарные операции с изображениями от Recraft. Цена за изображение.",
    icon: "✂️",
    slug: "recraft",
    subModels: [
      { id: "recraft-crisp-upscale", name: "Recraft Crisp Upscale", credits: 5 },
      { id: "recraft-remove-bg", name: "Recraft Remove Background", credits: 10 },
    ],
  },

  // === VIDEO ===
  {
    id: "veo",
    name: "Veo Fast",
    provider: "Google",
    category: "video",
    credits: 355,
    description: "Генерация видео от Google. Цена за клип.",
    icon: "🎥",
    slug: "veo",
    subModels: [
      { id: "veo-fast-720p", name: "Veo Fast 720p", credits: 355 },
      { id: "veo-fast-1080p", name: "Veo Fast 1080p", credits: 385 },
      { id: "veo-fast-4k", name: "Veo Fast 4K", credits: 1065 },
    ],
  },
  {
    id: "sora-2",
    name: "Sora 2",
    provider: "OpenAI",
    category: "video",
    credits: 160,
    description: "Флагман видеогенерации от OpenAI. Цена за секунду.",
    icon: "🌀",
    slug: "sora-2",
    subModels: [
      { id: "sora-2-base", name: "Sora 2 · за секунду", credits: 160 },
      { id: "sora-2-pro", name: "Sora 2 Pro · за секунду", credits: 480 },
    ],
  },
  {
    id: "kling-video",
    name: "Kling",
    provider: "Kuaishou",
    category: "video",
    credits: 115,
    description: "Генерация видео Kling. Kling 3.0 — цена за секунду, старшие версии — за клип.",
    icon: "🎞",
    slug: "kling-video",
    subModels: [
      { id: "kling-3-0", name: "Kling 3.0 · за секунду (720p)", credits: 115, isNew: true },
      { id: "kling-3-0-turbo", name: "Kling 3.0 Turbo · за секунду", credits: 145, isNew: true },
      { id: "kling-3-0-motion", name: "Kling 3.0 Motion Control · за секунду", credits: 190, isNew: true },
      { id: "kling-2-6", name: "Kling 2.6 · за клип 5с", credits: 370 },
      { id: "kling-2-5-turbo", name: "Kling 2.5 Turbo · за клип 5с", credits: 285 },
    ],
  },
  {
    id: "seedance",
    name: "Seedance",
    provider: "ByteDance",
    category: "video",
    credits: 330,
    description: "Кинематографичная видеогенерация от ByteDance. Цена за секунду.",
    icon: "💃",
    slug: "seedance",
    subModels: [
      { id: "seedance-2-0-fast", name: "Seedance 2.0 Fast · за секунду (480p)", credits: 105, isNew: true },
      { id: "seedance-2-0", name: "Seedance 2.0 · за секунду (720p)", credits: 330, isNew: true },
      { id: "seedance-2-0-1080p", name: "Seedance 2.0 · за секунду (1080p)", credits: 960, isNew: true },
    ],
  },
  {
    id: "hailuo",
    name: "Hailuo",
    provider: "MiniMax",
    category: "video",
    credits: 200,
    description: "Быстрая видеогенерация Hailuo. Цена за клип 6 секунд.",
    icon: "🎬",
    slug: "hailuo",
    subModels: [
      { id: "hailuo-2-3-std", name: "Hailuo 2.3 Std · за клип 6с", credits: 200, isNew: true },
      { id: "hailuo-2-3-pro", name: "Hailuo 2.3 Pro · за клип 6с", credits: 365, isNew: true },
    ],
  },
  {
    id: "wan-ai",
    name: "Wan AI",
    provider: "Alibaba",
    category: "video",
    credits: 130,
    description: "Открытая модель видеогенерации от Alibaba. Цена за секунду.",
    icon: "🌊",
    slug: "wan-ai",
    subModels: [
      { id: "wan-2-7", name: "Wan 2.7 · за секунду (720p)", credits: 130, isNew: true },
      { id: "wan-2-7-1080p", name: "Wan 2.7 · за секунду (1080p)", credits: 195, isNew: true },
    ],
  },

  // === AUDIO ===
  {
    id: "elevenlabs",
    name: "ElevenLabs",
    provider: "ElevenLabs",
    category: "audio",
    credits: 95,
    description: "Передовой синтез речи. Цена за 1000 знаков, минимум 25 кр.",
    icon: "🎙",
    slug: "elevenlabs",
    subModels: [
      { id: "el-studio", name: "Студийное (v2) · за 1000 знаков, минимум 25 кр", credits: 95 },
      { id: "el-turbo", name: "Быстрое (Turbo) · за 1000 знаков, минимум 25 кр", credits: 50 },
      { id: "el-dialogue", name: "Диалоги (v3) · за 1000 знаков, минимум 25 кр", credits: 115 },
    ],
  },
  {
    id: "suno",
    name: "Suno",
    provider: "Suno",
    category: "audio",
    credits: 80,
    description: "Генерация музыки, вокала и звуковых эффектов. Цена за операцию.",
    icon: "🎵",
    slug: "suno",
    subModels: [
      { id: "suno-track", name: "Трек (2 варианта)", credits: 80 },
      { id: "suno-extend", name: "Продлить трек", credits: 80 },
      { id: "suno-vocal", name: "Добавить вокал", credits: 80 },
      { id: "suno-cover", name: "Кавер по загрузке", credits: 80 },
      { id: "suno-fragment", name: "Замена фрагмента", credits: 40 },
      { id: "suno-sfx", name: "Звуковые эффекты", credits: 20 },
      { id: "suno-stems", name: "Разделение на стемы", credits: 80 },
      { id: "suno-clip", name: "Клип к треку", credits: 15 },
    ],
  },
];

export function getModelsByCategory(category: ModelCategory): AIModel[] {
  return models.filter((m) => m.category === category);
}

export function getModelBySlug(slug: string): AIModel | undefined {
  return models.find((m) => m.slug === slug);
}
