import { ORIGIN } from "@/lib/origin";
import { useEffect, useState } from "react";
import {
  CreditCard,
  X,
  Zap,
  Mail,
  Copy,
  Check,
  Trash2,
  KeyRound,
  Gift,
  Ticket,
  Users,
  HelpCircle,
  Plus,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useCredits } from "@/hooks/useCredits";

type SubStatus = "active" | "cancelled" | "none";
type Card = { brand: string; last4: string; exp: string } | null;
type Tab = "profile" | "history";

const PLAN_NAME = "Про";
const NEXT_BILLING = "22 августа 2026";
const PRICE = "1 490 ₽";
const EMAIL = "roman2024gerts@gmail.com";
const DISPLAY_NAME = "Роман Г.";
const REF_LINK = `${ORIGIN}/?ref=USER123`;

const HISTORY = [
  { date: "22.07.2026", desc: "Списание за подписку «Про»", amount: "−1 490 ₽" },
  { date: "22.07.2026", desc: "Начисление кредитов", amount: "+8 000 кредитов" },
  { date: "10.07.2026", desc: "Докупка кредитов", amount: "+5 000 кредитов" },
  { date: "22.06.2026", desc: "Списание за подписку «Про»", amount: "−1 490 ₽" },
];

function Modal({
  open,
  onClose,
  title,
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-[0_24px_80px_rgba(0,0,0,0.6)]"
      >
        <button
          onClick={onClose}
          className="absolute right-3 top-3 rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
          aria-label="Закрыть"
        >
          <X className="h-4 w-4" />
        </button>
        <h3 className="text-lg font-semibold pr-8">{title}</h3>
        <div className="mt-3 text-sm text-muted-foreground leading-relaxed">{children}</div>
        <div className="mt-6 flex items-center justify-end gap-2">{footer}</div>
      </div>
    </div>
  );
}

const btnSecondary =
  "inline-flex items-center justify-center h-9 px-3.5 rounded-lg text-[13px] font-medium border border-border text-foreground hover:bg-muted/50 transition-colors";
const btnSecondarySm =
  "inline-flex items-center justify-center h-8 px-3 rounded-lg text-[12px] font-medium border border-border text-foreground hover:bg-muted/50 transition-colors";
const btnDestructive =
  "inline-flex items-center justify-center h-9 px-3.5 rounded-lg text-[13px] font-medium bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors";

const card = "rounded-2xl border border-border bg-card p-5";

function CardIcon({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground">
      {children}
    </span>
  );
}

function CardHeader({
  icon,
  title,
  hint,
}: {
  icon: React.ReactNode;
  title: string;
  hint?: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <CardIcon>{icon}</CardIcon>
      <div className="flex items-center gap-1.5">
        <h3 className="text-[15px] font-semibold">{title}</h3>
        {hint && (
          <span title={hint} className="text-muted-foreground/70">
            <HelpCircle className="h-3.5 w-3.5" />
          </span>
        )}
      </div>
    </div>
  );
}

export default function AccountPage() {
  const { userName } = useAuth();
  const { balance, periodGranted } = useCredits();
  const [tab, setTab] = useState<Tab>("profile");
  const [subscription, setSubscription] = useState<SubStatus>("active");
  const [card1, setCard1] = useState<Card>({ brand: "Visa", last4: "4242", exp: "09/28" });
  const [cancelOpen, setCancelOpen] = useState(false);
  const [detachOpen, setDetachOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [promo, setPromo] = useState("");
  const [cert, setCert] = useState("");
  const [copied, setCopied] = useState(false);

  const initial = (userName || DISPLAY_NAME).charAt(0).toUpperCase();

  const handleCopyRef = () => {
    navigator.clipboard.writeText(REF_LINK);
    setCopied(true);
    toast.success("Ссылка скопирована");
    setTimeout(() => setCopied(false), 2000);
  };

  const tabBtn = (active: boolean) =>
    `h-9 px-4 rounded-full text-[13px] font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
      active
        ? "bg-muted text-foreground"
        : "text-muted-foreground hover:text-foreground"
    }`;

  return (
    <div className="min-h-[calc(100vh-var(--header-height,64px))]">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-5">
        {/* 1. Header */}
        <div className="flex items-center gap-4">
          <div className="h-[88px] w-[88px] rounded-full border-2 border-primary p-1 shrink-0">
            <div className="h-full w-full rounded-full bg-card flex items-center justify-center text-2xl font-semibold text-foreground">
              {initial}
            </div>
          </div>
          <div className="min-w-0">
            <h1 className="text-3xl font-semibold tracking-tight truncate">{DISPLAY_NAME}</h1>
            <p className="text-sm text-muted-foreground truncate">{EMAIL}</p>
          </div>
        </div>

        {/* 2. Balance */}
        <div className={card}>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4 min-w-0">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-muted border border-border">
                <Zap className="h-5 w-5 text-primary" />
              </span>
              <div className="min-w-0">
                <div className="text-sm text-muted-foreground">Текущий баланс</div>
                <div className="mt-0.5 text-4xl font-bold tabular-nums leading-none">
                  {balance.toLocaleString("ru-RU")}
                  <span className="ml-2 text-base font-normal text-muted-foreground align-middle">
                    кредитов
                  </span>
                </div>
              </div>
            </div>
            <Link
              to="/pricing"
              hash="credit-packs"
              className="inline-flex items-center gap-1.5 h-10 px-5 rounded-full text-[13px] font-semibold text-primary-foreground bg-primary hover:bg-primary/90 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Пополнить
            </Link>
          </div>
        </div>

        {/* 3. Subscription */}
        <div className={card}>
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h2 className="text-lg font-semibold">Подписка</h2>
              {subscription === "active" && (
                <>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-[15px] font-medium text-foreground">
                      План «{PLAN_NAME}»
                    </span>
                    <span className="inline-flex items-center rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-300">
                      Активна
                    </span>
                  </div>
                  <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                    <div>
                      Следующее списание:{" "}
                      <span className="text-foreground tabular-nums">
                        {NEXT_BILLING} · {PRICE}
                      </span>
                    </div>
                    <div>
                      Кредиты:{" "}
                      <span className="text-foreground tabular-nums">
                        {balance.toLocaleString("ru-RU")} из{" "}
                        {periodGranted.toLocaleString("ru-RU")}
                      </span>
                    </div>
                  </div>
                </>
              )}
              {subscription === "cancelled" && (
                <>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-[15px] font-medium text-foreground">
                      План «{PLAN_NAME}»
                    </span>
                    <span className="inline-flex items-center rounded-full border border-border bg-muted px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                      Активна до {NEXT_BILLING}
                    </span>
                  </div>
                  <div className="mt-2 text-sm text-muted-foreground">
                    Кредиты:{" "}
                    <span className="text-foreground tabular-nums">
                      {balance.toLocaleString("ru-RU")} из{" "}
                      {periodGranted.toLocaleString("ru-RU")}
                    </span>
                  </div>
                </>
              )}
              {subscription === "none" && (
                <div className="mt-2 text-[15px] text-foreground">
                  План «Старт» ·{" "}
                  <span className="text-muted-foreground">Бесплатно</span>
                </div>
              )}
            </div>
            <div className="shrink-0 mt-8">
              {subscription === "active" && (
                <button className={btnSecondary} onClick={() => setCancelOpen(true)}>
                  Отменить подписку
                </button>
              )}
              {subscription === "cancelled" && (
                <button className={btnSecondary} onClick={() => setSubscription("active")}>
                  Возобновить подписку
                </button>
              )}
              {subscription === "none" && (
                <Link to="/pricing" className={btnSecondary}>
                  Выбрать тариф
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* 4. Tabs */}
        <div className="flex items-center gap-1 pt-1">
          <button className={tabBtn(tab === "profile")} onClick={() => setTab("profile")}>
            Профиль
          </button>
          <button className={tabBtn(tab === "history")} onClick={() => setTab("history")}>
            История
          </button>
        </div>

        {/* 5. Profile tab */}
        {tab === "profile" && (
          <div className="grid md:grid-cols-2 gap-4">
            {/* Способ входа */}
            <div className={card}>
              <CardHeader
                icon={<KeyRound className="h-4 w-4" />}
                title="Способ входа"
                hint="Через какой аккаунт вы вошли"
              />
              <div className="mt-3 flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-muted">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                </span>
                <div className="text-[13px] min-w-0">
                  <div className="text-foreground">Email</div>
                  <div className="text-muted-foreground truncate">{EMAIL}</div>
                </div>
              </div>
            </div>

            {/* Способ оплаты */}
            <div className={card}>
              <CardHeader icon={<CreditCard className="h-4 w-4" />} title="Способ оплаты" />
              {card1 ? (
                <div className="mt-3 flex items-center justify-between gap-3 flex-wrap">
                  <div className="text-[13px] tabular-nums">
                    <span className="text-foreground">
                      {card1.brand} •••• {card1.last4}
                    </span>{" "}
                    <span className="text-muted-foreground">· до {card1.exp}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      className={btnSecondarySm}
                      onClick={() => toast("Замена карты недоступна в демо")}
                    >
                      Заменить карту
                    </button>
                    <button className={btnSecondarySm} onClick={() => setDetachOpen(true)}>
                      Отвязать
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-3 flex items-center justify-between gap-3 flex-wrap">
                  <div className="text-[13px] text-muted-foreground">Карта не привязана</div>
                  <button
                    className={btnSecondarySm}
                    onClick={() => setCard1({ brand: "Visa", last4: "4242", exp: "09/28" })}
                  >
                    Привязать карту
                  </button>
                </div>
              )}
            </div>

            {/* Промокод */}
            <div className={card}>
              <CardHeader icon={<Gift className="h-4 w-4" />} title="Промокод" />
              <div className="mt-3 flex items-center gap-2">
                <input
                  value={promo}
                  onChange={(e) => setPromo(e.target.value)}
                  placeholder="Введите промокод"
                  className="flex-1 h-10 px-3 rounded-lg text-[13px] bg-card border border-border focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 placeholder:text-muted-foreground"
                />
                <button
                  className={`${btnSecondary} h-10 shrink-0`}
                  onClick={() => toast("Проверка промокода недоступна в демо")}
                >
                  Применить
                </button>
              </div>
            </div>

            {/* Сертификат */}
            <div className={card}>
              <CardHeader icon={<Ticket className="h-4 w-4" />} title="Сертификат" />
              <div className="mt-3 flex items-center gap-2">
                <input
                  value={cert}
                  onChange={(e) => setCert(e.target.value)}
                  placeholder="Код сертификата"
                  className="flex-1 h-10 px-3 rounded-lg text-[13px] bg-card border border-border focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 placeholder:text-muted-foreground"
                />
                <button
                  className={`${btnSecondary} h-10 shrink-0`}
                  onClick={() => toast("Активация сертификата недоступна в демо")}
                >
                  Активировать
                </button>
              </div>
            </div>

            {/* Реферальная программа */}
            <div className={card}>
              <CardHeader
                icon={<Users className="h-4 w-4" />}
                title="Реферальная программа"
                hint="По 100 кредитов вам и другу за первую подписку"
              />
              <div className="mt-2 text-[13px] text-muted-foreground tabular-nums">
                Приглашено: <span className="text-foreground">0</span> · Начислено:{" "}
                <span className="text-foreground">0</span>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <input
                  readOnly
                  value={REF_LINK}
                  className="flex-1 h-9 px-3 rounded-lg text-[12px] bg-card border border-border text-foreground truncate focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                />
                <button className={btnSecondary} onClick={handleCopyRef}>
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  <span className="ml-1.5">Копировать</span>
                </button>
              </div>
            </div>

            {/* Удаление аккаунта */}
            <div className={card}>
              <CardHeader icon={<Trash2 className="h-4 w-4" />} title="Удаление аккаунта" />
              <div className="mt-3 flex items-center justify-between gap-3 flex-wrap">
                <p className="text-[13px] text-muted-foreground">
                  Все данные будут удалены без возможности восстановления
                </p>
                <button
                  onClick={() => setDeleteOpen(true)}
                  className="text-[13px] font-medium text-destructive hover:underline"
                >
                  Удалить аккаунт
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 6. History tab */}
        {tab === "history" && (
          <div className={card}>
            <div className="overflow-hidden rounded-xl border border-border">
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="bg-card text-muted-foreground">
                    <th className="px-4 py-2.5 text-left font-medium">Дата</th>
                    <th className="px-4 py-2.5 text-left font-medium">Описание</th>
                    <th className="px-4 py-2.5 text-right font-medium">Сумма</th>
                  </tr>
                </thead>
                <tbody>
                  {HISTORY.map((row, i) => (
                    <tr
                      key={i}
                      className="border-t border-border hover:bg-muted/50 transition-colors"
                    >
                      <td className="px-4 py-3 tabular-nums text-muted-foreground">{row.date}</td>
                      <td className="px-4 py-3 text-foreground">{row.desc}</td>
                      <td className="px-4 py-3 text-right tabular-nums text-foreground">
                        {row.amount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <Modal
        open={cancelOpen}
        onClose={() => setCancelOpen(false)}
        title="Отменить подписку?"
        footer={
          <>
            <button className={btnSecondary} onClick={() => setCancelOpen(false)}>
              Оставить подписку
            </button>
            <button
              className={btnDestructive}
              onClick={() => {
                setSubscription("cancelled");
                setCancelOpen(false);
              }}
            >
              Отменить подписку
            </button>
          </>
        }
      >
        Подписка останется активной до {NEXT_BILLING} — до этой даты доступ ко всем моделям
        сохраняется. Кредиты не сгорают и останутся на счёте. Автоматическое продление будет
        отключено.
      </Modal>

      <Modal
        open={detachOpen}
        onClose={() => setDetachOpen(false)}
        title="Отвязать карту?"
        footer={
          <>
            <button className={btnSecondary} onClick={() => setDetachOpen(false)}>
              Отмена
            </button>
            <button
              className={btnDestructive}
              onClick={() => {
                setCard1(null);
                if (subscription === "active") setSubscription("cancelled");
                setDetachOpen(false);
              }}
            >
              Отвязать
            </button>
          </>
        }
      >
        Карта {card1 ? `•••• ${card1.last4}` : ""} будет удалена. Автопродление подписки
        отключится — доступ сохранится до конца оплаченного периода.
      </Modal>

      <Modal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Удалить аккаунт?"
        footer={
          <>
            <button className={btnSecondary} onClick={() => setDeleteOpen(false)}>
              Отмена
            </button>
            <button
              className={btnDestructive}
              onClick={() => {
                setDeleteOpen(false);
                toast.success("Заявка на удаление отправлена (демо)");
              }}
            >
              Удалить аккаунт
            </button>
          </>
        }
      >
        Это действие необратимо. Все генерации, история и остаток кредитов будут удалены.
      </Modal>
    </div>
  );
}
