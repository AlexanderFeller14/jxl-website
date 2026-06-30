import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { PublicationsLibrary } from "@/components/publication/PublicationsLibrary";
import { getAllPublications, getCategories } from "@/lib/publications";

export const metadata: Metadata = {
  title: "Publications",
  description:
    "A growing collection of motorsport stories. Every publication documents one race weekend through photography, atmosphere and editorial design.",
};

export default function PublicationsPage() {
  const publications = getAllPublications();
  const categories = getCategories();

  return (
    <Container className="pb-section pt-32 md:pt-40">
      <header className="max-w-measure">
        <Eyebrow accent>Editorial Archive</Eyebrow>
        <h1 className="u-display mt-5 text-display">Publications</h1>
        <p className="mt-7 max-w-measure-sm text-base leading-relaxed text-ink-muted md:text-lg">
          A growing collection of motorsport stories. Every publication
          documents one race weekend through photography, atmosphere and
          editorial design.
        </p>
      </header>

      <div className="mt-16">
        <PublicationsLibrary
          publications={publications}
          categories={categories}
        />
      </div>
    </Container>
  );
}
