type ScenarioItem =
  | string
  | { icon?: string; title: string; description?: string };

interface ScenarioChipsBlockProps {
  heading: string;
  items: ScenarioItem[];
}

export function ScenarioChipsBlock({ heading, items }: ScenarioChipsBlockProps) {
  const labels = items.map((it) => (typeof it === "string" ? it : it.title));
  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <h2 className="text-2xl md:text-[32px] font-bold mb-8 text-center">{heading}</h2>
      <div className="flex flex-wrap justify-center gap-3">
        {labels.map((label) => (
          <span
            key={label}
            className="px-5 py-2.5 rounded-full border border-border text-sm hover:border-primary/50 transition-colors cursor-default"
          >
            {label}
          </span>
        ))}
      </div>
    </section>
  );
}