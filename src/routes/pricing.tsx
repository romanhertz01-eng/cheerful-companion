import { ORIGIN } from "@/lib/origin";
import { createFileRoute } from "@tanstack/react-router";
import PricingPage from "@/pages/PricingPage";
import { plans } from "@/data/plans";
import { pricingPage } from "@/data/seo/pages/pricing";
import { resolveRobots } from "@/data/seo/robots";
import type { SeoPage } from "@/data/seo/types";

const TITLE = pricingPage.seo.title;
const DESCRIPTION = pricingPage.seo.description;
const CANONICAL = pricingPage.seo.canonical;
const ROBOTS = resolveRobots(pricingPage as SeoPage);

const softwareApplicationLd = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "ERA2",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  url: CANONICAL,
  offers: plans
    .filter((p) => p.monthPrice !== null && p.monthPrice > 0)
    .map((p) => ({
      "@type": "Offer",
      name: p.name,
      price: String(p.monthPrice),
      priceCurrency: "RUB",
      url: CANONICAL,
    })),
});

const breadcrumbLd = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Главная", item: `${ORIGIN}/` },
    { "@type": "ListItem", position: 2, name: "Тарифы", item: CANONICAL },
  ],
});

export const Route = createFileRoute("/pricing")({
  component: PricingPage,
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { name: "robots", content: ROBOTS },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: CANONICAL },
      { property: "og:image", content: `${ORIGIN}/og-image.png` },
    ],
    links: [{ rel: "canonical", href: CANONICAL }],
    scripts: [
      {
        type: "application/ld+json",
        children: softwareApplicationLd,
      },
      {
        type: "application/ld+json",
        children: breadcrumbLd,
      },
    ],
  }),
});
