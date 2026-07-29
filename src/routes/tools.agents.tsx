import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/tools/agents")({
  beforeLoad: () => {
    throw redirect({ to: "/ai/agents", statusCode: 301 });
  },
  component: () => null,
});
