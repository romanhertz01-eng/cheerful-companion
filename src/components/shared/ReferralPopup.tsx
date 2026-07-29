import { ORIGIN } from "@/lib/origin";
import { useState } from "react";
import { X, Gift, Copy, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function ReferralPopup({ onClose }: { onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  const refLink = `${ORIGIN}/ref/USER123`;

  const handleCopy = () => {
    navigator.clipboard.writeText(refLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 12 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-[420px] max-w-[90vw] rounded-[20px] p-6 text-center shadow-2xl"
          style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
          role="dialog"
          aria-label="Пригласить друга"
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Закрыть"
            className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          >
            <X size={16} strokeWidth={2} />
          </button>

          <div
            className="w-14 h-14 mx-auto rounded-full flex items-center justify-center mb-4 text-foreground"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid hsl(var(--border))" }}
          >
            <Gift size={26} strokeWidth={1.8} />
          </div>

          <h3 className="text-[20px] font-semibold text-foreground">Пригласить друга</h3>
          <p className="text-[13px] text-muted-foreground mt-1.5">
            Вы оба получите по 100 кредитов
          </p>

          <div
            className="mt-5 rounded-[12px] p-4 text-left"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid hsl(var(--border))" }}
          >
            <div className="text-[13px] font-semibold text-foreground">
              Когда друг оформит первую подписку
            </div>
            <div className="text-[13px] text-muted-foreground mt-1">
              по 100 кредитов вам и другу
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              Без ограничений на количество приглашений
            </div>
          </div>

          <div
            className="flex items-center gap-2 mt-5 rounded-[10px] p-1 pl-3"
            style={{ background: "hsl(var(--secondary))", border: "1px solid hsl(var(--border))" }}
          >
            <span className="flex-1 text-left text-[12px] font-mono text-foreground truncate">
              {refLink}
            </span>
            <button
              type="button"
              onClick={handleCopy}
              aria-label="Скопировать ссылку"
              className="w-9 h-9 rounded-[8px] flex items-center justify-center text-white transition-transform hover:scale-105"
              style={{ background: "linear-gradient(135deg, hsl(var(--primary)), #ff7a3d)" }}
            >
              {copied ? <Check size={14} strokeWidth={2.2} /> : <Copy size={14} strokeWidth={2} />}
            </button>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className="mt-5 w-full h-11 rounded-[12px] text-[14px] font-medium text-white transition-transform hover:scale-[1.01]"
            style={{ background: "linear-gradient(135deg, hsl(var(--primary)), #ff7a3d)" }}
          >
            {copied ? "Ссылка скопирована" : "Скопировать ссылку"}
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
