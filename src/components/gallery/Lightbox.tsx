"use client";

import Image from "next/image";
import { createPortal } from "react-dom";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

export interface LightboxImage {
  src: string;
  alt: string;
  section?: string;
}

interface LightboxProps {
  images: LightboxImage[];
  index: number | null;
  onClose: () => void;
  onIndex: (i: number) => void;
}

export function Lightbox({ images, index, onClose, onIndex }: LightboxProps) {
  const reduce = useReducedMotion();
  const open = index !== null;
  const closeRef = useRef<HTMLButtonElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const go = useCallback(
    (dir: 1 | -1) => {
      if (index === null) return;
      const next = (index + dir + images.length) % images.length;
      onIndex(next);
    },
    [index, images.length, onIndex],
  );

  // Keyboard navigation
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, go, onClose]);

  // Lock scroll + focus the close button
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const current = index !== null ? images[index] : null;

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && current && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
          className="fixed inset-0 z-[100] flex flex-col bg-bg-sunken"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduce ? undefined : { opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Top bar */}
          <div className="flex items-center justify-between px-6 py-5 md:px-10">
            <p className="font-sans text-xs uppercase tracking-[0.2em] text-ink-muted">
              <span className="text-ink-primary">{index! + 1}</span>
              <span className="mx-2 text-ink-faint">/</span>
              {images.length}
              {current.section && (
                <span className="ml-4 text-ink-faint">{current.section}</span>
              )}
            </p>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Close viewer"
              className="flex h-10 w-10 items-center justify-center text-ink-muted transition-colors hover:text-ink-primary"
            >
              <span className="text-2xl leading-none">×</span>
            </button>
          </div>

          {/* Stage */}
          <div className="relative flex flex-1 items-center justify-center px-4 md:px-20">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous image"
              className="absolute left-2 z-10 flex h-12 w-12 items-center justify-center text-2xl text-ink-muted transition-colors hover:text-ink-primary md:left-6"
            >
              ‹
            </button>

            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                className="relative h-full max-h-[72vh] w-full max-w-5xl"
                initial={reduce ? false : { opacity: 0, scale: 0.985 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduce ? undefined : { opacity: 0, scale: 0.99 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <Image
                  src={current.src}
                  alt={current.alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 1024px"
                  className="object-contain"
                  priority
                />
              </motion.div>
            </AnimatePresence>

            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next image"
              className="absolute right-2 z-10 flex h-12 w-12 items-center justify-center text-2xl text-ink-muted transition-colors hover:text-ink-primary md:right-6"
            >
              ›
            </button>
          </div>

          {/* Filmstrip */}
          <div className="px-4 pb-6 pt-3 md:px-10">
            <div className="mx-auto flex max-w-4xl gap-2 overflow-x-auto pb-1">
              {images.map((img, i) => (
                <button
                  key={img.src + i}
                  type="button"
                  onClick={() => onIndex(i)}
                  aria-label={`View image ${i + 1}`}
                  className={cn(
                    "relative h-12 w-16 shrink-0 overflow-hidden transition-opacity duration-300",
                    i === index
                      ? "opacity-100 ring-1 ring-accent"
                      : "opacity-40 hover:opacity-80",
                  )}
                >
                  <Image
                    src={img.src}
                    alt=""
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
