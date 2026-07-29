import { Link, useNavigate } from "@tanstack/react-router";
import { Clock, LogOut, Moon, Plus, Settings, Sun, User, Zap } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/era/StatusBadge";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useCredits, getCreditsMetrics, ringColorClass, barColorClass } from "@/hooks/useCredits";

const PLAN: "PRO" | "FREE" = "FREE";
const EMAIL = "roman2024gerts@gmail.com";
const DISPLAY_NAME = "Роман Г.";

export function UserDropdown() {
  const { logout, userName } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const credits = useCredits();
  const { hasPeriod, leftPct } = getCreditsMetrics(credits);
  const initial = (userName || DISPLAY_NAME).charAt(0).toUpperCase();
  const leftPctRounded = Math.round(leftPct);

  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = hasPeriod
    ? circumference - (leftPct / 100) * circumference
    : 0;
  const ringCls = ringColorClass(leftPct);
  const barCls = barColorClass(leftPct);

  const ariaLabel = credits.isUnlimited
    ? "Аккаунт. Безлимитный тариф"
    : hasPeriod
      ? `Аккаунт. Осталось ${leftPctRounded}% кредитов периода`
      : "Аккаунт";

  const handleLogout = () => {
    logout();
    navigate({ to: "/" });
  };

  const itemCls =
    "flex items-center gap-2.5 h-9 px-3 rounded-md hover:bg-secondary text-sm cursor-pointer transition-colors text-foreground";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          aria-label={ariaLabel}
          className="relative inline-flex w-9 h-9 rounded-full items-center justify-center hover:scale-105 transition-transform cursor-pointer"
        >
          <svg
            viewBox="0 0 44 44"
            className="absolute inset-0 -rotate-90 pointer-events-none"
            aria-hidden="true"
          >
            <circle cx="22" cy="22" r="20" fill="none" strokeWidth="2" className="stroke-border" />
            {credits.isUnlimited ? (
              <circle cx="22" cy="22" r="20" fill="none" strokeWidth="2" className="stroke-primary" />
            ) : hasPeriod && !credits.isLoading ? (
              <circle
                cx="22"
                cy="22"
                r="20"
                fill="none"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                className={ringCls}
                style={{ transition: "stroke-dashoffset 300ms ease, stroke 200ms ease" }}
              />
            ) : null}
          </svg>
          <span className="w-[30px] h-[30px] rounded-full bg-card flex items-center justify-center font-mono text-sm font-semibold text-foreground">
            {initial}
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-[280px] p-2 bg-card border border-border rounded-2xl shadow-xl"
      >
        {/* Profile header */}
        <div className="px-3 py-2.5 flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="font-semibold text-sm text-foreground truncate">{DISPLAY_NAME}</div>
            <div className="text-xs text-muted-foreground truncate">{EMAIL}</div>
          </div>
          <StatusBadge variant={PLAN === "PRO" ? "pro" : "new"}>{PLAN}</StatusBadge>
        </div>

        <div className="my-2 h-px bg-border" />

        {/* Balance */}
        <div className="px-3 py-2">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
              <Zap className="h-3.5 w-3.5 text-primary" />
              Кредиты
            </span>
            <span className="font-mono tabular-nums text-sm text-foreground">
              {credits.balance.toLocaleString("ru-RU")}
              {!credits.isUnlimited && credits.periodGranted > 0 && (
                <> / {credits.periodGranted.toLocaleString("ru-RU")}</>
              )}
            </span>
          </div>
          {credits.isUnlimited ? (
            <div className="text-xs text-muted-foreground mt-2">Безлимитный тариф</div>
          ) : hasPeriod ? (
            <>
              <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden mt-2">
                <div
                  className={`h-full ${barCls} rounded-full transition-all`}
                  style={{ width: `${leftPct}%` }}
                />
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                Осталось {leftPctRounded}% от месячной квоты
              </div>
              {credits.balance > credits.periodGranted && (
                <div className="text-xs text-muted-foreground">
                  включая перенесённые и докупленные
                </div>
              )}
            </>
          ) : (
            <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden mt-2" />
          )}
        </div>

        <div className="px-2 pb-2 pt-1">
          <Button asChild variant="default" size="sm" className="w-full">
            <Link to="/pricing">
              <Plus className="h-3.5 w-3.5" />
              Пополнить
            </Link>
          </Button>
        </div>

        <div className="my-1 h-px bg-border" />

        <div className="space-y-0.5">
          <Link to="/account" className={itemCls}>
            <User className="h-3.5 w-3.5 text-muted-foreground" />
            Аккаунт
          </Link>
          <Link to="/history" className={itemCls}>
            <Clock className="h-3.5 w-3.5 text-muted-foreground" />
            История
          </Link>
          <button className={itemCls}>
            <Settings className="h-3.5 w-3.5 text-muted-foreground" />
            Настройки
          </button>
          <button className={itemCls} onClick={toggleTheme}>
            {theme === "dark" ? (
              <Sun className="h-3.5 w-3.5 text-muted-foreground" />
            ) : (
              <Moon className="h-3.5 w-3.5 text-muted-foreground" />
            )}
            Тема: {theme === "dark" ? "Тёмная" : "Светлая"}
          </button>
          <button
            className="flex items-center gap-2.5 h-9 px-3 rounded-md hover:bg-secondary text-sm cursor-pointer transition-colors text-destructive w-full"
            onClick={handleLogout}
          >
            <LogOut className="h-3.5 w-3.5" />
            Выйти
          </button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
