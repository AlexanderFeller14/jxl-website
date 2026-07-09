import Link from "next/link";
import type { Publication } from "@/data/publications";
import { getTotalPhotoCount, getYear } from "@/lib/publications";
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
  return `${getTotalPhotoCount(p)} Photos`;
}

/**
 * A collectible publication, rendered as a book cover. The interaction stays
 * editorial and restrained: on hover the photograph zooms slowly *within* its
 * fixed frame while the cover lifts a touch and its shadow softens — the way a
 * printed magazine catches the eye, with no tilt or gloss.
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
      {/* Cover frame — lifts gently; the photo inside scales, the frame holds */}
      <div
        className={cn(
          "relative shadow-book",
          "transition-[transform,box-shadow] duration-700 ease-editorial",
          "group-hover:-translate-y-1.5 group-hover:shadow-book-hover",
          // Touch devices have no hover — give a tap the same gentle lift.
          "group-active:-translate-y-1.5 group-active:shadow-book-hover",
        )}
      >
        {/* Bound-edge shadow on the spine side */}
        <span
          aria-hidden
          className="absolute left-0 top-0 bottom-0 z-20 w-3 bg-gradient-to-r from-black/35 to-transparent"
        />

        <BookCover
          publication={publication}
          priority={priority}
          sizes={sizes}
          imageClassName="transition-transform duration-[1500ms] ease-editorial will-change-transform group-hover:scale-[1.06]"
        />
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
