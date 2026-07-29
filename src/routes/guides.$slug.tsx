import { ORIGIN } from "@/lib/origin";
import { createFileRoute, notFound } from '@tanstack/react-router';
import { SeoRenderer } from '@/components/seo/SeoPage';
import { resolveRobots } from '@/data/seo/robots';
import { guides } from '@/data/seo/guides';

export const Route = createFileRoute('/guides/$slug')({
  loader: ({ params }) => {
    const guide = guides[params.slug];
    if (!guide) throw notFound();
    return { guide };
  },
  component: GuidePage,
  head: ({ params }) => {
    const guide = guides[params.slug];
    if (!guide) return {};
    const canonical = `${ORIGIN}/guides/${params.slug}`;
    return {
      meta: [
        { title: guide.seo.title },
        { name: 'description', content: guide.seo.description },
        { name: 'robots', content: resolveRobots(guide) },
        { property: 'og:title', content: guide.seo.ogTitle ?? guide.seo.title },
        { property: 'og:description', content: guide.seo.ogDescription ?? guide.seo.description },
        { property: 'og:url', content: canonical },
        { property: 'og:type', content: 'article' },
      ],
      links: [{ rel: 'canonical', href: canonical }],
    };
  },
});

function GuidePage() {
  const { guide } = Route.useLoaderData();
  return <SeoRenderer def={guide} />;
}