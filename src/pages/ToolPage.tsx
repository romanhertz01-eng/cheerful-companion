import { ORIGIN } from "@/lib/origin";

import { Link, getRouteApi } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { ModelGlyph } from "@/components/ui/era/ModelGlyph";
import { useEffect, useRef, useState } from "react";
import { getRelatedTools, isPublished, getModelPriceLabel, getToolsForModel, getModelForTool, getToolPageData, type ToolPageData } from "@/data/toolPages";
import { plans } from "@/data/plans";
import { FAQ, toolPageItems } from "@/components/shared/FAQ";
import { Footer } from "@/components/shared/Footer";
import { ToolWorkspace, computePricingParts } from "@/components/tool/ToolWorkspace";
import { VisualCards } from "@/components/tool/VisualCards";
import { ModelShowreel } from "@/components/tool/ModelShowreel";
import { CapabilityCards } from "@/components/tool/CapabilityCards";
import { AudioShowreel } from "@/components/tool/AudioShowreel";
import { PromptAnswer } from "@/components/tool/PromptAnswer";
import { ShowcaseStrip } from "@/components/tool/ShowcaseStrip";
import { TransformShowcase } from "@/components/tool/TransformShowcase";
import { ModelGallery } from "@/components/tool/ModelGallery";
import { PricingBlock } from "@/components/tool/PricingBlock";
import { CtaBanner } from "@/components/tool/CtaBanner";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const toolRouteApi = getRouteApi("/tools/$slug");

/** Measures how much chrome (promo bar + header) sits above the hero and
 *  exposes it as --header-offset so the hero can fill the rest of the screen. */
function useHeaderOffset(ref: React.RefObject<HTMLDivElement | null>, enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;
    const update = () => {
      const top = el.getBoundingClientRect().top + window.scrollY;
      el.style.setProperty("--header-offset", `${Math.max(0, Math.round(top))}px`);
    };
    update();
    window.addEventListener("resize", update);
    const ro = new ResizeObserver(update);
    if (document.body) ro.observe(document.body);
    return () => {
      window.removeEventListener("resize", update);
      ro.disconnect();
    };
  }, [ref, enabled]);
}

function HeroVideoBackground({ src, poster, overlay = 0.6 }: { src: string; poster?: string; overlay?: number }) {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <>
      {reduceMotion ? (
        poster ? (
          <img
            src={poster}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
        ) : null
      ) : (
        <video
          src={src}
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/45 to-black/95" />
    </>
  );
}

function truncate(s: string, n: number) {
  return s.length > n ? `${s.slice(0, n).trimEnd()}…` : s;
}

const ToolPage = () => {
  const { data } = toolRouteApi.useLoaderData() as { data: ToolPageData };
  const workspaceRef = useRef<HTMLDivElement | null>(null);
  const heroWrapRef = useRef<HTMLDivElement | null>(null);
  const [showFloatingBar, setShowFloatingBar] = useState(false);

  useHeaderOffset(heroWrapRef, true);

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

  // Цена по умолчанию для липкого бара (та же логика, что в панели генерации).
  const stickyPriceLabel = (() => {
    const t = data.tool;
    if (!t) return "";
    if (t.pricing) {
      const selects = t.selects ?? [];
      const idx = selects.map((s) => s.defaultIndex ?? 0);
      return computePricingParts(t.pricing, selects, idx, 0).total;
    }
    if (t.types?.length) return `${t.types[0].credits} кр`;
    if (typeof t.credits === "number") return `${t.credits} кр`;
    return "";
  })();

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
  const showRelated = data.kind === 'tool' && related.length >= 3;

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
      <div ref={heroWrapRef} className="relative w-full overflow-hidden min-h-[520px] md:min-h-[calc(100vh-var(--header-offset,180px))]">
        {data.heroVideo && (
          <HeroVideoBackground
            src={data.heroVideo.src}
            poster={data.heroVideo.poster}
            overlay={data.heroVideo.overlay}
          />
        )}
        <div className={cn("relative z-10", data.heroVideo && "pb-32")}>
      <section className="relative overflow-hidden" style={data.heroVideo ? undefined : { background: "linear-gradient(to bottom, hsl(var(--background)), hsl(var(--card)))" }}>
        {!data.heroVideo && (
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 80% 100% at 50% 0%, rgba(232,84,32,0.15) 0%, rgba(255,122,61,0.05) 40%, transparent 70%)" }} />
        )}
        <div className={cn("relative max-w-4xl mx-auto px-4", data.tool ? "pt-8 pb-5 md:pt-10 md:pb-6" : "pt-16 pb-14 md:pt-20 md:pb-16")}>
          <nav className={cn("items-center gap-1.5 text-[13px]", data.heroVideo ? "inline-flex px-4 py-2 rounded-full bg-black/40 backdrop-blur-sm text-white/80" : "flex text-muted-foreground", data.tool ? "mb-0" : "mb-8")}>
            <Link to="/" className={data.heroVideo ? "hover:text-white transition-colors" : "hover:text-foreground transition-colors"}>Главная</Link>
            <ChevronRight className={cn("w-3 h-3", data.heroVideo ? "text-white/50" : "")} />
            <Link to="/studios" search={{ q: "" }} className={data.heroVideo ? "hover:text-white transition-colors" : "hover:text-foreground transition-colors"}>Инструменты</Link>
            <ChevronRight className={cn("w-3 h-3", data.heroVideo ? "text-white/50" : "")} />
            <span className={data.heroVideo ? "text-white" : "text-foreground/70"}>{data.heroTitle}</span>
          </nav>

          {!data.tool && (
            <>
              <h1 className={cn("text-[28px] md:text-[44px] font-bold leading-[1.1] tracking-tight mb-5", data.heroVideo && "text-white")}>{data.heroTitle}</h1>
              <p className={cn("text-sm md:text-base leading-relaxed max-w-[640px] mb-10", data.heroVideo ? "text-white/80" : "text-muted-foreground")}>{data.heroDescription}</p>

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
          <ToolWorkspace data={data} onVideo={!!data.heroVideo} />
        </div>
      )}
        </div>
      </div>

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
            data.kind === 'tool' ? (
              <section key="showreel" className="max-w-5xl mx-auto px-4 py-12">
                <h2 className="text-2xl md:text-[32px] font-bold text-center md:text-left">{data.showreel.heading}</h2>
                {data.showreel.sub && (
                  <p className="mt-3 text-sm text-muted-foreground text-center md:text-left max-w-2xl mx-auto md:mx-0">{data.showreel.sub}</p>
                )}
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {data.showreel.items.slice(0, 8).map((it, i) => (
                    <figure key={i} className="flex flex-col gap-2">
                      <div className="aspect-square rounded-xl overflow-hidden border border-white/10 bg-white/[0.03]">
                        <img
                          src={it.image}
                          alt={it.label ?? it.prompt ?? data.showreel!.heading}
                          loading={i < 4 ? "eager" : "lazy"}
                          width={600}
                          height={600}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {(it.label || it.prompt) && (
                        <figcaption className="text-xs text-muted-foreground leading-snug line-clamp-3">
                          {it.label ? <span className="text-foreground font-medium">{it.label}. </span> : null}
                          {it.prompt}
                        </figcaption>
                      )}
                    </figure>
                  ))}
                </div>
              </section>
            ) : (
              <ModelShowreel
                key="showreel"
                heading={data.showreel.heading}
                sub={data.showreel.sub}
                aspect={data.showreel.aspect}
                items={data.showreel.items}
              />
            )
          ) : null,
          capabilityCards: data.capabilityCards ? (
            <CapabilityCards
              key="capabilityCards"
              heading={data.capabilityCards.heading}
              sub={data.capabilityCards.sub}
              cards={data.capabilityCards.cards}
            />
          ) : null,
          audioShowreel: data.audioShowreel ? (
            <AudioShowreel
              key="audioShowreel"
              heading={data.audioShowreel.heading}
              sub={data.audioShowreel.sub}
              textLabel={data.audioShowreel.textLabel}
              items={data.audioShowreel.items}
            />
          ) : null,
          promptAnswer: data.promptAnswer ? (
            <PromptAnswer
              key="promptAnswer"
              heading={data.promptAnswer.heading}
              sub={data.promptAnswer.sub}
              items={data.promptAnswer.items}
            />
          ) : null,
          transformShowcase: data.transformShowcase ? (
            <TransformShowcase
              key="transformShowcase"
              heading={data.transformShowcase.heading}
              sub={data.transformShowcase.sub}
              cta={data.transformShowcase.cta}
              input={data.transformShowcase.input}
              inputPrompt={data.transformShowcase.inputPrompt}
              outputs={data.transformShowcase.outputs}
              outputCols={data.transformShowcase.outputCols}
              onCtaClick={scrollToWorkspace}
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
          pricingBlock: data.pricingBlock ? (
            <PricingBlock
              key="pricingBlock"
              heading={data.pricingBlock.heading}
              sub={data.pricingBlock.sub}
            />
          ) : null,
          ctaBanner: data.ctaBanner ? (
            <CtaBanner
              key="ctaBanner"
              title={data.ctaBanner.title}
              button={data.ctaBanner.button}
              image={data.ctaBanner.image}
              video={data.ctaBanner.video}
              onClick={scrollToWorkspace}
            />
          ) : null,
          specs: data.specs ? (() => {
            const modelPage = data.kind === 'tool' ? getModelForTool(data) : null;
            const items = [...data.specs.items];
            if (data.kind === 'tool' && modelPage && !items.some((it) => it.label === 'Модель')) {
              items.push({ label: 'Модель', value: modelPage.modelName });
            }
            const renderValue = (label: string, value: string) => {
              if (data.kind === 'tool' && modelPage && label === 'Модель') {
                return (
                  <Link to="/tools/$slug" params={{ slug: modelPage.slug }} className="font-medium text-right underline decoration-dotted underline-offset-4 hover:text-primary transition-colors">
                    {value}
                  </Link>
                );
              }
              return <span className="font-medium text-right">{value}</span>;
            };
            return (
              <section key="specs" className="max-w-3xl mx-auto px-4 py-12">
                <h2 className="text-2xl md:text-[32px] font-bold mb-8 text-center md:text-left">{data.specs.heading}</h2>
                <div className="flex flex-col">
                  {items.map((it, i) => (
                    <div key={i} className="flex justify-between py-3 border-b border-border/60 gap-4">
                      <span className="text-muted-foreground">{it.label}</span>
                      {renderValue(it.label, it.value)}
                    </div>
                  ))}
                </div>
                {data.technologyDescription && (
                  <div className="mt-10">
                    <h3 className="text-lg md:text-xl font-semibold mb-3">Под капотом</h3>
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{data.technologyDescription}</p>
                  </div>
                )}
              </section>
            );
          })() : null,
          keyFeature: data.keyFeatureTitle ? (
            <section key="keyFeature" className="max-w-4xl mx-auto px-4 py-12">
              <h2 className="text-2xl md:text-[32px] font-bold mb-4">{data.keyFeatureTitle}</h2>
              {data.keyFeatureDescription && (
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{data.keyFeatureDescription}</p>
              )}
              {!data.specs && data.technologyDescription && (
                <div className="mt-10">
                  <h3 className="text-lg md:text-xl font-semibold mb-3">Под капотом</h3>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{data.technologyDescription}</p>
                </div>
              )}
            </section>
          ) : null,
          comparisonTable: data.comparisonTable ? (
            <section key="comparisonTable" className="max-w-5xl mx-auto px-4 py-12">
              <h2 className="text-2xl md:text-[32px] font-bold mb-8 text-center md:text-left">{data.comparisonTable.heading}</h2>
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
          featureBlocks: data.featureBlocks ? (() => {
            const withImg = data.featureBlocks.filter((b) => !!b.image);
            return (
              <section key="featureBlocks" className="max-w-5xl mx-auto px-4 py-12 flex flex-col gap-16">
                {withImg.map((b, i) => (
                  <div
                    key={`img-${i}`}
                    className={cn(
                      "flex flex-col gap-6 md:gap-12 items-center",
                      i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                    )}
                  >
                    <div className="md:w-1/2 w-full rounded-2xl border border-border overflow-hidden aspect-[4/3]">
                      <img src={b.image} alt={b.title} loading="lazy" width={800} height={600} className="w-full h-full object-cover" />
                    </div>
                    <div className="w-full md:w-1/2">
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
            );
          })() : null,
          tips: data.tips ? (
            <section key="tips" className="max-w-5xl mx-auto px-4 py-12">
              <h2 className="text-2xl md:text-[32px] font-bold mb-8 text-center md:text-left">{data.tips.heading}</h2>
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
              <h2 className="text-2xl md:text-[32px] font-bold mb-8 text-center md:text-left">{data.useCases.heading}</h2>
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
              <h2 className="text-2xl md:text-[32px] font-bold mb-3 text-center md:text-left">{data.modelChips.heading}</h2>
              {data.modelChips.sub && (
                <p className="text-muted-foreground text-center md:text-left mb-8 max-w-2xl mx-auto md:mx-0">{data.modelChips.sub}</p>
              )}
              {(() => {
                const all = data.modelChips.models.filter((m) => (m.slug ? isPublished(m.slug) : true));
                // Complete-rows only: 2→2, 3→3, 4→4(2×2), 5→4, 6→6(3×2), 7+→6
                const n = all.length;
                const shown = n >= 7 ? 6 : n === 5 ? 4 : n;
                const chips = all.slice(0, shown);
                const gridCols =
                  shown >= 6 ? "md:grid-cols-3" :
                  shown === 4 ? "md:grid-cols-2" :
                  shown === 3 ? "md:grid-cols-3" :
                  shown === 2 ? "md:grid-cols-2" :
                  "md:grid-cols-1";
                return (
              <div className={cn("grid grid-cols-1 sm:grid-cols-2 gap-4", gridCols)}>
                {chips.map((m) => {
                    const price = m.slug ? getModelPriceLabel(m.slug) : undefined;
                    const target = m.slug ? getToolPageData(m.slug) : undefined;
                    const desc = (m as any).desc || (target?.heroDescription ?? "");
                    const inner = (
                      <>
                        <ModelGlyph name={m.name} size={40} />
                        <div className="flex-1 min-w-0 flex flex-col">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-base truncate">{m.name}</span>
                            {m.badge && (
                              <span className="text-[10px] uppercase px-2 py-0.5 rounded-full bg-primary/15 text-primary shrink-0">
                                {m.badge}
                              </span>
                            )}
                          </div>
                          {desc && (
                            <p className="text-sm text-muted-foreground truncate mt-1">
                              {truncate(desc, 110)}
                            </p>
                          )}
                          <div className="mt-2 text-sm text-primary font-mono min-h-[1.25rem]">
                            {price ?? "\u00A0"}
                          </div>
                        </div>
                      </>
                    );
                    const base = "h-full rounded-xl border border-border bg-card p-5 transition-colors flex items-start gap-3";
                    return m.slug ? (
                      <Link
                        key={m.name}
                        to="/tools/$slug"
                        params={{ slug: m.slug }}
                        className={cn(base, "hover:border-primary/40 hover:bg-muted/50")}
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
                );
              })()}
            </section>
          ) : null,
          howItWorks: data.howItWorks ? (
            <section key="howItWorks" className="max-w-5xl mx-auto px-4 py-12">
              <h2 className="text-2xl md:text-[32px] font-bold mb-8 text-center md:text-left">
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
          modelTools: data.kind === 'model' ? (() => {
            const tools = getToolsForModel(data.slug);
            if (!tools.length) return null;
            if (tools.length === 1) {
              const t = tools[0];
              return (
                <section key="modelTools" className="max-w-5xl mx-auto px-4 py-12">
                  <h2 className="text-2xl md:text-[32px] font-bold mb-8 text-center md:text-left">Что делают на этой модели</h2>
                  <Link
                    to="/tools/$slug"
                    params={{ slug: t.slug }}
                    className="group flex items-center gap-5 rounded-2xl border border-white/10 bg-white/[0.04] shadow-sm p-6 hover:border-primary/40 hover:bg-white/[0.06] transition-colors"
                  >
                    <ModelGlyph name={t.heroTitle} size={48} />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg mb-1">{t.heroTitle}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                        {t.heroDescription}
                      </p>
                    </div>
                    <span aria-hidden className="shrink-0 text-primary text-2xl transition-transform group-hover:translate-x-1">→</span>
                  </Link>
                </section>
              );
            }
            return (
              <section key="modelTools" className="max-w-5xl mx-auto px-4 py-12">
                <h2 className="text-2xl md:text-[32px] font-bold mb-8 text-center md:text-left">Что делают на этой модели</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tools.map((t) => (
                    <Link
                      key={t.slug}
                      to="/tools/$slug"
                      params={{ slug: t.slug }}
                      className="rounded-xl border border-white/10 bg-white/[0.04] shadow-sm p-5 hover:border-primary/40 hover:bg-white/[0.06] transition-colors"
                    >
                      <h3 className="font-semibold mb-1">{t.heroTitle}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {t.heroDescription.length > 90 ? `${t.heroDescription.slice(0, 90).trimEnd()}…` : t.heroDescription}
                      </p>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })() : null,
        };

        // Широкий шаблон: модельные страницы видео и изображений
        const wideSlugs = [
          "kling", "sora", "veo", "seedance", "hailuo", "runway", "wan", "heygen",
          "nano-banana", "seedream", "flux", "gpt-image", "grok-imagine", "qwen-image",
        ];
        const isWidePilot = data.kind === "model" && wideSlugs.includes(data.slug);
        const videoOrder = [
          "capabilityCards",
          "showreel",
          "featureBlocks",
          "transformShowcase",
          "modelChips",
          "intro",
          "specs",
          "comparisonTable",
          "tips",
          "howItWorks",
          "audioShowreel",
          "promptAnswer",
          "pricingBlock",
          "ctaBanner",
        ];
        const imageOrder = [
          "capabilityCards",
          "transformShowcase",
          "gallery",
          "featureBlocks",
          "modelChips",
          "intro",
          "specs",
          "comparisonTable",
          "tips",
          "howItWorks",
          "pricingBlock",
          "ctaBanner",
        ];
        const baseModelOrder = ["showcaseStrip", "modelChips", "intro", "visualCards", "audioShowreel", "promptAnswer", "specs", "comparisonTable", "keyFeature", "featureBlocks", "showreel", "transformShowcase", "gallery", "tips", "useCases", "modelTools", "howItWorks"];
        const modelOrder =
          isWidePilot && data.category === "video"
            ? videoOrder
            : isWidePilot && data.category === "image"
              ? imageOrder
              : baseModelOrder;
        const toolOrder = ["intro", "showreel", "audioShowreel", "promptAnswer", "featureBlocks", "useCases", "howItWorks", "keyFeature", "specs", "modelChips"];
        const defaultOrder = data.kind === "model" ? modelOrder : toolOrder;
        // Optional per-page full override of section order (only affects pages that set it).
        const order: string[] = data.sectionOrder ?? defaultOrder;
        if (isWidePilot) {
          const rendered = order.filter((k) => sections[k]);
          return (
            <div className="tool-wide">
              {rendered.map((k, i) => (
                <div key={k} className={i % 2 === 0 ? "w-full bg-background" : "w-full bg-muted/30"}>
                  {sections[k]}
                </div>
              ))}
            </div>
          );
        }
        return <>{order.map((k) => sections[k])}</>;
      })()}

      {showRelated && (
        <section className="max-w-5xl mx-auto px-4 py-12">
          <h2 className="text-2xl md:text-[32px] font-bold mb-8 text-center md:text-left">Похожие инструменты</h2>
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
          <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-center">
            <button
              type="button"
              onClick={scrollToWorkspace}
              className="h-10 px-5 rounded-full font-semibold text-white transition-opacity hover:opacity-90 whitespace-nowrap"
              style={{ background: "hsl(var(--primary))" }}
            >
              Генерировать{stickyPriceLabel ? ` · ${stickyPriceLabel}` : ""}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ToolPage;
