import { AuthCTALink } from "@/components/auth/AuthCTALink";

interface SeoEditorialBlockProps {
  heading: string;
  text: string;
  ctaLabel: string;
  ctaLink: string;
}

export function SeoEditorialBlock({ heading, text, ctaLabel, ctaLink }: SeoEditorialBlockProps) {
  return (
    <section style={{ padding: "80px 0" }}>
      <div className="max-w-[800px] mx-auto px-4 text-center">
        <h2 className="text-2xl md:text-[28px] font-bold mb-5 leading-snug" style={{ color: "var(--seo-heading)" }}>
          {heading}
        </h2>
        <p className="mb-8" style={{ fontSize: 15, color: "var(--seo-text)", lineHeight: 1.8 }}>
          {text}
        </p>
        <AuthCTALink
          to={ctaLink}
          className="inline-block font-semibold"
          style={{ background: "linear-gradient(135deg, hsl(var(--primary)), #ff7a3d)", color: "#fff", borderRadius: 12, padding: "14px 32px", fontSize: 15 }}
        >
          {ctaLabel}
        </AuthCTALink>
        <div style={{ borderBottom: "1px solid var(--seo-faq-border)", marginTop: 80, width: "100%" }} />
      </div>
    </section>
  );
}
