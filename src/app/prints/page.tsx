import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "Prints",
  description:
    "Fine-art motorsport prints from the JXL-Visuals archive. The print shop is coming soon, enquire for editions today.",
};

// Placeholder catalogue, a real product/print model can slot in here later
// without changing the layout.
const previews = [
  { src: "/media/optimized/main-1800/CK1A8575-Enhanced-NR.JPG", title: "Floodlight", edition: "Nürburgring · Night" },
  { src: "/media/optimized/main-1800/CK1A8005.JPG", title: "Golden Hour", edition: "Nürburgring · 2024" },
  { src: "/media/optimized/main-1800/CK1A9131.JPG", title: "Into the Dark", edition: "Nordschleife · GT3" },
];

export default function PrintsPage() {
  return (
    <>
      <Container className="pt-32 md:pt-40">
        <div className="max-w-measure">
          <Eyebrow accent>Prints</Eyebrow>
          <h1 className="u-display mt-5 text-display text-balance">
            The Archive, on Paper
          </h1>
          <p className="mt-8 max-w-measure-sm text-base leading-relaxed text-ink-muted md:text-lg">
            Selected frames from the archive, produced as museum-grade
            fine-art prints. The full print shop is in production, enquire now
            for early editions.
          </p>
          <div className="mt-10">
            <ButtonLink href="/contact" variant="outline" arrow>
              Enquire about prints
            </ButtonLink>
          </div>
        </div>
      </Container>

      {/* Preview editions */}
      <Container className="py-section">
        <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {previews.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.08}>
              <figure className="group">
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-bg-sunken">
                  <Image
                    src={p.src}
                    alt={p.title}
                    fill
                    sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
                    className="object-cover transition-transform duration-700 ease-editorial group-hover:scale-[1.03]"
                  />
                </div>
                <figcaption className="mt-5 flex items-baseline justify-between">
                  <div>
                    <h3 className="font-display text-xl uppercase tracking-wide text-ink-primary">
                      {p.title}
                    </h3>
                    <p className="mt-1 text-[0.7rem] uppercase tracking-[0.16em] text-ink-muted">
                      {p.edition}
                    </p>
                  </div>
                  <span className="text-[0.65rem] uppercase tracking-[0.16em] text-ink-faint">
                    Coming soon
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </Container>

      {/* Note */}
      <section className="border-t border-line-hairline">
        <Container className="py-section-sm">
          <div className="max-w-measure">
            <p className="text-sm leading-relaxed text-ink-muted">
              Each print will be available in limited, numbered editions on
              archival paper. Sizes, framing and pricing are being finalised -
              register your interest and we&apos;ll notify you at launch.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
