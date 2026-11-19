"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "@/components/icons";
import styles from "./ExploreButton.module.css";

type Props = {
  label: string;
  /** In-page target, e.g. "#key-features". The page's smooth scrolling animates the jump. */
  href: string;
  /** Show the small down arrow after the label. */
  arrow?: boolean;
  className?: string;
};

/**
 * Small pill pinned to the bottom-right corner of the window that jumps to a section further
 * down. It is marked `data-arrived` once that section has reached it (and for as long as the
 * section is on screen or scrolled past); on tablets and phones the stylesheet uses that to
 * fade the button away.
 */
export function ExploreButton({ label, href, arrow = true, className }: Props) {
  const [arrived, setArrived] = useState(false);

  useEffect(() => {
    const target = document.getElementById(href.replace(/^#/, ""));
    if (!target) return;
    // The watched area stops 96px above the bottom of the window, just over the button, so the
    // section counts as arrived the moment its top edge would slide beneath the button. It
    // reaches far above the window, so "on screen" and "already scrolled past" are one
    // state and a jump straight from the end of the page back to the top is noticed.
    const io = new IntersectionObserver(([entry]) => setArrived(entry.isIntersecting), {
      rootMargin: "1000000px 0px -96px 0px",
    });
    io.observe(target);
    return () => io.disconnect();
  }, [href]);

  return (
    <a
      className={[styles.explore, className].filter(Boolean).join(" ")}
      href={href}
      data-arrived={arrived ? "" : undefined}
    >
      {label}
      {arrow && <ArrowUp className={styles.arrow} />}
    </a>
  );
}
