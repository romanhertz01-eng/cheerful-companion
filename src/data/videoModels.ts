// ─── Video model providers & sub-models for /video ───

export interface VideoSubModel {
  id: string;
  name: string;
  credits: number;
  isNew?: boolean;
  isDefault?: boolean;
  badge?: string;
  desc?: string;
  time?: string;
}

export interface VideoProvider {
  id: string;
  name: string;
  icon: string;
  badge?: string;
  subModels: VideoSubModel[];
  aspectRatios: string[];
  durationOptions: string[];
  resolutionOptions: string[];
  qualityOptions?: string[];
  functions?: string[];
}

export const videoProviders: VideoProvider[] = [
  {
    id: "kling",
    name: "Kling AI",
    icon: "🎬",
    badge: "Топ",
    subModels: [
      { id: "kling-3-0", name: "Kling 3.0", credits: 115, isNew: true, isDefault: true, desc: "720p · за секунду", time: "60 сек" },
      { id: "kling-3-0-turbo", name: "Kling 3.0 Turbo", credits: 145, isNew: true, desc: "Ускоренная · за секунду", time: "60 сек" },
      { id: "kling-3-0-motion", name: "Kling 3.0 Motion Control", credits: 190, isNew: true, desc: "Контроль движения · за секунду", time: "60 сек" },
      { id: "kling-2-6", name: "Kling 2.6", credits: 370, desc: "За клип 5 сек", time: "5 сек" },
      { id: "kling-2-5-turbo", name: "Kling 2.5 Turbo", credits: 285, desc: "За клип 5 сек", time: "5 сек" },
    ],
    aspectRatios: ["16:9", "9:16", "1:1", "4:3", "3:4"],
    durationOptions: ["5s", "8s", "10s"],
    resolutionOptions: ["720p", "1080p"],
    qualityOptions: ["Стандарт", "Профессиональный"],
    functions: ["Текст в видео", "Изображение в видео", "Кадры в видео"],
  },
  {
    id: "seedance",
    name: "Seedance",
    icon: "📊",
    badge: "60% OFF",
    subModels: [
      { id: "seedance-2-0-fast", name: "Seedance 2.0 Fast", credits: 105, isNew: true, desc: "480p · за секунду", time: "120 сек" },
      { id: "seedance-2-0", name: "Seedance 2.0", credits: 330, isNew: true, isDefault: true, badge: "60% OFF", desc: "720p · за секунду", time: "120 сек" },
      { id: "seedance-2-0-1080p", name: "Seedance 2.0 · 1080p", credits: 960, isNew: true, desc: "1080p · за секунду", time: "120 сек" },
    ],
    aspectRatios: ["16:9", "9:16", "1:1", "4:3"],
    durationOptions: ["5s", "8s", "10s"],
    resolutionOptions: ["720p", "1080p"],
    functions: ["Текст в видео", "Изображение в видео"],
  },
  {
    id: "veo",
    name: "Veo",
    icon: "🌊",
    badge: "Google",
    subModels: [
      { id: "veo-fast-720p", name: "Veo Fast 720p", credits: 355, isNew: true, isDefault: true, desc: "За клип", time: "120 сек" },
      { id: "veo-fast-1080p", name: "Veo Fast 1080p", credits: 385, isNew: true, desc: "За клип", time: "120 сек" },
      { id: "veo-fast-4k", name: "Veo Fast 4K", credits: 1065, isNew: true, desc: "За клип", time: "120 сек" },
    ],
    aspectRatios: ["16:9", "9:16", "1:1"],
    durationOptions: ["5s", "8s"],
    resolutionOptions: ["720p", "1080p"],
  },
  {
    id: "sora",
    name: "Sora",
    icon: "⬛",
    badge: "OpenAI",
    subModels: [
      { id: "sora-2", name: "Sora 2", credits: 160, isDefault: true, desc: "Флагман · за секунду", time: "180 сек" },
      { id: "sora-2-pro", name: "Sora 2 Pro", credits: 480, desc: "Максимум · за секунду", time: "300 сек" },
    ],
    aspectRatios: ["16:9", "9:16", "1:1", "4:3"],
    durationOptions: ["5s", "10s", "15s"],
    resolutionOptions: ["720p", "1080p"],
  },
  {
    id: "wan",
    name: "Wan AI",
    icon: "🌊",
    badge: "Open Source",
    subModels: [
      { id: "wan-2-7", name: "Wan 2.7", credits: 130, isDefault: true, isNew: true, desc: "720p · за секунду", time: "90 сек" },
      { id: "wan-2-7-1080p", name: "Wan 2.7 · 1080p", credits: 195, isNew: true, desc: "1080p · за секунду", time: "90 сек" },
    ],
    aspectRatios: ["16:9", "9:16", "1:1"],
    durationOptions: ["4s", "5s", "8s"],
    resolutionOptions: ["480p", "720p"],
  },
  {
    id: "hailuo",
    name: "Hailuo AI",
    icon: "🎬",
    badge: "NEW",
    subModels: [
      { id: "hailuo-2-3-std", name: "Hailuo 2.3 Std", credits: 200, isNew: true, isDefault: true, desc: "За клип 6 сек", time: "6 сек" },
      { id: "hailuo-2-3-pro", name: "Hailuo 2.3 Pro", credits: 365, isNew: true, desc: "За клип 6 сек", time: "6 сек" },
    ],
    aspectRatios: ["16:9", "9:16", "1:1"],
    durationOptions: ["5s", "8s"],
    resolutionOptions: ["720p", "1080p"],
  },
];

// ─── Carousel promo cards ───

export interface VideoCarouselCard {
  providerId: string;
  subModelId: string;
  title: string;
  desc: string;
  gradient: string;
  badge?: string;
}

export const videoCarouselCards: VideoCarouselCard[] = [
  {
    providerId: "seedance",
    subModelId: "seedance-2-0",
    title: "SEEDANCE 2.0",
    desc: "Создайте мир, который вы себе представляете.",
    gradient: "linear-gradient(135deg, #0a2e1a, #1b4e2d)",
    badge: "60% OFF",
  },
  {
    providerId: "kling",
    subModelId: "kling-3-0-motion",
    title: "KLING 3.0 MOTION",
    desc: "Динамический захват обновлён до максимума",
    gradient: "linear-gradient(135deg, #0a1a2e, #1b2d4e)",
    badge: "NEW",
  },
  {
    providerId: "veo",
    subModelId: "veo-fast-720p",
    title: "VEO FAST",
    desc: "Быстрая видеогенерация от Google",
    gradient: "linear-gradient(135deg, #1a0f2e, #2d1b4e)",
    badge: "NEW",
  },
];

// ─── Grid cards ───

export interface VideoGridCard {
  providerId: string;
  subModelId: string;
  label: string;
  shortDesc: string;
  credits: number;
  isNew?: boolean;
  icon?: string;
}

export const videoGridCards: VideoGridCard[] = [
  { providerId: "kling", subModelId: "kling-3-0", label: "Kling 3.0", shortDesc: "720p · 115 кр/сек", credits: 115, isNew: true, icon: "🎬" },
  { providerId: "seedance", subModelId: "seedance-2-0", label: "Seedance 2.0", shortDesc: "720p · 330 кр/сек", credits: 330, isNew: true, icon: "📊" },
  { providerId: "veo", subModelId: "veo-fast-720p", label: "Veo Fast 720p", shortDesc: "355 кр за клип", credits: 355, isNew: true, icon: "🌊" },
  { providerId: "sora", subModelId: "sora-2", label: "Sora 2", shortDesc: "160 кр/сек", credits: 160, icon: "⬛" },
  { providerId: "sora", subModelId: "sora-2-pro", label: "Sora 2 Pro", shortDesc: "480 кр/сек", credits: 480, icon: "⬛" },
  { providerId: "wan", subModelId: "wan-2-7", label: "Wan 2.7", shortDesc: "Open Source · 130 кр/сек", credits: 130, isNew: true, icon: "🌊" },
  { providerId: "hailuo", subModelId: "hailuo-2-3-std", label: "Hailuo 2.3 Std", shortDesc: "200 кр за клип 6с", credits: 200, isNew: true, icon: "🎬" },
  { providerId: "hailuo", subModelId: "hailuo-2-3-pro", label: "Hailuo 2.3 Pro", shortDesc: "365 кр за клип 6с", credits: 365, isNew: true, icon: "🎬" },
];

// ─── Prompt suggestions ───

export const videoPromptSuggestions = [
  "Замороженная поездка",
  "Фонари заднего хода",
  "Минимальное движение",
  "Прибытие динозавра",
  "Киберпанк ночью",
  "Закат над океаном",
  "Танец в невесомости",
];

// ─── Helpers ───

export function getDefaultVideoSubModel(provider: VideoProvider): VideoSubModel {
  return provider.subModels.find((s) => s.isDefault) || provider.subModels[0];
}
