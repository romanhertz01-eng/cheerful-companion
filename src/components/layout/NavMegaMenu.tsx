import { useState, useRef, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare, PenLine, Globe, FileSearch, Languages, Code,
  Image as ImageIcon, Camera, Paintbrush, Eraser, Scissors, ZoomIn, RefreshCw,
  Video, Sparkles, Film, User, TrendingUp,
  Music, AudioLines, Mic, Volume2, Activity, VolumeX,
  FileText,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { ModelGlyph } from "@/components/ui/era/ModelGlyph";
import { useAuth } from "@/contexts/AuthContext";
import { isPublished } from "@/data/toolPages";

export interface FeatureItem {
  icon: LucideIcon;
  title: string;
  desc: string;
  publicHref?: string;
}
export interface ModelItem {
  name: string;
  desc: string;
  badge?: string;
  publicHref?: string;
}
export interface TabConfig {
  key: string;
  label: string;
  route: string;
  publicRoute: string;
  features?: FeatureItem[];
  models?: ModelItem[];
  modelsTitle?: string;
}

export const TABS: TabConfig[] = [
  {
    key: "text", label: "Текст", route: "/text", publicRoute: "/ai/text",
    features: [
      { icon: MessageSquare, title: "Чат с ИИ", desc: "Ответы на любые вопросы", publicHref: "/tools/ai-chat" },
      { icon: PenLine, title: "Написать текст", desc: "Статьи, посты, тексты", publicHref: "/tools/ai-writer" },
      { icon: Globe, title: "Поиск в интернете", desc: "Актуальная информация", publicHref: "/tools/perplexity" },
      { icon: FileSearch, title: "Анализ документов", desc: "Исследования и разбор", publicHref: "/tools/document-analysis" },
      { icon: Languages, title: "Перевод текста", desc: "Перевод с сохранением смысла", publicHref: "/tools/translate" },
      { icon: Code, title: "Написать код", desc: "Создание и исправление кода", publicHref: "/tools/ai-code" },
    ],
    models: [
      { name: "ChatGPT", desc: "GPT от OpenAI", publicHref: "/tools/chatgpt" },
      { name: "Claude", desc: "От Anthropic", publicHref: "/tools/claude" },
      { name: "Gemini", desc: "От Google", publicHref: "/tools/gemini" },
      { name: "Perplexity", desc: "Поиск с ИИ", publicHref: "/tools/perplexity" },
      { name: "Grok", desc: "От xAI", publicHref: "/tools/grok" },
      { name: "Qwen", desc: "От Alibaba" },
      { name: "DeepSeek", desc: "Reasoning модель", publicHref: "/tools/deepseek" },
    ],
  },
  {
    key: "design", label: "Дизайн", route: "/design", publicRoute: "/ai/image",
    features: [
      { icon: ImageIcon, title: "Создать изображение", desc: "Генерация по тексту", publicHref: "/tools/image-generation" },
      { icon: Camera, title: "Сделать ИИ-фото", desc: "Реалистичные фото людей", publicHref: "/tools/ai-portrait" },
      { icon: Paintbrush, title: "Редактор фото", desc: "Изменение и доработка", publicHref: "/tools/photo-editor" },
      { icon: Eraser, title: "Удалить фон", desc: "Удаление и замена фона", publicHref: "/tools/remove-background" },
      { icon: Scissors, title: "Удалить объект", desc: "Удаление людей и предметов", publicHref: "/tools/object-remover" },
      { icon: ZoomIn, title: "Улучшить качество", desc: "Повышение чёткости и деталей", publicHref: "/tools/image-upscaler" },
      { icon: RefreshCw, title: "Реставрация фото", desc: "Убрать царапины и заломы", publicHref: "/tools/photo-restoration" },
      { icon: Paintbrush, title: "Раскрасить ч/б фото", desc: "Цвет для архивных снимков", publicHref: "/tools/colorize-photo" },
      { icon: Eraser, title: "Удалить водяной знак", desc: "Со своих материалов", publicHref: "/tools/watermark-remover" },
    ],
    models: [
      { name: "Nano Banana", desc: "Быстрая генерация", publicHref: "/tools/nano-banana" },
      { name: "Seedream", desc: "От ByteDance", publicHref: "/tools/seedream" },
      { name: "GPT Image", desc: "От OpenAI", publicHref: "/tools/gpt-image" },
      { name: "Flux", desc: "Фотореализм", publicHref: "/tools/flux" },
    ],
  },
  {
    key: "video", label: "Видео", route: "/video", publicRoute: "/ai/video",
    features: [
      { icon: Video, title: "Создать видео", desc: "Генерация из текста", publicHref: "/tools/video-generation" },
      { icon: Sparkles, title: "Оживить фото", desc: "Анимация изображений", publicHref: "/tools/ozhivit-foto" },
      { icon: User, title: "ИИ Аватар", desc: "Говорящие аватары", publicHref: "/tools/talking-avatar" },
      { icon: Film, title: "Видео для карточки Ozon", desc: "Ролик для маркетплейса", publicHref: "/tools/ozon-product-video" },
      { icon: ZoomIn, title: "Улучшить качество", desc: "Апскейл видео до 4K", publicHref: "/tools/video-upscaler" },
    ],
    models: [
      { name: "Kling", desc: "Реалистичное видео", publicHref: "/tools/kling" },
      { name: "Veo", desc: "От Google", publicHref: "/tools/veo" },
      { name: "Runway", desc: "Профессиональный" },
      { name: "Seedance", desc: "От ByteDance", publicHref: "/tools/seedance" },
      { name: "Hailuo", desc: "Minimax", publicHref: "/tools/hailuo" },
      { name: "Wan", desc: "Alibaba" },
      { name: "Sora", desc: "От OpenAI", publicHref: "/tools/sora" },
      { name: "HeyGen", desc: "AI аватары", publicHref: "/tools/talking-avatar" },
      { name: "Hedra", desc: "Говорящие персонажи", publicHref: "/tools/talking-avatar" },
    ],
  },
  {
    key: "audio", label: "Аудио", route: "/audio", publicRoute: "/ai/audio",
    features: [
      { icon: Music, title: "Создать песню", desc: "Генерация музыки и вокала", publicHref: "/tools/create-song" },
      { icon: AudioLines, title: "Озвучка текста", desc: "Текст в речь", publicHref: "/tools/text-to-speech" },
      { icon: Mic, title: "Клон голоса", desc: "Копирование голоса", publicHref: "/tools/voice-cloning" },
      { icon: Volume2, title: "Смена голоса", desc: "Изменение тембра", publicHref: "/tools/voice-changer" },
      { icon: Activity, title: "Создание звуков", desc: "Генерация эффектов", publicHref: "/tools/sound-effects" },
      { icon: FileText, title: "Транскрибация", desc: "Речь в текст", publicHref: "/tools/transcribe" },
      { icon: VolumeX, title: "Удаление шума", desc: "Очистка и улучшение", publicHref: "/tools/audio-denoise" },
    ],
    models: [
      { name: "ElevenLabs", desc: "Озвучка и голос", publicHref: "/tools/elevenlabs" },
      { name: "Suno", desc: "Генерация музыки", badge: "TOP", publicHref: "/tools/suno" },
    ],
  },
  {
    key: "agents", label: "Агенты", route: "/agents", publicRoute: "/ai/agents",
    modelsTitle: "РАБОТАЮТ НА",
    features: [
      { icon: TrendingUp, title: "Маркетолог", desc: "Стратегия и продвижение", publicHref: "/tools/ai-marketer" },
      { icon: PenLine, title: "Копирайтер", desc: "Тексты и SEO", publicHref: "/tools/ai-copywriter" },
      { icon: Code, title: "Программист", desc: "Код и отладка", publicHref: "/tools/ai-code" },
      { icon: Languages, title: "Переводчик", desc: "50+ языков", publicHref: "/tools/translate" },
      { icon: FileSearch, title: "Юрист", desc: "Анализ документов", publicHref: "/tools/ai-lawyer" },
    ],
    models: [
      { name: "ChatGPT", desc: "Универсальный ИИ", publicHref: "/tools/chatgpt" },
      { name: "Claude", desc: "Глубокий анализ", publicHref: "/tools/claude" },
      { name: "Gemini", desc: "От Google", publicHref: "/tools/gemini" },
      { name: "DeepSeek", desc: "Reasoning модель", publicHref: "/tools/deepseek" },
    ],
  },
];

export function NavMegaMenu() {
  const [active, setActive] = useState<string | null>(null);
  const { isAuthed } = useAuth();
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const open = (key: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setActive(key);
  };
  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setActive(null), 200);
  };

  useEffect(() => () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }, []);

  const activeTab = TABS.find((t) => t.key === active && t.features);

  return (
    <div className="relative flex items-center gap-1" onMouseLeave={scheduleClose}>
      {TABS.map((tab) => {
        const isHot = active === tab.key && tab.features;
        const targetRoute = isAuthed ? tab.route : tab.publicRoute;
        const handleEnter = () => {
          if (tab.features) {
            if (closeTimer.current) clearTimeout(closeTimer.current);
            closeTimer.current = setTimeout(() => open(tab.key), active ? 80 : 0);
          } else {
            if (closeTimer.current) clearTimeout(closeTimer.current);
            setActive(null);
          }
        };
        return (
          <Link
            key={tab.key}
            to={targetRoute}
            onMouseEnter={handleEnter}
            onClick={() => setActive(null)}
            className="px-3 h-9 inline-flex items-center rounded-full text-sm font-medium transition-colors"
            style={{
              color: isHot ? "var(--c-fg)" : "var(--c-fg-dim)",
              background: isHot ? "var(--c-bg-2)" : "transparent",
            }}
          >
            {tab.label}
          </Link>
        );
      })}

      <AnimatePresence>
        {activeTab && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            onMouseEnter={() => open(activeTab.key)}
            onMouseLeave={scheduleClose}
            className="absolute left-0 top-full z-50 pt-1"
            style={{ width: "min(720px, 92vw)" }}
          >
            <div
              className="grid grid-cols-2 gap-6 p-5"
              style={{
                background: "var(--c-bg-1)",
                border: "1px solid var(--c-line)",
                borderRadius: 22,
                boxShadow: "0 30px 80px -30px rgba(0,0,0,0.6)",
              }}
            >
              {/* Features */}
              <div className="flex flex-col">
                <div className="font-mono text-[11px] uppercase tracking-[0.14em] mb-3" style={{ color: "var(--c-fg-mute)" }}>
                  Возможности
                </div>
                <div className="flex flex-col gap-0.5">
                  {activeTab.features!.map((f) => {
                    const href = isAuthed ? activeTab.route : (f.publicHref ?? activeTab.publicRoute);
                    return (
                    <Link
                      key={f.title}
                      to={href}
                      onClick={() => setActive(null)}
                      className="flex items-center gap-3 px-3 py-2 rounded-[8px] text-left transition-colors hover:bg-[var(--c-bg-2)]"
                    >
                      <span
                        className="inline-flex items-center justify-center shrink-0"
                        style={{ width: 36, height: 36, borderRadius: 10, background: "var(--c-bg-2)", color: "var(--c-fg-dim)" }}
                      >
                        <f.icon size={18} strokeWidth={1.75} />
                      </span>
                      <span className="flex flex-col min-w-0">
                        <span className="text-[14px] font-medium leading-tight truncate" style={{ color: "var(--c-fg)" }}>{f.title}</span>
                        <span className="text-[12px] truncate" style={{ color: "var(--c-fg-mute)" }}>{f.desc}</span>
                      </span>
                    </Link>
                    );
                  })}
                </div>
                <Link
                  to={activeTab.route}
                  onClick={() => setActive(null)}
                  className="mt-3 inline-flex items-center gap-1 text-[12px] font-medium px-3"
                  style={{ color: "var(--c-accent)" }}
                >
                  Все возможности <ArrowRight size={12} />
                </Link>
              </div>

              {/* Models */}
              <div className="flex flex-col">
                <div className="font-mono text-[11px] uppercase tracking-[0.14em] mb-3" style={{ color: "var(--c-fg-mute)" }}>
                  {activeTab.modelsTitle || "Модели"}
                </div>
                <div className="flex flex-col gap-0.5">
                  {activeTab.models!.filter((m) => {
                    if (!m.publicHref) return true;
                    const match = m.publicHref.match(/^\/tools\/(.+)$/);
                    if (!match) return true;
                    return isPublished(match[1]);
                  }).map((m) => {
                    const href = isAuthed ? activeTab.route : (m.publicHref ?? activeTab.publicRoute);
                    return (
                    <Link
                      key={m.name}
                      to={href}
                      onClick={() => setActive(null)}
                      className="flex items-center gap-3 px-3 py-2 rounded-[8px] text-left transition-colors hover:bg-[var(--c-bg-2)]"
                    >
                      <ModelGlyph name={m.name} size={32} />
                      <span className="flex flex-col min-w-0">
                        <span className="text-[14px] font-medium leading-tight truncate flex items-center" style={{ color: "var(--c-fg)" }}>
                          {m.name}
                          {m.badge && <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded-full ml-1" style={{ background: "rgba(232,84,32,0.12)", color: "hsl(var(--primary))" }}>{m.badge}</span>}
                        </span>
                        <span className="text-[12px] truncate" style={{ color: "var(--c-fg-mute)" }}>{m.desc}</span>
                      </span>
                    </Link>
                    );
                  })}
                </div>
                <Link
                  to={isAuthed ? "/toolkit" : "/studios"}
                  onClick={() => setActive(null)}
                  className="mt-3 inline-flex items-center gap-1 text-[12px] font-medium px-3"
                  style={{ color: "var(--c-accent)" }}
                >
                  Все ИИ-модели <ArrowRight size={12} />
                </Link>
                {(() => {
                  const labels: Record<string, string> = {
                    text: "Все текстовые нейросети →",
                    design: "Все нейросети для изображений →",
                    video: "Все видео нейросети →",
                    audio: "Все аудио нейросети →",
                    agents: "Все ИИ-агенты →",
                  };
                  const label = labels[activeTab.key];
                  if (!label) return null;
                  const href = isAuthed ? activeTab.route : activeTab.publicRoute;
                  return (
                    <Link to={href} onClick={() => setActive(null)} className="flex items-center gap-1.5 mt-3 pt-3 mx-3 text-[12px] font-medium transition-colors hover:opacity-80 border-t" style={{ borderColor: "hsl(var(--border))", color: "hsl(var(--primary))" }}>
                      {label}
                    </Link>
                  );
                })()}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
