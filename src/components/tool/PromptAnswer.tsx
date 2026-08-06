import { useState } from "react";
import { cn } from "@/lib/utils";

type Item = {
  label?: string;
  version?: string;
  prompt: string;
  answer: string;
};

type Props = {
  heading: string;
  sub?: string;
  items: Item[];
};

export function PromptAnswer({ heading, sub, items }: Props) {
  const [activeIdx, setActiveIdx] = useState(0);
  if (!items?.length) return null;
  const active = items[activeIdx] ?? items[0];

  return (
    <section className="max-w-5xl mx-auto px-4 py-12">
      <h2 className="text-2xl md:text-[32px] font-bold text-center md:text-left">{heading}</h2>
      {sub ? (
        <p className="mt-3 text-sm text-muted-foreground text-center md:text-left">{sub}</p>
      ) : null}

      {items.length > 1 ? (
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {items.map((it, i) => {
            const isActive = i === activeIdx;
            return (
              <button
                key={i}
                type="button"
                onClick={() => setActiveIdx(i)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 border border-primary/40 text-foreground"
                    : "border border-border text-muted-foreground hover:bg-muted/60",
                )}
              >
                {it.label ?? `Пример ${i + 1}`}
              </button>
            );
          })}
        </div>
      ) : null}

      <div className="mt-8 grid gap-4 md:grid-cols-2 items-stretch">
        <div className="rounded-2xl border border-border bg-muted/40 p-5">
          <div className="text-xs uppercase tracking-wide text-muted-foreground mb-3">
            Запрос
          </div>
          <div className="text-sm leading-relaxed whitespace-pre-line">
            {active.prompt}
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">
              Ответ
            </div>
            {active.version ? (
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                {active.version}
              </span>
            ) : null}
          </div>
          <div className="text-sm leading-relaxed whitespace-pre-line">
            {active.answer}
          </div>
        </div>
      </div>
    </section>
  );
}