"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "@/components/cart/CartContext";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { ShoppingCart, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Logo from "@/components/Logo";
import { routing } from "@/i18n/routing";

// Add an entry here whenever a new locale is added to routing.locales.
const LOCALE_META: Record<string, { label: string; flag: string }> = {
  en: { label: "EN", flag: "🇬🇧" },
  es: { label: "ES", flag: "🇪🇸" },
};

const DRAWER_TRANSITION = { duration: 0.28, ease: "easeOut" as const };

export default function Header() {
  const { totalItems } = useCart();
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  function switchLocale(next: string) {
    // pathname starts with /en/ or /es/ — swap the segment
    const segments = pathname.split("/");
    segments[1] = next;
    router.push(segments.join("/") || "/");
    setMenuOpen(false);
  }

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const navLinks = [
    { href: `/${locale}/search`, label: t("findAPart") },
    { href: `/${locale}/contact`, label: t("contact") },
  ];

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
        {/* Logo — full wordmark on desktop */}
        <Link
          href={`/${locale}`}
          className="rs-logo-desktop"
          style={{ display: "flex", alignItems: "center" }}
        >
          <Logo variant="dark" height={28} />
        </Link>
        {/* Logo — icon only on mobile */}
        <Link
          href={`/${locale}`}
          className="rs-logo-mobile"
          style={{ alignItems: "center" }}
        >
          <Logo variant="dark" height={24} iconOnly />
        </Link>

        {/* Desktop right side */}
        <div className="rs-desktop-right" style={{ alignItems: "center", gap: 24 }}>
          <nav style={{ display: "flex", gap: 24 }}>
            {navLinks.map(({ href, label }) => (
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

          <CartLink locale={locale} totalItems={totalItems} />

          {/* Language switcher — hidden while only one locale is configured */}
          {routing.locales.length > 1 && (
            <div style={{ display: "flex", gap: 4 }}>
              {routing.locales.map((code) => {
                const meta = LOCALE_META[code] ?? { label: code.toUpperCase(), flag: "" };
                return (
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
                    {meta.flag} {meta.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Mobile right side — cart + hamburger only */}
        <div className="rs-mobile-right" style={{ alignItems: "center", gap: 18 }}>
          <CartLink locale={locale} totalItems={totalItems} />
          <button
            aria-label="Open menu"
            onClick={() => setMenuOpen(true)}
            style={{
              display: "flex",
              alignItems: "center",
              background: "none",
              border: "none",
              padding: 0,
              cursor: "pointer",
              color: "var(--color-rs-border)",
            }}
          >
            <Menu size={26} />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={DRAWER_TRANSITION}
              onClick={() => setMenuOpen(false)}
              style={{
                position: "fixed",
                inset: 0,
                backgroundColor: "rgba(20,24,32,0.55)",
                zIndex: 100,
              }}
            />
            <motion.div
              key="panel"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={DRAWER_TRANSITION}
              style={{
                position: "fixed",
                top: 0,
                right: 0,
                bottom: 0,
                width: "min(320px, 82vw)",
                backgroundColor: "var(--color-rs-ink)",
                zIndex: 101,
                display: "flex",
                flexDirection: "column",
                padding: "20px 24px 32px",
                boxShadow: "-16px 0 40px rgba(0,0,0,0.3)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 24 }}>
                <button
                  aria-label="Close menu"
                  onClick={() => setMenuOpen(false)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    background: "none",
                    border: "none",
                    padding: 0,
                    cursor: "pointer",
                    color: "var(--color-rs-border)",
                  }}
                >
                  <X size={26} />
                </button>
              </div>

              <nav style={{ display: "flex", flexDirection: "column" }}>
                {navLinks.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMenuOpen(false)}
                    style={{
                      padding: "18px 4px",
                      fontSize: 16,
                      fontWeight: 700,
                      color: "var(--color-rs-border)",
                      textDecoration: "none",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      borderBottom: "1px solid var(--color-rs-mid)",
                    }}
                  >
                    {label}
                  </Link>
                ))}
              </nav>

              {routing.locales.length > 1 && (
                <div style={{ marginTop: "auto", paddingTop: 24, borderTop: "1px solid var(--color-rs-mid)" }}>
                  <p
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "var(--color-rs-mid)",
                      margin: "0 0 12px",
                    }}
                  >
                    Language
                  </p>
                  <div style={{ display: "flex", gap: 8 }}>
                    {routing.locales.map((code) => {
                      const meta = LOCALE_META[code] ?? { label: code.toUpperCase(), flag: "" };
                      return (
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
                            padding: "6px 14px",
                            fontSize: 13,
                            fontWeight: 700,
                            letterSpacing: "0.05em",
                            cursor: "pointer",
                            fontFamily: "var(--font-sans)",
                          }}
                        >
                          {meta.flag} {meta.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style>{`
        .rs-logo-mobile { display: none; }
        .rs-desktop-right { display: flex; }
        .rs-mobile-right { display: none; }
        @media (max-width: 767px) {
          .rs-logo-desktop { display: none !important; }
          .rs-logo-mobile { display: flex !important; }
          .rs-desktop-right { display: none !important; }
          .rs-mobile-right { display: flex !important; }
        }
      `}</style>
    </header>
  );
}

function CartLink({ locale, totalItems }: { locale: string; totalItems: number }) {
  return (
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
  );
}
