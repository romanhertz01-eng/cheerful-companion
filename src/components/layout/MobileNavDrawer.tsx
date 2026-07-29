import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { X, ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { TABS } from "./NavMegaMenu";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function MobileNavDrawer({ open, onClose }: Props) {
  const { isAuthed } = useAuth();
  const [expanded, setExpanded] = useState<string | null>(TABS[0]?.key ?? null);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-50 bg-background flex flex-col lg:hidden"
        >
          <div className="flex items-center justify-between px-4 h-16 border-b border-border shrink-0">
            <span className="font-semibold text-base">Меню</span>
            <button
              type="button"
              onClick={onClose}
              aria-label="Закрыть меню"
              className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center hover:bg-card transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-3">
            {TABS.map((tab) => {
              const isOpen = expanded === tab.key;
              const tabHref = isAuthed ? tab.route : tab.publicRoute;
              return (
                <div key={tab.key} className="border-b border-border">
                  <button
                    type="button"
                    onClick={() => setExpanded(isOpen ? null : tab.key)}
                    className="w-full flex items-center justify-between py-4 text-left"
                  >
                    <span className="text-base font-semibold">{tab.label}</span>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 text-muted-foreground transition-transform",
                        isOpen && "rotate-180"
                      )}
                    />
                  </button>
                  {isOpen && (
                    <div className="pb-4 flex flex-col gap-1">
                      {tab.features?.map((f) => {
                        const href = isAuthed ? tab.route : (f.publicHref ?? tab.publicRoute);
                        return (
                          <Link
                            key={f.title}
                            to={href}
                            onClick={onClose}
                            className="flex items-center gap-3 px-2 py-2.5 rounded-lg hover:bg-secondary transition-colors"
                          >
                            <span
                              className="inline-flex items-center justify-center shrink-0"
                              style={{ width: 32, height: 32, borderRadius: 8, background: "var(--c-bg-2)", color: "var(--c-fg-dim)" }}
                            >
                              <f.icon size={16} strokeWidth={1.75} />
                            </span>
                            <span className="flex flex-col min-w-0">
                              <span className="text-sm font-medium leading-tight truncate">{f.title}</span>
                              <span className="text-xs text-muted-foreground truncate">{f.desc}</span>
                            </span>
                          </Link>
                        );
                      })}
                      {tab.models && tab.models.length > 0 && (
                        <>
                          <div className="mt-3 mb-1 px-2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                            {tab.modelsTitle || "Модели"}
                          </div>
                          {tab.models.map((m) => {
                            const href = isAuthed ? tab.route : (m.publicHref ?? tab.publicRoute);
                            return (
                              <Link
                                key={m.name}
                                to={href}
                                onClick={onClose}
                                className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-secondary transition-colors"
                              >
                                <span className="text-sm font-medium">{m.name}</span>
                                <span className="text-xs text-muted-foreground truncate">{m.desc}</span>
                              </Link>
                            );
                          })}
                        </>
                      )}
                      <Link
                        to={tabHref}
                        onClick={onClose}
                        className="mt-2 mx-2 text-xs font-medium text-primary"
                      >
                        Открыть раздел «{tab.label}» →
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {!isAuthed && (
            <div className="shrink-0 border-t border-border px-4 py-4 flex items-center gap-2 bg-background">
              <Link
                to="/auth"
                onClick={onClose}
                className="flex-1 inline-flex items-center justify-center h-11 rounded-full text-sm font-medium border"
                style={{ borderColor: "var(--c-line)", color: "var(--c-fg)" }}
              >
                Войти
              </Link>
              <Link
                to="/auth"
                onClick={onClose}
                className="flex-1 inline-flex items-center justify-center h-11 rounded-full text-sm font-medium text-white"
                style={{ background: "var(--c-accent)" }}
              >
                Начать
              </Link>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}