import { createContext, useContext, useMemo, useState, useCallback, type ReactNode } from "react";

export type CreditsState = {
  balance: number;
  periodGranted: number;
  periodSpent: number;
  isUnlimited: boolean;
  isLoading: boolean;
  addCredits: (n: number) => void;
};

// TODO: источник истины — бэкенд, значения приходят после каждой генерации
const INITIAL = {
  balance: 6240,
  periodGranted: 8000,
  periodSpent: 1760,
  isUnlimited: false,
  isLoading: false,
};

const CreditsContext = createContext<CreditsState>({
  ...INITIAL,
  addCredits: () => {},
});

export function CreditsProvider({ children }: { children: ReactNode }) {
  const [balance, setBalance] = useState(INITIAL.balance);
  // TODO: на бэкенде начисление подтверждает сервер, клиентское значение
  // перезаписывается ответом
  const addCredits = useCallback((n: number) => {
    setBalance((b) => b + n);
  }, []);
  const value = useMemo<CreditsState>(
    () => ({
      balance,
      periodGranted: INITIAL.periodGranted,
      periodSpent: INITIAL.periodSpent,
      isUnlimited: INITIAL.isUnlimited,
      isLoading: INITIAL.isLoading,
      addCredits,
    }),
    [balance, addCredits],
  );
  return <CreditsContext.Provider value={value}>{children}</CreditsContext.Provider>;
}

export function useCredits() {
  return useContext(CreditsContext);
}

export function getCreditsMetrics(s: CreditsState) {
  const hasPeriod = !s.isUnlimited && s.periodGranted > 0;
  const usedPct = hasPeriod
    ? Math.max(0, Math.min(100, (s.periodSpent / s.periodGranted) * 100))
    : 0;
  const leftPct = hasPeriod ? 100 - usedPct : 0;
  return { hasPeriod, usedPct, leftPct };
}

export function ringColorClass(leftPct: number) {
  if (leftPct > 25) return "stroke-primary";
  if (leftPct > 10) return "stroke-amber-500";
  return "stroke-red-500";
}

export function barColorClass(leftPct: number) {
  if (leftPct > 25) return "bg-primary";
  if (leftPct > 10) return "bg-amber-500";
  return "bg-red-500";
}