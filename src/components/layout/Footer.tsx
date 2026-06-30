import Link from "next/link";
import { site } from "@/lib/site";

export function Footer() {
  const year = 2026;

  return (
    <footer className="border-t border-line-hairline bg-bg-base">
      <div className="mx-auto w-full max-w-[1680px] px-6 md:px-10 lg:px-16 xl:px-20">
        {/* Editorial sign-off */}
        <div className="grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr] md:py-24">
          <div className="max-w-measure-sm">
            <Link href="/" className="flex items-baseline gap-2 leading-none">
              <span className="font-display text-3xl tracking-wide text-ink-primary">
                {site.shortName}
              </span>
              <span className="u-eyebrow text-[0.6rem] tracking-[0.35em]">
                Visuals
              </span>
            </Link>
            <p className="mt-6 text-sm leading-relaxed text-ink-muted">
              {site.description}
            </p>
          </div>

          <nav aria-label="Footer">
            <p className="u-eyebrow mb-5">Index</p>
            <ul className="space-y-3">
              {site.nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-ink-muted transition-colors duration-300 hover:text-ink-primary"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="u-eyebrow mb-5">Connect</p>
            <ul className="space-y-3">
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="text-sm text-ink-muted transition-colors duration-300 hover:text-ink-primary"
                >
                  {site.email}
                </a>
              </li>
              {site.social.map((s) => (
                <li key={s.href}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-ink-muted transition-colors duration-300 hover:text-ink-primary"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-line-hairline py-7 text-[0.7rem] uppercase tracking-[0.14em] text-ink-faint sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.name}. All rights reserved.
          </p>
          <p>{site.tagline}</p>
        </div>
      </div>
    </footer>
  );
}
