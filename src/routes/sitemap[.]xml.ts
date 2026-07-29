import { ORIGIN } from "@/lib/origin";
import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { toolPages } from "@/data/toolPages";
import { guides } from "@/data/seo/guides";
import { homePage } from "@/data/seo/pages/home";
import { aiImagePage } from "@/data/seo/pages/aiImage";
import { aiVideoPage } from "@/data/seo/pages/aiVideo";
import { aiAudioPage } from "@/data/seo/pages/aiAudio";
import { aiTextPage } from "@/data/seo/pages/aiText";
import { aiAgentsPage } from "@/data/seo/pages/aiAgents";
import { pricingPage } from "@/data/seo/pages/pricing";
import { studiosPage } from "@/data/seo/pages/studios";

const BASE_URL = ORIGIN;
const PROD_HOSTS = new Set(["era2.ai", "www.era2.ai"]);

type Entry = { path: string; lastmod?: string };

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const host = (request.headers.get("host") ?? "").toLowerCase();
        if (!PROD_HOSTS.has(host)) {
          return new Response(null, { status: 404 });
        }
        const entries: Entry[] = [];

        entries.push({ path: "/", lastmod: homePage.updatedAt });
        if (pricingPage.status === "published") {
          entries.push({ path: "/pricing", lastmod: pricingPage.updatedAt });
        }
        if (studiosPage.status === "published") {
          entries.push({ path: "/studios", lastmod: studiosPage.updatedAt });
        }
        const publishedGuides = Object.values(guides).filter((g) => g.status === "published");
        if (publishedGuides.length > 0) {
          const dates = publishedGuides
            .map((g) => g.updatedAt)
            .filter((d): d is string => typeof d === "string" && d.length > 0);
          if (dates.length > 0) {
            entries.push({ path: "/guides", lastmod: dates.sort().pop() });
          } else {
            entries.push({ path: "/guides" });
          }
        }

        for (const page of [aiImagePage, aiVideoPage, aiAudioPage, aiTextPage, aiAgentsPage]) {
          if (page.status === "published") {
            entries.push({ path: page.slug, lastmod: page.updatedAt });
          }
        }

        for (const tool of toolPages) {
          if (tool.status === "draft") continue;
          entries.push({ path: `/tools/${tool.slug}`, lastmod: tool.updatedAt });
        }

        for (const [slug, guide] of Object.entries(guides)) {
          if (guide.status !== "published") continue;
          entries.push({ path: `/guides/${slug}`, lastmod: guide.updatedAt });
        }

        const urls = entries.map((e) =>
          [
            `  <url>`,
            `    <loc>${BASE_URL}${e.path}</loc>`,
            e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
            `  </url>`,
          ]
            .filter(Boolean)
            .join("\n"),
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
            "Vary": "Host",
          },
        });
      },
    },
  },
});
