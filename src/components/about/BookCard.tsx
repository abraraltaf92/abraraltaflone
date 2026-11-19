"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef, type ReactNode } from "react";
import { achievements } from "@/content/about";
import { LineReveal } from "@/components/motion";
import { Appear } from "./Appear";
import { robotoItalic } from "./fonts";
import { useBreakpoint } from "./useBreakpoint";
import about from "./About.module.css";
import styles from "./Achievements.module.css";

const { book } = achievements;

const CameraIcon = () => (
  <svg className={styles.camera} viewBox="0 0 18 12" aria-hidden="true">
    <path d="M 12 4 L 16.553 1.724 C 16.863 1.569 17.231 1.586 17.526 1.768 C 17.82 1.95 18 2.272 18 2.618 L 18 9.382 C 18 9.728 17.82 10.05 17.526 10.232 C 17.231 10.414 16.863 10.431 16.553 10.276 L 12 8 Z M 0 2 C 0 0.895 0.895 0 2 0 L 10 0 C 11.105 0 12 0.895 12 2 L 12 10 C 12 11.105 11.105 12 10 12 L 2 12 C 0.895 12 0 11.105 0 10 Z" />
  </svg>
);

/**
 * The grey card itself. On desktop it grows from 80% to full size and brightens as the
 * whole page is scrolled from top to bottom; on smaller screens it rises into view instead.
 */
function Frame({ children }: { children: ReactNode }) {
  const breakpoint = useBreakpoint();
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 1], [0.5, 1]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [95, 0]);

  if (breakpoint !== "desktop") {
    return (
      <Appear y={150} duration={3} once={false} className={styles.book}>
        {children}
      </Appear>
    );
  }
  return (
    <motion.div className={styles.book} style={{ opacity, scale, y }}>
      {children}
    </motion.div>
  );
}

export function BookCard() {
  const breakpoint = useBreakpoint();
  const interviewSlot = useRef<HTMLDivElement>(null);

  return (
    <div data-cursor-label={book.cursorLabel} className={styles.bookSlot}>
      <Frame>
        <div className={styles.bookText}>
          <div className={styles.bookHead}>
            <LineReveal as="h3" parts={[{ text: book.heading }]} className={styles.bookHeading} />
            <LineReveal
              as="p"
              parts={[{ text: book.title }]}
              className={`${styles.bookTitle} ${robotoItalic.variable}`}
            />
          </div>
          <LineReveal as="p" parts={[{ text: book.description }]} className={`${styles.bookBody} ${about.wholeWords}`} />

          {/* The button slides in from the left; its resting place decides when. */}
          <div ref={interviewSlot}>
            <Appear x={-150} duration={2} amount={0.5} watch={interviewSlot}>
              <a className={styles.interview} href={book.interview.href} target="_blank" rel="noopener noreferrer">
                <span className={styles.interviewIcon}>
                  <CameraIcon />
                </span>
                <span className={styles.interviewLabel}>{book.interview.label}</span>
              </a>
            </Appear>
          </div>
        </div>

        <Appear
          x={150}
          y={101}
          duration={breakpoint === "phone" ? 2 : 3}
          amount={breakpoint === "phone" ? 0 : 0.5}
          className={styles.coverSlot}
        >
          <a
            className={styles.cover}
            href={book.interview.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${book.cover.alt} (opens the interview in a new tab)`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={book.cover.src} alt="" loading="lazy" decoding="async" />
          </a>
        </Appear>
      </Frame>
    </div>
  );
}
