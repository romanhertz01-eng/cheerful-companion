import { createFileRoute } from "@tanstack/react-router";
import { RequireAuth } from "@/components/auth/RequireAuth";
import VideoPage from "@/pages/VideoPage";

export const Route = createFileRoute("/video")({
  component: () => <RequireAuth><VideoPage /></RequireAuth>,
  head: () => ({
    meta: [
      { title: "ERA2 — Видео" },
      { name: "robots", content: "noindex,follow" },
    ],
  }),
});
