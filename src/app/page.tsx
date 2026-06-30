import { Container } from "@/components/layout/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { Hero } from "@/components/home/Hero";
import { FeaturedSpotlight } from "@/components/home/FeaturedSpotlight";
import { PublicationGrid } from "@/components/publication/PublicationGrid";
import {
  getAllPublications,
  getLatestPublished,
} from "@/lib/publications";

export default function HomePage() {
  const latest = getLatestPublished();
  const all = getAllPublications();

  return (
    <>
      <Hero />

      {latest && <FeaturedSpotlight publication={latest} />}

      {/* The archive */}
      <Container as="section" className="pb-section">
        <div className="u-rule pt-14 md:pt-20">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <Eyebrow accent>Latest Publications</Eyebrow>
              <h2 className="u-display mt-5 text-display-sm">The Archive</h2>
            </div>
            <ButtonLink href="/publications" variant="ghost" arrow>
              View all publications
            </ButtonLink>
          </div>

          <div className="mt-16">
            <PublicationGrid
              publications={all.slice(0, 4)}
              columns={4}
              priorityCount={2}
            />
          </div>
        </div>
      </Container>

      {/* Manifesto */}
      <section className="border-t border-line-hairline">
        <Container className="py-section">
          <Reveal>
            <p className="u-eyebrow mb-8 text-accent">The Philosophy</p>
            <p className="max-w-4xl font-display text-[clamp(1.75rem,4vw,3.25rem)] uppercase leading-[1.05] text-ink-primary">
              Photography is the foundation. The design tells the story.
            </p>
            <p className="mt-8 max-w-measure text-base leading-relaxed text-ink-muted">
              JXL-Visuals is not a portfolio. It is a publishing house, every
              race weekend treated as a body of work worthy of print, bound into
              an edition you could hold in your hands.
            </p>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
