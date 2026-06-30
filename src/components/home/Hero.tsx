"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

/** Hero artwork, swap this one path to change the cover image.
 *  A dedicated 3840px source (minted from the 6000px original) keeps it crisp
 *  up to 4K/retina; next/image serves device-sized AVIF/WebP from it. */
const HERO_IMAGE = "/media/optimized/main-3840/prosche-91-le-mans.JPG";

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const reduce = useReducedMotion();

  const rise = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.9, ease, delay },
        };

  return (
    <section
      data-theme="dark"
      className="relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-bg-base text-ink-primary"
    >
      {/* Cover image */}
      <Image
        src={HERO_IMAGE}
        alt="Porsche 911 GT3 R number 91 at speed in a panning shot at Le Mans"
        fill
        priority
        quality={85}
        sizes="100vw"
        className="object-cover object-center"
      />

      {/* Soft scrim keeps the centre (the car) clear, type legible top & bottom */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-bg-base/70 via-transparent to-transparent"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-bg-base via-bg-base/25 to-transparent"
      />
      <div aria-hidden className="absolute inset-0 bg-bg-base/10" />

      {/* Cover layout: identity up top, the car breathes in the middle, the
          title anchored at the foot of the page. */}
      <div className="relative z-10 mx-auto flex h-full max-w-[1680px] flex-col justify-between px-6 pb-10 pt-24 md:px-10 md:pb-14 md:pt-28 lg:px-16 xl:px-20">
        {/* Top row */}
        <div className="flex items-start justify-between gap-6">
          <motion.div {...rise(0.1)}>
            <span className="mb-5 block h-0.5 w-14 bg-accent" />
            <p className="font-sans text-[0.7rem] uppercase leading-[2.1] tracking-[0.3em] text-ink-primary">
              <span className="block">Motorsport</span>
              <span className="block">Racing</span>
              <span className="block">Photography</span>
            </p>
          </motion.div>

          <motion.div {...rise(0.2)} className="flex items-start gap-4 sm:gap-5">
            <p className="text-right font-sans text-[0.65rem] uppercase leading-[2] tracking-[0.22em] text-ink-primary sm:text-[0.7rem]">
              <span className="block">It&apos;s not</span>
              <span className="block">just the speed.</span>
              <span className="block">It&apos;s everything</span>
              <span className="block text-accent">in between.</span>
            </p>
            <span className="mt-1 hidden h-16 w-0.5 bg-accent sm:block" />
          </motion.div>
        </div>

        {/* Title anchored low so the car stays in clear air above it */}
        <motion.div {...rise(0.32)}>
          <h1 className="font-display uppercase leading-[0.82] text-ink-primary [font-size:clamp(2.75rem,11vw,9.5rem)] [text-shadow:0_4px_40px_rgba(0,0,0,0.55)]">
            Endurance
          </h1>
          <div className="mt-5 flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
            <p className="flex items-center gap-3 font-sans text-xs uppercase tracking-[0.3em] text-accent sm:text-sm">
              <span className="h-px w-7 bg-accent" />
              Pushing Limits. Chasing Perfection.
            </p>
            <p className="font-sans text-[0.7rem] uppercase tracking-[0.3em] text-ink-primary">
              JXL Visuals{" "}
              <span className="text-ink-muted">· Portfolio 2026</span>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
