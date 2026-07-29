import { Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { plans } from "@/data/plans";

interface PricingStripBlockProps {
  heading: string;
  sub?: string;
  planIds?: string[];
}

export function PricingStripBlock({ heading, sub, planIds }: PricingStripBlockProps) {
  const items = planIds
    ? planIds.map((id) => plans.find((p) => p.id === id)).filter((p): p is (typeof plans)[number] => !!p)
    : plans.filter((p) => (p.monthPrice ?? 0) > 0).slice(0, 4);

  return (
    <section className="px-4" style={{ padding: "60px 16px" }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-[32px] font-bold tracking-tight">{heading}</h2>
          {sub && <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">{sub}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((plan) => (
            <div
              key={plan.id}
              className="rounded-2xl border border-border bg-card/60 p-5 flex flex-col shadow-sm"
            >
              <div className="flex items-baseline justify-between mb-3">
                <h3 className="text-lg font-semibold">{plan.name}</h3>
                {plan.badge && (
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    {plan.badge.text}
                  </span>
                )}
              </div>

              <div className="mb-1">
                <span className="text-3xl font-bold tabular-nums">
                  {plan.monthPrice !== null ? `${plan.monthPrice.toLocaleString("ru-RU")} ₽` : plan.priceLabel}
                </span>
                {plan.monthPrice !== null && (
                  <span className="text-sm text-muted-foreground"> /мес</span>
                )}
              </div>
              <div className="text-xs text-muted-foreground mb-4">
                {plan.credits} кредитов{plan.creditsNote ? ` ${plan.creditsNote}` : ""}
              </div>

              <ul className="space-y-2 mb-5 flex-1">
                {plan.features.slice(0, 3).map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                    <Check size={14} className="mt-0.5 flex-shrink-0 text-primary" />
                    <span>{f.text}</span>
                  </li>
                ))}
              </ul>

              <Link
                to="/pricing"
                className="w-full text-center gradient-accent text-white rounded-xl py-2.5 font-semibold text-sm hover:opacity-95 transition"
              >
                Выбрать
              </Link>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link to="/pricing" className="text-sm text-primary hover:underline font-medium">
            Сравнить все тарифы →
          </Link>
        </div>
      </div>
    </section>
  );
}