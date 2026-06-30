import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Eyebrow } from "./Eyebrow";

interface SectionHeadingProps {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  className?: string;
  align?: "left" | "center";
  accentEyebrow?: boolean;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  className,
  align = "left",
  accentEyebrow,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        align === "center" && "mx-auto text-center",
        "max-w-measure",
        className,
      )}
    >
      {eyebrow && (
        <Eyebrow accent={accentEyebrow} className="mb-5">
          {eyebrow}
        </Eyebrow>
      )}
      <h2 className="u-display text-display-sm text-balance">{title}</h2>
      {description && (
        <p className="mt-6 max-w-measure text-base leading-relaxed text-ink-muted md:text-[1.0625rem]">
          {description}
        </p>
      )}
    </div>
  );
}
