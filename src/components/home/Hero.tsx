"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

/** Hero artwork, swap this one path to change the cover image. */
const HERO_IMAGE = "/media/optimized/main-1800/CK1A8005.JPG";

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
      className="relative h-[100svh] min-h-[660px] w-full overflow-hidden bg-bg-base text-ink-primary"
    >
      {/* Cover image */}
      <Image
        src={HERO_IMAGE}
        alt="ROWE BMW M4 GT3 cornering at golden hour on the Nürburgring Nordschleife"
        fill
        priority
        sizes="100vw"
        className="object-cover object-[62%_center]"
      />

      {/* Editorial darkening, keeps every label legible, car still visible */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-r from-bg-base/95 via-bg-base/35 to-transparent"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-bg-base via-bg-base/15 to-bg-base/45"
      />
      <div aria-hidden className="absolute inset-0 bg-bg-base/20" />

      {/* Cover layout */}
      <div className="relative z-10 mx-auto flex h-full max-w-[1680px] flex-col justify-between px-6 pb-10 pt-24 md:px-10 md:pb-14 md:pt-28 lg:px-16 xl:px-20">
        {/* Top row */}
        <div className="flex items-start justify-between gap-6">
          <motion.div {...rise(0.1)}>
            <span className="mb-6 block h-0.5 w-16 bg-accent" />
            <p className="font-sans text-[0.7rem] uppercase leading-[2.1] tracking-[0.3em] text-ink-primary">
              <span className="block">Endurance</span>
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

        {/* Headline */}
        <motion.div {...rise(0.32)} className="-mt-6 md:-mt-10">
          <h1 className="font-display uppercase leading-[0.8] text-ink-primary [font-size:clamp(3.75rem,15.5vw,15rem)] [text-shadow:0_4px_40px_rgba(0,0,0,0.55)]">
            Relentless
          </h1>
          <div className="mt-5 space-y-2 md:mt-7">
            <p className="font-sans text-xs uppercase tracking-[0.3em] text-accent sm:text-sm md:text-base">
              Pushing Limits.
            </p>
            <p className="flex items-center gap-3 font-sans text-xs uppercase tracking-[0.3em] text-accent sm:text-sm md:text-base">
              <span className="h-px w-7 bg-accent" />
              Chasing Perfection.
            </p>
          </div>
        </motion.div>

        {/* Bottom row */}
        <div className="flex items-end justify-between gap-6">
          <motion.div {...rise(0.42)}>
            <p className="font-sans text-[0.7rem] uppercase tracking-[0.3em] text-accent">
              JXL Visuals
            </p>
            <p className="mt-1.5 font-sans text-[0.7rem] uppercase tracking-[0.3em] text-ink-primary">
              Portfolio 2026
            </p>
            <span className="mt-3 block h-0.5 w-14 bg-accent" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
