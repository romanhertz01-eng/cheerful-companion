import type { SeoPage } from '../types';
import { ORIGIN } from '@/lib/origin';

export const pricingPage: Pick<SeoPage, 'status' | 'updatedAt' | 'seo'> = {
  status: 'published',
  updatedAt: '2026-07-28',
  seo: {
    title: 'Тарифы на нейросети — от 790 ₽ в месяц | ERA2.ai',
    description:
      'Единая подписка на 90+ нейросетей: ChatGPT, Kling, Sora и другие. Тарифы от 790 ₽/мес, оплата российскими картами и СБП, 150 кредитов бесплатно при регистрации.',
    canonical: `${ORIGIN}/pricing`,
  },
};