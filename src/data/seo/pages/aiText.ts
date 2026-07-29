import { ORIGIN } from "@/lib/origin";
import type { SeoPage } from '../types';

export const aiTextPage: SeoPage = {
  id: 'ai-text',
  slug: '/ai/text',
  pageKind: 'category',
  status: 'published',
  updatedAt: '2026-07-26',
  uniqueValue:
    'Обзор текстовых нейросетей ЭРА2: чат, статьи, код, перевод, анализ документов — какие модели доступны и как выбрать.',
  searchIntent: 'commercial',
  seo: {
    title: 'Нейросети для текста — ChatGPT, Claude, Gemini на русском | ERA2.ai',
    description:
      'Пишите статьи, переводите и генерируйте код с ChatGPT, Claude, Gemini, DeepSeek. Единая подписка, оплата в рублях, без VPN.',
    canonical: `${ORIGIN}/ai/text`,
    robots: 'index,follow',
  },
  breadcrumbs: [
    { label: 'Главная', href: '/' },
    { label: 'Текст', href: '/ai/text' },
  ],
  blocks: [
    {
      type: 'hero',
      enabled: true,
      order: 1,
      data: {
        h1: 'Нейросети для текста',
        subtitle:
          'Пишите статьи и посты, переводите, анализируйте документы и генерируйте код — ChatGPT, Claude, Gemini, DeepSeek и другие модели в единой подписке, оплата в рублях.',
        primaryCta: 'Начать писать',
        ctaHref: '/text',
      },
    },
    {
      type: 'toolGrid',
      enabled: true,
      order: 2,
      data: {
        heading: 'Текстовые инструменты',
        items: [
          { title: 'Чат с ИИ', desc: 'Диалог с моделью', href: '/text', icon: '💬' },
          { title: 'Написать текст', desc: 'Статьи и посты', href: '/ai/text', icon: '✍️' },
          { title: 'Перевод', desc: 'На любой язык', href: '/text', icon: '🌍' },
          { title: 'Написать код', desc: 'Генерация и разбор', href: '/text', icon: '💻' },
        ],
      },
    },
    {
      type: 'modelGrid',
      enabled: true,
      order: 3,
      data: {
        heading: 'Модели для текста',
        items: [
          { name: 'ChatGPT', desc: 'Универсальный лидер для любых задач', image: '/models/01.jpg', href: '/tools/chatgpt' },
          { name: 'Claude', desc: 'Длинные тексты и вдумчивый анализ', image: '/models/02.jpg', href: '/tools/claude' },
          { name: 'Gemini', desc: 'Мультимодальность и работа с данными', image: '/models/03.jpg', href: '/tools/gemini' },
          { name: 'Grok', desc: 'Актуальные ответы и смелый стиль', image: '/models/04.jpg', href: '/tools/grok' },
          { name: 'DeepSeek', desc: 'Сильная логика и код', image: '/models/05.jpg', href: '/tools/deepseek' },
          { name: 'Perplexity', desc: 'Поиск в интернете с источниками', image: '/models/06.jpg', href: '/tools/perplexity' },
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
          { title: 'Написать статью' },
          { title: 'Пост для соцсетей' },
          { title: 'Перевести текст' },
          { title: 'Резюме и вакансии' },
          { title: 'Программный код' },
          { title: 'Анализ документа' },
          { title: 'Бизнес-план' },
        ],
      },
    },
    { type: 'howItWorks', enabled: true, order: 6 },
    {
      type: 'editorial',
      enabled: true,
      order: 7,
      data: {
        heading: 'Текстовые нейросети без VPN и зарубежных карт',
        text: 'ЭРА2 собирает лучшие языковые модели в одном чате: ChatGPT, Claude, Gemini, DeepSeek, Perplexity и другие. Переключайтесь между моделями в один клик, пишите на русском и платите одной подпиской в рублях — без VPN и регистраций в зарубежных сервисах.',
      },
    },
    {
      type: 'faq',
      enabled: true,
      order: 8,
      data: {
        items: [
          { q: 'Какие текстовые нейросети есть в ЭРА2?', a: 'ChatGPT, Claude, Gemini, Grok, DeepSeek, Perplexity, Qwen — все в одной подписке.' },
          { q: 'Можно ли писать промпты на русском?', a: 'Да, все модели понимают русский; писать можно как удобно.' },
          { q: 'Подходит ли сервис для работы с кодом?', a: 'Да — DeepSeek и Claude сильны в генерации и разборе кода.' },
          { q: 'Сохраняется ли история диалогов?', a: 'Да, все чаты хранятся в вашей истории.' },
          { q: 'Есть ли бесплатный доступ?', a: 'Да, стартовые кредиты позволяют попробовать модели бесплатно.' },
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
          { label: 'Нейросети для изображений', href: '/ai/image' },
          { label: 'Нейросети для видео', href: '/ai/video' },
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
        title: 'Попробуйте текстовые нейросети ЭРА2',
        subtitle: 'Первый диалог — за минуту, без VPN, оплата в рублях.',
        button: 'Начать бесплатно',
        href: '/text',
      },
    },
  ],
};