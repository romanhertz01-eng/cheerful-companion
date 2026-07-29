import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { Check, ChevronDown, Users, Copy, Infinity as InfinityIcon, X, ArrowRight } from "lucide-react";
import { useCopyToast } from "@/components/shared/CopyToast";
import { cn } from "@/lib/utils";
import { Footer } from "@/components/shared/Footer";
import { motion } from "framer-motion";
import { plans, creditPacks, type Plan } from "@/data/plans";
import { PlanComparisonModal } from "@/components/pricing/PlanComparisonModal";

const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } };
const stagger = { show: { transition: { staggerChildren: 0.08 } } };

type Period = "year" | "month";
type Audience = "personal" | "team";

const fmtRub = (n: number) => `${n.toLocaleString("ru-RU")} ₽`;

const faqItems = [
  {
    q: "Что такое кредиты?",
    a: "Каждая генерация стоит фиксированное число кредитов. Текст: от 3 кредитов, изображения: 20–380, видео: от 25, аудио: 5–400. Кредиты не сгорают и переносятся, тратятся при активной подписке.",
  },
  {
    q: "Можно ли перейти на другой план?",
    a: "Да, в любой момент. Остаток кредитов сохраняется, перерасчёт — со следующего периода.",
  },
  {
    q: "Что будет когда кредиты закончатся?",
    a: "Можно докупить пакет кредитов или дождаться обновления в начале месяца.",
  },
  {
    q: "Есть ли API?",
    a: "Да, на планах Про, Макс, Ультра и Enterprise. Документация в личном кабинете.",
  },
];

const PricingPage = () => {
  const [period, setPeriod] = useState<Period>("month");
  const [audience, setAudience] = useState<Audience>("personal");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [compareOpen, setCompareOpen] = useState(false);
  const copy = useCopyToast();

  useEffect(() => { document.title = "ERA2 — Тарифы"; }, []);

  const visiblePlans = plans.filter((p) => (p.audience ?? "personal") === audience);

  const renderPlanCard = (plan: Plan) => {
    const isEnterprise = !!plan.enterprise;
    const isHighlight = !!plan.highlight;
    const showYear = period === "year" && plan.monthPrice !== null && plan.yearPricePerMonth !== null;
    const priceValue = plan.priceLabel
      ? plan.priceLabel
      : showYear
      ? fmtRub(plan.yearPricePerMonth as number)
      : plan.monthPrice === 0
      ? "Бесплатно"
      : fmtRub(plan.monthPrice as number);
    const showPerMonth = !plan.priceLabel && plan.monthPrice !== 0;
    const yearSaving =
      plan.monthPrice && plan.yearPricePerMonth
        ? (plan.monthPrice - plan.yearPricePerMonth) * 12
        : 0;
    const billingLine = plan.priceLabel
      ? "Индивидуальные условия · договор"
      : plan.monthPrice === 0
      ? "Без карты · навсегда бесплатно"
      : period === "year" && yearSaving > 0
      ? `При годовой оплате · экономия ${fmtRub(yearSaving)} в год`
      : "Отмена в любой момент";

    const features = plan.features.slice(0, 5);

    return (
      <motion.div
        key={plan.id}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "relative rounded-2xl px-6 py-6 text-left flex flex-col bg-card border",
          isHighlight ? "border-primary" : "border-border"
        )}
      >
        {plan.badge && (
          <div className="absolute -top-3 left-6">
            <span
              className={cn(
                "inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide",
                plan.badge.tone === "free" && "bg-muted text-foreground",
                plan.badge.tone === "accent" && "bg-primary text-primary-foreground",
                plan.badge.tone === "muted" && "bg-muted text-foreground"
              )}
            >
              {plan.badge.text}
            </span>
          </div>
        )}

        <h3 className="text-xl font-semibold mb-1">{plan.name}</h3>

        <div className="flex items-baseline gap-2">
          <div className="text-[36px] leading-none tabular-nums font-bold">
            {priceValue}
          </div>
          {showPerMonth && (
            <span className="text-sm text-muted-foreground">₽/мес</span>
          )}
        </div>
        <div className="text-xs text-muted-foreground mt-1.5">{billingLine}</div>

        {isEnterprise ? (
          <a
            href="mailto:sales@era2.ai?subject=Enterprise%20запрос"
            className={cn(
              "mt-4 w-full py-3 rounded-xl text-sm font-semibold transition-colors text-center",
              "border border-border text-foreground hover:bg-muted/50"
            )}
          >
            {plan.cta}
          </a>
        ) : plan.monthPrice === 0 ? (
          <Link
            to="/auth"
            className={cn(
              "mt-4 w-full py-3 rounded-xl text-sm font-semibold transition-colors text-center",
              "border border-border text-foreground hover:bg-muted/50"
            )}
          >
            {plan.cta}
          </Link>
        ) : (
          <Link
            to="/checkout"
            search={{ plan: plan.id, period: period === "year" ? "12m" : "1m" }}
            className={cn(
              "mt-4 w-full py-3 rounded-xl text-sm font-semibold transition-colors text-center",
              isHighlight
                ? "bg-primary text-primary-foreground hover:opacity-90"
                : "border border-border text-foreground hover:bg-muted/50"
            )}
          >
            {plan.cta}
          </Link>
        )}

        <div className="border-t border-border my-5" />

        <div className="text-[13px] text-muted-foreground mb-3">
          <span className="text-foreground font-semibold">{plan.credits}</span>{" "}
          {isEnterprise ? "" : plan.id === "start" ? "кредитов · разово" : "кредитов в месяц"}
        </div>

        <ul className="flex flex-col gap-2.5 flex-1">
          {features.map((f, idx) => {
            const isSummary = idx === 0 && /^Всё из/i.test(f.text);
            const Icon = f.negative ? X : f.unlimited ? InfinityIcon : Check;
            return (
              <li
                key={f.text}
                className="flex items-start gap-2 text-[13px] leading-[1.4]"
                style={{ wordBreak: "normal", overflowWrap: "normal" }}
              >
                {isSummary ? (
                  <span className="h-4 w-4 shrink-0" />
                ) : (
                  <Icon
                    className={cn(
                      "h-4 w-4 shrink-0 mt-[2px]",
                      f.unlimited ? "text-foreground" : "text-muted-foreground"
                    )}
                  />
                )}
                <span className={cn(f.negative ? "text-muted-foreground" : isSummary ? "text-foreground font-medium" : "text-foreground/90")}>
                  {f.text}
                </span>
              </li>
            );
          })}
        </ul>
      </motion.div>
    );
  };

  return (
    <div className="min-w-0">
      {/* Hero */}
      <section className="relative">
        <motion.div className="relative max-w-4xl mx-auto text-center px-4 pt-12 pb-8" initial="hidden" animate="show" variants={stagger}>
          <motion.p variants={fadeUp} className="text-xs uppercase tracking-[2px] text-muted-foreground font-semibold mb-4">Тарифы</motion.p>
          <motion.h1 variants={fadeUp} className="text-[32px] md:text-[44px] font-bold mb-3">Простые тарифы для каждого</motion.h1>
          <motion.p variants={fadeUp} className="text-muted-foreground mb-6">Одна подписка — доступ ко всем 90+ нейросетям. Начните бесплатно.</motion.p>

          {/* Period toggle + compare */}
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <div className="inline-flex rounded-full border border-border p-1">
              <button
                onClick={() => setPeriod("month")}
                className={cn(
                  "px-6 py-2 rounded-full text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-0",
                  period === "month" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                Месяц
              </button>
              <button
                onClick={() => setPeriod("year")}
                className={cn(
                  "px-6 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-0",
                  period === "year" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                Год
                <span className="tabular-nums text-[10px] bg-muted px-1.5 py-0.5 rounded-full font-bold">−15%</span>
              </button>
            </div>
            <button
              onClick={() => setCompareOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold border border-border hover:bg-muted/50 transition-colors"
            >
              Сравнить все тарифы
              <ArrowRight className="h-4 w-4" />
            </button>
          </motion.div>
        </motion.div>
      </section>

      {/* Audience tabs */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="flex justify-center mb-6">
          <div className="inline-flex rounded-full border border-border p-1">
            {(
              [
                { id: "personal", label: "Для себя" },
                { id: "team", label: "Для профи и команд" },
              ] as { id: Audience; label: string }[]
            ).map((t) => (
              <button
                key={t.id}
                onClick={() => setAudience(t.id)}
                className={cn(
                  "px-5 py-2 rounded-full text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-0",
                  audience === t.id ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Plan cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pb-6">
          {visiblePlans.map(renderPlanCard)}
        </div>
      </section>

      {/* Credit packs */}
      <section id="credit-packs" className="max-w-6xl mx-auto px-4 pb-12 scroll-mt-24">
        <div className="text-center mb-6">
          <h2 className="text-xl md:text-2xl font-bold mb-2">Докупка кредитов</h2>
          <p className="text-sm text-muted-foreground">
            Докупка доступна при активной подписке. Кредиты не сгорают и переносятся.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {creditPacks.map((p) => (
            <div
              key={p.id}
              className="bg-card border border-border rounded-xl p-4 flex items-center justify-between gap-3"
            >
              <div className="flex flex-col">
                <div className="text-[15px] font-medium text-foreground tabular-nums">
                  {p.credits.toLocaleString("ru-RU")} кредитов
                </div>
                <div className="text-[13px] text-muted-foreground mt-1 tabular-nums">
                  {fmtRub(p.price)}
                </div>
              </div>
              <button className="px-3.5 py-[7px] rounded-lg text-xs whitespace-nowrap border border-border text-foreground hover:bg-muted/50 transition-colors">
                Купить
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Trust / payment line */}
      <section className="max-w-5xl mx-auto px-4 pb-6">
        <p className="text-center text-xs md:text-sm text-muted-foreground">
          Оплата через ЮKassa · Карты РФ · СБП · Рассрочка · Возврат в течение 3 дней · Отмена подписки в любой момент
        </p>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 py-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Частые вопросы</h2>
        <div className="divide-y divide-border border-y border-border">
          {faqItems.map((item, i) => (
            <div key={i}>
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between py-4 text-left font-medium text-foreground hover:text-foreground/80 transition-colors"
              >
                <span>{item.q}</span>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 shrink-0 ml-4 text-muted-foreground transition-transform duration-200",
                    openFaq === i && "rotate-180"
                  )}
                />
              </button>
              <div
                className={cn(
                  "overflow-hidden transition-all duration-200",
                  openFaq === i ? "max-h-40 pb-4" : "max-h-0"
                )}
              >
                <p className="text-sm text-muted-foreground leading-relaxed">{item.a}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Реферальный баннер */}
      <section className="max-w-4xl mx-auto px-4 pb-12">
        <div className="relative overflow-hidden rounded-[24px] p-8 md:p-12 text-center bg-card border border-border">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-4 bg-muted">
            <Users className="h-5 w-5 text-foreground" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-3 text-foreground">
            Приведи друга — получи 100 кредитов
          </h2>
          <p className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto mb-6 leading-relaxed">
            Когда друг оформит первую подписку по вашей ссылке, вы оба получите по 100 кредитов. Без ограничений на количество приглашений.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-5">
            <div className="px-4 py-2.5 rounded-full text-sm text-foreground bg-card border border-border">
              era2.ai/ref/user123
            </div>
            <button
              onClick={() => copy("https://era2.ai/ref/user123", "Реферальная ссылка скопирована")}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold border border-border text-foreground hover:bg-muted/50 transition-colors"
            >
              <Copy className="h-4 w-4" />
              Копировать
            </button>
          </div>
          <p className="text-xs text-muted-foreground tabular-nums">
            Уже пригласили: 0 друзей · Заработано: 0 кредитов
          </p>
        </div>
      </section>

      <Footer />
      <PlanComparisonModal open={compareOpen} onClose={() => setCompareOpen(false)} />
    </div>
  );
};

export default PricingPage;
