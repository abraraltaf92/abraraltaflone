"use client";

import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type FocusEvent } from "react";
import { createPortal } from "react-dom";
import { journey } from "@/content/about";
import { Reveal, Rise } from "@/components/motion";
import { JourneyChart, type JourneyPoint } from "./JourneyChart";
import styles from "./Journey.module.css";

/** The open card: which point it is about, and the dot or list row it sits beside. */
type Active = { point: JourneyPoint; anchor: HTMLElement };

/** Same phone width as Journey.module.css. */
const PHONE = "(max-width: 809.98px)";

/** Space between a point and its card, and between the card and the screen edge. */
const GAP = 12;
const EDGE = 16;
/** The band at the top of the screen that belongs to the fixed nav bar; a card never opens in it. */
const NAV_ZONE = 96;
/** How long the card waits before closing, so the pointer can travel from the point onto it. */
const CLOSE_DELAY = 120;

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(value, Math.max(min, max)));

/**
 * Where the card goes on screen: above its point; below it when that would reach into the
 * nav's band; beside it when there is no room below either. Always inside the window.
 */
function cardPlace(anchor: DOMRect, width: number, height: number) {
  const page = document.documentElement;
  const top = NAV_ZONE;
  const bottom = page.clientHeight - EDGE;
  const right = page.clientWidth - EDGE;
  const centred = clamp(anchor.left + anchor.width / 2 - width / 2, EDGE, right - width);

  const above = anchor.top - GAP - height;
  if (above >= top) return { left: centred, top: above };
  const below = anchor.bottom + GAP;
  if (below + height <= bottom) return { left: centred, top: Math.max(below, top) };

  // Neither fits: next to the point, on whichever side has room (the right first).
  const level = clamp(anchor.top + anchor.height / 2 - height / 2, top, bottom - height);
  const after = anchor.right + GAP;
  if (after + width <= right) return { left: after, top: level };
  const before = anchor.left - GAP - width;
  if (before >= EDGE) return { left: before, top: level };
  // No room on any side (a small screen): on the roomier side, pushed back into view;
  // it then overlaps the point as little as it can.
  const roomier = bottom - anchor.bottom >= anchor.top - top ? below : above;
  return { left: centred, top: clamp(roomier, top, bottom - height) };
}

/**
 * What a card opened from the list sits beside: the point's dot while that is in view (and
 * clear of the nav), so the two read together. On phones, and once the dot has scrolled
 * away, it stays by the row.
 */
function anchorFor(source: HTMLElement, dot: HTMLElement | null) {
  if (!dot || window.matchMedia(PHONE).matches) return source;
  const { top, bottom } = dot.getBoundingClientRect();
  return top >= NAV_ZONE && bottom <= window.innerHeight ? dot : source;
}

function Card({
  active,
  onPointerEnter,
  onPointerLeave,
}: {
  active: Active;
  onPointerEnter: () => void;
  onPointerLeave: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { point, anchor } = active;

  // Keep the card next to its point while the page scrolls or resizes.
  useLayoutEffect(() => {
    const update = () => {
      const el = ref.current;
      if (!el) return;
      const place = cardPlace(anchor.getBoundingClientRect(), el.offsetWidth, el.offsetHeight);
      el.style.transform = `translate3d(${place.left}px, ${place.top}px, 0)`;
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [anchor]);

  return createPortal(
    <div ref={ref} className={styles.cardSlot}>
      {/* It can take focus (without being a tab stop) so that pressing it does not count as leaving the point. */}
      <motion.div
        id={`journey-card-${point.id}`}
        role="tooltip"
        tabIndex={-1}
        className={styles.card}
        data-journey-card=""
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
        onPointerEnter={onPointerEnter}
        onPointerLeave={(e) => e.pointerType === "mouse" && onPointerLeave()}
      >
        <p className={styles.cardPeriod}>{point.period}</p>
        <h3 className={styles.cardTitle}>{point.title}</h3>
        <ul className={styles.cardDetails}>
          {point.details.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </motion.div>
    </div>,
    document.body,
  );
}

export function Journey() {
  const [active, setActive] = useState<Active | null>(null);
  const section = useRef<HTMLElement>(null);
  const closeTimer = useRef<number | undefined>(undefined);

  const close = useCallback(() => setActive(null), []);
  const keepOpen = () => window.clearTimeout(closeTimer.current);
  const open = (point: JourneyPoint, anchor: HTMLElement) => {
    keepOpen();
    setActive((current) => (current?.point.id === point.id ? current : { point, anchor }));
  };
  const openFromRow = (point: JourneyPoint, row: HTMLElement) => {
    const dot = section.current?.querySelector<HTMLElement>(`[data-dot][data-point="${point.id}"]`) ?? null;
    open(point, anchorFor(row, dot));
  };
  const closeSoon = () => {
    keepOpen();
    closeTimer.current = window.setTimeout(close, CLOSE_DELAY);
  };
  // Focus moving from a row onto its own card (a press on the card) is not leaving.
  const leaveRow = (e: FocusEvent) => {
    if (!e.relatedTarget?.closest("[data-journey-card]")) closeSoon();
  };

  // While a card is open: Escape or a press anywhere else closes it.
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    const onPress = (e: PointerEvent) => {
      const target = e.target instanceof Element ? e.target : null;
      if (target?.closest(`[data-point="${active.point.id}"], [data-journey-card]`)) return;
      close();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPress);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPress);
    };
  }, [active, close]);

  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  return (
    <section ref={section} className={styles.section} aria-labelledby="journey-label">
      <Rise y={150} duration={3} className={styles.panel}>
        <Reveal className={styles.header}>
          <h2 className="section-label" id="journey-label">
            {journey.label}
          </h2>
          <p className={styles.hint}>{journey.hint}</p>
        </Reveal>

        <JourneyChart activeId={active?.point.id} onOpen={open} onLeave={closeSoon} />

        <ol className={styles.list}>
          {journey.points.map((point, i) => (
            <li key={point.id}>
              <button
                type="button"
                className={styles.row}
                data-point={point.id}
                data-active={active?.point.id === point.id || undefined}
                aria-describedby={active?.point.id === point.id ? `journey-card-${point.id}` : undefined}
                onPointerEnter={(e) => e.pointerType === "mouse" && openFromRow(point, e.currentTarget)}
                onPointerLeave={(e) => e.pointerType === "mouse" && closeSoon()}
                onClick={(e) => openFromRow(point, e.currentTarget)}
                onFocus={(e) => openFromRow(point, e.currentTarget)}
                onBlur={leaveRow}
              >
                <span className={styles.index} aria-hidden="true">
                  {i + 1}
                </span>
                <span className={styles.rowTitle}>{point.title}</span>
                <span className={styles.rowPeriod}>{point.period}</span>
              </button>
            </li>
          ))}
        </ol>
      </Rise>

      <AnimatePresence>
        {active && <Card key={active.point.id} active={active} onPointerEnter={keepOpen} onPointerLeave={closeSoon} />}
      </AnimatePresence>
    </section>
  );
}
