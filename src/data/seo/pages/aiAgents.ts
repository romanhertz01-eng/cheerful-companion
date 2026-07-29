import { ORIGIN } from "@/lib/origin";
import type { SeoPage } from '../types';

export const aiAgentsPage: SeoPage = {
  id: 'ai-agents',
  slug: '/ai/agents',
  pageKind: 'category',
  status: 'published',
  updatedAt: '2026-07-26',
  uniqueValue:
    'Обзор ИИ-агентов ЭРА2: готовые ассистенты под роли — маркетолог, копирайтер, программист, юрист — вместо настройки промптов вручную.',
  searchIntent: 'commercial',
  seo: {
    title: 'ИИ-агенты — готовые ассистенты для работы | ERA2.ai',
    description:
      'Маркетолог, копирайтер, программист, юрист — готовые ИИ-ассистенты под задачу. Единая подписка, оплата в рублях, без VPN.',
    canonical: `${ORIGIN}/ai/agents`,
    robots: 'index,follow',
  },
  breadcrumbs: [
    { label: 'Главная', href: '/' },
    { label: 'Агенты', href: '/ai/agents' },
  ],
  blocks: [
    {
      type: 'hero',
      enabled: true,
      order: 1,
      data: {
        h1: 'ИИ-агенты и ассистенты',
        subtitle:
          'Готовые специалисты под задачу: маркетолог, копирайтер, программист, переводчик, юрист. Выбирайте агента — и получайте результат без долгих промптов.',
        primaryCta: 'Выбрать агента',
        ctaHref: '/agents',
      },
    },
    {
      type: 'toolGrid',
      enabled: true,
      order: 2,
      data: {
        heading: 'Популярные агенты',
        items: [
          { title: 'Маркетолог', desc: 'Стратегия и контент-план', href: '/agents', icon: '📈' },
          { title: 'Копирайтер', desc: 'Тексты под задачу', href: '/agents', icon: '✍️' },
          { title: 'Программист', desc: 'Код и код-ревью', href: '/agents', icon: '💻' },
          { title: 'Юрист', desc: 'Разбор договоров', href: '/agents', icon: '⚖️' },
        ],
      },
    },
    {
      type: 'modelGrid',
      enabled: true,
      order: 3,
      data: {
        heading: 'Работают на моделях',
        items: [
          { name: 'ChatGPT', desc: 'Универсальные задачи и диалог', image: '/models/01.jpg', href: '/tools/chatgpt' },
          { name: 'Claude', desc: 'Длинные документы и анализ', image: '/models/02.jpg', href: '/tools/claude' },
          { name: 'Gemini', desc: 'Данные и мультимодальность', image: '/models/03.jpg', href: '/tools/gemini' },
          { name: 'DeepSeek', desc: 'Код и логика', image: '/models/04.jpg', href: '/tools/deepseek' },
        ],
      },
    },
    {
      type: 'scenarioChips',
      enabled: true,
      order: 4,
      data: {
        heading: 'Что умеют агенты',
        items: [
          { title: 'Контент-план' },
          { title: 'Продающий текст' },
          { title: 'Разбор договора' },
          { title: 'Код-ревью' },
          { title: 'Перевод документов' },
          { title: 'Идеи для бизнеса' },
          { title: 'SEO-тексты' },
        ],
      },
    },
    { type: 'howItWorks', enabled: true, order: 6 },
    {
      type: 'editorial',
      enabled: true,
      order: 7,
      data: {
        heading: 'ИИ-агенты вместо настройки промптов',
        text: 'Агенты ЭРА2 — это преднастроенные ассистенты с ролью, контекстом и форматом ответа. Не нужно изучать промпт-инжиниринг: выбираете «Маркетолога» или «Юриста», описываете задачу по-русски — и получаете структурированный результат.',
      },
    },
    {
      type: 'faq',
      enabled: true,
      order: 8,
      data: {
        items: [
          { q: 'Чем агент отличается от обычного чата?', a: 'У агента уже настроены роль, стиль и формат ответа под конкретную профессию.' },
          { q: 'Какие агенты доступны?', a: 'Маркетолог, копирайтер, программист, переводчик, юрист, генератор идей и другие.' },
          { q: 'Можно ли создать своего агента?', a: 'Персональные агенты — в планах; сейчас доступна готовая библиотека.' },
          { q: 'На каких моделях работают агенты?', a: 'ChatGPT, Claude, Gemini, DeepSeek — модель подбирается под задачу.' },
          { q: 'Подходит ли это для бизнеса?', a: 'Да — агенты закрывают типовые задачи маркетинга, продаж, документов и разработки.' },
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
          { label: 'Нейросети для текста', href: '/ai/text' },
          { label: 'Нейросети для изображений', href: '/ai/image' },
          { label: 'Нейросети для видео', href: '/ai/video' },
          { label: 'Тарифы', href: '/pricing' },
        ],
      },
    },
    {
      type: 'finalCta',
      enabled: true,
      order: 10,
      data: {
        title: 'Попробуйте ИИ-агентов ЭРА2',
        subtitle: 'Первый результат — за минуту, без VPN, оплата в рублях.',
        button: 'Начать бесплатно',
        href: '/agents',
      },
    },
  ],
};