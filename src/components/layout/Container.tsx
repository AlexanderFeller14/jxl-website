import { cn } from "@/lib/cn";
import type { ElementType, ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  /** Narrow editorial width for running text. */
  size?: "default" | "narrow" | "wide";
}

const sizes = {
  default: "max-w-[1440px]",
  narrow: "max-w-[920px]",
  wide: "max-w-[1680px]",
};

export function Container({
  children,
  className,
  as: Tag = "div",
  size = "default",
}: ContainerProps) {
  return (
    <Tag
      className={cn(
        "mx-auto w-full px-6 md:px-10 lg:px-16 xl:px-20",
        sizes[size],
        className,
      )}
    >
      {children}
    </Tag>
  );
}
