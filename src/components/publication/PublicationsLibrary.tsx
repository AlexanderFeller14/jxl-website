"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { Publication, PublicationCategory } from "@/data/publications";
import { cn } from "@/lib/cn";
import { BookCard } from "./BookCard";
import { PublicationHero } from "./PublicationHero";

type Filter = "All" | PublicationCategory;
type Order = "latest" | "oldest";

interface PublicationsLibraryProps {
  publications: Publication[];
  categories: { category: PublicationCategory; count: number }[];
}

export function PublicationsLibrary({
  publications,
  categories,
}: PublicationsLibraryProps) {
  const reduce = useReducedMotion();
  const [filter, setFilter] = useState<Filter>("All");
  const [order, setOrder] = useState<Order>("latest");
  const [previewSlug, setPreviewSlug] = useState<string>(
    publications[0]?.slug ?? "",
  );

  const filtered = useMemo(() => {
    const list = publications
      .filter((p) => filter === "All" || p.category === filter)
      .sort((a, b) =>
        order === "latest"
          ? b.date.localeCompare(a.date)
          : a.date.localeCompare(b.date),
      );
    return list;
  }, [publications, filter, order]);

  // Keep the preview valid as filters change.
  const preview =
    filtered.find((p) => p.slug === previewSlug) ?? filtered[0] ?? null;

  const filters: Filter[] = ["All", ...categories.map((c) => c.category)];

  return (
    <div>
      {/* Filter + sort bar */}
      <div className="flex flex-wrap items-center justify-between gap-y-4 border-b border-line-hairline pb-5">
        <div className="flex flex-wrap items-center gap-x-7 gap-y-3">
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={cn(
                "text-[0.7rem] uppercase tracking-[0.16em] transition-colors duration-300",
                filter === f
                  ? "text-accent"
                  : "text-ink-muted hover:text-ink-primary",
              )}
            >
              {f}
            </button>
          ))}
        </div>

        <label className="flex items-center gap-3 text-[0.65rem] uppercase tracking-[0.16em] text-ink-faint">
          Sort by
          <select
            value={order}
            onChange={(e) => setOrder(e.target.value as Order)}
            className="cursor-pointer bg-transparent text-[0.7rem] uppercase tracking-[0.16em] text-ink-primary outline-none"
          >
            <option value="latest" className="bg-bg-raised text-ink-primary">
              Latest
            </option>
            <option value="oldest" className="bg-bg-raised text-ink-primary">
              Oldest
            </option>
          </select>
        </label>
      </div>

      {/* Grid */}
      <motion.div
        layout={!reduce}
        className="mt-14 grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3 md:gap-x-8 md:gap-y-16 lg:grid-cols-5"
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((p, i) => (
            <motion.div
              key={p.slug}
              layout={!reduce}
              initial={reduce ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              onMouseEnter={() => setPreviewSlug(p.slug)}
              onFocusCapture={() => setPreviewSlug(p.slug)}
            >
              <BookCard
                publication={p}
                priority={i < 5}
                sizes="(max-width:640px) 45vw, (max-width:1024px) 30vw, 18vw"
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filtered.length === 0 && (
        <p className="mt-16 text-sm uppercase tracking-[0.16em] text-ink-muted">
          No publications in this category yet.
        </p>
      )}

      {/* Desktop featured preview, like browsing books in a bookstore */}
      {preview && (
        <div className="mt-24 hidden border-t border-line-hairline pt-20 lg:block">
          <AnimatePresence mode="wait">
            <motion.div
              key={preview.slug}
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <PublicationHero publication={preview} mode="preview" />
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
