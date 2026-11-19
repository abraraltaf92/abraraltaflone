"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Cursor.module.css";

/**
 * The site's own cursor: a small dot that follows the pointer.
 * Any ancestor can change it with data attributes:
 *   data-cursor-label="Projects"  -> the dot becomes a pill showing that text
 *   data-cursor-tone="light"      -> white dot (for dark backgrounds)
 *   data-cursor-tone="dark"       -> back to the dark dot inside a light-toned area
 * It is drawn above everything else, full-screen overlays included.
 */
export function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");
  const [tone, setTone] = useState<"dark" | "light">("dark");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    document.documentElement.classList.add("has-cursor");

    // Where the mouse was last seen, so the cursor can be re-read when the page changes under it.
    let last: { x: number; y: number } | null = null;
    let frame = 0;

    const read = (target: Element | null) => {
      setLabel(target?.closest<HTMLElement>("[data-cursor-label]")?.dataset.cursorLabel ?? "");
      setTone(target?.closest<HTMLElement>("[data-cursor-tone]")?.dataset.cursorTone === "light" ? "light" : "dark");
    };
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const el = ref.current;
      if (!el) return;
      last = { x: e.clientX, y: e.clientY };
      el.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      setVisible(true);
      read(e.target instanceof Element ? e.target : null);
    };
    const leave = () => setVisible(false);

    // The element under a resting mouse changes when the page scrolls, a full-screen overlay
    // opens or closes, or a picture finishes loading and takes up its space; look again so
    // the tone and label never go stale.
    const refresh = () => {
      frame = 0;
      if (last) read(document.elementFromPoint(last.x, last.y));
    };
    const queueRefresh = () => {
      if (!frame) frame = requestAnimationFrame(refresh);
    };
    const overlays = new MutationObserver(queueRefresh);
    overlays.observe(document.body, { childList: true });

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("scroll", queueRefresh, { passive: true });
    // "load" does not bubble, so it is caught on its way down to the image
    document.addEventListener("load", queueRefresh, true);
    document.documentElement.addEventListener("mouseleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("scroll", queueRefresh);
      document.removeEventListener("load", queueRefresh, true);
      document.documentElement.removeEventListener("mouseleave", leave);
      overlays.disconnect();
      cancelAnimationFrame(frame);
      document.documentElement.classList.remove("has-cursor");
    };
  }, []);

  return (
    <div ref={ref} className={styles.anchor} aria-hidden="true">
      <div
        className={styles.cursor}
        data-tone={tone}
        data-labelled={label ? "" : undefined}
        style={{ opacity: visible ? 1 : 0 }}
      >
        {label && <span className={styles.label}>{label}</span>}
      </div>
    </div>
  );
}
