import { ORIGIN } from "@/lib/origin";
import { createFileRoute } from '@tanstack/react-router';
import { SeoRenderer } from '@/components/seo/SeoPage';
import { resolveRobots } from '@/data/seo/robots';
import { aiImagePage } from '@/data/seo/pages/aiImage';

export const Route = createFileRoute('/ai/image')({
  component: () => <SeoRenderer def={aiImagePage} />,
  head: () => ({
    meta: [
      { title: aiImagePage.seo.title },
      { name: 'description', content: aiImagePage.seo.description },
      { name: 'robots', content: resolveRobots(aiImagePage) },
      { property: 'og:title', content: aiImagePage.seo.title },
      { property: 'og:description', content: aiImagePage.seo.description },
      { property: 'og:url', content: aiImagePage.seo.canonical },
      { property: 'og:image', content: `${ORIGIN}/og-image.png` },
    ],
    links: [{ rel: 'canonical', href: aiImagePage.seo.canonical }],
  }),
});