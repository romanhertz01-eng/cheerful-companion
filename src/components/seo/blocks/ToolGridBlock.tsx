import { Link } from "@tanstack/react-router";
import { isPublished } from "@/data/toolPages";

interface ToolItem {
  title: string;
  desc?: string;
  href: string;
  icon?: string;
}

interface ToolGridBlockProps {
  heading: string;
  items: ToolItem[];
}

const DESKTOP_COLS: Record<number, string> = {
  1: 'lg:grid-cols-1',
  2: 'lg:grid-cols-2',
  3: 'lg:grid-cols-3',
  4: 'lg:grid-cols-4',
};
const DESKTOP_MAX: Record<number, string> = {
  1: 'max-w-sm',
  2: 'max-w-3xl',
  3: 'max-w-5xl',
  4: 'max-w-6xl',
};
function desktopColsFor(n: number) {
  if (n <= 4) return Math.max(n, 1);
  return n % 3 === 0 ? 3 : 4;
}

export function ToolGridBlock({ heading, items }: ToolGridBlockProps) {
  const visible = items.filter((it) => {
    const match = it.href.match(/^\/tools\/([^/?#]+)/);
    if (!match) return true;
    return isPublished(match[1]);
  });
  const cols = desktopColsFor(visible.length);
  const colsClass = DESKTOP_COLS[cols];
  const maxClass = DESKTOP_MAX[cols];
  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <h2 className="text-2xl md:text-[32px] font-bold mb-8 text-center">{heading}</h2>
      <div className={`grid grid-cols-1 sm:grid-cols-2 ${colsClass} gap-4 mx-auto ${maxClass}`}>
        {visible.map((it) => (
          <Link
            key={it.title}
            to={it.href}
            className="group flex flex-col gap-3 p-5 bg-white/[0.04] border border-white/10 shadow-[0_2px_12px_rgba(0,0,0,0.4)] rounded-xl hover:border-primary/40 hover:bg-white/[0.06] transition-colors"
          >
            {it.icon && (
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-primary/10 border border-primary/20 text-xl">
                {it.icon}
              </div>
            )}
            <div>
              <div className="font-semibold text-sm mb-1">{it.title}</div>
              {it.desc && <div className="text-xs text-muted-foreground">{it.desc}</div>}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}