import { ORIGIN } from "@/lib/origin";
import { createFileRoute } from '@tanstack/react-router';
import { SeoRenderer } from '@/components/seo/SeoPage';
import { resolveRobots } from '@/data/seo/robots';
import { aiAgentsPage } from '@/data/seo/pages/aiAgents';

export const Route = createFileRoute('/ai/agents')({
  component: () => <SeoRenderer def={aiAgentsPage} />,
  head: () => ({
    meta: [
      { title: aiAgentsPage.seo.title },
      { name: 'description', content: aiAgentsPage.seo.description },
      { name: 'robots', content: resolveRobots(aiAgentsPage) },
      { property: 'og:title', content: aiAgentsPage.seo.title },
      { property: 'og:description', content: aiAgentsPage.seo.description },
      { property: 'og:url', content: aiAgentsPage.seo.canonical },
      { property: 'og:image', content: `${ORIGIN}/og-image.png` },
    ],
    links: [{ rel: 'canonical', href: aiAgentsPage.seo.canonical }],
  }),
});