// ─── Text model providers & sub-models for /text ───

import type { LucideIcon } from "lucide-react";
import { PenLine, Lightbulb, Code, Languages, Search, BarChart3 } from "lucide-react";

export interface TextSubModel {
  id: string;
  name: string;
  credits: number;
  badge?: string;       // "🏆 TOP" | "NEW" | "∞ FAST" | "🔍 WEB" | "🧠 THINK" | "🏆 PRO"
  description: string;
  isNew?: boolean;
  hasWeb?: boolean;
  hasThinking?: boolean;
  hasFiles?: boolean;
  hasImages?: boolean;
}

export interface TextProvider {
  id: string;
  name: string;
  icon: string;
  subModels: TextSubModel[];
}

export const textProviders: TextProvider[] = [
  {
    id: "chatgpt",
    name: "ChatGPT",
    icon: "",
    subModels: [
      { id: "gpt-5-6-luna", name: "GPT-5.6 Luna", credits: 4, badge: "∞ FAST", description: "Быстрые ответы, лёгкие задачи", hasFiles: true, hasImages: true },
      { id: "gpt-5-2", name: "GPT 5.2", credits: 6, description: "Рабочая лошадка — оптимум цены и качества", hasFiles: true, hasImages: true },
      { id: "gpt-5-4", name: "GPT 5.4", credits: 10, badge: "TOP", description: "Сложные задачи, длинный контекст", hasFiles: true, hasImages: true },
      { id: "gpt-5-6-terra", name: "GPT-5.6 Terra", credits: 10, description: "Универсальный флагман 5.6", hasFiles: true, hasImages: true },
      { id: "gpt-5-5", name: "GPT 5.5", credits: 18, badge: "TOP", description: "Максимальная модель для тяжёлых задач", hasFiles: true, hasImages: true },
      { id: "gpt-5-6-sol", name: "GPT-5.6 Sol", credits: 18, badge: "TOP", description: "Топ-версия 5.6 — самый умный OpenAI", isNew: true, hasFiles: true, hasImages: true },
    ],
  },
  {
    id: "claude",
    name: "Claude",
    icon: "",
    subModels: [
      { id: "claude-haiku-4-5", name: "Haiku 4.5", credits: 3, badge: "∞ FAST", description: "Быстрые ответы и короткие задачи", hasFiles: true, hasImages: true },
      { id: "claude-sonnet-4-6", name: "Sonnet 4.6", credits: 10, description: "Рабочая лошадка Anthropic", hasFiles: true, hasImages: true },
      { id: "claude-sonnet-5", name: "Sonnet 5", credits: 10, badge: "NEW", description: "Новое поколение Sonnet", isNew: true, hasFiles: true, hasImages: true },
      { id: "claude-opus-4-7", name: "Opus 4.7", credits: 18, badge: "TOP", description: "Сложные задачи и длинный контекст", hasFiles: true, hasImages: true },
      { id: "claude-opus-4-8", name: "Opus 4.8", credits: 20, badge: "TOP", description: "Обновлённый Opus с лучшим кодингом", hasFiles: true, hasImages: true },
      { id: "claude-fable-5", name: "Fable 5", credits: 40, badge: "NEW", description: "Самый мощный Claude", isNew: true, hasFiles: true, hasImages: true },
    ],
  },
  {
    id: "gemini",
    name: "Gemini",
    icon: "",
    subModels: [
      { id: "gemini-2-5-flash", name: "Gemini 2.5 Flash", credits: 3, badge: "∞ FAST", description: "Быстрые ответы, мультимодальность", hasFiles: true, hasImages: true },
      { id: "gemini-3-flash", name: "Gemini 3 Flash", credits: 3, badge: "∞ FAST", description: "Быстрая версия Gemini 3", hasFiles: true, hasImages: true },
      { id: "gemini-3-5-flash", name: "Gemini 3.5 Flash", credits: 6, badge: "NEW", description: "Обновлённый Flash 3.5", isNew: true, hasFiles: true, hasImages: true },
      { id: "gemini-2-5-pro", name: "Gemini 2.5 Pro", credits: 6, description: "Рабочая лошадка Google", hasFiles: true, hasImages: true },
      { id: "gemini-3-pro", name: "Gemini 3 Pro", credits: 6, badge: "TOP", description: "Сложные задачи и большие данные", hasFiles: true, hasImages: true },
      { id: "gemini-3-1-pro", name: "Gemini 3.1 Pro", credits: 6, badge: "NEW", description: "Новейший Gemini Pro", isNew: true, hasFiles: true, hasImages: true },
    ],
  },
  {
    id: "grok",
    name: "Grok",
    icon: "",
    subModels: [
      { id: "grok-4-3", name: "Grok 4.3", credits: 7, description: "Рабочая версия Grok — быстрая и точная", hasFiles: true, hasImages: true },
      { id: "grok-4-5", name: "Grok 4.5", credits: 13, badge: "TOP", description: "Флагман xAI для сложных задач", isNew: true, hasFiles: true, hasImages: true, hasThinking: true },
    ],
  },
  {
    id: "deepseek",
    name: "DeepSeek",
    icon: "",
    subModels: [
      { id: "deepseek-v4-flash", name: "DeepSeek V4-Flash", credits: 3, badge: "∞ FAST", description: "Быстрый open-source для повседневных задач", hasFiles: true },
      { id: "deepseek-v4-pro", name: "DeepSeek V4-Pro", credits: 10, description: "Мощный DeepSeek для сложных задач и рассуждений", hasFiles: true, hasThinking: true },
    ],
  },
  {
    id: "perplexity",
    name: "Perplexity",
    icon: "",
    subModels: [
      { id: "sonar", name: "Sonar", credits: 15, badge: "WEB", description: "Быстрый поиск с цитатами", hasWeb: true, hasFiles: true },
      { id: "sonar-pro", name: "Sonar Pro", credits: 35, badge: "WEB", description: "Расширенный поиск с анализом источников", hasWeb: true, hasFiles: true },
      { id: "sonar-reasoning-pro", name: "Sonar Reasoning Pro", credits: 25, badge: "WEB", description: "Поиск с пошаговым рассуждением", hasWeb: true, hasFiles: true, hasThinking: true },
      { id: "sonar-deep-research", name: "Sonar Deep Research", credits: 150, badge: "WEB", description: "Глубокое исследование с полным отчётом", hasWeb: true, hasFiles: true },
    ],
  },
  {
    id: "qwen",
    name: "Qwen",
    icon: "",
    subModels: [
      { id: "qwen-3-6-flash", name: "Qwen 3.6 Flash", credits: 3, badge: "∞ FAST", description: "Быстрая модель Alibaba", hasFiles: true, hasImages: true },
      { id: "qwen-3-7-plus", name: "Qwen 3.7 Plus", credits: 3, description: "Рабочая версия Qwen 3.7", hasFiles: true, hasImages: true },
      { id: "qwen-3-7-max", name: "Qwen 3.7 Max", credits: 18, badge: "TOP", description: "Максимальная мощность и рассуждения", isNew: true, hasFiles: true, hasImages: true, hasThinking: true },
    ],
  },
];

// ─── Quick action cards for welcome screen ───

export interface QuickAction {
  Icon: LucideIcon;
  title: string;
  description: string;
  prompt: string;
}

export const textQuickActions: QuickAction[] = [
  { Icon: PenLine,    title: "Написать текст",   description: "Статья, пост, письмо, сценарий",    prompt: "Напиши мне " },
  { Icon: Lightbulb,  title: "Генерация идей",   description: "Концепции, названия, слоганы",       prompt: "Придумай идеи для " },
  { Icon: Code,       title: "Написать код",     description: "Создам, исправлю, объясню",          prompt: "Напиши код: " },
  { Icon: Languages,  title: "Перевести",        description: "На любой язык с сохранением стиля",  prompt: "Переведи на английский: " },
  { Icon: Search,     title: "Найти ответ",      description: "Факты, объяснения, анализ",          prompt: "Объясни мне " },
  { Icon: BarChart3,  title: "Работа с данными", description: "Таблицы, отчёты, данные",            prompt: "Проанализируй " },
];

// ─── Helpers ───

export function getDefaultTextProvider(): TextProvider {
  return textProviders[0]; // ChatGPT
}

export function getDefaultTextSubModel(): TextSubModel {
  return textProviders[0].subModels.find((s) => s.id === "gpt-5-2")!;
}

export function findTextProvider(id: string): TextProvider | undefined {
  return textProviders.find((p) => p.id === id);
}
