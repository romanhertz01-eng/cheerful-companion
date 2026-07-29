export type PlanFeature = { text: string; unlimited?: boolean; negative?: boolean };

export type Plan = {
  id: string;
  name: string;
  badge?: { text: string; tone: "free" | "accent" | "muted" };
  monthPrice: number | null; // rub/month
  yearPricePerMonth: number | null; // rub/month billed yearly
  priceLabel?: string; // for enterprise
  credits: string;
  creditsNote?: string;
  cta: string;
  features: PlanFeature[];
  highlight?: boolean; // orange border + glow
  enterprise?: boolean; // accent bg card
  audience?: "personal" | "team";
};

export const plans: Plan[] = [
  {
    id: "start",
    name: "Старт",
    badge: { text: "Бесплатно", tone: "free" },
    monthPrice: 0,
    yearPricePerMonth: 0,
    credits: "150",
    creditsNote: "разово",
    cta: "Начать бесплатно",
    audience: "personal",
    features: [
      { text: "150 кредитов при регистрации" },
      { text: "Чат DeepSeek — 10 сообщений в день" },
      { text: "Базовые текстовые и image-модели" },
      { text: "Качество до 1K" },
      { text: "Видео недоступно", negative: true },
      { text: "История генераций 7 дней" },
    ],
  },
  {
    id: "basic",
    name: "Базовый",
    monthPrice: 790,
    yearPricePerMonth: 672,
    credits: "3 000",
    creditsNote: "в месяц",
    cta: "Выбрать план",
    audience: "personal",
    features: [
      { text: "Все текстовые модели (30+)" },
      { text: "Все модели изображений" },
      { text: "5 видео-моделей" },
      { text: "Качество до 2K" },
      { text: "Безлимитный ИИ-чат", unlimited: true },
      { text: "История генераций 30 дней" },
    ],
  },
  {
    id: "pro",
    name: "Про",
    badge: { text: "Популярный", tone: "accent" },
    monthPrice: 1490,
    yearPricePerMonth: 1267,
    credits: "8 000",
    creditsNote: "в месяц",
    cta: "Выбрать план",
    highlight: true,
    audience: "personal",
    features: [
      { text: "Доступ ко всем 90+ моделям" },
      { text: "Качество до 4K" },
      { text: "Генерация без очереди" },
      { text: "API-доступ" },
      { text: "Безлимит быстрых нейросетей", unlimited: true },
      { text: "Апскейл и удаление фона — бесплатно", unlimited: true },
      { text: "История генераций 90 дней" },
    ],
  },
  {
    id: "max",
    name: "Макс",
    monthPrice: 3990,
    yearPricePerMonth: 3392,
    credits: "24 000",
    creditsNote: "в месяц",
    cta: "Выбрать план",
    audience: "team",
    features: [
      { text: "Всё из Про" },
      { text: "Безлимит в 15+ нейросетях", unlimited: true },
      { text: "Безлимит изображений (Z-Image)", unlimited: true },
      { text: "Команда до 3 мест" },
      { text: "Приоритетная очередь" },
    ],
  },
  {
    id: "ultra",
    name: "Ультра",
    badge: { text: "Максимум", tone: "accent" },
    highlight: true,
    monthPrice: 9990,
    yearPricePerMonth: 8492,
    credits: "70 000",
    creditsNote: "в месяц",
    cta: "Выбрать план",
    audience: "team",
    features: [
      { text: "Всё из Макс" },
      { text: "Безлимит во ВСЕХ языковых моделях (вкл. Claude Opus, GPT-5.6)", unlimited: true },
      { text: "Безлимит изображений в 2 моделях", unlimited: true },
      { text: "Максимальный приоритет" },
      { text: "История генераций бессрочно" },
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    monthPrice: null,
    yearPricePerMonth: null,
    priceLabel: "Индивидуально",
    credits: "от 15 мест",
    cta: "Оставить заявку",
    enterprise: true,
    audience: "team",
    features: [
      { text: "Личный менеджер" },
      { text: "Постоплата и договор" },
      { text: "SLA и кастомные лимиты" },
      { text: "Гибкие условия для бизнеса и школ" },
    ],
  },
];

export const creditPacks = [
  { id: "small", name: "Малый", price: 290, credits: 1000 },
  { id: "medium", name: "Средний", price: 1290, credits: 5000 },
  { id: "large", name: "Большой", price: 4490, credits: 20000 },
];