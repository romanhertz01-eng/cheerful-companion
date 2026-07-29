import { createFileRoute } from "@tanstack/react-router";
import { RequireAuth } from "@/components/auth/RequireAuth";
import TextPage from "@/pages/TextPage";

export const Route = createFileRoute("/text")({
  component: () => <RequireAuth><TextPage /></RequireAuth>,
  head: () => ({
    meta: [
      { title: "ERA2 — Текст" },
      { name: "robots", content: "noindex,follow" },
    ],
  }),
});
