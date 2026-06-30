import type { Publication } from "@/data/publications";
import { cn } from "@/lib/cn";
import { BookCover } from "./BookCover";

interface BookCoverMockupProps {
  publication: Publication;
  className?: string;
}

/**
 * Large, realistic standing book, CSS 3D with page-edge thickness, spine and a
 * soft floor shadow. Tilts gently toward the viewer on hover.
 */
export function BookCoverMockup({
  publication,
  className,
}: BookCoverMockupProps) {
  return (
    <div className={cn("group relative [perspective:1800px]", className)}>
      <div
        className={cn(
          "relative [transform-style:preserve-3d]",
          "[transform:rotateY(-23deg)_rotateX(3deg)]",
          "transition-transform duration-700 ease-editorial",
          "group-hover:[transform:rotateY(-15deg)_rotateX(2deg)]",
        )}
      >
        {/* Spine (left side, recedes in Z) */}
        <div
          aria-hidden
          className="absolute left-0 top-0 h-full w-8 [transform-origin:left] [transform:rotateY(-90deg)] bg-gradient-to-r from-black/80 to-black/40"
        />

        {/* Page block (right edge) */}
        <div
          aria-hidden
          className="absolute right-0 top-0 h-full w-8 [transform-origin:right] [transform:rotateY(90deg)] bg-[repeating-linear-gradient(90deg,#e7e4dc_0px,#e7e4dc_1px,#c4c1b8_2px,#e7e4dc_3px)]"
        />

        {/* Front cover */}
        <div className="relative [transform:translateZ(16px)] shadow-book-hover">
          <BookCover
            publication={publication}
            priority
            sizes="(max-width: 768px) 80vw, 36vw"
          />
        </div>
      </div>

      {/* Floor shadow */}
      <div
        aria-hidden
        className="absolute -bottom-8 left-1/2 h-12 w-[78%] -translate-x-1/2 rounded-[50%] bg-[var(--shadow-floor)] blur-2xl"
      />
    </div>
  );
}
