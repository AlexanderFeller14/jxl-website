import type { Publication } from "@/data/publications";
import { cn } from "@/lib/cn";
import { Reveal } from "@/components/motion/Reveal";
import { BookCard } from "./BookCard";

interface PublicationGridProps {
  publications: Publication[];
  className?: string;
  /** Max columns at the largest breakpoint (5 = library, 4 = home). */
  columns?: 4 | 5;
  priorityCount?: number;
}

const colClass: Record<4 | 5, string> = {
  4: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
  5: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5",
};

export function PublicationGrid({
  publications,
  className,
  columns = 5,
  priorityCount = 0,
}: PublicationGridProps) {
  return (
    <div
      className={cn(
        "grid gap-x-6 gap-y-12 md:gap-x-8 md:gap-y-16",
        colClass[columns],
        className,
      )}
    >
      {publications.map((p, i) => (
        <Reveal key={p.slug} delay={Math.min(i, 5) * 0.06}>
          <BookCard
            publication={p}
            priority={i < priorityCount}
            sizes={
              columns === 5
                ? "(max-width:640px) 45vw, (max-width:1024px) 30vw, 18vw"
                : "(max-width:640px) 45vw, (max-width:1024px) 30vw, 22vw"
            }
          />
        </Reveal>
      ))}
    </div>
  );
}
