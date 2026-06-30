import {
  CATEGORY_ORDER,
  publications,
  type Publication,
  type PublicationCategory,
} from "@/data/publications";

/** Newest first by ISO date. */
function byNewest(a: Publication, b: Publication) {
  return b.date.localeCompare(a.date);
}

export type SortOrder = "latest" | "oldest";

export function getAllPublications(order: SortOrder = "latest"): Publication[] {
  const sorted = [...publications].sort(byNewest);
  return order === "oldest" ? sorted.reverse() : sorted;
}

export function getPublicationBySlug(slug: string): Publication | undefined {
  return publications.find((p) => p.slug === slug);
}

export function getAllSlugs(): string[] {
  return publications.map((p) => p.slug);
}

export function getFeatured(): Publication[] {
  return getAllPublications().filter((p) => p.featured);
}

/** The single most recent published edition, the home hero candidate. */
export function getLatestPublished(): Publication | undefined {
  return getAllPublications().find(
    (p) => (p.status ?? "published") === "published",
  );
}

/** Categories present in the data, in canonical order, with counts. */
export function getCategories(): {
  category: PublicationCategory;
  count: number;
}[] {
  return CATEGORY_ORDER.map((category) => ({
    category,
    count: publications.filter((p) => p.category === category).length,
  })).filter((c) => c.count > 0);
}

export function getByCategory(
  category: PublicationCategory | "All",
  order: SortOrder = "latest",
): Publication[] {
  const all = getAllPublications(order);
  return category === "All"
    ? all
    : all.filter((p) => p.category === category);
}

/** Related editions: same category first, then fill with latest others. */
export function getRelated(slug: string, limit = 3): Publication[] {
  const current = getPublicationBySlug(slug);
  if (!current) return [];
  const others = getAllPublications().filter((p) => p.slug !== slug);
  const sameCategory = others.filter((p) => p.category === current.category);
  const rest = others.filter((p) => p.category !== current.category);
  return [...sameCategory, ...rest].slice(0, limit);
}

export function getYear(date: string): string {
  return date.slice(0, 4);
}

export function getTotalPhotoCount(p: Publication): number {
  return p.gallery.reduce((sum, s) => sum + s.images.length, 0);
}
