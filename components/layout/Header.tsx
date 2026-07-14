"use client";

import Link from "next/link";
import { useCart } from "@/components/cart/CartContext";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { ShoppingCart } from "lucide-react";
import Logo from "@/components/Logo";

const LOCALES = [
  { code: "en", label: "EN", flag: "🇬🇧" },
  { code: "es", label: "ES", flag: "🇪🇸" },
];

export default function Header() {
  const { totalItems } = useCart();
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  function switchLocale(next: string) {
    // pathname starts with /en/ or /es/ — swap the segment
    const segments = pathname.split("/");
    segments[1] = next;
    router.push(segments.join("/") || "/");
  }

  return (
    <header
      style={{
        backgroundColor: "var(--color-rs-ink)",
        borderBottom: "2px solid var(--color-rs-orange)",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 24px",
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <Link href={`/${locale}`} style={{ display: "flex", alignItems: "center" }}>
          <Logo variant="dark" height={28} />
        </Link>

        {/* Right side */}
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          {/* Nav links */}
          <nav style={{ display: "flex", gap: 24 }}>
            {[
              { href: `/${locale}/stator`, label: t("stator") },
              { href: `/${locale}/rotor`, label: t("rotor") },
              { href: `/${locale}/contact`, label: t("contact") },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                style={{
                  color: "var(--color-rs-border)",
                  textDecoration: "none",
                  fontSize: 13,
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  transition: "color 0.15s",
                }}
                onMouseEnter={(e) =>
                  ((e.target as HTMLElement).style.color = "var(--color-rs-orange)")
                }
                onMouseLeave={(e) =>
                  ((e.target as HTMLElement).style.color = "var(--color-rs-border)")
                }
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Cart */}
          <Link
            href={`/${locale}/cart`}
            style={{
              position: "relative",
              color: "var(--color-rs-border)",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
            }}
          >
            <ShoppingCart size={22} />
            {totalItems > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: -8,
                  right: -10,
                  backgroundColor: "var(--color-rs-orange)",
                  color: "#fff",
                  borderRadius: "50%",
                  width: 18,
                  height: 18,
                  fontSize: 11,
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {totalItems}
              </span>
            )}
          </Link>

          {/* Language switcher */}
          <div style={{ display: "flex", gap: 4 }}>
            {LOCALES.map(({ code, label, flag }) => (
              <button
                key={code}
                onClick={() => switchLocale(code)}
                style={{
                  background: locale === code ? "var(--color-rs-orange)" : "transparent",
                  border: "1px solid",
                  borderColor:
                    locale === code ? "var(--color-rs-orange)" : "var(--color-rs-mid)",
                  color: locale === code ? "#fff" : "var(--color-rs-border)",
                  borderRadius: 2,
                  padding: "2px 8px",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.05em",
                  cursor: "pointer",
                  fontFamily: "var(--font-sans)",
                }}
              >
                {flag} {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
