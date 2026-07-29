interface TldrBlockProps {
  title?: string;
  points: string[];
  anchor?: string;
}

export function TldrBlock({ title = "Коротко", points, anchor }: TldrBlockProps) {
  return (
    <section id={anchor} className="max-w-3xl mx-auto px-4 pt-6">
      <div className="rounded-2xl border border-border bg-[hsl(var(--card))] p-6 md:p-8">
        <h2 className="text-lg md:text-xl font-semibold mb-4" style={{ color: "var(--seo-heading)" }}>
          {title}
        </h2>
        <ul className="list-disc pl-5 space-y-2 text-[15px]" style={{ color: "var(--seo-text)" }}>
          {points.map((p, i) => (
            <li key={i} className="leading-relaxed">{p}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}