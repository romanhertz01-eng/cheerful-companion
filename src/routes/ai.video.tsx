import { ORIGIN } from "@/lib/origin";
import { createFileRoute } from '@tanstack/react-router';
import { SeoRenderer } from '@/components/seo/SeoPage';
import { resolveRobots } from '@/data/seo/robots';
import { aiVideoPage } from '@/data/seo/pages/aiVideo';

export const Route = createFileRoute('/ai/video')({
  component: () => <SeoRenderer def={aiVideoPage} />,
  head: () => ({
    meta: [
      { title: aiVideoPage.seo.title },
      { name: 'description', content: aiVideoPage.seo.description },
      { name: 'robots', content: resolveRobots(aiVideoPage) },
      { property: 'og:title', content: aiVideoPage.seo.title },
      { property: 'og:description', content: aiVideoPage.seo.description },
      { property: 'og:url', content: aiVideoPage.seo.canonical },
      { property: 'og:image', content: `${ORIGIN}/og-image.png` },
    ],
    links: [{ rel: 'canonical', href: aiVideoPage.seo.canonical }],
  }),
});