import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

interface EyebrowProps {
  children: ReactNode;
  className?: string;
  /** Use the brand accent (sparingly, section openers, "now" states). */
  accent?: boolean;
}

export function Eyebrow({ children, className, accent }: EyebrowProps) {
  return (
    <span
      className={cn(
        "u-eyebrow inline-block",
        accent && "text-accent",
        className,
      )}
    >
      {children}
    </span>
  );
}
