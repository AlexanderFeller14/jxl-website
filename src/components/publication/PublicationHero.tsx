import Link from "next/link";
import type { Publication } from "@/data/publications";
import { getTotalPhotoCount } from "@/lib/publications";
import { cn } from "@/lib/cn";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ButtonLink } from "@/components/ui/Button";
import { BookCoverMockup } from "./BookCoverMockup";

interface PublicationHeroProps {
  publication: Publication;
  /** "detail" anchors to the on-page gallery; "preview" links to the detail route. */
  mode?: "detail" | "preview";
  className?: string;
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[7rem_1fr] gap-4 py-2.5">
      <dt className="text-[0.65rem] uppercase tracking-[0.18em] text-ink-faint">
        {label}
      </dt>
      <dd className="text-[0.8rem] uppercase tracking-[0.08em] text-ink-primary">
        {value}
      </dd>
    </div>
  );
}

export function PublicationHero({
  publication: p,
  mode = "detail",
  className,
}: PublicationHeroProps) {
  const comingSoon = p.status === "coming-soon";
  const galleryHref = mode === "detail" ? "#gallery" : `/publications/${p.slug}#gallery`;

  return (
    <div
      className={cn(
        "grid items-center gap-12 lg:grid-cols-[1fr_0.9fr] lg:gap-20",
        className,
      )}
    >
      {/* Left, editorial info */}
      <div>
        {mode === "detail" ? (
          <nav
            aria-label="Breadcrumb"
            className="mb-8 flex items-center gap-2 text-[0.65rem] uppercase tracking-[0.16em] text-ink-faint"
          >
            <Link href="/publications" className="hover:text-ink-primary">
              Publications
            </Link>
            <span aria-hidden>/</span>
            <span className="text-ink-muted">{p.title}</span>
          </nav>
        ) : (
          <Eyebrow accent className="mb-6">
            Featured Edition
          </Eyebrow>
        )}

        <h1 className="u-display text-display-sm text-balance">{p.title}</h1>
        <p className="mt-4 text-sm uppercase tracking-[0.14em] text-ink-muted">
          {p.subtitle}
        </p>

        <p className="mt-8 max-w-measure text-base leading-relaxed text-ink-muted md:text-[1.0625rem]">
          {p.description}
        </p>

        {/* Meta table */}
        <dl className="mt-10 max-w-md divide-y divide-line-hairline border-y border-line-hairline">
          <MetaRow label="Circuit" value={p.circuit} />
          <MetaRow label="Location" value={p.location} />
          <MetaRow label="Date" value={p.dateLabel} />
          <MetaRow label="Format" value={p.format} />
          <MetaRow
            label="Photos"
            value={comingSoon ? "Coming soon" : String(getTotalPhotoCount(p))}
          />
        </dl>

        {/* Actions */}
        <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-4">
          {!comingSoon ? (
            <ButtonLink href={galleryHref} variant="primary" arrow>
              View Gallery
            </ButtonLink>
          ) : (
            <p className="text-[0.7rem] uppercase tracking-[0.2em] text-ink-muted">
              Full publication coming soon
            </p>
          )}
        </div>
      </div>

      {/* Right, book mockup */}
      <div className="order-first lg:order-none">
        <div className="mx-auto w-[64%] max-w-[320px] lg:w-[88%] lg:max-w-none">
          <BookCoverMockup publication={p} />
        </div>
      </div>
    </div>
  );
}
