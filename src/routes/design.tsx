import { createFileRoute } from "@tanstack/react-router";
import { RequireAuth } from "@/components/auth/RequireAuth";
import DesignPage from "@/pages/DesignPage";

export const Route = createFileRoute("/design")({
  component: () => <RequireAuth><DesignPage /></RequireAuth>,
  head: () => ({
    meta: [
      { title: "ERA2 — Изображения" },
      { name: "robots", content: "noindex,follow" },
    ],
  }),
});
