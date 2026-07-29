import { AuthCTALink } from "@/components/auth/AuthCTALink";

interface HeroBlockProps {
  h1: string;
  subtitle?: string;
  primaryCta?: string;
  ctaHref?: string;
}

export function HeroBlock({ h1, subtitle, primaryCta, ctaHref = "/" }: HeroBlockProps) {
  return (
    <section
      className="px-4"
      style={{
        padding: "80px 16px 60px",
        background:
          "radial-gradient(1200px 400px at 50% 0%, hsl(var(--primary) / 0.12), transparent 70%)",
      }}
    >
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-[28px] md:text-[44px] font-bold leading-tight tracking-tight">
          {h1}
        </h1>
        {subtitle && (
          <p className="text-muted-foreground mt-5 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
            {subtitle}
          </p>
        )}
        {primaryCta && (
          <div className="mt-8">
            <AuthCTALink
              to={ctaHref}
              className="inline-flex items-center justify-center gradient-accent text-white font-semibold rounded-button px-7 py-3.5 text-[15px] shadow-sm hover:opacity-95 transition"
            >
              {primaryCta}
            </AuthCTALink>
          </div>
        )}
      </div>
    </section>
  );
}