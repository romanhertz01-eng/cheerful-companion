// ─── Image model providers & sub-models for /design ───

export interface ImageSubModel {
  id: string;
  name: string;
  credits: number;
  isNew?: boolean;
  isDefault?: boolean;
  badge?: string;
  desc?: string;
  time?: string;
}

export interface ImageProvider {
  id: string;
  name: string;
  icon: string;
  badge?: string;
  badgeColor?: string;
  description: string;
  subModels: ImageSubModel[];
  aspectRatios: string[];
  maxUploads: number;
  quantityOptions?: number[];
  qualityOptions?: string[];
  /** Extra toggles/pills rendered dynamically */
  hasTurbo?: boolean;
  hasAdvanced?: boolean;
  advancedFields?: AdvancedField[];
  styles?: string[];
}

export interface AdvancedField {
  key: string;
  label: string;
  type: "slider" | "input" | "style-grid";
  min?: number;
  max?: number;
  default?: number;
  options?: string[];
}

export const imageProviders: ImageProvider[] = [
  {
    id: "nano-banana",
    name: "Nano Banana",
    icon: "🍌",
    badge: "Популярная",
    badgeColor: "yellow",
    description: "Нашумевшая нейросеть от Google: Gemini Flash 3.0 Banana. Загрузите до 14 изображений вместе с запросом, чтобы использовать режим Remix",
    subModels: [
      { id: "nb-2-1k", name: "Nano Banana 2 · 1K", credits: 45, isDefault: true, isNew: true, desc: "1K · за изображение", time: "30 сек" },
      { id: "nb-2-2k", name: "Nano Banana 2 · 2K", credits: 70, isNew: true, desc: "2K · за изображение", time: "30 сек" },
      { id: "nb-2-4k", name: "Nano Banana 2 · 4K", credits: 105, isNew: true, desc: "4K · за изображение", time: "45 сек" },
      { id: "nb-2-lite", name: "Nano Banana 2 Lite", credits: 25, desc: "Быстрая · за изображение", time: "20 сек" },
      { id: "nb-pro", name: "Nano Banana Pro", credits: 145, desc: "Про · за изображение", time: "35 сек" },
    ],
    aspectRatios: ["1:1", "16:9", "9:16", "4:3", "3:4", "4:5", "5:4", "21:9"],
    maxUploads: 14,
    quantityOptions: [1, 2, 3, 4],
    qualityOptions: ["1K", "2K", "3K", "4K"],
  },
  {
    id: "seedream",
    name: "Seedream",
    icon: "📊",
    badge: "NEW",
    badgeColor: "green",
    description: "Seedream 5.0 (Lite) — единая мультимодальная модель ByteDance для генерации из текста, генерации по изображению, переноса стиля и редактирования.",
    subModels: [
      { id: "seedream-5-lite", name: "Seedream 5.0 Lite", credits: 30, isDefault: true, isNew: true, desc: "За изображение", time: "10 сек" },
      { id: "seedream-4-5", name: "Seedream 4.5", credits: 35, desc: "За изображение", time: "15 сек" },
      { id: "seedream-5-pro-1k", name: "Seedream 5 Pro · 1K", credits: 40, isNew: true, desc: "За изображение", time: "20 сек" },
      { id: "seedream-5-pro-2k", name: "Seedream 5 Pro · 2K", credits: 80, isNew: true, desc: "За изображение", time: "25 сек" },
    ],
    aspectRatios: ["1:1", "16:9", "9:16", "4:3", "3:4", "4:5"],
    maxUploads: 14,
    quantityOptions: [1, 2, 3, 4],
    qualityOptions: ["1K", "2K", "3K", "4K"],
  },
  {
    id: "gpt-image",
    name: "GPT Image",
    icon: "🤖",
    badge: "Premium",
    badgeColor: "purple",
    description: "Создавайте или редактируйте изображения в нейросети Sora Images (она же GPT Images) от OpenAI. Загрузите до 5 изображений для режима Remix.",
    subModels: [
      { id: "gpt-image-2-1k", name: "GPT Image 2 · 1K", credits: 35, isDefault: true, isNew: true, desc: "За изображение", time: "20 сек", badge: "NEW" },
      { id: "gpt-image-2-2k", name: "GPT Image 2 · 2K", credits: 55, isNew: true, desc: "За изображение", time: "25 сек" },
      { id: "gpt-image-2-4k", name: "GPT Image 2 · 4K", credits: 90, isNew: true, desc: "За изображение", time: "35 сек" },
      { id: "gpt-image-1-5-medium", name: "GPT Image 1.5 Medium", credits: 20, desc: "За изображение", time: "18 сек" },
    ],
    aspectRatios: ["1:1", "16:9", "9:16", "4:3", "3:4"],
    maxUploads: 5,
    quantityOptions: [1],
  },
  {
    id: "flux",
    name: "Flux",
    icon: "⚡",
    badge: "SOTA",
    badgeColor: "blue",
    description: "Набор моделей Flux для генерации изображений претендует на звание SOTA (state of the art), что является статусом лучших в индустрии.",
    subModels: [
      { id: "flux-2-pro-1k", name: "Flux-2 Pro · 1K", credits: 40, isDefault: true, isNew: true, desc: "За изображение", time: "15 сек" },
      { id: "flux-2-pro-2k", name: "Flux-2 Pro · 2K", credits: 55, isNew: true, desc: "За изображение", time: "18 сек" },
      { id: "flux-2-flex-1k", name: "Flux-2 Flex · 1K", credits: 115, desc: "Высокая гибкость · за изображение", time: "20 сек" },
    ],
    aspectRatios: ["1:1", "16:9", "9:16", "4:3", "3:4", "21:9"],
    maxUploads: 1,
    hasAdvanced: true,
    advancedFields: [
      { key: "steps", label: "Steps", type: "slider", min: 1, max: 50, default: 25 },
      { key: "cfg", label: "CFG Scale", type: "slider", min: 1, max: 20, default: 7 },
      { key: "seed", label: "Seed", type: "input" },
    ],
    styles: ["Photography", "Digital Art", "Illustration", "Sketch", "3D Render", "Anime"],
  },
  {
    id: "grok-imagine",
    name: "Grok Imagine",
    icon: "⚡",
    badge: "xAI",
    badgeColor: "orange",
    description: "Генерация изображений от xAI на базе Grok. Стандарт и режим Quality для 1K/2K.",
    subModels: [
      { id: "grok-imagine", name: "Grok Imagine", credits: 25, isDefault: true, desc: "За изображение", time: "15 сек" },
      { id: "grok-quality-1k", name: "Grok Quality · 1K", credits: 80, desc: "За изображение", time: "20 сек" },
      { id: "grok-quality-2k", name: "Grok Quality · 2K", credits: 115, desc: "За изображение", time: "25 сек" },
    ],
    aspectRatios: ["1:1", "16:9", "9:16", "4:3", "3:4"],
    maxUploads: 0,
    quantityOptions: [1, 2],
  },
  {
    id: "qwen-image",
    name: "Qwen Image",
    icon: "🔮",
    badge: "Alibaba",
    badgeColor: "blue",
    description: "Мультимодальная генерация и редактирование изображений от Alibaba.",
    subModels: [
      { id: "qwen-image", name: "Qwen Image", credits: 55, isDefault: true, desc: "За изображение", time: "20 сек" },
      { id: "qwen-image-edit", name: "Qwen Image Edit", credits: 70, desc: "За изображение", time: "25 сек" },
      { id: "qwen-z-image", name: "Qwen Z-Image", credits: 20, desc: "За изображение", time: "15 сек" },
    ],
    aspectRatios: ["1:1", "16:9", "9:16", "4:3", "3:4"],
    maxUploads: 1,
    quantityOptions: [1, 2],
  },
  {
    id: "topaz",
    name: "Topaz Upscale",
    icon: "🔺",
    badge: "Upscale",
    badgeColor: "purple",
    description: "Апскейл изображений до 8K с сохранением деталей.",
    subModels: [
      { id: "topaz-upscale-2k", name: "Topaz Upscale · 2K", credits: 80, isDefault: true, desc: "За изображение", time: "20 сек" },
      { id: "topaz-upscale-4k", name: "Topaz Upscale · 4K", credits: 160, desc: "За изображение", time: "30 сек" },
      { id: "topaz-upscale-8k", name: "Topaz Upscale · 8K", credits: 320, desc: "За изображение", time: "60 сек" },
    ],
    aspectRatios: ["1:1"],
    maxUploads: 1,
    quantityOptions: [1],
  },
  {
    id: "recraft",
    name: "Recraft",
    icon: "✂️",
    badge: "Utility",
    badgeColor: "green",
    description: "Утилитарные операции с изображениями от Recraft: апскейл и удаление фона.",
    subModels: [
      { id: "recraft-crisp-upscale", name: "Recraft Crisp Upscale", credits: 5, isDefault: true, desc: "За изображение", time: "10 сек" },
      { id: "recraft-remove-bg", name: "Recraft Remove Background", credits: 10, desc: "За изображение", time: "10 сек" },
    ],
    aspectRatios: ["1:1"],
    maxUploads: 1,
    quantityOptions: [1],
  },
];

// ─── Grid cards (ordered by popularity) ───

export interface GridCard {
  providerId: string;
  subModelId: string;
  label: string;
  shortDesc: string;
  credits: number;
  isNew?: boolean;
  badge?: string;
}

export const imageGridCards: GridCard[] = [
  { providerId: "nano-banana", subModelId: "nb-2-1k", label: "Nano Banana 2 · 1K", shortDesc: "45 кр за изображение", credits: 45, isNew: true },
  { providerId: "seedream", subModelId: "seedream-5-lite", label: "Seedream 5.0 Lite", shortDesc: "30 кр за изображение", credits: 30, isNew: true },
  { providerId: "gpt-image", subModelId: "gpt-image-2-1k", label: "GPT Image 2 · 1K", shortDesc: "35 кр за изображение", credits: 35, badge: "NEW", isNew: true },
  { providerId: "flux", subModelId: "flux-2-pro-1k", label: "Flux-2 Pro · 1K", shortDesc: "40 кр за изображение", credits: 40, isNew: true },
  { providerId: "grok-imagine", subModelId: "grok-imagine", label: "Grok Imagine", shortDesc: "25 кр за изображение", credits: 25 },
  { providerId: "qwen-image", subModelId: "qwen-image", label: "Qwen Image", shortDesc: "55 кр за изображение", credits: 55 },
  { providerId: "topaz", subModelId: "topaz-upscale-2k", label: "Topaz Upscale · 2K", shortDesc: "Апскейл · 80 кр", credits: 80 },
  { providerId: "recraft", subModelId: "recraft-crisp-upscale", label: "Recraft Crisp Upscale", shortDesc: "Утилита · 5 кр", credits: 5 },
];

// ─── Carousel promo cards ───

export interface CarouselPromo {
  providerId: string;
  subModelId: string;
  title: string;
  desc: string;
  gradient: string;
  badge?: string;
}

export const imageCarouselCards: CarouselPromo[] = [
  {
    providerId: "nano-banana",
    subModelId: "nb-2-1k",
    title: "NANO BANANA 2",
    desc: "1K · 45 кр за изображение",
    gradient: "linear-gradient(135deg, #1a2e0f, #2e4e1b)",
    badge: "NEW",
  },
  {
    providerId: "seedream",
    subModelId: "seedream-5-lite",
    title: "SEEDREAM 5.0 LITE",
    desc: "30 кр за изображение · до 14 референсов",
    gradient: "linear-gradient(135deg, #0a1a2e, #1b2d4e)",
    badge: "NEW",
  },
  {
    providerId: "flux",
    subModelId: "flux-2-pro-1k",
    title: "FLUX-2 PRO",
    desc: "SOTA · 40 кр за изображение",
    gradient: "linear-gradient(135deg, #1a0a2e, #2e1a4e)",
    badge: "NEW",
  },
];

// ─── Prompt suggestions ───

export const imagePromptSuggestions = [
  "Рождественское настроени...",
  "Открытка с днём рождения",
  "Путешествие с питомцем",
  "Аниме портрет",
  "Логотип минимализм",
  "Киберпанк город ночью",
  "Сюрреалистичный пейзаж",
];

// ─── Helpers ───

export function getDefaultSubModel(provider: ImageProvider): ImageSubModel {
  return provider.subModels.find((s) => s.isDefault) || provider.subModels[0];
}

export function getProviderById(id: string): ImageProvider | undefined {
  return imageProviders.find((p) => p.id === id);
}
