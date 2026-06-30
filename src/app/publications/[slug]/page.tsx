import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ButtonLink } from "@/components/ui/Button";
import { PublicationHero } from "@/components/publication/PublicationHero";
import { PublicationGrid } from "@/components/publication/PublicationGrid";
import { EditorialGallery } from "@/components/gallery/EditorialGallery";
import {
  getAllSlugs,
  getPublicationBySlug,
  getRelated,
} from "@/lib/publications";

interface Params {
  params: { slug: string };
}

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: Params): Metadata {
  const p = getPublicationBySlug(params.slug);
  if (!p) return { title: "Not found" };

  return {
    title: p.title,
    description: p.description,
    openGraph: {
      title: `${p.title} · JXL-Visuals`,
      description: p.description,
      type: "article",
      images: [{ url: p.cover, alt: p.title }],
    },
  };
}

export default function PublicationDetailPage({ params }: Params) {
  const publication = getPublicationBySlug(params.slug);
  if (!publication) notFound();

  const related = getRelated(publication.slug, 4);
  const hasGallery = publication.gallery.some((s) => s.images.length > 0);

  return (
    <article>
      {/* Hero */}
      <Container className="pb-section-sm pt-28 md:pt-36">
        <PublicationHero publication={publication} mode="detail" />
      </Container>

      {/* Gallery */}
      {hasGallery && (
        <Container className="pb-section">
          <EditorialGallery publication={publication} />
        </Container>
      )}

      {/* Related */}
      {related.length > 0 && (
        <section className="border-t border-line-hairline">
          <Container className="py-section">
            <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
              <div>
                <Eyebrow accent>Keep Reading</Eyebrow>
                <h2 className="u-display mt-5 text-display-sm">
                  More from the Archive
                </h2>
              </div>
              <ButtonLink href="/publications" variant="ghost" arrow>
                All publications
              </ButtonLink>
            </div>
            <PublicationGrid publications={related} columns={4} />
          </Container>
        </section>
      )}
    </article>
  );
}
