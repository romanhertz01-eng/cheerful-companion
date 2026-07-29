import { ORIGIN } from "@/lib/origin";
import type { SeoPage } from '../types';

export const aiVideoPage: SeoPage = {
  id: 'ai-video',
  slug: '/ai/video',
  pageKind: 'category',
  status: 'published',
  updatedAt: '2026-07-26',
  uniqueValue:
    'Обзор всех видео-нейросетей ЭРА2 в одном месте: какие задачи решают, какие модели доступны, как выбрать.',
  searchIntent: 'commercial',
  seo: {
    title: 'Нейросети для видео — генерация и обработка видео ИИ | ERA2.ai',
    description:
      'Создавайте и обрабатывайте видео нейросетями: текст в видео, оживить фото, ИИ-аватар, апскейл. Kling, Veo, Runway, Sora и другие — единая подписка, оплата в рублях.',
    canonical: `${ORIGIN}/ai/video`,
    robots: 'index,follow',
  },
  breadcrumbs: [
    { label: 'Главная', href: '/' },
    { label: 'Видео', href: '/ai/video' },
  ],
  blocks: [
    {
      type: 'hero',
      enabled: true,
      order: 1,
      data: {
        h1: 'Нейросети для видео',
        subtitle:
          'Создавайте видео из текста и фото, оживляйте снимки, улучшайте качество — Kling, Veo, Sora, Seedance и другие модели в единой подписке, оплата в рублях.',
        primaryCta: 'Создать видео',
        ctaHref: '/video',
      },
    },
    {
      type: 'toolGrid',
      enabled: true,
      order: 2,
      data: {
        heading: 'Видео-инструменты',
        items: [
          { title: 'Оживить фото', desc: 'Фото → живое видео', href: '/tools/ozhivit-foto', icon: '🎬' },
          { title: 'Создать видео', desc: 'Видео из текста', href: '/tools/video-generation', icon: '✨' },
          { title: 'ИИ-аватар', desc: 'Говорящий персонаж', href: '/tools/talking-avatar', icon: '🧑' },
        ],
      },
    },
    {
      type: 'modelGrid',
      enabled: true,
      order: 3,
      data: {
        heading: 'Модели для видео',
        items: [
          { name: 'Kling 3.0', badge: 'NEW', desc: 'Целостные раскадровки с ультрадетализированной динамикой', image: '/models/05.jpg', href: '/tools/kling' },
          { name: 'Veo 3', desc: 'Кинематографичное видео со звуком', image: '/models/02.jpg', href: '/tools/veo' },
          { name: 'Sora 2', desc: 'Сложные сцены и длинные планы', image: '/models/03.jpg', href: '/tools/sora' },
          { name: 'Seedance 2.0', desc: 'Танцы и динамичные движения', image: '/models/04.jpg', href: '/tools/seedance' },
          { name: 'Hailuo', desc: 'Быстрая генерация коротких роликов', image: '/models/06.jpg', href: '/tools/hailuo' },
          { name: 'Wan 2.7', desc: 'Стабильные персонажи и сцены', image: '/models/01.jpg' },
        ],
      },
    },
    {
      type: 'scenarioChips',
      enabled: true,
      order: 4,
      data: {
        heading: 'Что можно сделать',
        items: [
          { title: 'Оживить фото', description: 'Превратите статичный снимок в короткое видео' },
          { title: 'Видео из текста', description: 'Сгенерируйте ролик по текстовому описанию' },
          { title: 'ИИ-аватар', description: 'Говорящий аватар из фото и озвучки' },
          { title: 'Видео для Ozon и WB', description: 'Готовые ролики для карточек товара' },
          { title: 'Синхрон губ', description: 'Синхронизация артикуляции с озвучкой' },
        ],
      },
    },
    {
      type: 'gallery',
      enabled: true,
      order: 5,
      data: {
        title: 'Примеры работ нейросетей',
        showMeta: false,
        items: [
          { image: '/community/01.jpg' },
          { image: '/community/02.jpg' },
          { image: '/community/03.jpg' },
          { image: '/community/04.jpg' },
          { image: '/community/05.jpg' },
          { image: '/community/06.jpg' },
          { image: '/community/07.jpg' },
          { image: '/community/08.jpg' },
        ],
      },
    },
    { type: 'howItWorks', enabled: true, order: 6 },
    {
      type: 'editorial',
      enabled: true,
      order: 7,
      data: {
        heading: 'Видео-нейросети без VPN и зарубежных карт',
        text: 'ЭРА2 объединяет лучшие модели генерации видео в одном сервисе: Kling, Veo, Sora, Seedance, Hailuo и другие. Не нужно регистрироваться в десяти сервисах и платить в валюте — одна подписка в рублях открывает все инструменты: от оживления фото до готовых роликов для маркетплейсов.',
      },
    },
    {
      type: 'faq',
      enabled: true,
      order: 8,
      data: {
        items: [
          { q: 'Какие нейросети для видео доступны в ЭРА2?', a: 'Kling, Veo, Sora, Seedance, Hailuo, Wan и другие — в одной подписке, без VPN и зарубежных карт.' },
          { q: 'Можно ли создать видео из фотографии?', a: 'Да — инструмент "Оживить фото" превращает снимок в короткое живое видео за минуту.' },
          { q: 'Сколько стоит генерация видео?', a: 'Списываются кредиты по тарифу; стоимость зависит от модели, длительности и разрешения. Начать можно бесплатно.' },
          { q: 'На каком языке писать промпт?', a: 'На русском — модели корректно понимают русскоязычные описания.' },
          { q: 'Где хранятся мои видео?', a: 'Все результаты сохраняются в вашей истории генераций и доступны для скачивания.' },
        ],
      },
    },
    {
      type: 'relatedLinks',
      enabled: true,
      order: 9,
      data: {
        heading: 'Смотрите также',
        links: [
          { label: 'Нейросети для изображений', href: '/design' },
          { label: 'Нейросети для текста', href: '/text' },
          { label: 'Нейросети для аудио', href: '/audio' },
          { label: 'Тарифы', href: '/pricing' },
        ],
      },
    },
    {
      type: 'finalCta',
      enabled: true,
      order: 10,
      data: {
        title: 'Попробуйте видео-нейросети ЭРА2',
        subtitle: 'Создайте первое видео за минуту — без VPN, оплата в рублях.',
        button: 'Начать бесплатно',
        href: '/video',
      },
    },
  ],
};