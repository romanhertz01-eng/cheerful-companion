import { Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { plans } from "@/data/plans";
import { cn } from "@/lib/utils";

interface PricingBlockProps {
  heading: string;
  sub?: string;
}

export function PricingBlock({ heading, sub }: PricingBlockProps) {
  const shown = plans.filter((p) => !p.enterprise).slice(0, 3);

  return (
    <section className="max-w-[1360px] mx-auto px-4 py-16">
      <h2 className="text-2xl md:text-[32px] font-bold text-center md:text-left">{heading}</h2>
      {sub && (
        <p className="mt-3 text-sm text-muted-foreground text-center md:text-left max-w-2xl mx-auto md:mx-0">
          {sub}
        </p>
      )}

      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {shown.map((plan) => {
          const price =
            plan.monthPrice === null
              ? plan.priceLabel ?? "—"
              : plan.monthPrice === 0
              ? "0 ₽"
              : `${plan.monthPrice.toLocaleString("ru-RU")} ₽`;

          return (
            <div
              key={plan.id}
              className={cn(
                "relative rounded-2xl border bg-card p-6 flex flex-col",
                plan.highlight ? "border-primary shadow-[0_0_30px_-12px_hsl(var(--primary))]" : "border-border"
              )}
            >
              {plan.badge && (
                <span className={cn(
                    "absolute top-4 right-4 text-[11px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wide",
                    plan.badge.tone === "accent"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground"
                  )}>
                  {plan.badge.text}
                </span>
              )}

              <h3 className="text-xl font-semibold">{plan.name}</h3>
              <div className="mt-3 flex items-baseline gap-1.5">
                <span className="text-3xl font-bold">{price}</span>
                {plan.monthPrice !== null && (
                  <span className="text-xs text-muted-foreground">/мес</span>
                )}
              </div>

              <p className="mt-2 text-sm text-muted-foreground">
                {plan.credits} кредитов{plan.creditsNote ? ` ${plan.creditsNote}` : ""}
              </p>

              <ul className="mt-5 flex flex-col gap-2">
                {plan.features.filter((f) => !f.negative).slice(0, 4).map((f) => (
                  <li key={f.text} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Check size={16} className="text-primary shrink-0 mt-0.5" />
                    <span>{f.text}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto pt-6">
                <Link
                  to="/pricing"
                  className={cn(
                    "w-full h-11 rounded-full flex items-center justify-center font-semibold text-sm transition-opacity hover:opacity-90",
                    plan.highlight
                      ? "gradient-accent text-white"
                      : "border border-border"
                  )}
                >
                  Выбрать план
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default PricingBlock;
