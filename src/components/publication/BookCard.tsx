import Link from "next/link";
import type { Publication } from "@/data/publications";
import { getYear } from "@/lib/publications";
import { cn } from "@/lib/cn";
import { BookCover } from "./BookCover";

interface BookCardProps {
  publication: Publication;
  priority?: boolean;
  sizes?: string;
  className?: string;
  /** Hook for the desktop featured-preview hover. */
  onActivate?: () => void;
}

function meta(p: Publication): string {
  if (p.status === "coming-soon") return "Coming Soon";
  if (p.pages) return `${p.pages} Pages`;
  return `${p.gallery.reduce((n, s) => n + s.images.length, 0)} Photos`;
}

/**
 * A collectible publication, rendered as a tactile book:
 * cover artwork + page-edge depth, with a soft lift / rotation on hover.
 */
export function BookCard({
  publication,
  priority,
  sizes,
  className,
}: BookCardProps) {
  const [place] = publication.location.split(",");
  const year = getYear(publication.date);

  return (
    <Link
      href={`/publications/${publication.slug}`}
      className={cn("group block", className)}
      aria-label={`${publication.title}, open publication`}
    >
      {/* Book object */}
      <div className="[perspective:1400px]">
        <div
          className={cn(
            "relative transition-[transform,filter] duration-500 ease-editorial",
            "drop-shadow-[0_18px_40px_rgba(0,0,0,0.55)]",
            "group-hover:-translate-y-2 group-hover:[transform:rotate(-0.9deg)]",
            "group-hover:drop-shadow-[0_36px_70px_rgba(0,0,0,0.7)]",
          )}
        >
          {/* Page-block edge (right + bottom) for book thickness */}
          <span
            aria-hidden
            className="absolute -right-1 top-1 bottom-1 w-1.5 rounded-r-[1px] bg-gradient-to-r from-white/25 via-white/5 to-transparent"
          />
          {/* Spine shadow on the left */}
          <span
            aria-hidden
            className="absolute left-0 top-0 bottom-0 z-10 w-3 bg-gradient-to-r from-black/40 to-transparent"
          />
          <BookCover
            publication={publication}
            priority={priority}
            sizes={sizes}
          />
        </div>
      </div>

      {/* Caption */}
      <div className="mt-6">
        <h3 className="font-display text-lg uppercase leading-none tracking-wide text-ink-primary transition-colors duration-300 group-hover:text-white">
          {publication.title}
        </h3>
        <p className="mt-2 text-[0.7rem] uppercase tracking-[0.16em] text-ink-muted">
          {place} · {year}
        </p>
        <p className="mt-1 text-[0.7rem] uppercase tracking-[0.16em] text-ink-faint">
          {meta(publication)}
        </p>
      </div>
    </Link>
  );
}
