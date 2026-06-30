"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Publication } from "@/data/publications";
import { cn } from "@/lib/cn";
import { Lightbox, type LightboxImage } from "./Lightbox";

interface EditorialGalleryProps {
  publication: Publication;
}

export function EditorialGallery({ publication }: EditorialGalleryProps) {
  const [active, setActive] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  // Flatten images once, keeping a global index for the lightbox.
  const { sections, flat } = useMemo(() => {
    const flat: LightboxImage[] = [];
    const sections = publication.gallery.map((s) => {
      const items = s.images.map((src, i) => {
        const flatIndex = flat.length;
        const alt = `${publication.title}, ${s.label}, frame ${i + 1}`;
        flat.push({ src, alt, section: s.label });
        return { src, alt, flatIndex };
      });
      return { label: s.label, caption: s.caption, items };
    });
    return { sections, flat };
  }, [publication]);

  // Scrollspy for the sticky section nav.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) {
          const idx = Number(
            (visible.target as HTMLElement).dataset.sectionIndex,
          );
          if (!Number.isNaN(idx)) setActive(idx);
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5] },
    );
    sectionRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [sections.length]);

  const scrollTo = (i: number) => {
    sectionRefs.current[i]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div id="gallery" className="scroll-mt-[72px]">
      {/* Sticky section navigation */}
      <div className="sticky top-[72px] z-40 -mx-6 mb-12 border-y border-line-hairline bg-bg-base/85 px-6 backdrop-blur-md md:-mx-10 md:px-10 lg:-mx-16 lg:px-16 xl:-mx-20 xl:px-20">
        <div className="flex items-center gap-7 overflow-x-auto py-4">
          <span className="shrink-0 text-[0.6rem] uppercase tracking-[0.16em] text-ink-faint">
            Gallery
          </span>
          {sections.map((s, i) => (
            <button
              key={s.label}
              type="button"
              onClick={() => scrollTo(i)}
              className={cn(
                "shrink-0 text-[0.7rem] uppercase tracking-[0.16em] transition-colors duration-300",
                i === active
                  ? "text-accent"
                  : "text-ink-muted hover:text-ink-primary",
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-24 md:space-y-36">
        {sections.map((s, i) => (
          <section
            key={s.label}
            data-section-index={i}
            ref={(el) => {
              sectionRefs.current[i] = el;
            }}
            className="scroll-mt-[140px]"
          >
            <div className="mb-8 flex items-baseline gap-5">
              <h2 className="u-display text-3xl text-ink-primary md:text-4xl">
                {s.label}
              </h2>
              {s.caption && (
                <p className="text-[0.7rem] uppercase tracking-[0.16em] text-ink-muted">
                  {s.caption}
                </p>
              )}
            </div>

            <SectionLayout
              items={s.items}
              onOpen={(flatIndex) => setLightboxIndex(flatIndex)}
            />
          </section>
        ))}
      </div>

      <Lightbox
        images={flat}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onIndex={(idx) => setLightboxIndex(idx)}
      />
    </div>
  );
}

interface LayoutItem {
  src: string;
  alt: string;
  flatIndex: number;
}

/**
 * Editorial (non-masonry) layout: a full-bleed feature opens the chapter, the
 * rest fall into a measured two-column rhythm. Fixed aspect ratios = no CLS.
 */
function SectionLayout({
  items,
  onOpen,
}: {
  items: LayoutItem[];
  onOpen: (flatIndex: number) => void;
}) {
  const [feature, ...rest] = items;
  if (!feature) return null;

  return (
    <div className="space-y-6 md:space-y-8">
      <GalleryFrame
        item={feature}
        onOpen={onOpen}
        className="aspect-[16/9]"
        sizes="(max-width: 1024px) 100vw, 1100px"
        priority
      />
      {rest.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 md:gap-8">
          {rest.map((item, i) => (
            <GalleryFrame
              key={item.src + i}
              item={item}
              onOpen={onOpen}
              className="aspect-[4/3]"
              sizes="(max-width: 640px) 100vw, 50vw"
            />
          ))}
        </div>
      )}
    </div>
  );
}

function GalleryFrame({
  item,
  onOpen,
  className,
  sizes,
  priority,
}: {
  item: LayoutItem;
  onOpen: (flatIndex: number) => void;
  className?: string;
  sizes: string;
  priority?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={() => onOpen(item.flatIndex)}
      className={cn(
        "group relative w-full overflow-hidden bg-bg-sunken",
        className,
      )}
      aria-label="Open image in viewer"
    >
      <Image
        src={item.src}
        alt={item.alt}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover transition-transform duration-700 ease-editorial group-hover:scale-[1.03]"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/10"
      />
    </button>
  );
}
