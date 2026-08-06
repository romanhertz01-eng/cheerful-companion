import { useState } from "react";
import { Play } from "lucide-react";

interface AudioItem {
  title: string;
  duration: string;
  meta?: string;
  text?: string;
  src?: string;
}

interface Props {
  heading: string;
  sub?: string;
  textLabel?: string;
  items: AudioItem[];
}

export function AudioShowreel({ heading, sub, textLabel = "Озвученный текст", items }: Props) {
  const [activeIdx, setActiveIdx] = useState(0);
  if (!items.length) return null;
  const active = items[activeIdx] ?? items[0];
  const disabled = !active.src;

  const bars = Array.from({ length: 60 }, (_, i) => {
    const height =
      20 + 55 * Math.abs(Math.sin(i * 0.35)) * (0.6 + 0.4 * Math.sin(i * 0.11));
    const played = i < 60 * 0.3;
    return (
      <div
        key={i}
        className={`flex-1 rounded-full ${played ? "bg-primary/60" : "bg-white/15"}`}
        style={{ height: `${height}%` }}
      />
    );
  });

  return (
    <section className="max-w-4xl mx-auto px-4 py-12">
      <h2 className="text-2xl md:text-3xl font-bold text-center md:text-left">{heading}</h2>
      {sub && (
        <p className="mt-3 text-sm text-muted-foreground text-center md:text-left">{sub}</p>
      )}

      <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <div className="flex items-center gap-4">
          <button
            type="button"
            disabled={disabled}
            title={disabled ? "Пример — аудио появится позже" : undefined}
            className={`shrink-0 w-14 h-14 rounded-full gradient-accent flex items-center justify-center ${
              disabled ? "opacity-40 cursor-not-allowed" : ""
            }`}
          >
            <Play size={22} color="white" />
          </button>
          <div className="min-w-0">
            <div className="font-semibold text-base truncate">{active.title}</div>
            {active.meta && (
              <div className="text-xs text-muted-foreground truncate">{active.meta}</div>
            )}
          </div>
        </div>

        <div className="mt-5 h-16 flex items-end gap-[3px]">{bars}</div>

        <div className="mt-3 flex justify-between text-xs text-muted-foreground">
          <span>0:00</span>
          <span>{active.duration}</span>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-2">
        {items.map((item, i) => {
          const isActive = i === activeIdx;
          return (
            <button
              key={i}
              type="button"
              onClick={() => setActiveIdx(i)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors ${
                isActive
                  ? "border border-primary/40 bg-primary/[0.06]"
                  : "border border-white/10 hover:bg-white/[0.04]"
              }`}
            >
              <span className="shrink-0 w-6 text-sm text-muted-foreground tabular-nums">
                {i + 1}
              </span>
              <span className="font-medium text-sm flex-1 truncate">{item.title}</span>
              <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
                {item.duration}
              </span>
            </button>
          );
        })}
      </div>

      {active.text && (
        <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.03] px-5 py-4">
          <div className="text-xs uppercase tracking-wide text-muted-foreground mb-2">
            {textLabel}
          </div>
          <p className="text-sm leading-relaxed">{active.text}</p>
        </div>
      )}
    </section>
  );
}