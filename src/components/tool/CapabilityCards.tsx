type CapabilityCard = {
  title: string;
  desc: string;
  image: string;
  inset?: string;
  insetPosition?: 'bottom-left' | 'bottom-right' | 'top-right';
};

interface CapabilityCardsProps {
  heading: string;
  sub?: string;
  cards: CapabilityCard[];
}

const POSITION: Record<string, string> = {
  'bottom-left': 'bottom-4 left-4',
  'bottom-right': 'bottom-4 right-4',
  'top-right': 'top-4 right-4',
};

export function CapabilityCards({ heading, sub, cards }: CapabilityCardsProps) {
  if (!cards?.length) return null;
  return (
    <section className="max-w-[1360px] mx-auto px-4 py-16">
      <h2 className="text-2xl md:text-[32px] font-bold text-center md:text-left">{heading}</h2>
      {sub && (
        <p className="mt-3 text-sm text-muted-foreground text-center md:text-left max-w-2xl mx-auto md:mx-0">{sub}</p>
      )}

      <div className="mt-12 grid gap-8 md:grid-cols-3">
        {cards.map((card, i) => {
          const positionClass = POSITION[card.insetPosition ?? 'bottom-left'] ?? POSITION['bottom-left'];
          return (
            <article key={i}>
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-border">
                <img
                  src={card.image}
                  alt={card.title}
                  loading="lazy"
                  width={800}
                  height={600}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                {card.inset && (
                  <div
                    className={`absolute w-[110px] h-[75px] rounded-lg overflow-hidden border-2 border-white/80 shadow-lg ${positionClass}`}
                  >
                    <img
                      src={card.inset}
                      alt=""
                      loading="lazy"
                      width={110}
                      height={75}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
              <h3 className="mt-5 text-lg md:text-xl font-semibold">{card.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{card.desc}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default CapabilityCards;