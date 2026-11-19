"use client";

import type { ComponentProps, MouseEvent } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { scrollToSection, scrollToTop } from "./SmoothScroll";

const withoutTrailingSlash = (path: string) => (path.length > 1 ? path.replace(/\/$/, "") : path);

/**
 * A link for the site's own navigation (nav bar, phone menu, footer).
 *
 * Moving around inside the page you are already on does not add to the browser history,
 * so Back always leaves the page instead of stepping through every section visited:
 *   - a link to a section of this page ("/#projects" while on "/") puts the hash in the
 *     address bar in place of the current entry and glides to the section;
 *   - a link to this page itself ("/" while on "/") clears any hash and glides to the top.
 * Both are done here, without a router navigation. A link to any other page is an
 * ordinary navigation.
 */
export function SiteLink({ href, onClick, ...rest }: Omit<ComponentProps<typeof Link>, "href"> & { href: string }) {
  const pathname = withoutTrailingSlash(usePathname());
  const [path, section] = href.split("#");
  const samePage = path.startsWith("/") && withoutTrailingSlash(path) === pathname;

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    const newTab = e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0;
    if (!samePage || newTab || e.defaultPrevented) return;
    e.preventDefault();
    // Passing null lets the router take note of the new address without a navigation.
    if (window.location.pathname + window.location.hash !== href) window.history.replaceState(null, "", href);
    if (section) scrollToSection(section);
    else scrollToTop();
  };

  return <Link href={href} onClick={handleClick} {...rest} />;
}
