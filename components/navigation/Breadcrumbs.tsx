import React from "react";
import Link from "next/link";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

/**
 * Editorial Breadcrumbs component following the site-architecture specification.
 * Renders an accessible, crawlable breadcrumb trail reflecting the URL hierarchy.
 */
export function Breadcrumbs({
  items,
  className = "",
}: {
  items: BreadcrumbItem[];
  className?: string;
}) {
  // Deduplicate leading "Home" / "/" item if already provided by page caller
  const displayItems = items.filter(
    (item, idx) => !(idx === 0 && (item.href === "/" || item.label.trim().toLowerCase() === "home"))
  );

  return (
    <nav
      aria-label="Breadcrumb"
      className={`text-xs text-el-fg-faint flex items-center gap-1.5 select-none ${className}`}
    >
      <Link
        href="/"
        className="transition-colors duration-150 hover:text-el-fg focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-el-signal-lime rounded-xs"
      >
        Home
      </Link>
      {displayItems.map((item, idx) => {
        const isLast = idx === displayItems.length - 1;
        return (
          <React.Fragment key={idx}>
            <span className="text-el-border-strong select-none">/</span>
            {isLast || !item.href ? (
              <span
                className="text-el-fg-muted font-medium tracking-tight"
                aria-current="page"
              >
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="transition-colors duration-150 hover:text-el-fg focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-el-signal-lime rounded-xs"
              >
                {item.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
