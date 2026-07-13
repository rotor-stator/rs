// Root layout — html/body are provided by [locale]/layout.tsx
// This wrapper is required by Next.js App Router conventions.
import type { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
