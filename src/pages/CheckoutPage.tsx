import { ORIGIN } from "@/lib/origin";
import { useEffect, useMemo, useState } from "react";
import { Link, useSearch, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Gift, X } from "lucide-react";
import { SiVisa, SiMastercard, SiTelegram } from "@icons-pack/react-simple-icons";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { plans } from "@/data/plans";

type PeriodId = "1m" | "3m" | "6m" | "12m";

const PERIODS: { id: PeriodId; months: number; label: string; discount: number; badge?: string }[] = [
  { id: "1m", months: 1, label: "1 месяц", discount: 0 },
  { id: "3m", months: 3, label: "3 месяца", discount: 0.05, badge: "−5%" },
  { id: "6m", months: 6, label: "6 месяцев", discount: 0.10, badge: "−10%" },
  { id: "12m", months: 12, label: "1 год", discount: 0.15, badge: "−15%" },
];

const EMAIL = "romanhertz01@gmail.com";
const LEGAL = 'ООО «ЭРА2»';

const fmtRub = (n: number) => `${n.toLocaleString("ru-RU")} ₽`;

function addMonths(date: Date, months: number) {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

function fmtDate(d: Date) {
  const months = [
    "января","февраля","марта","апреля","мая","июня",
    "июля","августа","сентября","октября","ноября","декабря"
  ];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

const btnSecondary =
  "inline-flex items-center justify-center h-9 px-3.5 rounded-lg text-[13px] font-medium border border-border text-foreground hover:bg-muted/50 transition-colors";

export default function CheckoutPage() {
  const search = useSearch({ strict: false }) as { plan?: string; period?: string };
  const navigate = useNavigate();
  const planId = search?.plan ?? "pro";
  const plan = plans.find((p) => p.id === planId && !p.enterprise) ?? plans.find((p) => p.id === "pro")!;

  const [period, setPeriod] = useState<PeriodId>(
    (["1m", "3m", "6m", "12m"].includes(search?.period ?? "") ? (search!.period as PeriodId) : "1m")
  );
  const [agreed, setAgreed] = useState(false);
  const [promo, setPromo] = useState("");
  const [isGift, setIsGift] = useState(false);
  const [giftModal, setGiftModal] = useState<null | { link: string }>(null);

  const monthPrice = plan.monthPrice ?? 0;

  const rows = useMemo(
    () =>
      PERIODS.map((p) => ({
        ...p,
        total: Math.round(monthPrice * p.months * (1 - p.discount)),
        base: monthPrice * p.months,
      })),
    [monthPrice]
  );

  const selected = rows.find((r) => r.id === period)!;
  const nextBilling = fmtDate(addMonths(new Date(), selected.months));
  const periodWord = selected.months === 1 ? "месяц" : selected.months === 12 ? "год" : `${selected.months} мес.`;

  const handlePay = () => {
    if (!agreed) return;
    if (isGift) {
      const code = Math.random().toString(36).slice(2, 6).toUpperCase();
      setGiftModal({ link: `${ORIGIN}/gift/DEMO-${code}` });
      return;
    }
    toast("Переход к оплате", { description: `${plan.name} · ${selected.label} · ${fmtRub(selected.total)}` });
  };

  useEffect(() => {
    if (!giftModal) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setGiftModal(null);
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [giftModal]);

  const copyLink = async () => {
    if (!giftModal) return;
    try {
      await navigator.clipboard.writeText(giftModal.link);
      toast("Ссылка скопирована");
    } catch {
      toast("Не удалось скопировать");
    }
  };

  return (
    <div className="min-h-[calc(100vh-var(--header-height,64px))]">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <p className="text-xs uppercase tracking-[2px] text-muted-foreground font-semibold">Чекаут</p>
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight mt-1">Оформление подписки</h1>
          </div>
          <button
            onClick={() => navigate({ to: "/pricing" })}
            className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Сменить тариф
          </button>
        </div>

        <div className="grid md:grid-cols-[1fr_1.05fr] gap-5 items-start">
          {/* LEFT: Order summary */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="text-[13px] text-muted-foreground">Ваш план</div>
            <div className="text-3xl md:text-[32px] font-semibold mt-1">{plan.name}</div>

            <div className="mt-5 space-y-2.5 text-[13px]">
              <Row
                label={isGift ? "Получатель" : "Аккаунт"}
                value={isGift ? "По ссылке-подарку" : EMAIL}
              />
              <Row label="Кредитов в месяц" value={`${plan.credits}`} />
              {selected.discount > 0 && (
                <Row label="Скидка" value={`${Math.round(selected.discount * 100)} %`} />
              )}
              <Row label="Период" value={selected.label} />
            </div>

            <div className="my-5 h-px bg-border" />

            <div className="text-[13px] text-muted-foreground">К оплате</div>
            <div className="flex items-baseline gap-3 mt-1">
              <div className="text-3xl md:text-[34px] font-semibold tabular-nums">
                {fmtRub(selected.total)}
              </div>
              {selected.discount > 0 && (
                <div className="text-sm text-muted-foreground line-through tabular-nums">
                  {fmtRub(selected.base)}
                </div>
              )}
            </div>
            <div className="text-xs text-muted-foreground mt-2 tabular-nums">
              {isGift
                ? `Подписка на ${selected.label.toLowerCase()} · активируется по ссылке · без автопродления`
                : `Следующее списание: ${nextBilling} · ${fmtRub(selected.total)}`}
            </div>

            <div className="mt-5">
              <div className="text-[13px] text-muted-foreground mb-2">Промокод</div>
              <div className="flex items-center gap-2">
                <input
                  value={promo}
                  onChange={(e) => setPromo(e.target.value)}
                  placeholder="Введите промокод"
                  className="flex-1 h-9 px-3 rounded-lg text-[13px] bg-card border border-border focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 placeholder:text-muted-foreground"
                />
                <button
                  className={btnSecondary}
                  onClick={() => toast("Промокод не найден (демо)")}
                >
                  Применить
                </button>
              </div>
            </div>

            <div className="mt-5 pt-5 border-t border-border">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-card border border-border">
                    <Gift className="h-4 w-4 text-muted-foreground" />
                  </span>
                  <div className="min-w-0">
                    <div className="text-[13px] text-foreground">Подарить подписку другу</div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      После оплаты вы получите ссылку — отправьте её другу в любой мессенджер
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={isGift}
                  onClick={() => setIsGift((v) => !v)}
                  className={cn(
                    "relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors",
                    isGift ? "bg-foreground/25" : "bg-muted"
                  )}
                >
                  <span
                    className={cn(
                      "absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform",
                      isGift ? "translate-x-[22px]" : "translate-x-0.5"
                    )}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT: Period + payment */}
          <div className="space-y-5">
            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="text-[15px] font-semibold">Период оплаты</h2>
              <div className="mt-3 space-y-2">
                {rows.map((r) => {
                  const active = period === r.id;
                  return (
                    <label
                      key={r.id}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-colors",
                        active
                          ? "border-border bg-muted"
                          : "border-border hover:bg-muted/50"
                      )}
                    >
                      <span
                        className={cn(
                          "h-4 w-4 rounded-full border flex items-center justify-center shrink-0",
                          active ? "border-foreground" : "border-border"
                        )}
                      >
                        {active && <span className="h-2 w-2 rounded-full bg-foreground" />}
                      </span>
                      <span className="flex-1 text-[13px] text-foreground">{r.label}</span>
                      {r.badge && (
                        <span className="inline-flex items-center rounded-full border border-border bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                          {r.badge}
                        </span>
                      )}
                      <span className="text-[13px] tabular-nums text-foreground">
                        {fmtRub(r.total)}
                      </span>
                      <input
                        type="radio"
                        name="period"
                        className="sr-only"
                        checked={active}
                        onChange={() => setPeriod(r.id)}
                      />
                    </label>
                  );
                })}
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Чем длиннее период — тем ниже цена месяца. Списание раз в выбранный период.
              </p>

              <label className="mt-5 flex items-start gap-3 cursor-pointer text-[12px] leading-[1.5] text-muted-foreground">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 h-4 w-4 shrink-0 rounded border-border bg-card accent-primary"
                />
                {/* TODO: вернуть ссылки при появлении /legal/* */}
                <span>
                  Я принимаю условия оферты и политики конфиденциальности
                  {isGift
                    ? `. Это разовый платёж ${fmtRub(selected.total)} за подарочную подписку «${plan.name}» на ${selected.label.toLowerCase()}. Автопродление не подключается.`
                    : ` и разрешаю ${LEGAL} списывать ${fmtRub(selected.total)} раз в ${periodWord} с привязанной карты в счёт подписки «${plan.name}». Отменить автопродление можно в любой момент в разделе Аккаунт.`}
                </span>
              </label>

              <button
                onClick={handlePay}
                disabled={!agreed}
                className={cn(
                  "mt-5 w-full h-11 rounded-xl text-[14px] font-semibold text-white bg-gradient-to-r from-[#E85420] to-[#ff7a3d] transition-opacity",
                  !agreed ? "opacity-50 cursor-not-allowed" : "hover:opacity-95"
                )}
              >
                {isGift ? `Подарить за ${fmtRub(selected.total)}` : `Оплатить ${fmtRub(selected.total)}`}
              </button>

              <div className="mt-4 flex items-center justify-center gap-2 flex-wrap">
                <span className="bg-white rounded-md px-2.5 py-1.5 flex items-center">
                  <SiVisa color="#1A1F71" size={20} />
                </span>
                <span className="bg-white rounded-md px-2.5 py-1.5 flex items-center">
                  <SiMastercard color="#EB001B" size={20} />
                </span>
                <span className="bg-white rounded-md px-2.5 py-1.5 flex items-center font-semibold text-xs" style={{ color: "#0F754E" }}>
                  МИР
                </span>
                <span className="bg-white rounded-md px-2.5 py-1.5 flex items-center font-semibold text-xs" style={{ color: "#1D1D1B" }}>
                  СБП
                </span>
                <span className="bg-white rounded-md px-2.5 py-1.5 flex items-center font-semibold text-xs" style={{ color: "#21A038" }}>
                  SberPay
                </span>
                <span className="bg-white rounded-md px-2.5 py-1.5 flex items-center font-semibold text-xs" style={{ color: "#8B3FFC" }}>
                  ЮMoney
                </span>
              </div>
              <div className="mt-3 text-center text-xs text-muted-foreground">
                Способ оплаты выберете на защищённой странице ЮKassa · Возврат в течение 3 дней
              </div>
            </div>

            <div className="text-center">
              <Link to="/pricing" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                ← Вернуться к тарифам
              </Link>
            </div>
          </div>
        </div>
      </div>

      {giftModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
          onClick={() => setGiftModal(null)}
        >
          <div
            className="relative w-full max-w-md max-h-[90vh] overflow-auto rounded-2xl border border-border bg-card p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setGiftModal(null)}
              className="absolute right-3 top-3 h-8 w-8 inline-flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              aria-label="Закрыть"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="h-12 w-12 rounded-full bg-card flex items-center justify-center text-foreground">
              <Gift className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-[18px] font-semibold">Подарок готов</h3>
            <p className="mt-1.5 text-[13px] text-muted-foreground leading-[1.55]">
              Подписка «{plan.name}» на {selected.label.toLowerCase()}. Отправьте ссылку другу — он активирует её сам. Ссылка действует 90 дней.
            </p>

            <div className="mt-4">
              <input
                readOnly
                value={giftModal.link}
                onFocus={(e) => e.currentTarget.select()}
                className="w-full h-10 px-3 rounded-lg text-[13px] font-mono tabular-nums bg-card border border-border text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              />
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <button onClick={copyLink} className={btnSecondary + " w-full"}>
                Скопировать
              </button>
              <a
                href={`https://t.me/share/url?url=${encodeURIComponent(giftModal.link)}&text=${encodeURIComponent("Дарю тебе подписку ЭРА2")}`}
                target="_blank"
                rel="noopener noreferrer"
                className={btnSecondary + " w-full gap-2"}
              >
                <SiTelegram size={16} color="currentColor" />
                Отправить в Telegram
              </a>
            </div>

            <p className="mt-4 text-[11px] text-muted-foreground text-center">
              Ссылку также отправили вам на почту
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-foreground tabular-nums truncate">{value}</span>
    </div>
  );
}