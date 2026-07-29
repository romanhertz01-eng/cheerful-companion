import { FAQ, toolPageItems } from "@/components/shared/FAQ";

interface FaqItem { q: string; a: string }
interface FaqBlockProps {
  items?: FaqItem[];
  title?: string;
  subtitle?: string;
  anchor?: string;
}

export function FaqBlock({ items, title, subtitle, anchor }: FaqBlockProps) {
  return (
    <div id={anchor}>
      <FAQ items={items ?? toolPageItems} title={title} subtitle={subtitle} />
    </div>
  );
}