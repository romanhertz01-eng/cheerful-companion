import { createFileRoute } from "@tanstack/react-router";
import { RequireAuth } from "@/components/auth/RequireAuth";
import ToolkitPage from "@/pages/ToolkitPage";

export const Route = createFileRoute("/toolkit")({
  component: () => <RequireAuth><ToolkitPage /></RequireAuth>,
  head: () => ({
    meta: [
      { title: "ERA2 — Все нейросети" },
      { name: "robots", content: "noindex,follow" },
    ],
  }),
});
