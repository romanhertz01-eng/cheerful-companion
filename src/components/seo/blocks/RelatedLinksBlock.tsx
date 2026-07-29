import { Link } from "@tanstack/react-router";

interface RelatedLink {
  label: string;
  href: string;
  desc?: string;
}

interface RelatedLinksBlockProps {
  heading: string;
  links?: RelatedLink[];
  items?: RelatedLink[];
}

export function RelatedLinksBlock({ heading, links, items }: RelatedLinksBlockProps) {
  const data = items ?? links ?? [];
  const hasDesc = data.some((l) => l.desc);
  if (hasDesc) {
    return (
      <section className="max-w-5xl mx-auto px-4 py-10">
        <h2 className="text-xl font-bold mb-4">{heading}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.map((l) => (
            <Link
              key={l.href}
              to={l.href}
              className="block rounded-2xl border border-border bg-[hsl(var(--card))] p-5 hover:border-[hsl(var(--primary))] transition-colors"
            >
              <div className="font-semibold" style={{ color: "var(--seo-heading)" }}>{l.label}</div>
              {l.desc && (
                <div className="mt-1.5 text-sm text-[hsl(var(--muted-foreground))]">{l.desc}</div>
              )}
            </Link>
          ))}
        </div>
      </section>
    );
  }
  return (
    <section className="max-w-5xl mx-auto px-4 py-10">
      <h2 className="text-xl font-bold mb-4">{heading}</h2>
      <div className="flex flex-wrap gap-3">
        {data.map((l) => (
          <Link
            key={l.href}
            to={l.href}
            className="px-4 py-2 rounded-full border border-border text-sm text-muted-foreground hover:border-primary/50 hover:text-foreground transition-colors"
          >
            {l.label}
          </Link>
        ))}
      </div>
    </section>
  );
}