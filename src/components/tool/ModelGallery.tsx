import { useState } from "react";

interface ModelGalleryProps {
  heading: string;
  images: string[];
  initialCount?: number;
}

const aspectRatioByIndex = (i: number) => {
  if (i % 3 === 0) return "aspect-[3/4]";
  if (i % 3 === 1) return "aspect-[1/1]";
  return "aspect-[4/5]";
};

export function ModelGallery({ heading, images, initialCount = 12 }: ModelGalleryProps) {
  const [shown, setShown] = useState(initialCount);

  if (!images.length) return null;

  const visibleImages = images.slice(0, shown);
  const canShowMore = shown < images.length;

  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <h2 className="text-2xl md:text-[32px] font-bold mb-10 text-center">{heading}</h2>
      <div className="columns-2 md:columns-4 gap-4">
        {visibleImages.map((src, i) => (
          <div key={`${src}-${i}`} className={`break-inside-avoid mb-4 ${aspectRatioByIndex(i)}`}>
            <img
              src={src}
              alt={`${heading} — пример ${i + 1}`}
              loading="lazy"
              className="w-full h-full object-cover rounded-xl border border-white/10"
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
