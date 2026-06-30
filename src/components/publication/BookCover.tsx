import Image from "next/image";
import type { Publication } from "@/data/publications";
import { cn } from "@/lib/cn";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function monthYear(date: string): string {
  const [y, m] = date.split("-");
  const month = MONTHS[Number(m) - 1] ?? "";
  return `${month} ${y}`.toUpperCase();
}

function placeAndCountry(location: string): [string, string] {
  const [place, country] = location.split(",").map((s) => s.trim());
  return [place ?? location, country ?? ""];
}

interface BookCoverProps {
  publication: Publication;
  /** Render with next/image priority (above-the-fold covers). */
  priority?: boolean;
  sizes?: string;
  className?: string;
}

/**
 * The designed magazine cover: photography + editorial overlay (place, stacked
 * title, date and wordmark). This is what makes a publication read as a *book*,
 * not a thumbnail.
 */
export function BookCover({
  publication,
  priority,
  sizes = "(max-width: 768px) 60vw, 20vw",
  className,
}: BookCoverProps) {
  const [place, country] = placeAndCountry(publication.location);
  const titleWords = publication.title.split(" ");

  return (
    <div
      className={cn(
        "relative aspect-[18/25] w-full overflow-hidden bg-bg-sunken",
        className,
      )}
    >
      {publication.cover ? (
        <Image
          src={publication.cover}
          alt={`${publication.title}, cover`}
          fill
          priority={priority}
          sizes={sizes}
          className="object-cover"
        />
      ) : (
        // Coming-soon editions have no photo yet — a quiet dark placeholder.
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-br from-bg-raised via-bg-sunken to-black"
        />
      )}

      {/* Legibility gradients */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/10 to-black/85"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"
      />

      {/* Printed-cover hairline */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10"
      />

      {/* Overlay typography */}
      <div className="absolute inset-0 flex flex-col justify-between p-[7%]">
        <div className="space-y-0.5">
          <p className="font-sans text-[0.5rem] uppercase leading-tight tracking-[0.2em] text-white/85 sm:text-[0.6rem]">
            {place}
          </p>
          {country && (
            <p className="font-sans text-[0.5rem] uppercase leading-tight tracking-[0.2em] text-white/55 sm:text-[0.6rem]">
              {country}
            </p>
          )}
        </div>

        <div className="mt-auto">
          <h3 className="font-display uppercase leading-[0.86] text-white [font-size:clamp(1.1rem,2.4vw,2rem)]">
            {titleWords.map((word, i) => (
              <span key={i} className="block">
                {word}
              </span>
            ))}
          </h3>

          <div className="mt-[8%] flex items-end justify-between">
            <span className="font-sans text-[0.5rem] uppercase tracking-[0.2em] text-white/70 sm:text-[0.6rem]">
              {publication.status === "coming-soon"
                ? "Coming Soon"
                : monthYear(publication.date)}
            </span>
            <span className="flex items-baseline gap-1 leading-none">
              <span className="font-display text-xs tracking-wide text-white/90">
                JXL
              </span>
              <span className="font-sans text-[0.4rem] uppercase tracking-[0.3em] text-white/50">
                Visuals
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
