import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

const PROD_HOSTS = new Set(["era2.ai", "www.era2.ai"]);

const PROD_ROBOTS = `User-agent: *
Allow: /

User-agent: Yandex
Allow: /
Clean-param: next&plan&period&model&utm_source&utm_medium&utm_campaign&utm_content&utm_term

User-agent: MJ12bot
Disallow: /

Sitemap: https://era2.ai/sitemap.xml
`;

const BLOCK_ROBOTS = `User-agent: *
Disallow: /
`;

export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const host = (request.headers.get("host") ?? "").toLowerCase();
        const body = PROD_HOSTS.has(host) ? PROD_ROBOTS : BLOCK_ROBOTS;
        return new Response(body, {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "no-store",
            "Vary": "Host",
          },
        });
      },
    },
  },
});
