import { createFileRoute } from "@tanstack/react-router";
import { RequireAuth } from "@/components/auth/RequireAuth";
import AccountPage from "@/pages/AccountPage";

export const Route = createFileRoute("/account")({
  component: () => (
    <RequireAuth>
      <AccountPage />
    </RequireAuth>
  ),
  head: () => ({
    meta: [
      { title: "ERA2 — Аккаунт" },
      { name: "description", content: "Управление подпиской, картой и историей платежей ERA2.ai" },
      { name: "robots", content: "noindex,follow" },
      { property: "og:title", content: "ERA2 — Аккаунт" },
      { property: "og:description", content: "Управление подпиской, картой и историей платежей ERA2.ai" },
    ],
  }),
});