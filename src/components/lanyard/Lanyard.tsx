"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import type { LanyardSettings } from "./LanyardScene";
import styles from "./Lanyard.module.css";

// three.js and the physics engine are loaded only in the browser, after the page is up.
const LanyardScene = dynamic(() => import("./LanyardScene"), { ssr: false });

type Breakpoint = "desktop" | "tablet" | "phone";

const artwork = {
  cardColor: "rgb(19, 0, 33)",
  frontImage: "/lanyard/front.png",
  backImage: "/lanyard/back.png",
};

/**
 * Per-screen-size tuning. `drift` is how much of the page scroll the card follows
 * (0.2 = it slides down at a fifth of the scroll speed). `maxDrift` is how far, in pixels,
 * it may slide in total: on tablet and phone the card hangs just above the "Core Skills"
 * heading, so it stops before it would reach it (the spacing is set in Hero.module.css).
 *
 * Desktop (1200px and up): the strap comes down from above the page, past the nav bar, on
 * a long rope. Below 1440px the canvas itself shrinks with the window (Lanyard.module.css),
 * which scales the whole scene; these numbers stay the same.
 * Tablet and phone: the card hangs just under the intro on a short strap, long enough to
 * show the name once. The anchor sits a touch above the top edge of the canvas, where the
 * strap fades in (see Lanyard.module.css).
 */
const presets: Record<Breakpoint, LanyardSettings & { drift: number; maxDrift: number }> = {
  desktop: {
    ...artwork,
    gravity: 70,
    cameraDistance: 20,
    ropeLength: 3,
    anchorY: 4,
    lighting: 74,
    interactive: true,
    clipColor: "rgb(64, 64, 64)",
    strapImage: "/lanyard/strap.png",
    imageSizing: "fill",
    drift: 0.2,
    maxDrift: Infinity,
  },
  tablet: {
    ...artwork,
    gravity: 70,
    cameraDistance: 34,
    ropeLength: 1.15,
    anchorY: 6.08,
    lighting: 74,
    interactive: true,
    clipColor: "rgb(64, 64, 64)",
    strapImage: "/lanyard/strap.png",
    imageSizing: "fill",
    drift: 0.15,
    maxDrift: 32,
  },
  phone: {
    ...artwork,
    gravity: 60,
    cameraDistance: 34,
    ropeLength: 1.15,
    anchorY: 6.08,
    lighting: 78,
    interactive: true,
    clipColor: "rgb(64, 64, 64)",
    strapImage: "/lanyard/strap.png",
    imageSizing: "fill",
    drift: 0.1,
    maxDrift: 32,
  },
};

function currentBreakpoint(): Breakpoint {
  if (window.matchMedia("(max-width: 809.98px)").matches) return "phone";
  if (window.matchMedia("(max-width: 1199.98px)").matches) return "tablet";
  return "desktop";
}

export function Lanyard() {
  const ref = useRef<HTMLDivElement>(null);
  const [breakpoint, setBreakpoint] = useState<Breakpoint | null>(null);
  const [onScreen, setOnScreen] = useState(true);

  useEffect(() => {
    const update = () => setBreakpoint(currentBreakpoint());
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Scroll drift, and pause rendering while the card is out of view.
  useEffect(() => {
    const el = ref.current;
    if (!el || !breakpoint) return;
    const { drift, maxDrift } = presets[breakpoint];
    let frame = 0;
    const apply = () => {
      frame = 0;
      el.style.transform = `translate3d(0, ${Math.min(window.scrollY * drift, maxDrift)}px, 0)`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(apply);
    };
    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    const io = new IntersectionObserver((entries) => setOnScreen(entries.some((e) => e.isIntersecting)));
    io.observe(el);
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
      io.disconnect();
    };
  }, [breakpoint]);

  return (
    <div ref={ref} className={styles.lanyard} aria-hidden="true">
      {breakpoint && <LanyardScene key={breakpoint} settings={presets[breakpoint]} active={onScreen} />}
    </div>
  );
}
