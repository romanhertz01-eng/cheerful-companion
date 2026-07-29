import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/tools/text-generation")({
  beforeLoad: () => {
    throw redirect({ to: "/ai/text", statusCode: 301 });
  },
  component: () => null,
});
