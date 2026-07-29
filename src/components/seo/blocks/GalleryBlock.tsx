import { Heart, Eye } from "lucide-react";
import { CommunityGallery } from "../CommunityGallery";

interface GalleryItem {
  image: string;
  author?: string;
  likes?: number;
  views?: number;
}

interface GalleryBlockProps {
  title?: string;
  count?: number;
  type?: "image" | "video";
  items?: GalleryItem[];
  showMeta?: boolean;
}

export function GalleryBlock({ title = "Работы сообщества", count, type, items, showMeta = true }: GalleryBlockProps) {
  if (!items || items.length === 0) {
    return <CommunityGallery title={title} count={count} type={type} />;
  }

  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <h2 className="text-2xl md:text-[32px] font-bold mb-8 text-center">{title}</h2>
      <div className="columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3">
        {items.map((w, i) => (
          <div
            key={w.image + i}
            className="break-inside-avoid rounded-xl border border-border bg-card shadow-sm relative overflow-hidden cursor-pointer hover:scale-[1.02] hover:border-primary/40 hover:bg-muted/50 transition-all group"
          >
            <img src={w.image} alt={w.author ?? `${title} — ${i + 1}`} loading="lazy" className="w-full h-auto block object-cover" />
            {showMeta && w.author && (
            <div className="absolute bottom-0 left-0 right-0 p-2.5 bg-gradient-to-t from-black/60 to-transparent flex items-center justify-between">
              <span className="text-white text-[11px]">{w.author}</span>
              <div className="flex items-center gap-2 text-white/70 text-[10px]">
                {typeof w.likes === "number" && (
                  <span className="flex items-center gap-0.5"><Heart className="w-3 h-3" /> {w.likes}</span>
                )}
                {typeof w.views === "number" && (
                  <span className="flex items-center gap-0.5"><Eye className="w-3 h-3" /> {w.views}</span>
                )}
              </div>
            </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}