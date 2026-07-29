import { createFileRoute } from "@tanstack/react-router";
import AuthPage from "@/pages/AuthPage";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
  head: () => ({
    meta: [
      { title: "ERA2.ai — Авторизация" },
      { name: "robots", content: "noindex,follow" },
    ],
  }),
});
