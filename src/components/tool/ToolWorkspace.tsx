import { useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Upload, Play, Loader2, ChevronDown, Check, Play as PlayIcon } from "lucide-react";
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

export function ToolWorkspace({ data }: { data: ToolPageData }) {
  const tool = data.tool!;
  if (tool.layout === "row") {
    return <RowWorkspace data={data} />;
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
      <div className="max-w-6xl mx-auto px-4 py-8 grid gap-5 md:grid-cols-[440px_1fr]">
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
                className="w-full accent-[#E85420]"
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
            <div className="flex flex-col gap-3">
              {tool.selects.map((sel, si) => (
                <div key={si}>
                  <label className="text-xs text-muted-foreground mb-1 block">{sel.label}</label>
                  <div className="grid grid-cols-3 gap-2">
                    {sel.options.map((opt, oi) => {
                      const active = (selectIdx[si] ?? sel.defaultIndex ?? 0) === oi;
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() =>
                            setSelectIdx((prev) => {
                              const next = [...prev];
                              next[si] = oi;
                              return next;
                            })
                          }
                          className={cn(
                            "px-3 py-2 rounded-lg text-sm font-medium border transition-colors",
                            active
                              ? "border-primary bg-primary/10 text-foreground"
                              : "border-border text-muted-foreground hover:text-foreground"
                          )}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {has("generate") && (
            <div className="pt-1 border-t border-border">
              <p className="text-[11px] text-muted-foreground mb-2">
                {tool.pricing
                  ? computePricingLabel(tool.pricing, tool.selects ?? [], selectIdx, 0)
                  : tool.types
                  ? `Требуется кредитов: ${tool.types[selectedType].credits}`
                  : `модель: ${tool.modelName} · ${tool.credits} кредитов`}
              </p>
              {tool.planNote && (
                <p className="text-[11px] mb-2" style={{ color: "#E85420" }}>{tool.planNote}</p>
              )}
              <button
                type="button"
                disabled={isAuthed && (!file || status === "loading")}
                onClick={onGenerate}
                className="w-full h-10 rounded-lg font-semibold text-white transition-opacity disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 flex items-center justify-center gap-2"
                style={{ background: "#E85420" }}
              >
                {status === "loading" ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Генерация...
                  </>
                ) : (
                  "Генерировать"
                )}
              </button>
            </div>
          )}
        </div>

        {/* RIGHT PREVIEW */}
        <div className="flex flex-col gap-3 h-full">
          <div className="shrink-0">
            <h1 className="text-[28px] md:text-[40px] font-bold leading-[1.1] tracking-tight text-center">{data.heroTitle}</h1>
            <p className="text-sm text-muted-foreground mt-1.5 text-center max-w-[560px] mx-auto">{data.heroDescription}</p>
          </div>

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

function RowWorkspace({ data }: { data: ToolPageData }) {
  const tool = data.tool!;
  const voices = tool.voices ?? [];
  const maxChars = tool.maxChars ?? 2000;
  const { isAuthed } = useAuth();
  const navigate = useNavigate();
  const [voice, setVoice] = useState(voices[0] ?? "");
  const [voiceOpen, setVoiceOpen] = useState(false);
  const [text, setText] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [sampleFile, setSampleFile] = useState<File | null>(null);
  const sampleRef = useRef<HTMLInputElement>(null);
  const selects = tool.selects ?? [];
  const [selectIdx, setSelectIdx] = useState<number[]>(
    () => selects.map((s) => s.defaultIndex ?? 0)
  );
  const resultType = tool.resultType ?? "audio";

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

  return (
    <section className="border-y border-border" style={{ background: "hsl(var(--card))" }}>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-[28px] md:text-[44px] font-bold leading-[1.1] tracking-tight text-center mb-3">{data.heroTitle}</h1>
        <p className="text-muted-foreground text-center max-w-[640px] mx-auto mb-8">{data.heroDescription}</p>
        <div className="rounded-2xl border border-border bg-background/60 p-5 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Link to={isAuthed ? "/toolkit" : "/studios"} className="p-1.5 rounded-md hover:bg-muted transition-colors">
              <ArrowLeft size={16} />
            </Link>
          </div>

          {voices.length > 0 && (
            <div className="relative">
              <label className="text-xs text-muted-foreground mb-1 block">Голос</label>
              <button
                type="button"
                onClick={() => setVoiceOpen((v) => !v)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg border border-border bg-muted/40 text-sm"
              >
                <span className="font-medium">{voice}</span>
                <ChevronDown size={14} className="text-muted-foreground" />
              </button>
              {voiceOpen && (
                <div className="absolute z-10 mt-1 w-full rounded-lg border border-border bg-background shadow-lg overflow-hidden">
                  {voices.map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => {
                        setVoice(v);
                        setVoiceOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 text-sm text-left hover:bg-muted transition-colors"
                    >
                      <span>{v}</span>
                      {v === voice && <Check size={14} className="text-primary" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

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
                className="w-full h-[88px] rounded-xl border-2 border-dashed border-border hover:border-primary/50 transition-colors flex flex-col items-center justify-center gap-1 text-center px-3"
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

          <div className="relative">
            <textarea
              rows={5}
              value={value}
              onChange={(e) => setText(e.target.value.slice(0, maxChars))}
              placeholder={tool.textPlaceholder}
              className="w-full resize-none rounded-lg border border-border bg-background/80 px-3 py-2.5 text-sm outline-none focus:border-primary/60 transition-colors"
            />
            <div className="absolute bottom-2 right-3 text-[11px] text-muted-foreground">
              {value.length} / {maxChars}
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-2 border-t border-border sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 flex-wrap min-w-0">
              <span className="border border-border rounded-full px-3 py-1 text-xs">{tool.modelName}</span>
              {selects.map((sel, si) => (
                <div key={si} className="flex items-center gap-1 flex-wrap">
                  <span className="text-[11px] text-muted-foreground">{sel.label}:</span>
                  <div className="flex items-center gap-1 rounded-lg border border-border p-0.5 flex-wrap">
                    {sel.options.map((opt, oi) => {
                      const active = (selectIdx[si] ?? 0) === oi;
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() =>
                            setSelectIdx((prev) => {
                              const next = [...prev];
                              next[si] = oi;
                              return next;
                            })
                          }
                          className={cn(
                            "text-xs px-2.5 py-1.5 rounded-md font-medium transition-colors",
                            active
                              ? "bg-primary/15 text-foreground"
                              : "text-muted-foreground hover:text-foreground"
                          )}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
              <span className="text-[11px] text-muted-foreground">
                {tool.pricing
                  ? computePricingLabel(tool.pricing, selects, selectIdx, value.length)
                  : `${tool.credits} кредитов`}
              </span>
              {tool.planNote && (
                <span className="text-[11px]" style={{ color: "#E85420" }}>{tool.planNote}</span>
              )}
            </div>
            <button
              type="button"
              disabled={isAuthed && (!value.trim() || status === "loading")}
              onClick={onGenerate}
              className="w-full sm:w-auto h-10 px-5 rounded-lg font-semibold text-white transition-opacity disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 flex items-center justify-center gap-2 shrink-0"
              style={{ background: "#E85420" }}
            >
              {status === "loading" ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Генерация...
                </>
              ) : (
                "Генерировать"
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
                <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg" style={{ background: "#E85420" }}>
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
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "#E85420" }}>
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
