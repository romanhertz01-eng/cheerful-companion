import { createFileRoute } from "@tanstack/react-router";
import { RequireAuth } from "@/components/auth/RequireAuth";
import AudioPage from "@/pages/AudioPage";

export const Route = createFileRoute("/audio")({
  component: () => <RequireAuth><AudioPage /></RequireAuth>,
  head: () => ({
    meta: [
      { title: "ERA2 — Аудио" },
      { name: "robots", content: "noindex,follow" },
    ],
  }),
});
