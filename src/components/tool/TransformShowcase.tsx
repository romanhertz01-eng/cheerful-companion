import { Sparkles } from "lucide-react";

interface Props {
  heading: string;
  sub?: string;
  cta?: string;
  input: string;
  inputPrompt?: string;
  outputs: string[];
  outputCols?: 2 | 3;
  onCtaClick?: () => void;
}

export function TransformShowcase({
  heading,
  sub,
  cta,
  input,
  inputPrompt,
  outputs,
  outputCols = 2,
  onCtaClick,
}: Props) {
  return (
    <section className="max-w-[1360px] mx-auto px-4 py-16">
      <h2 className="text-3xl md:text-[40px] font-bold text-center leading-tight">{heading}</h2>
      {sub && (
        <p className="mt-5 text-base text-muted-foreground text-center max-w-3xl mx-auto leading-relaxed">
          {sub}
        </p>
      )}
      {cta && (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={onCtaClick}
            className="h-12 px-8 rounded-full border border-border font-medium hover:bg-muted/60 transition-colors"
          >
            {cta}
          </button>
        </div>
      )}

      <div className="mt-14 flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-2">
        {/* ВХОД */}
        <div className="relative w-full max-w-[480px] lg:w-[40%] shrink-0">
          <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-border">
            <img
              src={input}
              alt="Исходное изображение"
              loading="lazy"
              width={800}
              height={1000}
              className="absolute inset-0 w-full h-full object-cover"
            />
            {inputPrompt && (
              <div className="absolute bottom-4 left-4 right-4 rounded-xl bg-black/70 backdrop-blur-sm border border-white/15 px-4 py-3 flex gap-3 items-start">
                <Sparkles size={16} className="shrink-0 mt-0.5 text-white/80" />
                <p className="text-sm text-white/90 leading-snug">{inputPrompt}</p>
              </div>
            )}
          </div>
        </div>

        {/* СТРЕЛКА */}
        <div className="shrink-0 rotate-90 lg:rotate-0 py-4 lg:py-0 lg:px-2" aria-hidden>
          <svg width="56" height="40" viewBox="0 0 56 40" fill="none">
            <defs>
              <linearGradient id="arrowGrad" x1="0" y1="0" x2="56" y2="0">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.5" />
                <stop offset="100%" stopColor="hsl(var(--primary))" />
              </linearGradient>
            </defs>
            <path d="M0 12 H30 V2 L56 20 L30 38 V28 H0 Z" fill="url(#arrowGrad)" />
          </svg>
        </div>

        {/* ВЫХОДЫ */}
        <div className="w-full max-w-[620px] lg:w-[46%] shrink-0 rounded-2xl border border-border p-4">
          <div className={`grid gap-3 ${outputCols === 3 ? "grid-cols-3" : "grid-cols-2"}`}>
            {outputs.map((src, i) => (
              <div key={i} className="aspect-[4/5] rounded-xl overflow-hidden border border-border/60">
                <img
                  src={src}
                  alt={`Результат ${i + 1}`}
                  loading="lazy"
                  width={600}
                  height={750}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}