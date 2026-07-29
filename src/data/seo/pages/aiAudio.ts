import { ORIGIN } from "@/lib/origin";
import type { SeoPage } from '../types';

export const aiAudioPage: SeoPage = {
  id: 'ai-audio',
  slug: '/ai/audio',
  pageKind: 'category',
  status: 'published',
  updatedAt: '2026-07-26',
  uniqueValue:
    'Обзор аудио-нейросетей ЭРА2: озвучка текста, создание музыки, клонирование голоса, транскрибация — модели и инструменты в одном месте.',
  searchIntent: 'commercial',
  seo: {
    title: 'Нейросети для аудио — озвучка, музыка, клон голоса | ERA2.ai',
    description:
      'Озвучка текста ElevenLabs, песни Suno, клонирование голоса и транскрибация. Единая подписка, оплата в рублях, без VPN.',
    canonical: `${ORIGIN}/ai/audio`,
    robots: 'index,follow',
  },
  breadcrumbs: [
    { label: 'Главная', href: '/' },
    { label: 'Аудио', href: '/ai/audio' },
  ],
  blocks: [
    {
      type: 'hero',
      enabled: true,
      order: 1,
      data: {
        h1: 'Нейросети для аудио',
        subtitle:
          'Озвучивайте тексты, создавайте музыку, клонируйте голос и расшифровывайте записи — ElevenLabs, Suno и другие модели в единой подписке, оплата в рублях.',
        primaryCta: 'Создать аудио',
        ctaHref: '/audio',
      },
    },
    {
      type: 'toolGrid',
      enabled: true,
      order: 2,
      data: {
        heading: 'Аудио-инструменты',
        items: [
          { title: 'Озвучка текста', desc: 'Текст в речь', href: '/tools/text-to-speech', icon: '🎙️' },
          { title: 'Создать песню', desc: 'Музыка по описанию', href: '/audio', icon: '🎵' },
          { title: 'Клон голоса', desc: 'Свой голос по образцу', href: '/tools/voice-cloning', icon: '🗣️' },
          { title: 'Транскрибация', desc: 'Аудио в текст', href: '/tools/transcribe', icon: '📝' },
        ],
      },
    },
    {
      type: 'modelGrid',
      enabled: true,
      order: 3,
      data: {
        heading: 'Модели для аудио',
        items: [
          { name: 'ElevenLabs', desc: 'Реалистичная озвучка на десятках языков', image: '/models/01.jpg', href: '/tools/elevenlabs' },
          { name: 'Suno', badge: 'TOP', desc: 'Полноценные песни по описанию', image: '/models/02.jpg', href: '/tools/suno' },
          { name: 'ElevenLabs Voice Clone', desc: 'Клонирование голоса по образцу', image: '/models/03.jpg', href: '/tools/voice-cloning' },
          { name: 'ElevenLabs STT', desc: 'Точная расшифровка аудио в текст', image: '/models/04.jpg', href: '/tools/transcribe' },
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
          { title: 'Озвучить текст' },
          { title: 'Песня по описанию' },
          { title: 'Подкаст' },
          { title: 'Джингл для рекламы' },
          { title: 'Клон голоса' },
          { title: 'Расшифровать запись' },
          { title: 'Убрать шум' },
        ],
      },
    },
    { type: 'howItWorks', enabled: true, order: 6 },
    {
      type: 'editorial',
      enabled: true,
      order: 7,
      data: {
        heading: 'Аудио-нейросети без VPN и зарубежных карт',
        text: 'ЭРА2 объединяет главные аудио-модели в одном сервисе: озвучка ElevenLabs, музыка Suno, клонирование голоса и транскрибация. Работайте с русским языком, платите одной подпиской в рублях — без VPN и зарубежных карт.',
      },
    },
    {
      type: 'faq',
      enabled: true,
      order: 8,
      data: {
        items: [
          { q: 'Какие аудио-нейросети доступны?', a: 'ElevenLabs для озвучки и голоса, Suno для музыки, плюс инструменты транскрибации и очистки звука.' },
          { q: 'Можно ли озвучить текст русским голосом?', a: 'Да, доступны десятки реалистичных русскоязычных голосов.' },
          { q: 'Как создать свою песню?', a: 'Опишите жанр, настроение и тему — Suno соберёт трек с вокалом за пару минут.' },
          { q: 'Законно ли клонировать голос?', a: 'Клонировать можно только свой голос или с согласия владельца — это требование сервиса.' },
          { q: 'В каких форматах скачиваются результаты?', a: 'Готовые файлы доступны в стандартных форматах: MP3 и WAV.' },
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
          { label: 'Нейросети для видео', href: '/ai/video' },
          { label: 'Нейросети для изображений', href: '/ai/image' },
          { label: 'Тарифы', href: '/pricing' },
        ],
      },
    },
    {
      type: 'finalCta',
      enabled: true,
      order: 10,
      data: {
        title: 'Попробуйте аудио-нейросети ЭРА2',
        subtitle: 'Первая озвучка — за минуту, без VPN, оплата в рублях.',
        button: 'Начать бесплатно',
        href: '/audio',
      },
    },
  ],
};