import { Fragment, useEffect, useMemo, useState } from "react";
import { X, Search, Download, Infinity as InfinityIcon, Video, Image as ImageIcon, Music, Type } from "lucide-react";
import { cn } from "@/lib/utils";
import { comparisonGroups, comparisonTiers, type ComparisonValue, type ComparisonGroup } from "@/data/planComparison";

const groupIcons: Record<ComparisonGroup["id"], typeof Video> = {
  video: Video,
  image: ImageIcon,
  audio: Music,
  text: Type,
};

const INITIAL_VISIBLE = 3;
const COLLAPSE_THRESHOLD = 6;

// grid template: model column + one column per tier
const GRID_COLS = "minmax(240px,1.4fr) repeat(4, minmax(120px, 1fr))";

function ValueCell({ value }: { value: ComparisonValue }) {
  if (value === "unlimited") {
    return (
      <span
        className="inline-flex items-center gap-1 rounded-lg border border-border bg-muted px-3 py-1 text-xs font-semibold text-foreground"
      >
        <InfinityIcon className="h-3.5 w-3.5" />
        Безлимит
      </span>
    );
  }
  if (value === null) {
    return <span className="text-muted-foreground/70 text-sm">—</span>;
  }
  return (
      <span className="inline-flex items-baseline gap-1 rounded-lg border border-border bg-card px-3 py-1">
      <span className="tabular-nums font-medium text-sm text-foreground">{value}</span>
      <span className="text-xs text-muted-foreground">ген.</span>
    </span>
  );
}

export function PlanComparisonModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return comparisonGroups
      .map((g) => ({
        ...g,
        rows: q ? g.rows.filter((r) => r.model.toLowerCase().includes(q)) : g.rows,
      }))
      .filter((g) => g.rows.length > 0);
  }, [query]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-stretch justify-center bg-background/80 backdrop-blur-sm md:items-center"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative flex w-full max-w-[1100px] max-h-[100dvh] flex-col overflow-hidden border border-border bg-card shadow-[0_24px_80px_rgba(0,0,0,0.6)] md:my-8 md:max-h-[85vh] md:rounded-3xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-8 py-5 md:px-10">
          <div>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight">Сравнение тарифов</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Сколько генераций даёт каждый план на популярных моделях
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground disabled:opacity-50"
              title="Скачать PDF (скоро)"
              disabled
            >
              <Download className="h-4 w-4" />
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="border-b border-border px-8 py-4 md:px-10">
          <div className="relative max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Поиск по моделям…"
              className="w-full rounded-lg border border-border bg-card py-2 pl-9 pr-3 text-sm focus:border-primary/50 focus:outline-none"
            />
          </div>
        </div>

        {/* Scroll region */}
        <div className="flex-1 overflow-auto px-8 pb-8 pt-2 md:px-10 md:pb-10">
          {/* Sticky column header */}
          <div
            className="sticky top-0 z-10 -mx-8 grid items-center border-b border-border bg-card px-8 py-3 md:-mx-10 md:px-10"
            style={{ gridTemplateColumns: GRID_COLS }}
          >
            <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
              Модель
            </div>
            {comparisonTiers.map((t) => (
              <div
                key={t.id}
                className={cn(
                  "text-center text-sm font-semibold",
                  t.id === "pro" ? "text-primary" : "text-foreground"
                )}
              >
                {t.name}
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="py-16 text-center text-muted-foreground">Ничего не найдено</div>
          )}

          {filtered.map((group) => {
            const Icon = groupIcons[group.id];
            const isExpanded = expanded[group.id] ?? false;
            const canCollapse = group.rows.length > COLLAPSE_THRESHOLD;
            const visible = !canCollapse || isExpanded ? group.rows : group.rows.slice(0, INITIAL_VISIBLE);
            const hasMore = canCollapse;
            return (
              <Fragment key={group.id}>
                <div className="mb-4 mt-8 flex items-center gap-3">
                  <span
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card"
                  >
                    <Icon className="h-5 w-5 text-muted-foreground" />
                  </span>
                  <h3 className="text-lg md:text-xl font-bold tracking-tight">{group.title}</h3>
                </div>

                <div>
                  {visible.map((row) => (
                    <div
                      key={`${group.id}-${row.model}`}
                      className="grid items-center border-b border-border py-3.5 transition-colors hover:bg-muted/50"
                      style={{ gridTemplateColumns: GRID_COLS }}
                    >
                      <div className="min-w-0 pr-4">
                        <div className="truncate font-medium text-foreground">{row.model}</div>
                        <div className="text-xs text-muted-foreground">{row.unit}</div>
                      </div>
                      {comparisonTiers.map((t) => (
                        <div key={t.id} className="flex items-center justify-center">
                          <ValueCell value={row.values[t.id]} />
                        </div>
                      ))}
                    </div>
                  ))}
                  {hasMore && (
                    <div className="pt-3">
                      <button
                        onClick={() => setExpanded((s) => ({ ...s, [group.id]: !isExpanded }))}
                        className="text-xs font-semibold text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
                      >
                        {isExpanded ? "Скрыть" : `Показать ещё (${group.rows.length - INITIAL_VISIBLE})`}
                      </button>
                    </div>
                  )}
                </div>
              </Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}