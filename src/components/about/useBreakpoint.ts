"use client";

import { useSyncExternalStore } from "react";

export type Breakpoint = "desktop" | "tablet" | "phone";

// Same breakpoints as globals.css.
const PHONE = "(max-width: 809.98px)";
const TABLET = "(min-width: 810px) and (max-width: 1199.98px)";

/** The breakpoint the window is in right now. Only call in the browser. */
export function currentBreakpoint(): Breakpoint {
  if (window.matchMedia(PHONE).matches) return "phone";
  if (window.matchMedia(TABLET).matches) return "tablet";
  return "desktop";
}

function subscribe(onChange: () => void) {
  const lists = [PHONE, TABLET].map((query) => window.matchMedia(query));
  lists.forEach((list) => list.addEventListener("change", onChange));
  return () => lists.forEach((list) => list.removeEventListener("change", onChange));
}

/** Live breakpoint for behaviour that CSS alone cannot switch. Renders as desktop on the server. */
export function useBreakpoint(): Breakpoint {
  return useSyncExternalStore(subscribe, currentBreakpoint, () => "desktop");
}
