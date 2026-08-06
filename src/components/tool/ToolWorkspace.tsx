import { useRef, useState, useEffect, useLayoutEffect } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  Upload,
  Play,
  Loader2,
  ChevronDown,
  Check,
  Play as PlayIcon,
  Plus,
  X,
  RectangleHorizontal,
  Clock,
  Monitor,
  SlidersHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ToolPageData } from "@/data/toolPages";
import { useAuth } from "@/contexts/AuthContext";
import { buildAuthHref } from "@/lib/authRedirect";

type Status = "idle" | "loading" | "done";

type ToolPricing = NonNullable<NonNullable<ToolPageData["tool"]>["pricing"]>;
type ToolSelects = NonNullable<NonNullable<ToolPageData["tool"]>["selects"]>;

function computePricingLabel(
  pricing: ToolPricing,
  selects: ToolSelects,
  selectIdx: number[],
  chars: number
): string {
  const chosen = selects.map(
    (s, i) => s.options[selectIdx[i] ?? s.defaultIndex ?? 0]
  );
  const matched = pricing.rates.find(
    (r) => r.matchOption && chosen.includes(r.matchOption)
  );
  const rate = (matched ?? pricing.rates[0]).rate;

  if (pricing.mode === "per-second") {
    const dIdx = selects.findIndex((s) => /длит/i.test(s.label));
    let seconds = 1;
    if (dIdx >= 0) {
      const opt = selects[dIdx].options[selectIdx[dIdx] ?? selects[dIdx].defaultIndex ?? 0];
      const m = opt.match(/\d+/);
      if (m) seconds = parseInt(m[0], 10);
    }
    const total = rate * seconds;
    return `${rate} кр/сек · ролик ${seconds} с ≈ ${total} кр`;
  }
  if (pricing.mode === "per-message") return `${rate} кр за сообщение`;
  if (pricing.mode === "per-clip") return `${rate} кр ${pricing.unitLabel || "за ролик"}`.trim();
  if (pricing.mode === "per-1k-chars") {
    const min = pricing.minCredits ?? 0;
    const total = Math.max(min, Math.ceil((chars * rate) / 1000 / 5) * 5);
    if (min && chars > 0) {
      return `≈ ${total} кр за этот текст (минимум ${min})`;
    }
    return `${rate} кр ${pricing.unitLabel || "за 1000 знаков"}${min ? ` · минимум ${min}` : ""}`;
  }
  return "";
}

// Splits pricing into a small rate string (left of CTA) and a total credits label
// that goes inside the "Генерировать · N кр" button. Reads the same inputs as
// computePricingLabel — does not alter its output.
export function computePricingParts(
  pricing: ToolPricing,
  selects: ToolSelects,
  selectIdx: number[],
  chars: number
): { rate: string; total: string } {
  const chosen = selects.map(
    (s, i) => s.options[selectIdx[i] ?? s.defaultIndex ?? 0]
  );
  const matched = pricing.rates.find(
    (r) => r.matchOption && chosen.includes(r.matchOption)
  );
  const rate = (matched ?? pricing.rates[0]).rate;

  if (pricing.mode === "per-second") {
    const dIdx = selects.findIndex((s) => /длит/i.test(s.label));
    let seconds = 1;
    if (dIdx >= 0) {
      const opt = selects[dIdx].options[selectIdx[dIdx] ?? selects[dIdx].defaultIndex ?? 0];
      const m = opt.match(/\d+/);
      if (m) seconds = parseInt(m[0], 10);
    }
    return { rate: `${rate} кр/сек`, total: `${rate * seconds} кр` };
  }
  if (pricing.mode === "per-message") {
    return { rate: `${rate} кр/сообщение`, total: `${rate} кр` };
  }
  if (pricing.mode === "per-clip") {
    const unit = pricing.unitLabel || "за ролик";
    return { rate: `${rate} кр ${unit}`.trim(), total: `${rate} кр` };
  }
  if (pricing.mode === "per-1k-chars") {
    const min = pricing.minCredits ?? 0;
    const total = Math.max(min, Math.ceil((chars * rate) / 1000 / 5) * 5);
    const rateLabel = `${rate} кр/1000 знаков${min ? ` · мин ${min}` : ""}`;
    return { rate: rateLabel, total: `${total} кр` };
  }
  return { rate: "", total: "" };
}

// Slugs whose bar shows a "+" image-upload slot to the left of the textarea.
const IMAGE_UPLOAD_SLUGS = new Set([
  "kling",
  "video-generation",
  "ozhivit-foto",
  "seedance",
  "sora",
  "veo",
  "hailuo",
  "ozon-product-video",
]);

function iconForLabel(label: string) {
  const l = label.toLowerCase();
  if (/формат|aspect|соотношени/.test(l)) return RectangleHorizontal;
  if (/длител|duration|секунд|время/.test(l)) return Clock;
  if (/разреш|resolution|качеств|quality/.test(l)) return Monitor;
  return SlidersHorizontal;
}

const FLAGSHIP_RE = /pro|max|ultra|flagship|premium|3\.0|v3\b|1\.6/i;

function ChipSelect({
  label,
  options,
  value,
  onChange,
  variant = "pill",
  icon: IconOverride,
  flagshipMark = false,
  onVideo = false,
}: {
  label: string;
  options: string[];
  value: number;
  onChange: (i: number) => void;
  variant?: "pill" | "inline";
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  flagshipMark?: boolean;
  onVideo?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [dropUp, setDropUp] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!open || !btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    setDropUp(spaceBelow < 220 && rect.top > 220);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (
        !btnRef.current?.contains(e.target as Node) &&
        !menuRef.current?.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const current = options[value] ?? options[0];
  const Icon = IconOverride ?? iconForLabel(label);
  const showFlame = flagshipMark && FLAGSHIP_RE.test(current);

  return (
    <div className="relative">
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        title={label}
        className={cn(
          "flex items-center gap-1.5 text-xs font-medium transition-colors",
          variant === "pill"
            ? "h-8 px-3 rounded-full border border-border bg-muted/60 text-foreground hover:bg-muted"
            : onVideo
              ? "bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-lg text-white/90 hover:bg-black/55"
              : "h-8 px-2 rounded-md text-foreground/85 hover:bg-muted/60"
        )}
      >
        <Icon size={14} className={cn("shrink-0", variant === "inline" && onVideo ? "text-white/70" : "opacity-70")} />
        {showFlame && <span aria-hidden>🔥</span>}
        <span className="truncate max-w-[140px]">{current}</span>
        <ChevronDown size={12} className={cn(variant === "inline" && onVideo ? "text-white/60" : "opacity-60")} />
      </button>
      {open && (
        <div
          ref={menuRef}
          className={cn(
            "absolute z-30 min-w-[180px] rounded-xl border border-border bg-popover text-popover-foreground shadow-xl py-1",
            dropUp ? "bottom-full mb-1" : "top-full mt-1"
          )}
        >
          <div className="px-3 py-1.5 text-[10px] uppercase tracking-wide text-muted-foreground">
            {label}
          </div>
          {options.map((opt, i) => (
            <button
              key={opt}
              type="button"
              onClick={() => {
                onChange(i);
                setOpen(false);
              }}
              className={cn(
                "w-full flex items-center justify-between gap-3 px-3 py-2 text-xs text-left transition-colors",
                i === value
                  ? "text-foreground"
                  : "text-foreground/75 hover:text-foreground hover:bg-muted/60"
              )}
            >
              <span>{opt}</span>
              {i === value && <Check size={12} className="text-primary" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function ToolWorkspace({ data, onVideo = false }: { data: ToolPageData; onVideo?: boolean }) {
  const tool = data.tool!;
  if (tool.layout === "row") {
    return <RowWorkspace data={data} onVideo={onVideo} />;
  }
  const demoImage = tool.demoImage ?? "/examples/ozhivit-preview.jpg";
  const demoCaption = tool.demoCaption ?? "Пример результата";
  const isVideo = data.category === "video";
  const { isAuthed } = useAuth();
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [motion, setMotion] = useState(50);
  const [duration, setDuration] = useState<5 | 10>(5);
  const [status, setStatus] = useState<Status>("idle");
  const [selectedType, setSelectedType] = useState(0);
  const [selectIdx, setSelectIdx] = useState<number[]>(
    () => tool.selects?.map((s) => s.defaultIndex ?? 0) ?? []
  );
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const has = tool.bricks.includes.bind(tool.bricks);

  const onFile = (f: File | null) => {
    if (!f) return;
    if (preview) URL.revokeObjectURL(preview);
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setStatus("idle");
  };

  const onGenerate = () => {
    if (!isAuthed) {
      const next = typeof window !== "undefined" ? window.location.pathname + window.location.search : undefined;
      navigate({ to: buildAuthHref(next) });
      return;
    }
    if (!file) return;
    setStatus("loading");
    setTimeout(() => setStatus("done"), 1800);
  };

  return (
    <section className="border-y border-border" style={{ background: "hsl(var(--card))" }}>
      <div className="max-w-6xl mx-auto px-4 pt-8 pb-4 text-center">
        <h1 className="text-[28px] md:text-[40px] font-bold leading-[1.1] tracking-tight">{data.heroTitle}</h1>
        <p className="text-sm text-muted-foreground mt-1.5 max-w-[560px] mx-auto">{data.heroDescription}</p>
      </div>
      <div className="max-w-6xl mx-auto px-4 pb-8 grid gap-5 md:grid-cols-[440px_1fr]">
        {/* LEFT PANEL */}
        <div className="rounded-2xl border border-border bg-background/60 p-3 flex flex-col gap-2.5">
          <div className="flex items-center gap-2">
            <Link to={isAuthed ? "/toolkit" : "/studios"} className="p-1.5 rounded-md hover:bg-muted transition-colors">
              <ArrowLeft size={16} />
            </Link>
            <span className="font-semibold text-sm">{data.heroTitle}</span>
          </div>

          {has("type-preset") && tool.types && (
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Тип</label>
              <div className="grid grid-cols-3 gap-2">
                {tool.types.map((t, i) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setSelectedType(i)}
                    className={cn(
                      "relative h-[72px] rounded-lg overflow-hidden border-2 transition-colors",
                      i === selectedType ? "border-primary" : "border-transparent"
                    )}
                  >
                    <img src={t.image} alt={t.label} className="absolute inset-0 w-full h-full object-cover" />
                    <span className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent text-white text-[10px] font-medium px-1.5 py-1 text-center leading-tight">
                      {t.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {has("upload-1") && (
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">{tool.uploadLabel ?? "Изображение"}</label>
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  onFile(e.dataTransfer.files?.[0] ?? null);
                }}
                className="w-full h-[120px] rounded-xl border-2 border-dashed border-border hover:border-primary/50 transition-colors flex flex-col items-center justify-center gap-1.5 text-center px-3 overflow-hidden relative"
              >
                {preview && (tool.uploadAccept ?? "image/").startsWith("image/") ? (
                  <img src={preview} alt="preview" className="absolute inset-0 w-full h-full object-cover" />
                ) : file ? (
                  <>
                    <Upload size={20} className="text-muted-foreground" />
                    <span className="text-sm truncate max-w-full px-2">{file.name}</span>
                    <span className="text-[11px] text-muted-foreground">{tool.uploadHint ?? "JPEG, PNG, WEBP"}</span>
                  </>
                ) : (
                  <>
                    <Upload size={20} className="text-muted-foreground" />
                    <span className="text-sm">Загрузите файл или перетащите сюда</span>
                    <span className="text-[11px] text-muted-foreground">{tool.uploadHint ?? "JPEG, PNG, WEBP"}</span>
                  </>
                )}
              </button>
              <input
                ref={inputRef}
                type="file"
                accept={tool.uploadAccept ?? "image/jpeg,image/png,image/webp"}
                className="hidden"
                onChange={(e) => onFile(e.target.files?.[0] ?? null)}
              />
              {tool.uploadHints && tool.uploadHints.length > 0 && (
                <ul className="mt-2 space-y-1.5">
                  {tool.uploadHints.map((h) => (
                    <li key={h} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                      <Check size={14} className="text-primary mt-0.5 shrink-0" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {has("model") && (
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Модель</label>
              <button
                type="button"
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg border border-border bg-muted/40 text-sm"
              >
                <span className="font-medium">{tool.modelName}</span>
                <ChevronDown size={14} className="text-muted-foreground" />
              </button>
            </div>
          )}

          {has("slider-motion") && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs text-muted-foreground">Движение</label>
                <span className="text-xs font-medium">{motion}</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={motion}
                onChange={(e) => setMotion(Number(e.target.value))}
                className="w-full accent-[hsl(var(--primary))]"
              />
            </div>
          )}

          {has("duration") && (
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Длительность</label>
              <div className="grid grid-cols-2 gap-2">
                {([5, 10] as const).map((d) => (
                  <button
                    key={d}
                    onClick={() => setDuration(d)}
                    className={cn(
                      "px-3 py-2 rounded-lg text-sm font-medium border transition-colors",
                      duration === d
                        ? "border-primary bg-primary/10 text-foreground"
                        : "border-border text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {d}с
                  </button>
                ))}
              </div>
            </div>
          )}

          {has("select") && tool.selects && tool.selects.length > 0 && (
            <div className="flex flex-wrap items-center gap-x-1 gap-y-2">
              {tool.selects.map((sel, si) => (
                <div key={si} className="flex items-center">
                  {si > 0 && <span className="h-4 w-px bg-border/80 mx-1" aria-hidden />}
                  <ChipSelect
                    variant="inline"
                    label={sel.label}
                    options={sel.options}
                    value={selectIdx[si] ?? sel.defaultIndex ?? 0}
                    onChange={(oi) =>
                      setSelectIdx((prev) => {
                        const next = [...prev];
                        next[si] = oi;
                        return next;
                      })
                    }
                  />
                </div>
              ))}
            </div>
          )}

          {has("generate") && (
            <div className="pt-1 border-t border-border">
              {tool.planNote && (
                <p className="text-[11px] mb-2" style={{ color: "hsl(var(--primary))" }}>{tool.planNote}</p>
              )}
              {(() => {
                const totalLabel = tool.pricing
                  ? computePricingParts(tool.pricing, tool.selects ?? [], selectIdx, 0).total
                  : tool.types
                  ? `${tool.types[selectedType].credits} кр`
                  : typeof tool.credits === "number"
                  ? `${tool.credits} кр`
                  : "";
                return (
                  <div className="flex justify-end">
                    <button
                      type="button"
                      disabled={isAuthed && (!file || status === "loading")}
                      onClick={onGenerate}
                      className="h-10 px-5 rounded-full font-semibold text-white transition-opacity disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 flex items-center justify-center gap-2"
                      style={{ background: "hsl(var(--primary))" }}
                    >
                      {status === "loading" ? (
                        <>
                          <Loader2 size={16} className="animate-spin" /> Генерация...
                        </>
                      ) : (
                        <>Создать{totalLabel ? ` · ${totalLabel}` : ""}</>
                      )}
                    </button>
                  </div>
                );
              })()}
            </div>
          )}
        </div>

        {/* RIGHT PREVIEW */}
        <div className="flex flex-col gap-3 h-full">
          <div className="flex-1 min-h-0 relative overflow-hidden rounded-2xl border border-border bg-background/60">
            {status === "loading" && (
              <div className="absolute inset-0 animate-pulse bg-muted/40 flex items-center justify-center z-20">
                <Loader2 size={32} className="animate-spin text-primary" />
              </div>
            )}

            <img
              src={preview || demoImage}
              alt="result"
              className="absolute inset-0 w-full h-full object-cover"
            />

            {status === "done" && isVideo && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 z-10">
                <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
                  <Play size={26} className="ml-1 text-black" fill="black" />
                </div>
              </div>
            )}

            {status === "idle" && !preview && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/25 z-10">
                {isVideo && (
                  <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                    <Play size={22} className="ml-0.5 text-black" fill="black" />
                  </div>
                )}
                <span className="text-xs text-white/90 font-medium">{isVideo ? "Пример результата" : demoCaption}</span>
                {isVideo && <span className="text-[10px] text-white/70">фото → видео</span>}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ToolWorkspace;

function RowWorkspace({ data, onVideo = false }: { data: ToolPageData; onVideo?: boolean }) {
  const tool = data.tool!;
  const voices = tool.voices ?? [];
  const maxChars = tool.maxChars ?? 2000;
  const { isAuthed } = useAuth();
  const navigate = useNavigate();
  const [voice, setVoice] = useState(voices[0] ?? "");
  const [text, setText] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [sampleFile, setSampleFile] = useState<File | null>(null);
  const sampleRef = useRef<HTMLInputElement>(null);
  const selects = tool.selects ?? [];
  const [selectIdx, setSelectIdx] = useState<number[]>(
    () => selects.map((s) => s.defaultIndex ?? 0)
  );
  const resultType = tool.resultType ?? "audio";
  const supportsImage = IMAGE_UPLOAD_SLUGS.has(data.slug);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const imageRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const onImage = (f: File | null) => {
    if (!f) return;
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImage(f);
    setImagePreview(URL.createObjectURL(f));
  };
  const clearImage = () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImage(null);
    setImagePreview(null);
    if (imageRef.current) imageRef.current.value = "";
  };

  const onGenerate = () => {
    if (!isAuthed) {
      const next = typeof window !== "undefined" ? window.location.pathname + window.location.search : undefined;
      navigate({ to: buildAuthHref(next) });
      return;
    }
    if (!text.trim()) return;
    setStatus("loading");
    setTimeout(() => setStatus("done"), 1800);
  };

  const value = text.slice(0, maxChars);
  const pricingParts = tool.pricing
    ? computePricingParts(tool.pricing, selects, selectIdx, value.length)
    : null;
  const totalLabel = pricingParts ? pricingParts.total : `${tool.credits} кр`;

  return (
    <section
      className={onVideo ? "" : "border-y border-border"}
      style={onVideo ? undefined : { background: "hsl(var(--card))" }}
    >
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className={cn("text-[28px] md:text-[44px] font-bold leading-[1.1] tracking-tight text-center mb-3", onVideo && "text-white")}>{data.heroTitle}</h1>
        <p className={cn("text-center max-w-[640px] mx-auto mb-8", onVideo ? "text-white/80" : "text-muted-foreground")}>{data.heroDescription}</p>
        <div
          className={cn(
            "rounded-3xl border p-5 md:p-6 flex flex-col gap-4 shadow-lg shadow-black/5",
            onVideo
              ? "ws-on-video bg-black/35 backdrop-blur-md border-white/15 text-white"
              : "border-border bg-card text-card-foreground",
          )}
        >
          {tool.sampleUpload && (
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">{tool.sampleUpload.label}</label>
              <button
                type="button"
                onClick={() => sampleRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const f = e.dataTransfer.files?.[0] ?? null;
                  if (f) setSampleFile(f);
                }}
                className="w-full h-[88px] rounded-2xl border-2 border-dashed border-border hover:border-primary/50 transition-colors flex flex-col items-center justify-center gap-1 text-center px-3"
              >
                <Upload size={18} className="text-muted-foreground" />
                <span className="text-sm truncate max-w-full">{sampleFile ? sampleFile.name : "Загрузите файл или перетащите сюда"}</span>
                <span className="text-[11px] text-muted-foreground">{tool.sampleUpload.hint}</span>
              </button>
              <input
                ref={sampleRef}
                type="file"
                accept={tool.sampleUpload.accept ?? "audio/*"}
                className="hidden"
                onChange={(e) => setSampleFile(e.target.files?.[0] ?? null)}
              />
            </div>
          )}

          <div className="flex gap-3 items-start">
            {supportsImage && (
              <div className="shrink-0">
                <button
                  type="button"
                  onClick={() => imageRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    onImage(e.dataTransfer.files?.[0] ?? null);
                  }}
                  title="Загрузить изображение"
                  className="relative w-11 h-11 rounded-xl border border-dashed border-border hover:border-primary/60 hover:bg-muted/40 transition-colors flex items-center justify-center overflow-hidden group"
                >
                  {imagePreview ? (
                    <>
                      <img src={imagePreview} alt="preview" className="absolute inset-0 w-full h-full object-cover" />
                      <span
                        role="button"
                        aria-label="Удалить изображение"
                        onClick={(e) => {
                          e.stopPropagation();
                          clearImage();
                        }}
                        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={12} className="text-primary-foreground" />
                      </span>
                    </>
                  ) : (
                    <Plus size={18} className="text-muted-foreground" />
                  )}
                </button>
                <input
                  ref={imageRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) => onImage(e.target.files?.[0] ?? null)}
                />
              </div>
            )}

            <div className="relative flex-1 min-w-0">
              <textarea
                rows={supportsImage ? 3 : 4}
                value={value}
                onChange={(e) => setText(e.target.value.slice(0, maxChars))}
                placeholder={tool.textPlaceholder}
                className={cn(
                  "w-full h-full min-h-[72px] resize-none bg-transparent px-1 py-1 text-sm outline-none border-0",
                  onVideo ? "text-white placeholder:text-white/50" : "text-foreground placeholder:text-muted-foreground",
                )}
              />
              <div className="absolute bottom-1 right-1 text-[11px] text-muted-foreground">
                {value.length} / {maxChars}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 flex-wrap border-t border-border/70 pt-3">
            <div className="flex flex-wrap items-center gap-x-1 gap-y-2 min-w-0">
              {(() => {
                const inlineItems: React.ReactNode[] = [];
                if (voices.length > 0) {
                  inlineItems.push(
                    <ChipSelect
                      key="voice"
                      label="Голос"
                      options={voices}
                      value={Math.max(0, voices.indexOf(voice))}
                      onChange={(i) => setVoice(voices[i])}
                      variant="inline"
                      onVideo={onVideo}
                    />
                  );
                }
                selects.forEach((sel, si) => {
                  // First select acts as the "version" pill on the far left.
                  if (si === 0) return;
                  inlineItems.push(
                    <ChipSelect
                      key={si}
                      label={sel.label}
                      options={sel.options}
                      value={selectIdx[si] ?? sel.defaultIndex ?? 0}
                      onChange={(oi) =>
                        setSelectIdx((prev) => {
                          const next = [...prev];
                          next[si] = oi;
                          return next;
                        })
                      }
                      variant="inline"
                      onVideo={onVideo}
                    />
                  );
                });
                return (
                  <>
                    {selects[0] && (
                      <ChipSelect
                        label={selects[0].label}
                        options={selects[0].options}
                        value={selectIdx[0] ?? selects[0].defaultIndex ?? 0}
                        onChange={(oi) =>
                          setSelectIdx((prev) => {
                            const next = [...prev];
                            next[0] = oi;
                            return next;
                          })
                        }
                        variant="pill"
                        flagshipMark
                      />
                    )}
                    {inlineItems.map((node, idx) => (
                      <div key={idx} className="flex items-center gap-1">
                        {!onVideo && <span className="h-4 w-px bg-border/80" aria-hidden />}
                        {node}
                      </div>
                    ))}
                  </>
                );
              })()}
            </div>
            <button
              type="button"
              disabled={isAuthed && (!value.trim() || status === "loading")}
              onClick={onGenerate}
              className="h-10 px-5 rounded-full font-semibold text-white transition-opacity disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 flex items-center justify-center gap-2 w-full sm:w-auto sm:ml-auto shrink-0"
              style={{ background: "hsl(var(--primary))" }}
            >
              {status === "loading" ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Генерация...
                </>
              ) : (
                <>
                  <span>Генерировать</span>
                  <span className="opacity-90">· {totalLabel}</span>
                </>
              )}
            </button>
          </div>

          {tool.legalNote && (
            <p className="text-[11px] text-muted-foreground flex items-start gap-1.5">
              <span aria-hidden>⚠️</span>
              <span>{tool.legalNote}</span>
            </p>
          )}
        </div>
        {tool.planNote && (
          <p className="mt-2 text-[11px] text-center" style={{ color: "hsl(var(--primary))" }}>{tool.planNote}</p>
        )}

        {status === "done" && (
          resultType === "images" ? (
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
              {["/community/01.jpg", "/community/02.jpg", "/community/03.jpg", "/community/04.jpg"].map((src) => (
                <img
                  key={src}
                  src={src}
                  alt="Пример результата"
                  className="w-full aspect-square object-cover rounded-xl border border-white/10"
                />
              ))}
            </div>
          ) : resultType === "video" ? (
            <div className="mt-4 relative w-full aspect-video rounded-xl border border-white/10 overflow-hidden bg-background/60">
              <img
                src="/community/02.jpg"
                alt="Готовое видео"
                className="absolute inset-0 w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg" style={{ background: "hsl(var(--primary))" }}>
                  <PlayIcon size={28} className="ml-1 text-white" fill="white" />
                </div>
              </div>
              <div className="absolute bottom-2 left-3 text-[11px] text-white/90 bg-black/40 backdrop-blur px-2 py-1 rounded">
                Пример результата
              </div>
            </div>
          ) : resultType === "text" ? (
            <div className="mt-4 rounded-xl border border-white/10 bg-background/60 p-5">
              <div className="space-y-3">
                <div className="h-3 rounded bg-white/10" style={{ width: "100%" }} />
                <div className="h-3 rounded bg-white/10" style={{ width: "92%" }} />
                <div className="h-3 rounded bg-white/10" style={{ width: "96%" }} />
                <div className="h-3 rounded bg-white/10" style={{ width: "60%" }} />
              </div>
              <p className="text-xs text-muted-foreground mt-3">Ответ модели появится здесь</p>
            </div>
          ) : (
          <div className="mt-4 rounded-xl border border-border p-4 flex items-center gap-3 bg-background/60">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "hsl(var(--primary))" }}>
              <PlayIcon size={18} className="ml-0.5 text-white" fill="white" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold">Аудио готово</div>
              <div className="text-[11px] text-muted-foreground">{voice} · MP3</div>
            </div>
          </div>
          )
        )}
      </div>
    </section>
  );
}
