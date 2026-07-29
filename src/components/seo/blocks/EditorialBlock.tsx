import { AuthCTALink } from "@/components/auth/AuthCTALink";
import { SeoEditorialBlock } from "../SeoEditorialBlock";

interface EditorialBlockProps {
  heading: string;
  text?: string;
  paragraphs?: string[];
  anchor?: string;
  cta?: { label: string; href: string };
}

export function EditorialBlock({ heading, text, paragraphs, anchor, cta }: EditorialBlockProps) {
  if (paragraphs && paragraphs.length) {
    return (
      <section id={anchor} style={{ padding: "56px 0" }}>
        <div className="max-w-3xl mx-auto px-4">
          <h2
            className="text-2xl md:text-[28px] font-bold mb-6 leading-snug"
            style={{ color: "var(--seo-heading)" }}
          >
            {heading}
          </h2>
          <div className="space-y-5">
            {paragraphs.map((p, i) => (
              <p key={i} style={{ fontSize: 16, color: "var(--seo-text)", lineHeight: 1.75 }}>
                {p}
              </p>
            ))}
          </div>
          {cta && (
            <div className="mt-8">
              <AuthCTALink
                to={cta.href}
                className="inline-flex items-center justify-center gradient-accent text-white font-semibold rounded-button px-6 py-3 text-sm hover:opacity-95 transition"
              >
                {cta.label}
              </AuthCTALink>
            </div>
          )}
        </div>
      </section>
    );
  }
  return (
    <section id={anchor}>
      <SeoEditorialBlock
        heading={heading}
        text={text ?? ""}
        ctaLabel={cta?.label ?? "Начать бесплатно"}
        ctaLink={cta?.href ?? "/"}
      />
    </section>
  );
}