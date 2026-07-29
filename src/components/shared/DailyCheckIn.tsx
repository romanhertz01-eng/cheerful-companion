import { useState, useEffect, useRef } from "react";
import { useLocation } from "@tanstack/react-router";
import { X, Gift, Check, Flame } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCopyToast } from "@/components/shared/CopyToast";
import { useCredits } from "@/hooks/useCredits";
import { useAuth } from "@/contexts/AuthContext";

export const DAYS = [
  { day: 1, credits: 5 },
  { day: 2, credits: 5 },
  { day: 3, credits: 8 },
  { day: 4, credits: 8 },
  { day: 5, credits: 12 },
  { day: 6, credits: 12 },
  { day: 7, credits: 50, isBonus: true },
];

function plurDays(n: number): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return "день";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return "дня";
  return "дней";
}

// TODO: показывать только залогиненным
// TODO: начисление на бэкенде, стрик считать по времени сервера
export function useDailyCheckIn() {
  const [streak, setStreak] = useState(1);
  const [claimedToday, setClaimedToday] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const today = new Date().toDateString();
    const lastSeen = localStorage.getItem("era2_checkin_seen");
    const claimed = localStorage.getItem("era2_checkin_claimed");
    const savedStreak = parseInt(localStorage.getItem("era2_checkin_streak") || "0");
    if (lastSeen === today) {
      setStreak(Math.max(1, savedStreak));
      setClaimedToday(claimed === today);
      return;
    }
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    const newStreak = lastSeen === yesterday ? Math.min(savedStreak + 1, 7) : 1;
    // Визит засчитывается фактом захода, без клика «Забрать»
    localStorage.setItem("era2_checkin_seen", today);
    localStorage.setItem("era2_checkin_streak", String(newStreak));
    setStreak(newStreak);
    setClaimedToday(claimed === today);
  }, []);

  const claim = () => {
    localStorage.setItem("era2_checkin_claimed", new Date().toDateString());
    setClaimedToday(true);
  };

  return { streak, claimedToday, claim, current: DAYS[streak - 1] };
}

export function DailyCheckIn() {
  const { streak, claimedToday, claim, current } = useDailyCheckIn();
  const [open, setOpen] = useState(false);
  const onClose = () => setOpen(false);
  const toast = useCopyToast();
  const { addCredits } = useCredits();
  const location = useLocation();
  const { isAuthed } = useAuth();
  const shownThisSession = useRef(false);

  // Умный показ: везде кроме /tools и /checkout, задержка 3с,
  // не в первый визит, отмена при активности, один раз в день.
  // TODO: авторизация — показывать только залогиненным
  // TODO: серверный стрик — считать по времени сервера
  useEffect(() => {
    if (typeof window === "undefined") return;
    // Только для залогиненных — гостям бонус начислять некому.
    if (!isAuthed) return;
    // Разрешённые рабочие разделы. Публичные SEO-посадочные (/, /ai/*, /tools/*,
    // /pricing, /studios, /auth) и потоки покупки/аккаунта — исключены.
    const ALLOWED = ["/text", "/design", "/video", "/audio", "/agents", "/history", "/toolkit", "/create"];
    if (!ALLOWED.some((p) => location.pathname === p || location.pathname.startsWith(p + "/"))) return;
    if (shownThisSession.current) return;

    const debug = localStorage.getItem("era2_debug_checkin") === "1";
    if (!debug && claimedToday) return;

    // Первый визит — отложить, а не пропустить: показать, только если
    // человек задержался на сайте > 60с с самого первого захода.
    if (!debug) {
      const firstSeenRaw = localStorage.getItem("era2_first_seen");
      if (!firstSeenRaw) {
        localStorage.setItem("era2_first_seen", String(Date.now()));
        return;
      }
      const firstSeen = parseInt(firstSeenRaw, 10);
      if (!Number.isFinite(firstSeen) || Date.now() - firstSeen < 60_000) return;
    }

    let cancelled = false;
    const delay = debug ? 500 : 1800;
    const timer = window.setTimeout(() => {
      if (cancelled) return;
      shownThisSession.current = true;
      setOpen(true);
      cleanup();
    }, delay);

    const onActivity = () => {
      cancelled = true;
      window.clearTimeout(timer);
      cleanup();
    };

    const cleanup = () => {
      window.removeEventListener("click", onActivity);
      window.removeEventListener("keydown", onActivity);
    };

    window.addEventListener("click", onActivity);
    window.addEventListener("keydown", onActivity);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      cleanup();
    };
  }, [location.pathname, claimedToday, isAuthed]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  const handleCheckin = () => {
    claim();
    addCredits(current.credits);
    toast("", `+${current.credits} кредитов зачислены`);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 22, stiffness: 280 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-[400px] max-w-[90vw] rounded-[20px] p-6 text-center"
            style={{
              background: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
            }}
          >
            <button
              onClick={onClose}
              aria-label="Закрыть"
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X size={18} />
            </button>

            <div className="mb-3 flex justify-center">
              <Flame size={36} style={{ color: "hsl(var(--primary))" }} />
            </div>

            <h2 className="text-xl font-bold text-foreground mb-1">
              Заходите 7 дней подряд
            </h2>
            <p className="text-sm text-muted-foreground mb-5">
              и получите до 100 кредитов бесплатно
            </p>

            <div
              className="rounded-[12px] p-3 mb-5 flex items-center justify-center gap-2"
              style={{
                background: "rgba(232,84,32,0.1)",
                border: "1px solid rgba(232,84,32,0.2)",
              }}
            >
              <span className="text-sm text-foreground">
                Ваш стрик: <span className="font-semibold">{streak} {plurDays(streak)}</span> из 7
              </span>
              <span
                className="text-sm font-bold font-mono"
                style={{ color: "hsl(var(--primary))" }}
              >
                +{current.credits} кредитов
              </span>
            </div>

            <div className="grid grid-cols-7 gap-1.5 mb-3">
              {DAYS.map((d) => {
                const done = d.day < streak;
                const active = d.day === streak;
                return (
                  <div key={d.day} className="flex flex-col items-center gap-1">
                    <div
                      className="w-full aspect-square rounded-[10px] flex items-center justify-center text-[11px] font-semibold transition-colors"
                      style={{
                        background: done
                          ? "hsl(var(--primary))"
                          : active
                            ? "rgba(232,84,32,0.15)"
                            : "hsl(var(--secondary))",
                        border: active
                          ? "1px solid hsl(var(--primary))"
                          : "1px solid hsl(var(--border))",
                        color: done
                          ? "white"
                          : active
                            ? "hsl(var(--primary))"
                            : "hsl(var(--muted-foreground))",
                      }}
                    >
                      {done ? (
                        <Check size={14} />
                      ) : d.isBonus ? (
                        <Gift size={14} />
                      ) : (
                        `+${d.credits}`
                      )}
                    </div>
                    <span className="text-[10px] text-muted-foreground">
                      День {d.day}
                    </span>
                  </div>
                );
              })}
            </div>

            {claimedToday ? (
              <div className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-[14px] text-sm font-medium text-muted-foreground border border-white/10 bg-white/[0.04]">
                <Check size={16} />
                Забрано сегодня
              </div>
            ) : (
              <button
                onClick={handleCheckin}
                className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-[14px] text-sm font-semibold text-white transition-all hover:opacity-95"
                style={{
                  background: "linear-gradient(135deg, hsl(var(--primary)), #ff7a3d)",
                  boxShadow: "0 8px 22px -8px rgba(232,84,32,0.55)",
                }}
              >
                Забрать +{current.credits} кредитов
              </button>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
