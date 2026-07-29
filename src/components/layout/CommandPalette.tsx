import { useNavigate } from "@tanstack/react-router";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { StatusBadge } from "@/components/ui/era/StatusBadge";
import { ModelGlyph } from "@/components/ui/era/ModelGlyph";
import { useCommandPalette } from "@/hooks/useCommandPalette";
import { useAuth } from "@/contexts/AuthContext";
import { searchableModels, modelTypeToRoute, type SearchableModelType } from "@/config/searchableModels";

const TYPE_LABEL: Record<SearchableModelType, string> = {
  text: "Текст",
  image: "Изображения",
  video: "Видео",
  audio: "Аудио",
};

const PUBLIC_CATEGORY: Record<SearchableModelType, string> = {
  text: "/ai/text",
  image: "/ai/image",
  video: "/ai/video",
  audio: "/ai/audio",
};

// Map searchableModel id → existing /tools/<slug> landing (see src/data/toolPages.ts).
const MODEL_ID_TO_TOOL_SLUG: Record<string, string> = {
  chatgpt: "chatgpt",
  claude: "claude",
  gemini: "gemini",
  grok: "grok",
  deepseek: "deepseek",
  perplexity: "perplexity",
  "nb-2-1k": "nano-banana",
  seedream: "seedream",
  "gpt-image": "gpt-image",
  flux: "flux",
  "grok-imagine": "grok-imagine",
  "qwen-image": "qwen-image",
  "kling-3": "kling",
  "veo-fast-720p": "veo",
  "sora-2": "sora",
  "seedance-2": "seedance",
  hailuo: "hailuo",
  "wan-2-7": "wan-ai",
  suno: "suno",
  "eleven-labs": "elevenlabs",
};

export function CommandPalette() {
  const { open, setOpen } = useCommandPalette();
  const navigate = useNavigate();
  const { isAuthed } = useAuth();

  const handleSelect = (id: string, type: SearchableModelType) => {
    setOpen(false);
    if (isAuthed) {
      navigate({ to: modelTypeToRoute[type], search: { model: id } as never });
      return;
    }
    const slug = MODEL_ID_TO_TOOL_SLUG[id];
    if (slug) {
      navigate({ to: "/tools/$slug", params: { slug } });
    } else {
      navigate({ to: PUBLIC_CATEGORY[type] as never });
    }
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Найти модель или сервис..." />
      <CommandList className="max-h-[60vh]">
        <CommandEmpty>Ничего не найдено.</CommandEmpty>
        <CommandGroup heading="Модели">
          {searchableModels.map((m) => (
            <CommandItem
              key={m.id}
              value={`${m.name} ${m.provider} ${m.type}`}
              onSelect={() => handleSelect(m.id, m.type)}
              className="h-14 px-3 gap-3 cursor-pointer data-[selected=true]:bg-secondary"
            >
              <ModelGlyph name={m.name} size={32} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm text-foreground truncate">{m.name}</span>
                  {m.isNew && <StatusBadge variant="new" />}
                </div>
                <div className="text-xs text-muted-foreground truncate">
                  {m.provider} · {TYPE_LABEL[m.type]}
                </div>
              </div>
              <span className="font-mono tabular-nums text-xs text-muted-foreground bg-secondary rounded-full px-2 py-0.5 shrink-0">
                {m.credits} cr
              </span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
      <div className="border-t border-border px-3 py-2 flex items-center gap-3 text-[11px] text-muted-foreground font-mono">
        <span>↑↓ навигация</span>
        <span>↵ выбрать</span>
        <span>esc закрыть</span>
      </div>
    </CommandDialog>
  );
}
