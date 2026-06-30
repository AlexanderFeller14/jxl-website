import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "About",
  description:
    "JXL-Visuals is a digital publishing house dedicated to motorsport, every race weekend treated as a body of work worthy of print.",
};

const principles = [
  {
    title: "Photography is the foundation",
    body: "Every edition begins on track, in the rain, the fog and the floodlight. The image always comes first.",
  },
  {
    title: "Every weekend, an edition",
    body: "We don't shoot galleries. We build publications, each race weekend documented as a complete, considered story.",
  },
  {
    title: "Made to be printed",
    body: "If it isn't worthy of paper, it doesn't ship. Design, sequencing and typography treated like a coffee-table book.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Intro, deliberately compact so the poster reads at first glance */}
      <Container className="pt-24 md:pt-28">
        <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
          <h1 className="u-display text-3xl md:text-4xl lg:text-5xl">
            A Publishing House for Motorsport
          </h1>
          <Eyebrow accent>About · JXL-Visuals</Eyebrow>
        </div>
        <p className="mt-4 text-base leading-relaxed text-ink-muted md:text-lg">
          Every race weekend, documented as a collectible publication.
        </p>
      </Container>

      {/* Editorial poster, designed piece, shown uncropped at its native 3:2 */}
      <Container className="mt-6 md:mt-8">
        <Reveal>
          <div className="relative aspect-[3/2] w-full overflow-hidden bg-bg-sunken">
            <Image
              src="/media/nbr-2025/24h-poster.png"
              alt="Twenty Four Hours, JXL-Visuals endurance racing poster: a GT3 car trailing red light at night"
              fill
              sizes="(max-width: 1024px) 100vw, 1440px"
              quality={90}
              className="object-cover"
            />
          </div>
        </Reveal>
      </Container>

      {/* Story */}
      <Container className="py-section">
        <div className="grid gap-12 md:grid-cols-[0.6fr_1fr] md:gap-20">
          <Reveal>
            <h2 className="u-display text-display-sm">The Story</h2>
          </Reveal>
          <Reveal delay={0.1} className="space-y-6 text-base leading-relaxed text-ink-muted md:text-[1.0625rem]">
            <p>
              It started with a simple conviction: that the emotion of a race
              weekend deserves more than a feed. The arrival, the practice runs,
              the long night, the quiet victory, a story with a beginning, a
              middle and an end.
            </p>
            <p>
              From the Nürburgring Nordschleife to the Circuit de la Sarthe and
              the hillclimbs of the Swiss alps, each edition is photographed,
              sequenced and designed as a publication you could hold in your
              hands, and would want to keep.
            </p>
            <p>
              The photography documents motorsport. The design transforms it
              into something timeless.
            </p>
          </Reveal>
        </div>
      </Container>

      {/* Principles */}
      <section className="border-t border-line-hairline">
        <Container className="py-section">
          <Eyebrow accent>Principles</Eyebrow>
          <div className="mt-12 grid gap-12 md:grid-cols-3 md:gap-10">
            {principles.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.08}>
                <p className="font-display text-2xl uppercase leading-none text-ink-primary">
                  0{i + 1}
                </p>
                <h3 className="mt-5 text-lg text-ink-primary">{p.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                  {p.body}
                </p>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="border-t border-line-hairline">
        <Container className="flex flex-col items-start justify-between gap-8 py-section-sm md:flex-row md:items-center">
          <h2 className="u-display text-display-sm">
            Browse the archive
          </h2>
          <div className="flex gap-7">
            <ButtonLink href="/publications" variant="outline" arrow>
              View Publications
            </ButtonLink>
            <ButtonLink href="/contact" variant="ghost" arrow>
              Get in touch
            </ButtonLink>
          </div>
        </Container>
      </section>
    </>
  );
}
