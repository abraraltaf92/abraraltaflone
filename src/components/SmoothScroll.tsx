"use client";

import { useEffect } from "react";
import Lenis from "lenis";

// Eased wheel scrolling for the whole page. `duration` is how long a wheel flick keeps gliding.
const DURATION = 3;

let lenis: Lenis | null = null;

/** Pause or resume page scrolling (used while a full-screen overlay is open). */
export function setScrollLocked(locked: boolean) {
  if (locked) lenis?.stop();
  else lenis?.start();
  document.documentElement.style.overflow = locked ? "hidden" : "";
}

/** Glide to the top of the page (a plain jump when smooth scrolling is off). */
export function scrollToTop() {
  if (lenis) lenis.scrollTo(0);
  else window.scrollTo(0, 0);
}

/** Glide to the element with this id; its `scroll-margin-top` keeps it clear of the nav bar. */
export function scrollToSection(id: string) {
  const target = document.getElementById(id);
  if (!target) return;
  if (lenis) lenis.scrollTo(target);
  else target.scrollIntoView();
}

export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    lenis = new Lenis({ duration: DURATION, anchors: true });
    let frame = requestAnimationFrame(function raf(time) {
      lenis?.raf(time);
      frame = requestAnimationFrame(raf);
    });
    return () => {
      cancelAnimationFrame(frame);
      lenis?.destroy();
      lenis = null;
    };
  }, []);

  return null;
}
