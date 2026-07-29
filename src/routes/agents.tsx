import { createFileRoute } from "@tanstack/react-router";
import { RequireAuth } from "@/components/auth/RequireAuth";
import AgentsPage from "@/pages/AgentsPage";

export const Route = createFileRoute("/agents")({
  component: () => <RequireAuth><AgentsPage /></RequireAuth>,
  head: () => ({
    meta: [
      { title: "ERA2 — Агенты" },
      { name: "robots", content: "noindex,follow" },
    ],
  }),
});
