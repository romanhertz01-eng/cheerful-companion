import { ORIGIN } from "@/lib/origin";
import { createFileRoute, notFound } from "@tanstack/react-router";
import ToolPage from "@/pages/ToolPage";
import { getToolPageData } from "@/data/toolPages";

export const Route = createFileRoute("/tools/$slug")({
  loader: ({ params }) => {
    const data = getToolPageData(params.slug);
    if (!data) throw notFound();
    return { data };
  },
  component: ToolPage,
  head: ({ params }) => {
    const data = getToolPageData(params.slug);
    if (!data) return {};
    const title = `${data.heroTitle} онлайн — нейросеть | ERA2.ai`;
    const canonical = `${ORIGIN}/tools/${params.slug}`;
    const robots = data.status === 'draft' ? 'noindex, follow' : 'index, follow';
    return {
      meta: [
        { title },
        { name: "description", content: data.heroDescription },
        { name: "robots", content: robots },
        { property: "og:title", content: title },
        { property: "og:description", content: data.heroDescription },
        { property: "og:url", content: canonical },
        { property: "og:image", content: `${ORIGIN}/og-image.png` },
      ],
      links: [{ rel: "canonical", href: canonical }],
    };
  },
});
