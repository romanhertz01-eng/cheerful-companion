import { ORIGIN } from "@/lib/origin";
import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { CreditsProvider } from "@/hooks/useCredits";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/layout/Layout";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import { OnboardingTour } from "@/components/shared/OnboardingTour";
import { CopyToastProvider } from "@/components/shared/CopyToast";
import { CornerPromo } from "@/components/shared/CornerPromo";
import { DailyCheckIn } from "@/components/shared/DailyCheckIn";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Страница не найдена</h2>
        <p className="mt-2 text-sm text-muted-foreground">Запрашиваемая страница не существует.</p>
        <div className="mt-6">
          <Link to="/" className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
            На главную
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "ERA2.ai — Агрегатор нейросетей" },
      { name: "description", content: "Единая подписка на ChatGPT, Claude, Midjourney, Sora, ElevenLabs и 90+ других нейросетей. Без VPN, оплата в рублях." },
      { property: "og:title", content: "ERA2.ai — Агрегатор нейросетей" },
      { property: "og:description", content: "Единая подписка на ChatGPT, Claude, Midjourney, Sora, ElevenLabs и 90+ других нейросетей. Без VPN, оплата в рублях." },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "ERA2.ai" },
      { property: "og:locale", content: "ru_RU" },
      { property: "og:image", content: `${ORIGIN}/og-image.png` },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:title", content: "ERA2.ai — Агрегатор нейросетей" },
      { name: "twitter:description", content: "Единая подписка на ChatGPT, Claude, Midjourney, Sora, ElevenLabs и 90+ других нейросетей. Без VPN, оплата в рублях." },
      { name: "twitter:image", content: `${ORIGIN}/og-image.png` },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "theme-color", content: "#E85420" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "apple-touch-icon", href: "/favicon.svg" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  const orgWebsiteLd = JSON.stringify([
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "ERA2",
      url: ORIGIN,
      logo: `${ORIGIN}/favicon.svg`,
      alternateName: ["ЭРА2", "era2", "ERA2.ai"],
      description:
        "Агрегатор нейросетей: 90+ ИИ-моделей по единой подписке с оплатой в рублях",
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "ERA2.ai",
      url: ORIGIN,
      inLanguage: "ru-RU",
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${ORIGIN}/studios?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
  ]);
  return (
    <html lang="ru">
      <head>
        <HeadContent />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: orgWebsiteLd }}
        />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CreditsProvider>
        <TooltipProvider>
          <Layout>
            <ErrorBoundary>
              <Outlet />
            </ErrorBoundary>
          </Layout>
          <OnboardingTour />
          <CopyToastProvider />
          <CornerPromo />
          <DailyCheckIn />
        </TooltipProvider>
        </CreditsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
