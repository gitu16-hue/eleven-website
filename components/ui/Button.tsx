import { ComponentPropsWithoutRef } from "react";
import Link from "next/link";

type Variant = "primary" | "secondary" | "ghost";

const base =
  "group inline-flex items-center gap-2 text-el-sm font-medium tracking-[-0.01em] " +
  "transition-all duration-[var(--el-duration-fast)] " +
  "focus-visible:outline-2 focus-visible:outline-offset-3 disabled:opacity-40 disabled:pointer-events-none " +
  "active:scale-[0.98]";

const variants: Record<Variant, string> = {
  primary:
    "bg-el-fg text-el-bg px-6 py-3.5 hover:bg-el-accent",
  secondary:
    "border border-el-border-strong text-el-fg px-6 py-3.5 hover:border-el-fg hover:shadow-el-sm",
  ghost:
    "text-el-fg-muted hover:text-el-fg px-1 py-1",
};

type ButtonProps = {
  variant?: Variant;
  arrow?: boolean;
} & (
  | ({ href: string } & ComponentPropsWithoutRef<typeof Link>)
  | ({ href?: undefined } & ComponentPropsWithoutRef<"button">)
);

export function Button({
  variant = "primary",
  arrow = false,
  className = "",
  children,
  href,
  ...props
}: ButtonProps) {
  const classes = `${base} ${variants[variant]} ${className}`;

  if (href) {
    const linkProps = props as Omit<ComponentPropsWithoutRef<typeof Link>, "href">;
    return (
      <Link href={href} className={classes} {...linkProps}>
        {children}
        {arrow && <ArrowIcon />}
      </Link>
    );
  }

  return (
    <button className={classes} {...(props as ComponentPropsWithoutRef<"button">)}>
      {children}
      {arrow && <ArrowIcon />}
    </button>
  );
}

function ArrowIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className="transition-transform duration-[var(--el-duration-fast)] group-hover:translate-x-1"
    >
      <path
        d="M3 8H13M13 8L9 4M13 8L9 12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
