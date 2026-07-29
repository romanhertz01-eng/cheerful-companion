interface BlockPlaceholderProps {
  type: string;
}

export function BlockPlaceholder({ type }: BlockPlaceholderProps) {
  if (!import.meta.env.DEV) return null;
  return (
    <section className="max-w-5xl mx-auto px-4 py-8">
      <div className="border border-dashed border-white/15 rounded-xl py-10 flex items-center justify-center">
        <span className="text-sm text-muted-foreground">блок: {type}</span>
      </div>
    </section>
  );
}