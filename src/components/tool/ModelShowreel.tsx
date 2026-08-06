import { useEffect, useRef, useState } from "react";

type ShowreelItem = { image: string; video?: string; prompt?: string; label?: string };

interface ModelShowreelProps {
  heading: string;
  sub?: string;
  aspect?: '2/1' | '16/9' | '4/3' | '1/1';
  items: ShowreelItem[];
}

export function ModelShowreel({ heading, sub, items, aspect = '2/1' }: ModelShowreelProps) {
  const aspectClass =
    aspect === '16/9' ? 'aspect-video'
    : aspect === '4/3' ? 'aspect-[4/3]'
    : aspect === '1/1' ? 'aspect-square'
    : 'aspect-[2/1]';
  const [activeIdx, setActiveIdx] = useState(0);
  const firstSrc = items[0]?.image ?? "";
  const [frontSrc, setFrontSrc] = useState(firstSrc);
  const [backSrc, setBackSrc] = useState(firstSrc);
  const [frontOnTop, setFrontOnTop] = useState(true);
  const mountedRef = useRef(false);

  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }
    const nextSrc = items[activeIdx]?.image ?? "";
    if (frontOnTop) {
      setBackSrc(nextSrc);
      setFrontOnTop(false);
    } else {
      setFrontSrc(nextSrc);
      setFrontOnTop(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIdx]);

  if (!items.length) return null;
  const active = items[activeIdx];

  const mediaMaxWidth = aspect === '1/1' ? 'max-w-[640px]' : 'max-w-5xl';
  return (
    <section className="max-w-5xl mx-auto px-4 py-12">
      <h2 className="text-2xl md:text-[32px] font-bold text-center md:text-left">{heading}</h2>
      {sub && (
        <p className="mt-3 text-sm text-muted-foreground text-center md:text-left max-w-2xl mx-auto md:mx-0">
          {sub}
        </p>
      )}

      <div className={`mt-8 ${aspectClass} ${mediaMaxWidth} mx-auto w-full max-h-[520px] rounded-2xl overflow-hidden border border-white/10 bg-white/[0.03] relative`}>
        {active.video ? (
          <video
            key={active.video}
            src={active.video}
            poster={active.image}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <>
        <img
          src={frontSrc}
          alt={active.label ?? heading}
          loading="eager"
          fetchPriority="high"
          width={1600}
          height={800}
          className={
            "absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-300 " +
            (frontOnTop ? "opacity-100" : "opacity-0")
          }
        />
        <img
          src={backSrc}
          alt={active.label ?? heading}
          loading="lazy"
          width={1600}
          height={800}
          className={
            "absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-300 " +
            (frontOnTop ? "opacity-0" : "opacity-100")
          }
        />
          </>
        )}
      </div>

      <div className="mt-4 flex justify-center">
        <div className="inline-flex items-center gap-2 p-2 rounded-full border border-white/10 bg-white/[0.04]">
          {items.map((it, i) => {
            const isActive = i === activeIdx;
            return (
              <button
                key={i}
                type="button"
                onClick={() => setActiveIdx(i)}
                aria-label={`Пример ${i + 1}`}
                aria-current={isActive ? "true" : undefined}
                className={
                  "overflow-hidden transition-all duration-300 shrink-0 " +
                  (isActive
                    ? "w-[72px] h-10 rounded-xl ring-2 ring-primary"
                    : "w-10 h-10 rounded-full opacity-60 hover:opacity-100")
                }
              >
                <img src={it.image} alt="" width={72} height={40} className="object-cover w-full h-full" />
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default ModelShowreel;