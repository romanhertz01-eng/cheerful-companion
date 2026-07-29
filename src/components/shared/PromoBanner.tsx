import { useState } from "react";
import { X, Zap } from "lucide-react";
import { Link, useLocation } from "@tanstack/react-router";
import { toolPages } from "@/data/toolPages";

export function PromoBanner() {
  const [dismissed, setDismissed] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("era2_promo_banner_dismissed") === "true";
  });
  const { pathname } = useLocation();

  if (dismissed) return null;

  const handleDismiss = () => {
    localStorage.setItem("era2_promo_banner_dismissed", "true");
    setDismissed(true);
  };

  const isVideoContext = (() => {
    if (pathname === "/ai/video") return true;
    const m = pathname.match(/^\/tools\/([^/]+)/);
    if (!m) return false;
    const tool = toolPages.find((t) => t.slug === m[1]);
    return tool?.tool?.resultType === "video";
  })();

  return (
    <div
      className="relative w-full flex items-center justify-center gap-2 sm:gap-3 px-10 sm:px-4 py-2 text-xs sm:text-sm text-white"
      style={{
        background: "linear-gradient(90deg, #E85420, #ff7a3d)",
      }}
    >
      <Zap size={14} className="shrink-0" />
      {isVideoContext ? (
        <span className="font-semibold text-center">
          Начните бесплатно с изображений и текста — видео доступно с тарифа Базовый
        </span>
      ) : (
        <>
          <span className="font-semibold whitespace-nowrap">150 кредитов бесплатно</span>
          <span className="opacity-70 hidden md:inline">·</span>
          <span className="opacity-90 hidden md:inline">
            Попробуйте 90+ нейросетей без VPN
          </span>
        </>
      )}
      <Link
        to={isVideoContext ? "/pricing" : "/auth"}
        className="ml-1 sm:ml-2 inline-flex items-center h-7 px-3 rounded-full bg-white/15 hover:bg-white/25 transition-colors text-xs font-semibold backdrop-blur-sm whitespace-nowrap"
      >
        <span className="hidden sm:inline">{isVideoContext ? "Смотреть тарифы" : "Начать бесплатно"}</span>
        <span className="sm:hidden">{isVideoContext ? "Тарифы" : "Начать"}</span>
      </Link>
      <button
        onClick={handleDismiss}
        aria-label="Закрыть"
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-white/15 transition-colors"
      >
        <X size={14} />
      </button>
    </div>
  );
}
