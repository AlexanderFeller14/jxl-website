"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { site } from "@/lib/site";
import { cn } from "@/lib/cn";
import { ThemeToggle } from "./ThemeToggle";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function Wordmark() {
  return (
    <Link
      href="/"
      aria-label={`${site.name}, home`}
      className="group flex items-baseline gap-2 leading-none"
    >
      <span className="font-display text-2xl tracking-wide text-ink-primary">
        {site.shortName}
      </span>
      <span className="u-eyebrow text-[0.6rem] tracking-[0.35em] text-ink-muted transition-colors duration-300 group-hover:text-ink-primary">
        Visuals
      </span>
    </Link>
  );
}

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock scroll when the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // The homepage hero is always dark. While the nav sits transparent over it
  // (top of page, menu closed), pin the nav to the dark theme so its text and
  // icons stay light, regardless of the visitor's light/dark choice. Once a
  // solid backdrop appears (scrolled) or the mobile menu opens, follow the page
  // theme again.
  const overHero = pathname === "/" && !scrolled && !open;

  return (
    <>
      <header
        data-theme={overHero ? "dark" : undefined}
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-colors duration-500 ease-editorial",
          scrolled || open
            ? "border-b border-line-hairline bg-bg-base/85 backdrop-blur-md"
            : "border-b border-transparent",
        )}
      >
        <nav className="mx-auto flex h-[72px] w-full max-w-[1680px] items-center justify-between px-6 md:px-10 lg:px-16 xl:px-20">
          <Wordmark />

          <div className="flex items-center gap-1 md:gap-7">
            {/* Desktop nav */}
            <ul className="hidden items-center gap-9 md:flex">
              {site.nav.map((item) => {
                const active = isActive(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "relative py-1 text-[0.7rem] uppercase tracking-[0.18em] transition-colors duration-300 ease-editorial",
                        active
                          ? "text-ink-primary"
                          : "text-ink-muted hover:text-ink-primary",
                      )}
                    >
                      {item.label}
                      <span
                        className={cn(
                          "absolute -bottom-0.5 left-0 h-px bg-accent transition-all duration-300 ease-editorial",
                          active ? "w-full" : "w-0",
                        )}
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>

            <ThemeToggle />

            {/* Mobile menu button */}
            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((v) => !v)}
              className="relative z-50 -mr-2 flex h-11 w-11 items-center justify-center md:hidden"
            >
              <span className="sr-only">Menu</span>
              <div className="flex flex-col items-end gap-[5px]">
                <span
                  className={cn(
                    "block h-px bg-ink-primary transition-all duration-300 ease-editorial",
                    open ? "w-5 translate-y-[6px] rotate-45" : "w-5",
                  )}
                />
                <span
                  className={cn(
                    "block h-px bg-ink-primary transition-all duration-300 ease-editorial",
                    open ? "w-5 -translate-y-[5px] -rotate-45" : "w-4",
                  )}
                />
              </div>
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile overlay menu — a SIBLING of <header> so the header's
          backdrop-filter doesn't trap this fixed layer (it would otherwise
          collapse to the 72px header height). */}
      <div
        id="mobile-menu"
        className={cn(
          "fixed inset-0 z-40 bg-bg-base transition-opacity duration-500 ease-editorial md:hidden",
          open
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0",
        )}
        aria-hidden={!open}
      >
        <div className="flex h-full flex-col px-7 pb-[max(2rem,env(safe-area-inset-bottom))] pt-[72px]">
          <nav
            aria-label="Mobile"
            className="flex flex-1 flex-col justify-center"
          >
            {site.nav.map((item, i) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex items-baseline gap-4 border-b border-line-hairline py-4 first:border-t"
                  style={{
                    transform: open ? "translateY(0)" : "translateY(14px)",
                    opacity: open ? 1 : 0,
                    transition:
                      "transform 0.5s cubic-bezier(0.22,1,0.36,1), opacity 0.5s cubic-bezier(0.22,1,0.36,1)",
                    transitionDelay: open ? `${80 + i * 55}ms` : "0ms",
                  }}
                >
                  <span
                    className={cn(
                      "w-7 shrink-0 font-sans text-[0.7rem] tabular-nums tracking-[0.2em] transition-colors duration-300",
                      active ? "text-accent" : "text-ink-faint",
                    )}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    style={{ fontSize: "clamp(1.55rem, 7.5vw, 2.4rem)" }}
                    className={cn(
                      "u-display leading-[1.04] transition-colors duration-300",
                      active
                        ? "text-accent"
                        : "text-ink-primary group-hover:text-accent",
                    )}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Sign-off: direct contact at arm's reach */}
          <div
            className="mt-10 flex flex-wrap items-center justify-between gap-x-6 gap-y-3"
            style={{
              opacity: open ? 1 : 0,
              transition: "opacity 0.5s ease",
              transitionDelay: open ? `${80 + site.nav.length * 55}ms` : "0ms",
            }}
          >
            <a
              href={`mailto:${site.email}`}
              className="text-sm text-ink-muted transition-colors duration-300 hover:text-ink-primary"
            >
              {site.email}
            </a>
            <div className="flex gap-5">
              {site.social.map((s) => (
                <a
                  key={s.href}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[0.7rem] uppercase tracking-[0.16em] text-ink-faint transition-colors duration-300 hover:text-ink-primary"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
