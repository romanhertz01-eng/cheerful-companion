import type { SeoPage } from '../types';
import { ORIGIN } from '@/lib/origin';

export const studiosPage: Pick<SeoPage, 'status' | 'updatedAt' | 'seo'> = {
  status: 'published',
  updatedAt: '2026-07-28',
  seo: {
    title: 'Все нейросети — каталог из 90+ ИИ-моделей | ERA2.ai',
    description:
      'Полный каталог нейросетей ЭРА2: генерация текста, изображений, видео и озвучки. Выбирайте модель под задачу — всё в одной подписке, без VPN.',
    canonical: `${ORIGIN}/studios`,
  },
};