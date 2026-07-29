import { ORIGIN } from "@/lib/origin";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  MessageSquare, Globe, Languages, FileText, Pencil, Sparkles,
  Image as ImageIcon, Camera, Palette, Scissors, UserRound, XCircle, ZoomIn,
  Video, Film, User, Music2, ArrowUpCircle,
  Music, Mic, Volume2, VolumeX, AudioLines,
  Search,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ModelGlyph } from "@/components/ui/era/ModelGlyph";
import { textProviders } from "@/data/textModels";
import { imageProviders } from "@/data/imageModels";
import { videoProviders } from "@/data/videoModels";
import { useAuth } from "@/contexts/AuthContext";
import { studiosPage } from "@/data/seo/pages/studios";
import { resolveRobots } from "@/data/seo/robots";
import type { SeoPage } from "@/data/seo/types";

const STUDIOS_TITLE = studiosPage.seo.title;
const STUDIOS_DESCRIPTION = studiosPage.seo.description;
const STUDIOS_CANONICAL = studiosPage.seo.canonical;
const STUDIOS_ROBOTS = resolveRobots(studiosPage as SeoPage);

export const Route = createFileRoute("/studios")({
  validateSearch: (search: Record<string, unknown>) => ({
    q: typeof search.q === "string" ? search.q : "",
  }),
  head: () => ({
    meta: [
      { title: STUDIOS_TITLE },
      { name: "description", content: STUDIOS_DESCRIPTION },
      { name: "robots", content: STUDIOS_ROBOTS },
      { property: "og:title", content: STUDIOS_TITLE },
      { property: "og:description", content: STUDIOS_DESCRIPTION },
      { property: "og:url", content: STUDIOS_CANONICAL },
      { property: "og:image", content: `${ORIGIN}/og-image.png` },
    ],
    links: [{ rel: "canonical", href: STUDIOS_CANONICAL }],
  }),
  component: ToolsAndModelsPage,
});

interface Tool { Icon: LucideIcon; title: string; category: string; slug: string }

// Every entry MUST map to an existing slug in src/data/toolPages.ts. Cards without
// a landing page are removed (guests must not land on /auth).
const tools: Tool[] = [
  // image
  { Icon: ImageIcon, title: "Создать изображение", category: "image", slug: "image-generation" },
  { Icon: XCircle,   title: "Удалить фон",          category: "image", slug: "remove-background" },
  { Icon: ZoomIn,    title: "Улучшить качество фото", category: "image", slug: "image-upscaler" },
  { Icon: Scissors,  title: "Удалить объект",       category: "image", slug: "object-remover" },
  { Icon: Sparkles,  title: "Убрать водяной знак",  category: "image", slug: "watermark-remover" },
  { Icon: Palette,   title: "Раскрасить ч/б фото",  category: "image", slug: "colorize-photo" },
  { Icon: Camera,    title: "Реставрация фото",     category: "image", slug: "photo-restoration" },

  // video
  { Icon: Video,     title: "Создать видео",        category: "video", slug: "video-generation" },
  { Icon: User,      title: "ИИ Аватар",            category: "video", slug: "talking-avatar" },
  { Icon: Film,      title: "Оживить фото",         category: "video", slug: "ozhivit-foto" },
  { Icon: ArrowUpCircle, title: "Видео для карточки Ozon", category: "video", slug: "ozon-product-video" },

  // audio
  { Icon: AudioLines, title: "Озвучка текста",       category: "audio", slug: "text-to-speech" },
  { Icon: Mic,        title: "Клон голоса",          category: "audio", slug: "voice-cloning" },
  { Icon: VolumeX,    title: "Транскрибация",        category: "audio", slug: "transcribe" },
];

const categoryLabels: Record<string, string> = {
  text: "ТЕКСТОВЫЕ ИНСТРУМЕНТЫ",
  image: "ИНСТРУМЕНТЫ ДЛЯ ИЗОБРАЖЕНИЙ",
  video: "ВИДЕО ИНСТРУМЕНТЫ",
  audio: "АУДИО ИНСТРУМЕНТЫ",
};

const modelCategoryLabels: Record<string, string> = {
  text: "ТЕКСТОВЫЕ МОДЕЛИ",
  image: "МОДЕЛИ ДЛЯ ИЗОБРАЖЕНИЙ",
  video: "ВИДЕО МОДЕЛИ",
  audio: "АУДИО МОДЕЛИ",
};

const categoryLinksAuthed: Record<string, string> = {
  text: "/text",
  image: "/design",
  video: "/video",
  audio: "/audio",
};
const categoryLinksGuest: Record<string, string> = {
  text: "/ai/text",
  image: "/ai/image",
  video: "/ai/video",
  audio: "/ai/audio",
};

// Provider id → { slug, category }: which /tools/<slug> lending page maps to
// which category. Guards against collisions (например, kling существует и в
// image, и в video, но /tools/kling — это видео-модель).
const PROVIDER_LANDINGS: Record<string, { slug: string; category: string }> = {
  chatgpt:      { slug: "chatgpt", category: "text" },
  claude:       { slug: "claude", category: "text" },
  gemini:       { slug: "gemini", category: "text" },
  grok:         { slug: "grok", category: "text" },
  deepseek:     { slug: "deepseek", category: "text" },
  perplexity:   { slug: "perplexity", category: "text" },
  "nano-banana": { slug: "nano-banana", category: "image" },
  seedream:     { slug: "seedream", category: "image" },
  "gpt-image":  { slug: "gpt-image", category: "image" },
  flux:         { slug: "flux", category: "image" },
  sora:         { slug: "sora", category: "video" },
  veo:          { slug: "veo", category: "video" },
  kling:        { slug: "kling", category: "video" },
  seedance:     { slug: "seedance", category: "video" },
  hailuo:       { slug: "hailuo", category: "video" },
  elevenlabs:   { slug: "elevenlabs", category: "audio" },
  suno:         { slug: "suno", category: "audio" },
};

const filters: { id: string; label: string; Icon?: LucideIcon }[] = [
  { id: "all", label: "Все" },
  { id: "text", label: "Текст", Icon: MessageSquare },
  { id: "image", label: "Изображения", Icon: ImageIcon },
  { id: "video", label: "Видео", Icon: Video },
  { id: "audio", label: "Аудио", Icon: Mic },
];

const audioModels = [
  { provider: "ElevenLabs", models: ["ElevenLabs TTS", "ElevenLabs SFX", "ElevenLabs Voice Changer", "ElevenLabs Music"] },
  { provider: "Suno", models: ["Suno v4", "Suno v3.5"] },
];

const allCategories = ["text", "image", "video", "audio"];

function FilterPills({ filter, setFilter }: { filter: string; setFilter: (f: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2 mb-8">
      {filters.map(f => (
        <button
          key={f.id}
          onClick={() => setFilter(f.id)}
          className={cn(
            "inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-medium transition-colors",
            filter === f.id ? "text-white" : "text-muted-foreground"
          )}
          style={filter === f.id
            ? { background: "hsl(var(--primary))", border: "1px solid transparent" }
            : { background: "hsl(var(--secondary))", border: "1px solid hsl(var(--border))" }
          }
        >
          {f.Icon && <f.Icon className="w-3.5 h-3.5" />}
          {f.label}
        </button>
      ))}
    </div>
  );
}

function ToolsAndModelsPage() {
  useEffect(() => { document.title = "ERA2 — Инструменты и Модели"; }, []);
  const [tab, setTab] = useState<"tools" | "models">("tools");
  const [filter, setFilter] = useState("all");
  const { isAuthed } = useAuth();
  const { q } = Route.useSearch();
  const navigate = useNavigate({ from: "/studios" });
  const query = q.trim().toLowerCase();
  const matches = (s: string) => !query || s.toLowerCase().includes(query);

  const catLink = (cat: string) => (isAuthed ? categoryLinksAuthed[cat] : categoryLinksGuest[cat]);
  const providerHref = (providerId: string, cat: string) => {
    if (isAuthed) return categoryLinksAuthed[cat];
    const landing = PROVIDER_LANDINGS[providerId];
    return landing && landing.category === cat ? `/tools/${landing.slug}` : categoryLinksGuest[cat];
  };

  const visibleCategories = filter === "all" ? allCategories : [filter];

  return (
    <div className="min-h-[calc(100vh-var(--header-height,64px))] px-4 lg:px-8 py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-6 text-center" style={{ color: "var(--text-primary)" }}>
          Инструменты и Модели
        </h1>

        <div className="max-w-xl mx-auto mb-6 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="search"
            value={q}
            onChange={(e) =>
              navigate({ search: (prev: { q: string }) => ({ ...prev, q: e.target.value }), replace: true })
            }
            placeholder="Поиск: midjourney, sora, аватар…"
            className="w-full rounded-xl pl-9 pr-3 py-2.5 text-sm outline-none focus:border-[hsl(var(--primary))]"
            style={{ background: "var(--bg-card)", border: "1px solid var(--border-primary)", color: "var(--text-primary)" }}
          />
        </div>

        <div className="flex justify-center gap-2 mb-6">
          {(["tools", "models"] as const).map(t => (
            <button
              key={t}
              onClick={() => { setTab(t); setFilter("all"); }}
              className={cn("px-5 py-2.5 rounded-[14px] text-sm font-medium",
                tab === t ? "text-white" : "text-muted-foreground"
              )}
              style={tab === t
                ? { background: "linear-gradient(135deg, hsl(var(--primary)), #ff7a3d)", border: "1px solid transparent" }
                : { background: "hsl(var(--secondary))", border: "1px solid hsl(var(--border))" }
              }
            >
              {t === "tools" ? "Инструменты" : "Модели"}
            </button>
          ))}
        </div>

        <FilterPills filter={filter} setFilter={setFilter} />

        {tab === "tools" && visibleCategories.map(cat => {
          const catTools = tools.filter(t => t.category === cat && matches(t.title));
          if (!catTools.length) return null;
          return (
            <div key={cat} className="mb-10">
              <h2 className="text-xs font-semibold tracking-wider mb-4" style={{ color: "var(--text-tertiary)" }}>
                {categoryLabels[cat]}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {catTools.map(t => (
                  <Link
                    key={`${cat}-${t.title}`}
                    to={isAuthed ? (categoryLinksAuthed[cat] as any) : (`/tools/${t.slug}` as any)}
                    className="rounded-2xl p-4 flex flex-col items-start gap-3 transition-colors hover:brightness-110"
                    style={{ background: "var(--bg-card)", border: "1px solid var(--border-primary)" }}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: "rgba(232, 84, 32, 0.12)", border: "1px solid rgba(232, 84, 32, 0.18)" }}
                    >
                      <t.Icon className="w-5 h-5" style={{ color: "hsl(var(--primary))" }} />
                    </div>
                    <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                      {t.title}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}

        {tab === "models" && (
          <>
            {visibleCategories.includes("text") && (
              <div className="mb-10">
                <h2 className="text-xs font-semibold tracking-wider mb-4" style={{ color: "var(--text-tertiary)" }}>
                  {modelCategoryLabels.text}
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {textProviders.flatMap(p =>
                    p.subModels.filter(s => matches(s.name) || matches(p.name)).map(s => (
                      <Link
                        key={`text-${p.id}-${s.id}`}
                        to={providerHref(p.id, "text") as any}
                        className="rounded-2xl p-4 flex items-center gap-3 transition-colors hover:brightness-110"
                        style={{ background: "var(--bg-card)", border: "1px solid var(--border-primary)" }}
                      >
                        <ModelGlyph name={p.name} size={32} />
                        <span className="text-sm font-medium truncate" style={{ color: "var(--text-primary)" }}>
                          {s.name}
                        </span>
                      </Link>
                    ))
                  )}
                </div>
              </div>
            )}

            {visibleCategories.includes("image") && (
              <div className="mb-10">
                <h2 className="text-xs font-semibold tracking-wider mb-4" style={{ color: "var(--text-tertiary)" }}>
                  {modelCategoryLabels.image}
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {imageProviders.flatMap(p =>
                    p.subModels.filter(s => matches(s.name) || matches(p.name)).map(s => (
                      <Link
                        key={`img-${p.id}-${s.id}`}
                        to={providerHref(p.id, "image") as any}
                        className="rounded-2xl p-4 flex items-center gap-3 transition-colors hover:brightness-110"
                        style={{ background: "var(--bg-card)", border: "1px solid var(--border-primary)" }}
                      >
                        <ModelGlyph name={p.name} size={32} />
                        <span className="text-sm font-medium truncate" style={{ color: "var(--text-primary)" }}>
                          {s.name}
                        </span>
                      </Link>
                    ))
                  )}
                </div>
              </div>
            )}

            {visibleCategories.includes("video") && (
              <div className="mb-10">
                <h2 className="text-xs font-semibold tracking-wider mb-4" style={{ color: "var(--text-tertiary)" }}>
                  {modelCategoryLabels.video}
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {videoProviders.flatMap(p =>
                    p.subModels.filter(s => matches(s.name) || matches(p.name)).map(s => (
                      <Link
                        key={`vid-${p.id}-${s.id}`}
                        to={providerHref(p.id, "video") as any}
                        className="rounded-2xl p-4 flex items-center gap-3 transition-colors hover:brightness-110"
                        style={{ background: "var(--bg-card)", border: "1px solid var(--border-primary)" }}
                      >
                        <ModelGlyph name={p.name} size={32} />
                        <span className="text-sm font-medium truncate" style={{ color: "var(--text-primary)" }}>
                          {s.name}
                        </span>
                      </Link>
                    ))
                  )}
                </div>
              </div>
            )}

            {visibleCategories.includes("audio") && (
              <div className="mb-10">
                <h2 className="text-xs font-semibold tracking-wider mb-4" style={{ color: "var(--text-tertiary)" }}>
                  {modelCategoryLabels.audio}
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {audioModels.flatMap(p =>
                    p.models.filter(m => matches(m) || matches(p.provider)).map(m => (
                      <Link
                        key={`audio-${p.provider}-${m}`}
                        to={providerHref(p.provider.toLowerCase(), "audio") as any}
                        className="rounded-2xl p-4 flex items-center gap-3 transition-colors hover:brightness-110"
                        style={{ background: "var(--bg-card)", border: "1px solid var(--border-primary)" }}
                      >
                        <ModelGlyph name={p.provider} size={32} />
                        <span className="text-sm font-medium truncate" style={{ color: "var(--text-primary)" }}>
                          {m}
                        </span>
                      </Link>
                    ))
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
