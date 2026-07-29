import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useAuth } from "@/contexts/AuthContext";
import { buildAuthHref } from "@/lib/authRedirect";

interface HeroGeneratorTab {
  key: string;
  label: string;
  placeholder: string;
  model: string;
  href: string;
}

interface HeroGeneratorBlockProps {
  h1: string;
  subtitle?: string;
  tabs: HeroGeneratorTab[];
}

export function HeroGeneratorBlock({ h1, subtitle, tabs }: HeroGeneratorBlockProps) {
  const { isAuthed } = useAuth();
  const [activeKey, setActiveKey] = useState(tabs[0]?.key ?? "");
  const [value, setValue] = useState("");
  const active = tabs.find((t) => t.key === activeKey) ?? tabs[0];

  if (!active) return null;

  const guestHref =
    typeof window !== "undefined"
      ? buildAuthHref(active.href)
      : "/auth";
  const targetHref = isAuthed ? active.href : guestHref;

  return (
    <section
      className="px-4"
      style={{
        padding: "80px 16px 60px",
        background:
          "radial-gradient(1200px 400px at 50% 0%, hsl(var(--primary) / 0.12), transparent 70%)",
      }}
    >
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-[32px] md:text-[52px] font-bold leading-tight tracking-tight">
          {h1}
        </h1>
        {subtitle && (
          <p className="text-muted-foreground mt-5 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
            {subtitle}
          </p>
        )}

        <div className="max-w-3xl mx-auto rounded-2xl border border-border bg-background/60 p-5 mt-10 text-left">
          <div className="flex flex-wrap gap-2 mb-4">
            {tabs.map((t) => {
              const isActive = t.key === activeKey;
              return (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setActiveKey(t.key)}
                  className={
                    isActive
                      ? "gradient-accent text-white rounded-full px-3 py-1 text-xs font-medium"
                      : "border border-border text-foreground/80 rounded-full px-3 py-1 text-xs hover:bg-accent/40 transition"
                  }
                >
                  {t.label}
                </button>
              );
            })}
          </div>

          <textarea
            rows={3}
            placeholder={active.placeholder}
            value={value}
            onChange={(e) => setValue(e.target.value.slice(0, 2000))}
            className="w-full bg-transparent outline-none resize-none text-[15px] placeholder:text-muted-foreground"
          />

          <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
            <div className="flex items-center gap-3">
              <span className="border border-border rounded-full px-3 py-1 text-xs text-foreground/80">
                {active.model}
              </span>
              <span className="text-xs text-muted-foreground tabular-nums">
                {value.length}/2000
              </span>
            </div>
            <Link
              to={targetHref}
              className="gradient-accent text-white rounded-xl px-6 py-2.5 font-semibold text-sm hover:opacity-95 transition"
            >
              Создать
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}