import { ORIGIN } from "@/lib/origin";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import type { SeoPage } from '@/data/seo/types';
import { blockRegistry } from './blocks/registry';
import { Footer } from '@/components/shared/Footer';

export function SeoRenderer({ def }: { def: SeoPage }) {
  const blocks = def.blocks.filter((b) => b.enabled).sort((a, b) => a.order - b.order);

  const hasBreadcrumbs = def.breadcrumbs.length > 0;
  const breadcrumbLd = hasBreadcrumbs
    ? {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: def.breadcrumbs.map((c, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: c.label,
          item: `${ORIGIN}${c.href}`,
        })),
      }
    : null;

  const faqBlock = def.blocks.find((b) => b.type === 'faq' && b.enabled);
  const faqItems = (faqBlock?.data as { items?: { q: string; a: string }[] } | undefined)?.items;
  const faqLd = faqItems && faqItems.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqItems.map((it) => ({
          '@type': 'Question',
          name: it.q,
          acceptedAnswer: { '@type': 'Answer', text: it.a },
        })),
      }
    : null;

  const articleLd =
    def.pageKind === 'guide'
      ? {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: def.seo.title,
          dateModified: def.updatedAt,
          author: { '@type': 'Organization', name: 'ERA2' },
          publisher: { '@type': 'Organization', name: 'ERA2' },
          mainEntityOfPage: def.seo.canonical,
        }
      : null;

  return (
    <>
      {breadcrumbLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
        />
      )}
      {faqLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        />
      )}
      {articleLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
        />
      )}
      {hasBreadcrumbs && (
        <div className="max-w-5xl mx-auto px-4 pt-6">
        <Breadcrumb>
          <BreadcrumbList>
            {def.breadcrumbs.map((crumb, i) => {
              const isLast = i === def.breadcrumbs.length - 1;
              return (
                <span key={crumb.href} className="contents">
                  <BreadcrumbItem>
                    {isLast ? (
                      <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink href={crumb.href}>{crumb.label}</BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {!isLast && <BreadcrumbSeparator />}
                </span>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
        </div>
      )}
      {blocks.map((b, idx) => {
        const C = blockRegistry[b.type];
        const el = <C key={b.order} type={b.type} {...(b.data || {})} />;
        if (
          def.pageKind === 'guide' &&
          b.type === 'hero' &&
          def.updatedAt
        ) {
          const [y, m, d] = def.updatedAt.split('-');
          const formatted = `${d}.${m}.${y}`;
          return (
            <span key={b.order} className="contents">
              {el}
              <div className="max-w-3xl mx-auto px-4 -mt-4 mb-6 text-center text-sm text-muted-foreground">
                Обновлено {formatted}
                {def.readingTime ? ` · ${def.readingTime}` : ''}
              </div>
            </span>
          );
        }
        return el;
      })}
      <Footer />
    </>
  );
}