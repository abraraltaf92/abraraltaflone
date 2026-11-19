"use client";

import { motion, useScroll, type MotionStyle, type MotionValue } from "motion/react";
import { useRef, type CSSProperties } from "react";
import { intro, photos } from "@/content/about";
import { Reveal, Rise } from "@/components/motion";
import styles from "./Intro.module.css";

/** The two numbers the styles animate from: how far the pile has spread and how visible the headline is. */
type Progress = MotionStyle & Record<"--spread" | "--reveal", MotionValue<number>>;

// On upright screens the photos stand in rows. Photos that end up equally far from the
// centre share a column; the columns are numbered outwards from the centre: 0.5, 1.5, ...
const reaches = [...new Set(photos.map((photo) => Math.abs(photo.x)))].sort((a, b) => a - b);
const columnOf = (x: number) => Math.sign(x) * (reaches.indexOf(Math.abs(x)) + 0.5);
/** Two facts about the arrangement that the styles cannot count for themselves. */
const arrangement = {
  "--columns": reaches.length * 2,
  "--far-y": Math.max(...photos.map((photo) => Math.abs(photo.y))),
} as CSSProperties;

/**
 * Page opener. A pile of photos stays pinned to the screen while the page scrolls;
 * the pile spreads out to the edges and the headline fades in between the photos.
 */
export function Intro() {
  const spreadTrack = useRef<HTMLDivElement>(null);
  const headingTrack = useRef<HTMLDivElement>(null);

  // Each value runs 0 -> 1 while its track scrolls up past the bottom edge of the screen.
  const { scrollYProgress: spread } = useScroll({ target: spreadTrack, offset: ["start end", "end end"] });
  const { scrollYProgress: reveal } = useScroll({ target: headingTrack, offset: ["start end", "end end"] });

  const progress: Progress = { "--spread": spread, "--reveal": reveal };
  const top = photos.length - 1;

  return (
    <section className={styles.intro} style={arrangement} aria-labelledby="about-heading">
      <div className={styles.titleSlot}>
        <Reveal onMount className={styles.titleReveal}>
          <p className={styles.title}>
            {intro.title.map((part) => (
              <span key={part.text} className={styles[part.tone]}>
                {part.text}
              </span>
            ))}
          </p>
        </Reveal>
      </div>

      <motion.div className={styles.pinned} style={progress}>
        <div className={styles.headingWrap}>
          <h1 className={styles.heading} id="about-heading">
            {intro.heading.map((part) => (
              <span key={part.text} className={styles[part.tone]}>
                {part.text}
              </span>
            ))}
          </h1>
        </div>

        <Rise onMount y={150} duration={2} className={styles.pile}>
          {photos.map((photo, i) => {
            const frame = (
              <div
                key={photo.src}
                className={styles.photo}
                style={{ "--x": photo.x, "--y": photo.y, "--column": columnOf(photo.x) } as CSSProperties}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo.src} alt={photo.alt} decoding="async" />
              </div>
            );
            // The photo on top of the pile also pops up on its own as the page loads.
            return i === top ? (
              <Rise key={photo.src} onMount y={150} duration={0.4} className={styles.layer}>
                {frame}
              </Rise>
            ) : (
              frame
            );
          })}
        </Rise>
      </motion.div>

      {/* Invisible scroll distance that drives the two animations above. */}
      <div ref={spreadTrack} className={styles.track} aria-hidden="true">
        <div ref={headingTrack} className={styles.trackEnd} />
      </div>
    </section>
  );
}
