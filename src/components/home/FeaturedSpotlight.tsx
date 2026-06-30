import type { Publication } from "@/data/publications";
import { getYear } from "@/lib/publications";
import { Container } from "@/components/layout/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { BookCoverMockup } from "@/components/publication/BookCoverMockup";

/**
 * Editorial feature for a single publication, the latest edition, presented
 * like the opening spread of a magazine.
 */
export function FeaturedSpotlight({
  publication,
  eyebrow = "Featured Edition",
}: {
  publication: Publication;
  eyebrow?: string;
}) {
  return (
    <Container as="section" className="py-section">
      <div className="grid items-center gap-14 lg:grid-cols-[1fr_0.85fr] lg:gap-24">
        <Reveal>
          <Eyebrow accent>{eyebrow}</Eyebrow>
          <h2 className="u-display mt-5 text-display-sm">
            {publication.title}
          </h2>
          <p className="mt-3 text-sm uppercase tracking-[0.16em] text-ink-muted">
            {publication.location} · {getYear(publication.date)}
          </p>
          <p className="mt-7 max-w-measure text-base leading-relaxed text-ink-muted md:text-[1.0625rem]">
            {publication.description}
          </p>
          <div className="mt-10">
            <ButtonLink
              href={`/publications/${publication.slug}`}
              variant="outline"
              arrow
            >
              Open Publication
            </ButtonLink>
          </div>
        </Reveal>

        <Reveal delay={0.12} className="order-first lg:order-none">
          <div className="mx-auto w-[68%] max-w-[340px] lg:w-[82%] lg:max-w-none">
            <BookCoverMockup publication={publication} />
          </div>
        </Reveal>
      </div>
    </Container>
  );
}
