import { createFileRoute } from "@tanstack/react-router";
import { RequireAuth } from "@/components/auth/RequireAuth";
import HistoryPage from "@/pages/HistoryPage";

export const Route = createFileRoute("/history")({
  component: () => <RequireAuth><HistoryPage /></RequireAuth>,
  head: () => ({
    meta: [
      { title: "ERA2 — История" },
      { name: "robots", content: "noindex,follow" },
    ],
  }),
});
