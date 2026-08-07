import { useState } from "react";

interface ModelGalleryProps {
  heading: string;
  images: string[];
  initialCount?: number;
}

export function ModelGallery({ heading, images, initialCount = 12 }: ModelGalleryProps) {
  const [shown, setShown] = useState(initialCount);

  if (!images.length) return null;

  const visibleImages = images.slice(0, shown);
  const canShowMore = shown < images.length;

  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <h2 className="text-2xl md:text-[32px] font-bold mb-10 text-center md:text-left">{heading}</h2>
      <div className="columns-2 md:columns-4 lg:columns-5 gap-4">
        {visibleImages.map((src, i) => (
          <div key={`${src}-${i}`} className="break-inside-avoid mb-4">
            <img
              src={src}
              alt={`${heading} — пример ${i + 1}`}
              loading="lazy"
              width={800}
              height={1000}
              className="w-full h-auto rounded-xl border border-white/10"
            />
          </div>
        ))}
      </div>
      {canShowMore && (
        <div className="text-center mt-8">
          <button
            type="button"
            onClick={() => setShown((s) => s + 8)}
            className="rounded-full border border-white/15 px-8 py-3 text-sm font-medium hover:border-primary/40 hover:bg-white/[0.04] transition-colors"
          >
            Показать ещё
          </button>
        </div>
      )}
    </section>
  );
}
