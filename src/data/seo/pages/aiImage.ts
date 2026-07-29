import { ORIGIN } from "@/lib/origin";
import type { SeoPage } from '../types';

export const aiImagePage: SeoPage = {
  id: 'ai-image',
  slug: '/ai/image',
  pageKind: 'category',
  status: 'published',
  updatedAt: '2026-07-26',
  uniqueValue:
    'Обзор нейросетей для изображений ЭРА2: генерация, редактирование, удаление фона, апскейл — модели и инструменты в одном месте.',
  searchIntent: 'commercial',
  seo: {
    title: 'Нейросети для изображений — генерация картинок онлайн | ERA2.ai',
    description:
      'Создавайте изображения из текста, удаляйте фон и улучшайте фото: Nano Banana, Midjourney, Flux. Единая подписка, оплата в рублях, без VPN.',
    canonical: `${ORIGIN}/ai/image`,
    robots: 'index,follow',
  },
  breadcrumbs: [
    { label: 'Главная', href: '/' },
    { label: 'Изображения', href: '/ai/image' },
  ],
  blocks: [
    {
      type: 'hero',
      enabled: true,
      order: 1,
      data: {
        h1: 'Нейросети для изображений',
        subtitle:
          'Создавайте картинки из текста, редактируйте фото, удаляйте фон и улучшайте качество — Nano Banana, Midjourney, Flux, Seedream и другие модели в единой подписке, оплата в рублях.',
        primaryCta: 'Создать изображение',
        ctaHref: '/design',
      },
    },
    {
      type: 'toolGrid',
      enabled: true,
      order: 2,
      data: {
        heading: 'Инструменты для изображений',
        items: [
          { title: 'Создать изображение', desc: 'Картинка из текста', href: '/tools/image-generation', icon: '🎨' },
          { title: 'Удалить фон', desc: 'В один клик', href: '/tools/remove-background', icon: '✂️' },
          { title: 'Апскейл', desc: 'Улучшить качество', href: '/tools/image-upscaler', icon: '🔍' },
          { title: 'Редактор фото', desc: 'Правки и ретушь', href: '/design', icon: '🖌️' },
        ],
      },
    },
    {
      type: 'modelGrid',
      enabled: true,
      order: 3,
      data: {
        heading: 'Модели для изображений',
        items: [
          { name: 'Nano Banana 2', badge: 'NEW', desc: 'Быстрая генерация и точное редактирование', image: '/models/01.jpg', href: '/tools/nano-banana' },
          { name: 'Midjourney', desc: 'Художественная эстетика и детализация', image: '/models/02.jpg', href: '/tools/midjourney' },
          { name: 'Flux', desc: 'Реализм и контроль композиции', image: '/models/03.jpg', href: '/tools/flux' },
          { name: 'Seedream', desc: 'Качество и скорость для повседневных задач', image: '/models/04.jpg', href: '/tools/seedream' },
          { name: 'GPT Image', desc: 'Понимание сложных промптов', image: '/models/05.jpg', href: '/tools/gpt-image' },
          { name: 'Imagen 4', desc: 'Фотореализм от Google', image: '/models/06.jpg', href: '/tools/imagen' },
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
          { title: 'Портрет по фото' },
          { title: 'Логотип' },
          { title: 'Контент для соцсетей' },
          { title: 'Удалить фон' },
          { title: 'Улучшить качество' },
          { title: 'Фото товара' },
          { title: 'Аватарка' },
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
        heading: 'Генерация изображений без VPN и зарубежных карт',
        text: 'В ЭРА2 собраны главные модели генерации и редактирования изображений: Nano Banana, Midjourney, Flux, Seedream, GPT Image. Пишите промпт на русском, выбирайте модель под задачу — от логотипа до фото товара — и платите одной подпиской в рублях.',
      },
    },
    {
      type: 'faq',
      enabled: true,
      order: 8,
      data: {
        items: [
          { q: 'Какие модели для изображений доступны?', a: 'Nano Banana, Midjourney, Flux, Seedream, GPT Image, Imagen и другие.' },
          { q: 'Можно ли редактировать свои фото?', a: 'Да — загрузите фото и меняйте фон, убирайте объекты, улучшайте качество.' },
          { q: 'Понимают ли модели русский промпт?', a: 'Да, все инструменты работают с русскоязычными описаниями.' },
          { q: 'Кому принадлежат созданные изображения?', a: 'Результаты генераций доступны вам для скачивания и использования.' },
          { q: 'Есть ли бесплатные генерации?', a: 'Да, стартовые кредиты позволяют попробовать генерацию бесплатно.' },
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
          { label: 'Нейросети для видео', href: '/ai/video' },
          { label: 'Нейросети для текста', href: '/ai/text' },
          { label: 'Нейросети для аудио', href: '/ai/audio' },
          { label: 'Тарифы', href: '/pricing' },
        ],
      },
    },
    {
      type: 'finalCta',
      enabled: true,
      order: 10,
      data: {
        title: 'Попробуйте генерацию изображений в ЭРА2',
        subtitle: 'Первая картинка — за минуту, без VPN, оплата в рублях.',
        button: 'Начать бесплатно',
        href: '/design',
      },
    },
  ],
};