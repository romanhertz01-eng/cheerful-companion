import { createFileRoute } from "@tanstack/react-router";
import { RequireAuth } from "@/components/auth/RequireAuth";
import CheckoutPage from "@/pages/CheckoutPage";

export const Route = createFileRoute("/checkout")({
  component: () => (
    <RequireAuth>
      <CheckoutPage />
    </RequireAuth>
  ),
  validateSearch: (search: Record<string, unknown>) => ({
    plan: typeof search.plan === "string" ? search.plan : undefined,
    period: typeof search.period === "string" ? search.period : undefined,
  }),
  head: () => ({
    meta: [
      { title: "ERA2 — Оформление подписки" },
      { name: "description", content: "Оформление подписки на ERA2.ai: выбор периода и способа оплаты." },
      { name: "robots", content: "noindex,follow" },
      { property: "og:title", content: "ERA2 — Оформление подписки" },
      { property: "og:description", content: "Оформление подписки на ERA2.ai: выбор периода и способа оплаты." },
    ],
  }),
});