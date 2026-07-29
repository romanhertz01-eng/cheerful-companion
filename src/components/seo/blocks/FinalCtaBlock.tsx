import { AuthCTALink } from "@/components/auth/AuthCTALink";

interface FinalCtaBlockProps {
  title: string;
  subtitle?: string;
  button: string;
  href: string;
}

export function FinalCtaBlock({ title, subtitle, button, href }: FinalCtaBlockProps) {
  return (
    <section className="px-4" style={{ padding: "80px 16px" }}>
      <div
        className="max-w-4xl mx-auto text-center rounded-3xl border border-border p-10 md:p-14"
        style={{
          background:
            "radial-gradient(800px 300px at 50% 0%, hsl(var(--primary) / 0.12), transparent 70%), var(--seo-card-bg, hsl(var(--card)))",
        }}
      >
        <h2 className="text-2xl md:text-[32px] font-bold leading-tight">{title}</h2>
        {subtitle && (
          <p className="text-muted-foreground mt-4 text-base md:text-lg">{subtitle}</p>
        )}
        <div className="mt-8">
          <AuthCTALink
            to={href}
            className="inline-flex items-center justify-center gradient-accent text-white font-semibold rounded-button px-7 py-3.5 text-[15px] shadow-sm hover:opacity-95 transition"
          >
            {button}
          </AuthCTALink>
        </div>
      </div>
    </section>
  );
}