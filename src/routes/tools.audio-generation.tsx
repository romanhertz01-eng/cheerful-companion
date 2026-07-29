import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/tools/audio-generation")({
  beforeLoad: () => {
    throw redirect({ to: "/ai/audio", statusCode: 301 });
  },
  component: () => null,
});
