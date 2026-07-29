import { useEffect, useRef, useState } from "react";

interface VisualCard {
  title: string;
  desc?: string;
  image: string;
}

interface VisualCardsProps {
  heading: string;
  sub?: string;
  cards: VisualCard[];
}

export function VisualCards({ heading, sub, cards }: VisualCardsProps) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<Array<HTMLElement | null>>([]);
  const [activeIdx, setActiveIdx] = useState(0);

  const gridColsClass =
    cards.length <= 2
      ? "md:grid-cols-2"
      : cards.length === 3
      ? "md:grid-cols-3"
      : "md:grid-cols-4";

  const titleSizeClass =
    cards.length >= 4 ? "text-base md:text-lg" : "text-lg md:text-xl";

  useEffect(() => {
    const root = scrollerRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) {
          const idx = itemRefs.current.indexOf(visible.target as HTMLElement);
          if (idx !== -1) setActiveIdx(idx);
        }
      },
      { root, threshold: [0.5, 0.75, 1] }
    );
    itemRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [cards.length]);

  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <h2 className="text-2xl md:text-[32px] font-bold text-center">{heading}</h2>
      {sub && (
        <p className="mt-3 text-sm text-muted-foreground text-center max-w-2xl mx-auto">
          {sub}
        </p>
      )}

      <div
        ref={scrollerRef}
        className={`mt-8 flex md:grid ${gridColsClass} gap-4 overflow-x-auto snap-x snap-mandatory md:overflow-visible md:snap-none -mx-4 px-4 md:mx-0 md:px-0`}
      >
        {cards.map((card, i) => (
          <article
            key={card.title}
            ref={(el) => {
              itemRefs.current[i] = el;
            }}
            className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 min-w-[75%] snap-center md:min-w-0"
          >
            <img
              src={card.image}
              alt={card.title}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
            <div className="absolute bottom-0 inset-x-0 p-5">
              <h3 className={`uppercase font-bold ${titleSizeClass} leading-tight text-white`}>
                {card.title}
              </h3>
              {card.desc && (
                <p className="text-sm text-white/70 mt-2 line-clamp-2">{card.desc}</p>
              )}
            </div>
          </article>
        ))}
      </div>

      <div className="mt-4 flex md:hidden justify-center gap-1.5">
        {cards.map((card, i) => {
          const active = i === activeIdx;
          return (
            <span
              key={card.title}
              className={`h-1.5 rounded-full transition-all ${
                active ? "bg-primary w-6" : "bg-white/25 w-1.5"
              }`}
            />
          );
        })}
      </div>
    </section>
  );
}

export default VisualCards;