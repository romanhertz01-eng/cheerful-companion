interface TocItem { anchor: string; label: string }
interface TocBlockProps { items: TocItem[]; title?: string }

export function TocBlock({ items, title = "Содержание" }: TocBlockProps) {
  return (
    <nav className="max-w-3xl mx-auto px-4 pt-6" aria-label={title}>
      <div className="rounded-xl border border-border/70 bg-[hsl(var(--card))]/60 p-5">
        <h2 className="text-xs uppercase tracking-[0.14em] font-mono text-[hsl(var(--muted-foreground))] mb-3">
          {title}
        </h2>
        <ol className="space-y-1.5 text-sm">
          {items.map((it, i) => (
            <li key={it.anchor} className="flex gap-2">
              <span className="text-[hsl(var(--muted-foreground))] tabular-nums">{i + 1}.</span>
              <a href={`#${it.anchor}`} className="hover:text-[hsl(var(--primary))] transition-colors">
                {it.label}
              </a>
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}