import { ORIGIN } from "@/lib/origin";
import { createFileRoute } from '@tanstack/react-router';
import { SeoRenderer } from '@/components/seo/SeoPage';
import { resolveRobots } from '@/data/seo/robots';
import { aiAudioPage } from '@/data/seo/pages/aiAudio';

export const Route = createFileRoute('/ai/audio')({
  component: () => <SeoRenderer def={aiAudioPage} />,
  head: () => ({
    meta: [
      { title: aiAudioPage.seo.title },
      { name: 'description', content: aiAudioPage.seo.description },
      { name: 'robots', content: resolveRobots(aiAudioPage) },
      { property: 'og:title', content: aiAudioPage.seo.title },
      { property: 'og:description', content: aiAudioPage.seo.description },
      { property: 'og:url', content: aiAudioPage.seo.canonical },
      { property: 'og:image', content: `${ORIGIN}/og-image.png` },
    ],
    links: [{ rel: 'canonical', href: aiAudioPage.seo.canonical }],
  }),
});