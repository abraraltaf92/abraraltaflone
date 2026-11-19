"use client";

import { motion } from "motion/react";
import { useEffect, useRef, type CSSProperties, type ElementType, type ReactNode } from "react";
import styles from "./motion.module.css";

type Common = { children: ReactNode; className?: string; style?: CSSProperties };

/**
 * Slide + fade in from the right, once, when the element scrolls into view
 * (or straight away with `onMount`). Used for section labels, rows and buttons.
 */
export function Reveal({
  children,
  className,
  style,
  x = 20,
  delay = 0.2,
  duration = 1,
  onMount = false,
}: Common & { x?: number; delay?: number; duration?: number; onMount?: boolean }) {
  const target = { opacity: 1, x: 0 };
  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, x }}
      {...(onMount ? { animate: target } : { whileInView: target, viewport: { once: true } })}
      transition={{ type: "tween", delay, duration, ease: [0.35, 0, 0, 1] }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Springy rise from below (or drop from above with a negative `y`).
 * `onMount` plays on page load; otherwise it plays once when scrolled into view.
 */
export function Rise({
  children,
  className,
  style,
  y = 150,
  duration = 3,
  onMount = false,
}: Common & { y?: number; duration?: number; onMount?: boolean }) {
  const target = { opacity: 1, y: 0 };
  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0.001, y }}
      {...(onMount ? { animate: target } : { whileInView: target, viewport: { once: true } })}
      transition={{ type: "spring", bounce: 0.2, duration }}
    >
      {children}
    </motion.div>
  );
}

export type TextPart = { text: string; tone?: string; bold?: boolean };

/**
 * "human-centered" -> ["human-", "centered"]: the only place a line may break inside a
 * word is straight after a hyphen or dash, as in ordinary text.
 */
const splitAfterDashes = (word: string) => word.match(/[^-–—]+[-–—]*|[-–—]+/g) ?? [word];

const graphemes = new Intl.Segmenter(undefined, { granularity: "grapheme" });
const splitCharacters = (word: string) => Array.from(graphemes.segment(word), (s) => s.segment);

type LineRevealProps = {
  /** Element to render, e.g. "p" or "h3". */
  as?: ElementType;
  /** Runs of text; `tone` and `bold` pick a class from `toneClass` / `boldClass`. */
  parts: TextPart[];
  className?: string;
  toneClass?: Record<string, string>;
  boldClass?: string;
  /** Play on page load instead of when the text scrolls into view. */
  onMount?: boolean;
};

/**
 * Text that appears line by line: every rendered line slides in from the right and fades
 * up, each 0.2s after the one above. Lines are read from the real layout, so it works at
 * any width. `parts` lets one heading mix colours and weights.
 *
 * Every character is its own inline box, which is how the original site sets this kind
 * of text: it switches off pair kerning (that decides where these headings wrap). Words
 * are kept whole: a line only ever breaks between words, or after a hyphen or dash.
 *
 * Screen readers get the sentence once, as plain text; the animated copy is hidden from
 * them. With "reduce motion" switched on the text is simply there (see motion.module.css).
 */
export function LineReveal({
  as: Tag = "h1",
  parts,
  className,
  toneClass,
  boldClass,
  onMount = false,
}: LineRevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const play = () => {
      // Characters that share a top edge sit on the same line.
      let line = -1;
      let top: number | null = null;
      el.querySelectorAll<HTMLElement>("[data-char]").forEach((char) => {
        if (char.offsetTop !== top) {
          top = char.offsetTop;
          line += 1;
        }
        char.style.setProperty("--line", String(line));
      });
      el.dataset.shown = "";
    };

    if (onMount) {
      play();
      return;
    }
    const io = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        play();
        io.disconnect();
      }
    });
    io.observe(el);
    return () => io.disconnect();
  }, [onMount]);

  return (
    <Tag ref={ref} className={[styles.lines, className].filter(Boolean).join(" ")}>
      <span className={`visually-hidden ${styles.plain}`}>{parts.map((part) => part.text).join("")}</span>
      <span aria-hidden="true">
        {parts.map((part, p) => {
          const cls = [part.tone && toneClass?.[part.tone], part.bold && boldClass].filter(Boolean).join(" ");
          return (
            <span key={p} className={cls || undefined}>
              {part.text.split(/(\s+)/).map((word, w) =>
                // spaces stay ordinary text, so lines still wrap between words
                word.trim() === ""
                  ? word
                  : splitAfterDashes(word).map((piece, i) => (
                      <span key={`${w}-${i}`} className={styles.word}>
                        {splitCharacters(piece).map((char, c) => (
                          <span key={c} data-char="" className={styles.char}>
                            {char}
                          </span>
                        ))}
                      </span>
                    )),
              )}
            </span>
          );
        })}
      </span>
    </Tag>
  );
}
