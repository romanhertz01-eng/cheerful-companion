import type { SeoPage } from './types';

export function resolveRobots(page: SeoPage): string {
  if (page.status !== 'published') return 'noindex, follow';
  return page.seo.robots ?? 'index, follow';
}