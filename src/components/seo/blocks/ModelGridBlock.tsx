import { Link } from "@tanstack/react-router";
import { ModelGlyph } from "@/components/ui/era/ModelGlyph";
import { isPublished } from "@/data/toolPages";

interface ModelItem {
  name: string;
  desc?: string;
  badge?: string;
  image?: string;
  href?: string;
}

interface ModelGridBlockProps {
  heading: string;
  items: ModelItem[];
}

function Card({ m }: { m: ModelItem }) {
  return (
    <div className="bg-white/[0.04] border border-white/10 shadow-[0_2px_12px_rgba(0,0,0,0.4)] rounded-xl overflow-hidden hover:border-primary/40 hover:bg-white/[0.06] transition-colors h-full">
      {m.image && (
        <img src={m.image} alt={m.name} loading="lazy" className="w-full h-[72px] object-cover" />
      )}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <ModelGlyph name={m.name} size={32} />
          <span className="font-semibold text-sm">{m.name}</span>
          {m.badge && (
            <span className="text-[9px] gradient-accent text-white px-1.5 py-0.5 rounded-full font-bold">
              {m.badge}
            </span>
          )}
        </div>
        {m.desc && <p className="text-xs text-muted-foreground">{m.desc}</p>}
      </div>
    </div>
  );
}

export function ModelGridBlock({ heading, items }: ModelGridBlockProps) {
  const visible = items.filter((m) => {
    if (!m.href) return true;
    const match = m.href.match(/^\/tools\/([^/?#]+)/);
    if (!match) return true;
    return isPublished(match[1]);
  });
  return (
    <section className="max-w-5xl mx-auto px-4 py-12">
      <h2 className="text-2xl md:text-[32px] font-bold mb-8 text-center">{heading}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {visible.map((m) =>
          m.href ? (
            <Link key={m.name} to={m.href} className="block">
              <Card m={m} />
            </Link>
          ) : (
            <Card key={m.name} m={m} />
          )
        )}
      </div>
    </section>
  );
}