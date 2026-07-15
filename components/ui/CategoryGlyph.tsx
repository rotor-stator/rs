import { ProductCategory } from "@/lib/types";

interface Props {
  category: ProductCategory;
  size?: number;
}

export default function CategoryGlyph({ category, size = 56 }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      {category === "stator" ? (
        <>
          <rect x="8" y="8" width="48" height="48" rx="8" stroke="#C8CDD7" strokeWidth="2.5" fill="none" />
          <ellipse cx="32" cy="32" rx="16" ry="16" stroke="var(--color-rs-orange)" strokeWidth="2.5" fill="none" />
          <ellipse cx="32" cy="32" rx="5" ry="5" stroke="var(--color-rs-orange)" strokeWidth="2" fill="none" />
        </>
      ) : (
        <>
          <ellipse cx="32" cy="32" rx="10" ry="24" stroke="var(--color-rs-orange)" strokeWidth="2.5" fill="none" />
          <path d="M20 16 Q32 8 44 16" stroke="#C8CDD7" strokeWidth="2" fill="none" />
          <path d="M20 32 Q32 24 44 32" stroke="#C8CDD7" strokeWidth="2" fill="none" />
          <path d="M20 48 Q32 40 44 48" stroke="#C8CDD7" strokeWidth="2" fill="none" />
        </>
      )}
    </svg>
  );
}
