import { useState, useRef, useEffect } from "react";
import { Search, Check, ChevronRight } from "lucide-react";
import { textProviders, type TextProvider, type TextSubModel } from "@/data/textModels";
import { ModelIcon } from "@/components/text/ModelIcon";
import { cn } from "@/lib/utils";

interface Props {
  open: boolean;
  onClose: () => void;
  selectedProviderId: string;
  selectedSubModelId: string;
  onSelect: (providerId: string, subModelId: string) => void;
}

const badgeStyles: Record<string, string> = {
  "TOP": "bg-amber-500/15 text-amber-400",
  "NEW": "bg-emerald-500/15 text-emerald-400",
  "PRO": "bg-primary/15 text-primary",
  "MAX": "bg-primary/15 text-primary",
  "∞ FAST": "bg-sky-500/15 text-sky-400",
  "FAST": "bg-sky-500/15 text-sky-400",
  "WEB": "bg-blue-500/15 text-blue-400",
  "THINK": "bg-primary/15 text-primary",
};

const providerDescriptions: Record<string, string> = {
  chatgpt: "Модели OpenAI",
  claude: "Модели Anthropic",
  gemini: "Модели Google",
  grok: "Модели xAI",
  deepseek: "Модели DeepSeek",
  perplexity: "Поиск + ИИ",
  qwen: "Alibaba Cloud",
};

function getMinCredits(provider: TextProvider): number {
  return Math.min(...provider.subModels.map((s) => s.credits));
}

export function TextModelSelector({ open, onClose, selectedProviderId, selectedSubModelId, onSelect }: Props) {
  const [search, setSearch] = useState("");
  const [hoveredProvider, setHoveredProvider] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) { setSearch(""); setHoveredProvider(null); }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  const q = search.toLowerCase();
  const isSearching = q.length > 0;

  const filteredProviders = textProviders
    .map((p) => ({
      ...p,
      subModels: p.subModels.filter(
        (s) => !q || s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q) || p.name.toLowerCase().includes(q)
      ),
    }))
    .filter((p) => p.subModels.length > 0);

  const activeHover = hoveredProvider || selectedProviderId;
  const hoverProviderData = textProviders.find((p) => p.id === activeHover);

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div ref={ref} className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50 flex gap-1">
        {/* Main dropdown */}
        <div className="w-[340px] max-h-[480px] rounded-xl border shadow-2xl overflow-hidden flex flex-col" style={{ background: "var(--bg-popup)", borderColor: "rgba(232, 84, 32,0.3)" }}>
          <div className="flex items-center gap-2 px-3 py-2.5 border-b" style={{ borderColor: "var(--border-primary)" }}>
            <Search className="w-4 h-4 shrink-0 text-muted-foreground" />
            <input
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Поиск нейросетей..."
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground text-foreground"
            />
          </div>

          <div className="flex-1 overflow-y-auto">
            {isSearching ? (
              <>
                {filteredProviders.map((provider) =>
                  provider.subModels.map((sub) => {
                    const isSelected = selectedProviderId === provider.id && selectedSubModelId === sub.id;
                    return (
                      <button
                        key={sub.id}
                        onClick={() => { onSelect(provider.id, sub.id); onClose(); }}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors",
                          isSelected ? "bg-[rgba(232, 84, 32,0.1)]" : "hover:bg-[rgba(232, 84, 32,0.08)]"
                        )}
                      >
                        <ModelIcon providerId={provider.id} size={20} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-medium text-foreground">{sub.name}</span>
                            {sub.badge && (
                              <span className={cn("text-[9px] font-bold px-1.5 py-0.5 rounded-full", badgeStyles[sub.badge] || "bg-muted text-muted-foreground")}>
                                {sub.badge}
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] mt-0.5 truncate text-muted-foreground">{sub.description}</div>
                        </div>
                        <span className="font-mono text-xs shrink-0" style={{ color: "hsl(var(--primary))" }}>{sub.credits} cr</span>
                        {isSelected && <Check className="w-3.5 h-3.5 shrink-0" style={{ color: "#ff7a3d" }} />}
                      </button>
                    );
                  })
                )}
                {filteredProviders.length === 0 && (
                  <div className="px-4 py-8 text-center text-sm text-muted-foreground">Модель не найдена</div>
                )}
              </>
            ) : (
              textProviders.map((provider) => (
                <button
                  key={provider.id}
                  onMouseEnter={() => setHoveredProvider(provider.id)}
                  onClick={() => {
                    const defaultSub = provider.subModels.find((s) => s.badge?.includes("TOP")) || provider.subModels[0];
                    onSelect(provider.id, defaultSub.id);
                    onClose();
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-3 text-left transition-colors",
                    activeHover === provider.id ? "bg-[rgba(232, 84, 32,0.1)]" : "hover:bg-[rgba(232, 84, 32,0.08)]",
                  )}
                >
                  <ModelIcon providerId={provider.id} size={24} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-foreground">{provider.name}</div>
                    <div className="text-[11px] text-muted-foreground">{providerDescriptions[provider.id] || ""}</div>
                  </div>
                  <span className="font-mono text-xs shrink-0 text-muted-foreground">{getMinCredits(provider)} cr</span>
                  <ChevronRight className="w-3.5 h-3.5 shrink-0 text-muted-foreground" />
                </button>
              ))
            )}
          </div>
        </div>

        {/* Sub-model flyout */}
        {!isSearching && hoverProviderData && (
          <div className="w-[300px] max-h-[480px] rounded-xl border shadow-2xl overflow-y-auto" style={{ background: "var(--bg-popup)", borderColor: "rgba(232, 84, 32,0.3)" }}>
            <div className="px-3 py-2 border-b flex items-center gap-2" style={{ borderColor: "var(--border-primary)" }}>
              <ModelIcon providerId={hoverProviderData.id} size={16} />
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{hoverProviderData.name}</span>
            </div>
            {hoverProviderData.subModels.map((sub) => {
              const isSelected = selectedProviderId === hoverProviderData.id && selectedSubModelId === sub.id;
              return (
                <button
                  key={sub.id}
                  onClick={() => { onSelect(hoverProviderData.id, sub.id); onClose(); }}
                  className={cn(
                    "w-full flex items-center gap-2.5 px-3 py-2.5 text-left transition-colors",
                    isSelected ? "bg-[rgba(232, 84, 32,0.12)]" : "hover:bg-[rgba(232, 84, 32,0.08)]"
                  )}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className={cn("text-sm", isSelected ? "font-semibold text-foreground" : "font-medium text-muted-foreground")}>{sub.name}</span>
                      {sub.badge && (
                        <span className={cn("text-[9px] font-bold px-1.5 py-0.5 rounded-full", badgeStyles[sub.badge] || "bg-muted text-muted-foreground")}>
                          {sub.badge}
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] mt-0.5 truncate text-muted-foreground">{sub.description}</div>
                  </div>
                  <span className="font-mono text-xs shrink-0" style={{ color: "hsl(var(--primary))" }}>{sub.credits} cr</span>
                  {isSelected && <Check className="w-3.5 h-3.5 shrink-0" style={{ color: "#ff7a3d" }} />}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
