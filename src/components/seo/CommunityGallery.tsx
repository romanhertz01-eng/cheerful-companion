interface CommunityGalleryProps {
  title?: string;
  count?: number;
  type?: "image" | "video";
  items?: unknown[];
}

export function CommunityGallery({ items }: CommunityGalleryProps) {
  if (!items || items.length === 0) return null;
  return null;
}
