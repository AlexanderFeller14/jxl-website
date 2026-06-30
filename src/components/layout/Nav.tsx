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

  return (
    <header
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
          onClick={() => setOpen((v) => !v)}
          className="relative z-50 flex h-10 w-10 items-center justify-center md:hidden"
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

      {/* Mobile overlay menu */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-bg-base transition-opacity duration-500 ease-editorial md:hidden",
          open
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0",
        )}
      >
        <ul className="flex h-full flex-col justify-center gap-3 px-8">
          {site.nav.map((item, i) => {
            const active = isActive(pathname, item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "u-display block text-5xl transition-colors duration-300",
                    active ? "text-ink-primary" : "text-ink-faint",
                  )}
                  style={{ transitionDelay: open ? `${i * 40}ms` : "0ms" }}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </header>
  );
}
