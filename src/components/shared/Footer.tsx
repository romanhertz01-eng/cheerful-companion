import { Link } from "@tanstack/react-router";

const productLinks = [
  { label: "Главная", to: "/" },
  { label: "Текст", to: "/ai/text" },
  { label: "Изображения", to: "/ai/image" },
  { label: "Видео", to: "/ai/video" },
  { label: "Аудио", to: "/ai/audio" },
  { label: "Агенты", to: "/ai/agents" },
  { label: "Гайды", to: "/guides" },
  { label: "Тарифы", to: "/pricing" },
];

const toolsLinks = [
  { label: "Оживить фото", to: "/tools/ozhivit-foto" },
  { label: "Генератор изображений", to: "/tools/image-generation" },
  { label: "Создать видео", to: "/tools/video-generation" },
  { label: "Удалить фон", to: "/tools/remove-background" },
  { label: "Апскейл", to: "/tools/image-upscaler" },
  { label: "Реставрация фото", to: "/tools/photo-restoration" },
  { label: "Озвучка текста", to: "/tools/text-to-speech" },
  { label: "ChatGPT", to: "/tools/chatgpt" },
  { label: "Sora", to: "/tools/sora" },
];

function FooterColumn({ title, links }: { title: string; links: { label: string; to: string }[] }) {
  return (
    <div>
      <h4 className="mb-4 font-mono text-[11px] uppercase tracking-[0.14em] text-[hsl(var(--muted-foreground))]">
        {title}
      </h4>
      <ul className="space-y-2.5">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              to={link.to}
              className="text-sm text-[hsl(var(--foreground))] hover:text-[#ff7a3d] transition-colors"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-[hsl(var(--border))] bg-[hsl(var(--card))] mt-20">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-[1.6fr_1fr_1fr] gap-12">
        {/* Brand */}
        <div>
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <span
              className="flex items-center justify-center font-bold text-white select-none"
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: "linear-gradient(135deg, #E85420, #ff7a3d)",
                fontSize: 18,
                letterSpacing: "-0.02em",
                boxShadow: "0 2px 8px rgba(232, 84, 32, 0.3)",
              }}
            >
              E
            </span>
            <span className="text-[20px] font-semibold tracking-tight" style={{ color: "var(--c-fg)" }}>
              era<span style={{ color: "var(--c-accent-2)" }}>2</span>
            </span>
          </Link>
          <p className="mt-4 text-sm text-[hsl(var(--muted-foreground))] max-w-[320px] leading-relaxed">
            Все нейросети в одном месте. Единая подписка, оплата в рублях.
          </p>
        </div>

        <FooterColumn title="Продукт" links={productLinks} />
        <FooterColumn title="Инструменты" links={toolsLinks} />
      </div>

      <div className="border-t border-[hsl(var(--border))]">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row justify-between items-center gap-2">
          <span className="flex items-center gap-2 text-[hsl(var(--muted-foreground))]">
            <span
              className="flex items-center justify-center font-bold text-white select-none"
              style={{ width: 20, height: 20, borderRadius: 5, background: "linear-gradient(135deg, #E85420, #ff7a3d)", fontSize: 11 }}
            >
              E
            </span>
            <span className="text-xs">
              © 2026 era<span style={{ color: "var(--c-accent-2)" }}>2</span>.ai
            </span>
          </span>
          <span className="font-mono text-xs text-[hsl(var(--muted-foreground))]">
            v1.0.0
          </span>
        </div>
      </div>
    </footer>
  );
}
