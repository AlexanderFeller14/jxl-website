import Link from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "outline" | "ghost";

interface BaseProps {
  children: ReactNode;
  className?: string;
  variant?: Variant;
  /** Trailing arrow, the house style for CTAs. */
  arrow?: boolean;
  /** Force a plain anchor opening in a new tab (e.g. static PDFs). */
  newTab?: boolean;
}

const base =
  "group inline-flex items-center gap-3 font-sans text-[0.78rem] uppercase tracking-wide transition-all duration-300 ease-editorial focus-visible:outline-offset-4 disabled:opacity-40";

const variants: Record<Variant, string> = {
  primary:
    "bg-ink-primary text-bg-base px-6 py-3.5 hover:bg-white",
  outline:
    "border border-line-strong px-6 py-3.5 text-ink-primary hover:border-accent hover:text-ink-primary",
  ghost: "text-ink-primary px-0 py-1 hover:text-accent",
};

function Arrow() {
  return (
    <span
      aria-hidden
      className="inline-block transition-transform duration-300 ease-editorial group-hover:translate-x-1"
    >
      →
    </span>
  );
}

interface ButtonLinkProps
  extends BaseProps,
    Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "children"> {
  href: string;
}

export function ButtonLink({
  children,
  className,
  variant = "primary",
  arrow,
  newTab,
  href,
  ...rest
}: ButtonLinkProps) {
  const external = href.startsWith("http");
  const classes = cn(base, variants[variant], className);

  if (external || newTab) {
    return (
      <a
        href={href}
        className={classes}
        target="_blank"
        rel="noopener noreferrer"
        {...rest}
      >
        {children}
        {arrow && <Arrow />}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} {...rest}>
      {children}
      {arrow && <Arrow />}
    </Link>
  );
}
