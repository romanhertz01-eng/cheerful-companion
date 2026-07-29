import { AuthCTALink } from "@/components/auth/AuthCTALink";

interface Step {
  title: string;
  text: string;
  ctaLabel?: string;
  ctaHref?: string;
  anchor?: string;
}
interface StepsBlockProps {
  heading: string;
  steps: Step[];
  anchor?: string;
}

export function StepsBlock({ heading, steps, anchor }: StepsBlockProps) {
  return (
    <section id={anchor} className="max-w-3xl mx-auto px-4 py-12">
      <h2 className="text-2xl md:text-[28px] font-bold mb-8 leading-snug" style={{ color: "var(--seo-heading)" }}>
        {heading}
      </h2>
      <ol className="space-y-6">
        {steps.map((s, i) => (
          <li
            key={i}
            id={s.anchor}
            className="flex gap-5 rounded-2xl border border-border bg-[hsl(var(--card))] p-5 md:p-6"
          >
            <div
              className="shrink-0 flex items-center justify-center rounded-xl font-bold text-white"
              style={{
                width: 48,
                height: 48,
                fontSize: 20,
                background: "linear-gradient(135deg, hsl(var(--primary)), #ff7a3d)",
              }}
            >
              {i + 1}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--seo-heading)" }}>
                {s.title}
              </h3>
              <p className="text-[15px] leading-relaxed" style={{ color: "var(--seo-text)" }}>
                {s.text}
              </p>
              {s.ctaLabel && s.ctaHref && (
                <div className="mt-4">
                  <AuthCTALink
                    to={s.ctaHref}
                    className="inline-flex items-center justify-center gradient-accent text-white font-semibold rounded-button px-5 py-2.5 text-sm hover:opacity-95 transition"
                  >
                    {s.ctaLabel}
                  </AuthCTALink>
                </div>
              )}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}