import { ORIGIN } from "@/lib/origin";

import { Link, getRouteApi } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ModelGlyph } from "@/components/ui/era/ModelGlyph";
import { getRelatedTools, isPublished, type ToolPageData } from "@/data/toolPages";
import { plans } from "@/data/plans";
import { FAQ, toolPageItems } from "@/components/shared/FAQ";
import { Footer } from "@/components/shared/Footer";
import { ToolWorkspace } from "@/components/tool/ToolWorkspace";
import { VisualCards } from "@/components/tool/VisualCards";
import { ModelShowreel } from "@/components/tool/ModelShowreel";
import { ShowcaseStrip } from "@/components/tool/ShowcaseStrip";
import { TransformShowcase } from "@/components/tool/TransformShowcase";
import { ModelGallery } from "@/components/tool/ModelGallery";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const toolRouteApi = getRouteApi("/tools/$slug");

const ToolPage = () => {
  const { data } = toolRouteApi.useLoaderData() as { data: ToolPageData };
  const workspaceRef = useRef<HTMLDivElement | null>(null);
  const [showFloatingBar, setShowFloatingBar] = useState(false);

  useEffect(() => {
    if (!data.tool) return;
    const el = workspaceRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        // Показывать липкий бар только когда ToolWorkspace ПОЛНОСТЬЮ ушёл вверх.
        const scrolledAbove =
          !entry.isIntersecting && entry.boundingClientRect.bottom <= 0;
        setShowFloatingBar(scrolledAbove);
      },
      { threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [data.tool, data.slug]);

  const scrollToWorkspace = () => {
    workspaceRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const targetPage = data.category === "video" ? "/video" : data.category === "audio" ? "/audio" : "/design";

  const faqForLd = data.faqItems ?? toolPageItems;
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqForLd.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Главная", item: `${ORIGIN}/` },
      { "@type": "ListItem", position: 2, name: "Инструменты", item: `${ORIGIN}/studios` },
      { "@type": "ListItem", position: 3, name: data.heroTitle, item: `${ORIGIN}/tools/${data.slug}` },
    ],
  };
  const related = getRelatedTools(data.slug);
  const showRelated = related.length >= 3;

  const minPaidPrice = Math.min(
    ...plans
      .map((p) => p.monthPrice)
      .filter((v): v is number => typeof v === "number" && v > 0)
  );
  const softwareAppLd = data.tool
    ? {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: `${data.modelName} в ERA2`,
        applicationCategory: "MultimediaApplication",
        operatingSystem: "Web",
        url: `${ORIGIN}/tools/${data.slug}`,
        offers: {
          "@type": "Offer",
          price: minPaidPrice,
          priceCurrency: "RUB",
          description: "Доступ в составе подписки ERA2",
        },
      }
    : null;
  const howToLd = data.tool && data.howItWorks
    ? {
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: data.howItWorks.title,
        step: data.howItWorks.steps.map((s, i) => ({
          "@type": "HowToStep",
          position: i + 1,
          name: s.title,
          text: s.desc,
        })),
      }
    : null;

  return (
    <div className="min-w-0">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      {softwareAppLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppLd) }}
        />
      )}
      {howToLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(howToLd) }}
        />
      )}
      {/* Hero with prompt bar */}
      <section className="relative overflow-hidden" style={{ background: "linear-gradient(to bottom, hsl(var(--background)), hsl(var(--card)))" }}>
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 80% 100% at 50% 0%, rgba(232,84,32,0.15) 0%, rgba(255,122,61,0.05) 40%, transparent 70%)" }} />
        <div className={cn("relative max-w-4xl mx-auto px-4", data.tool ? "pt-8 pb-5 md:pt-10 md:pb-6" : "pt-16 pb-14 md:pt-20 md:pb-16")}>
          <nav className={cn("flex items-center gap-1.5 text-[13px] text-muted-foreground", data.tool ? "mb-0" : "mb-8")}>
            <Link to="/" className="hover:text-foreground transition-colors">Главная</Link>
            <ChevronRight className="w-3 h-3" />
            <Link to="/studios" className="hover:text-foreground transition-colors">Инструменты</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground/70">{data.heroTitle}</span>
          </nav>

          {!data.tool && (
            <>
              <h1 className="text-[28px] md:text-[44px] font-bold leading-[1.1] tracking-tight mb-5">{data.heroTitle}</h1>
              <p className="text-muted-foreground text-sm md:text-base leading-relaxed max-w-[640px] mb-10">{data.heroDescription}</p>

              {/* Prompt bar */}
              <div className="bg-card border border-border rounded-2xl p-5 md:p-6 max-w-2xl">
                <div className="flex gap-2 mb-4">
                  <span className="px-4 py-1.5 rounded-full gradient-accent text-white text-sm font-medium">Текст в изображение</span>
                  <span className="px-4 py-1.5 rounded-full text-sm font-medium text-muted-foreground hover:text-foreground cursor-pointer transition-colors border border-border">Изображение в изображение</span>
                </div>
                <input readOnly placeholder="Введите текст запроса для генерации" className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-sm placeholder:text-muted-foreground mb-4 outline-none" />
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-3 py-1.5 rounded-full border border-border text-xs text-muted-foreground">{data.modelName}</span>
                  <span className="px-3 py-1.5 rounded-full border border-border text-xs text-muted-foreground">4:3</span>
                  <span className="px-3 py-1.5 rounded-full border border-border text-xs text-muted-foreground">×1</span>
                  <Link to={targetPage as any} className="ml-auto px-5 py-2 rounded-xl gradient-accent text-white text-sm font-semibold hover:opacity-90 transition-opacity">
                    Создать
                  </Link>
                </div>
                <p className="text-[11px] text-muted-foreground mt-3">1 изображение создаётся, фон, цвет и стиль из настроенных</p>
              </div>
            </>
          )}
        </div>
      </section>

      {data.tool && (
        <div ref={workspaceRef}>
          <ToolWorkspace data={data} />
        </div>
      )}

      {data.kind === 'model' && data.heroFacts && data.heroFacts.length > 0 && (
        <p className="mt-5 text-sm text-muted-foreground text-center">
          {data.heroFacts.join(" · ")}
        </p>
      )}

      {(() => {
        const sections: Record<string, React.ReactNode> = {
          showcaseStrip: data.showcaseStrip ? (
            <ShowcaseStrip key="showcaseStrip" images={data.showcaseStrip.images} />
          ) : null,
          intro: data.intro ? (
            <section key="intro" className="max-w-3xl mx-auto px-4 py-12 text-center">
              <h2 className="text-2xl md:text-[32px] font-bold mb-4">{data.intro.heading}</h2>
              <p className="text-muted-foreground leading-relaxed">{data.intro.text}</p>
            </section>
          ) : null,
          visualCards: data.visualCards ? (
            <VisualCards
              key="visualCards"
              heading={data.visualCards.heading}
              sub={data.visualCards.sub}
              cards={data.visualCards.cards}
            />
          ) : null,
          showreel: data.showreel ? (
            <ModelShowreel
              key="showreel"
              heading={data.showreel.heading}
              sub={data.showreel.sub}
              items={data.showreel.items}
            />
          ) : null,
          transformShowcase: data.transformShowcase ? (
            <TransformShowcase
              key="transformShowcase"
              heading={data.transformShowcase.heading}
              sub={data.transformShowcase.sub}
              inputLabel={data.transformShowcase.inputLabel}
              outputLabel={data.transformShowcase.outputLabel}
              inputs={data.transformShowcase.inputs}
              outputs={data.transformShowcase.outputs}
              prompt={data.transformShowcase.prompt}
            />
          ) : null,
          gallery: data.gallery ? (
            <ModelGallery
              key="gallery"
              heading={data.gallery.heading}
              images={data.gallery.images}
              initialCount={data.gallery.initialCount}
            />
          ) : null,
          specs: data.specs ? (
            <section key="specs" className="max-w-3xl mx-auto px-4 py-12">
              <h2 className="text-2xl md:text-[32px] font-bold mb-8 text-center">{data.specs.heading}</h2>
              <div className="flex flex-col">
                {data.specs.items.map((it, i) => (
                  <div key={i} className="flex justify-between py-3 border-b border-border/60 gap-4">
                    <span className="text-muted-foreground">{it.label}</span>
                    <span className="font-medium text-right">{it.value}</span>
                  </div>
                ))}
              </div>
            </section>
          ) : null,
          comparisonTable: data.comparisonTable ? (
            <section key="comparisonTable" className="max-w-5xl mx-auto px-4 py-12">
              <h2 className="text-2xl md:text-[32px] font-bold mb-8 text-center">{data.comparisonTable.heading}</h2>
              <div className="overflow-x-auto -mx-4 px-4">
                <table className="w-full min-w-[640px] text-sm">
                  <thead>
                    <tr>
                      <th className="text-left py-3 pr-4 font-normal text-muted-foreground w-1/4"></th>
                      {data.comparisonTable.columns.map((c, i) => (
                        <th
                          key={c}
                          className={
                            "text-left py-3 px-4 font-semibold " +
                            (i === 0 ? "bg-white/[0.04] rounded-t-lg" : "")
                          }
                        >
                          {c}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.comparisonTable.rows.map((row, ri) => (
                      <tr key={ri} className="border-t border-border/60">
                        <td className="py-3 pr-4 text-muted-foreground align-top">{row.label}</td>
                        {row.values.map((v, vi) => (
                          <td
                            key={vi}
                            className={
                              "py-3 px-4 align-top " +
                              (vi === 0 ? "bg-white/[0.04] font-medium" : "")
                            }
                          >
                            {v}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ) : null,
          featureBlocks: data.featureBlocks ? (
            <section key="featureBlocks" className="max-w-5xl mx-auto px-4 py-12 flex flex-col gap-16">
              {data.featureBlocks.map((b, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex flex-col gap-6 md:gap-12 items-center",
                    b.image && (i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse")
                  )}
                >
                  {b.image && (
                    <div className="md:w-1/2 w-full rounded-2xl border border-border overflow-hidden aspect-[4/3]">
                      <img src={b.image} alt={b.title} loading="lazy" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className={cn("w-full", b.image ? "md:w-1/2" : "max-w-3xl text-center mx-auto")}>
                    <h3 className="text-2xl md:text-[28px] font-bold mb-3">{b.title}</h3>
                    <p className="text-muted-foreground mb-5 leading-relaxed">{b.desc}</p>
                    <button
                      type="button"
                      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                      className="gradient-accent text-white rounded-full px-6 py-2.5 font-semibold hover:opacity-90 transition-opacity"
                    >
                      {b.cta}
                    </button>
                  </div>
                </div>
              ))}
            </section>
          ) : null,
          tips: data.tips ? (
            <section key="tips" className="max-w-5xl mx-auto px-4 py-12">
              <h2 className="text-2xl md:text-[32px] font-bold mb-8 text-center">{data.tips.heading}</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {data.tips.items.map((it, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-white/10 bg-white/[0.04] shadow-sm p-5 hover:border-primary/40 hover:bg-white/[0.06] transition-colors"
                  >
                    <h4 className="font-semibold mb-1">{it.title}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{it.desc}</p>
                  </div>
                ))}
              </div>
            </section>
          ) : null,
          useCases: data.useCases ? (
            <section key="useCases" className="max-w-5xl mx-auto px-4 py-12">
              <h2 className="text-2xl md:text-[32px] font-bold mb-8 text-center">{data.useCases.heading}</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {data.useCases.items.map((it, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-white/10 bg-white/[0.04] shadow-sm p-5 hover:border-primary/40 hover:bg-white/[0.06] transition-colors"
                  >
                    <h4 className="font-semibold mb-1">{it.title}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{it.desc}</p>
                  </div>
                ))}
              </div>
            </section>
          ) : null,
          modelChips: data.modelChips ? (
            <section key="modelChips" className="max-w-5xl mx-auto px-4 py-12">
              <h2 className="text-2xl md:text-[32px] font-bold mb-3 text-center">{data.modelChips.heading}</h2>
              {data.modelChips.sub && (
                <p className="text-muted-foreground text-center mb-8 max-w-2xl mx-auto">{data.modelChips.sub}</p>
              )}
              <div className="flex gap-4 overflow-x-auto no-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
                {data.modelChips.models
                  .filter((m) => (m.slug ? isPublished(m.slug) : true))
                  .map((m) => {
                    const inner = (
                      <>
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                          <ModelGlyph name={m.name} size={32} />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-base">{m.name}</span>
                          {m.badge && (
                            <span className="text-[10px] uppercase px-2 py-0.5 rounded-full bg-primary/15 text-primary">
                              {m.badge}
                            </span>
                          )}
                        </div>
                        {m.priceFrom && (
                          <div className="mt-3 text-sm text-primary font-mono">{m.priceFrom}</div>
                        )}
                      </>
                    );
                    const base = "shrink-0 w-[200px] rounded-xl border border-white/10 bg-white/[0.04] p-5 transition-colors";
                    return m.slug ? (
                      <Link
                        key={m.name}
                        to="/tools/$slug"
                        params={{ slug: m.slug }}
                        className={cn(base, "hover:border-primary/40 hover:bg-white/[0.06]")}
                      >
                        {inner}
                      </Link>
                    ) : (
                      <div key={m.name} className={base}>
                        {inner}
                      </div>
                    );
                  })}
              </div>
            </section>
          ) : null,
          howItWorks: data.howItWorks ? (
            <section key="howItWorks" className="max-w-5xl mx-auto px-4 py-12">
              <h2 className="text-2xl md:text-[32px] font-bold mb-8 text-center">
                {data.howItWorks.title}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {data.howItWorks.steps.map((step, i) => (
                  <div
                    key={i}
                    className="bg-card border border-border shadow-sm rounded-xl p-6 hover:border-primary/40 hover:bg-muted/50 transition-colors"
                  >
                    <span className="gradient-accent-text font-bold text-sm mb-2 block">Шаг {i + 1}</span>
                    <h4 className="font-semibold mb-1">{step.title}</h4>
                    <p className="text-sm text-muted-foreground">{step.desc}</p>
                  </div>
                ))}
              </div>
              <div className="text-center mt-8">
                <button
                  type="button"
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  className="gradient-accent text-white rounded-full px-8 py-3 font-semibold hover:opacity-90 transition-opacity"
                >
                  {data.howItWorks.cta ?? data.finalCta?.button ?? "Попробовать"}
                </button>
              </div>
            </section>
          ) : null,
          examples: data.examples ? (
            <section key="examples" className="max-w-5xl mx-auto px-4 py-12">
              <h2 className="text-2xl md:text-[32px] font-bold mb-8 text-center">{data.examples.heading}</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {data.examples.images.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt={`${data.examples!.heading} — ${i + 1}`}
                    loading="lazy"
                    className="w-full aspect-square object-cover rounded-xl border border-white/10"
                  />
                ))}
              </div>
            </section>
          ) : null,
        };

        if (data.bigStat) {
          sections.bigStat = (
            <section key="bigStat" className="max-w-3xl mx-auto px-4 py-16 text-center">
              <div className="text-6xl md:text-7xl font-bold gradient-accent-text">{data.bigStat.value}</div>
              <p className="text-xl md:text-2xl font-semibold mt-3">{data.bigStat.label}</p>
              {data.bigStat.sub && <p className="text-muted-foreground mt-3 max-w-xl mx-auto">{data.bigStat.sub}</p>}
              {data.bigStat.button && (
                <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="gradient-accent text-white rounded-full px-8 py-3 font-semibold mt-6 hover:opacity-90 transition-opacity">
                  {data.bigStat.button}
                </button>
              )}
            </section>
          );
        }

        const modelOrder = ["showcaseStrip", "modelChips", "intro", "visualCards", "showreel", "transformShowcase", "specs", "comparisonTable", "featureBlocks", "gallery", "tips", "useCases", "howItWorks", "bigStat"];
        const toolOrder = ["intro", "featureBlocks", "useCases", "howItWorks", "examples", "specs", "modelChips", "bigStat"];
        const order = data.kind === "model" ? modelOrder : toolOrder;
        return <>{order.map((k) => sections[k])}</>;
      })()}

      {showRelated && (
        <section className="max-w-5xl mx-auto px-4 py-12">
          <h2 className="text-2xl md:text-[32px] font-bold mb-8 text-center">Похожие инструменты</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {related.map((r) => (
              <Link
                key={r.slug}
                to="/tools/$slug"
                params={{ slug: r.slug }}
                className="rounded-xl border border-white/10 bg-white/[0.04] shadow-sm p-5 hover:border-primary/40 hover:bg-white/[0.06] transition-colors"
              >
                <h3 className="font-semibold mb-1">{r.heroTitle}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {r.heroDescription.length > 90 ? `${r.heroDescription.slice(0, 90).trimEnd()}…` : r.heroDescription}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <FAQ items={data.faqItems ?? toolPageItems} />

      {/* Final CTA (tool pages) */}
      {data.tool && data.finalCta && (
        <section className="max-w-3xl mx-auto px-4 py-16 md:py-20 text-center">
          <h2 className="text-[24px] md:text-[32px] font-bold mb-4 leading-tight">{data.finalCta.title}</h2>
          <p className="text-muted-foreground text-sm md:text-base mb-8 max-w-[600px] mx-auto">{data.finalCta.subtitle}</p>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="gradient-accent text-white rounded-full px-8 py-3.5 font-semibold hover:opacity-90 transition-opacity"
          >
            {data.finalCta.button}
          </button>
        </section>
      )}

      <Footer />

      {data.tool && (
        <div
          className={cn(
            "fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background/95 backdrop-blur transition-all duration-300",
            showFloatingBar ? "translate-y-0 opacity-100" : "translate-y-full opacity-0 pointer-events-none"
          )}
          aria-hidden={!showFloatingBar}
        >
          <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
            <span className="hidden md:block flex-1 truncate text-sm text-muted-foreground">
              {data.tool.textPlaceholder ?? "Опишите задачу…"}
            </span>
            <span className="md:hidden flex-1" />
            <span className="border border-border rounded-full px-3 py-1 text-xs text-muted-foreground whitespace-nowrap">
              {data.modelName}
            </span>
            <button
              type="button"
              onClick={scrollToWorkspace}
              className="gradient-accent text-white rounded-full px-4 py-2 text-sm font-semibold hover:opacity-90 transition-opacity whitespace-nowrap"
            >
              Генерировать
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ToolPage;
