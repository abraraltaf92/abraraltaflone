"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { education } from "@/content/about";
import { LineReveal, Reveal } from "@/components/motion";
import { Appear } from "./Appear";
import { robotoLight } from "./fonts";
import { useBreakpoint } from "./useBreakpoint";
import about from "./About.module.css";
import styles from "./Education.module.css";

type Degree = (typeof education.degrees)[number];

/** Rows glide to their new place when a description opens or closes. */
const glide = { type: "spring", bounce: 0.2, duration: 0.4 } as const;

const ArrowIcon = () => (
  <svg className={styles.arrowIcon} viewBox="0 0 16 12" fill="currentColor" aria-hidden="true">
    <path d="M 8.906 0.32 C 9.353 -0.107 10.076 -0.107 10.522 0.32 L 15.665 5.234 C 16.112 5.661 16.112 6.352 15.665 6.779 L 10.522 11.693 C 10.074 12.107 9.361 12.101 8.92 11.68 C 8.479 11.259 8.473 10.578 8.906 10.149 L 12 7.099 L 1.143 7.099 C 0.512 7.099 0 6.61 0 6.007 C 0 5.403 0.512 4.914 1.143 4.914 L 12 4.914 L 8.906 1.864 C 8.46 1.438 8.46 0.746 8.906 0.32" />
  </svg>
);

/**
 * The text under an open row. On desktop it simply fades in; on smaller screens
 * the words sharpen and rise into place one after another.
 */
function Description({ id, text }: { id: string; text: string }) {
  const wordByWord = useBreakpoint() !== "desktop";
  const reduce = useReducedMotion();

  return (
    <motion.div
      id={id}
      className={styles.description}
      layout="position"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={glide}
    >
      {wordByWord && !reduce ? (
        <p>
          <span className="visually-hidden">{text}</span>
          <span aria-hidden="true">
            {text.split(" ").map((word, i) => (
              <motion.span
                key={i}
                className={styles.word}
                initial={{ opacity: 0.001, y: 10, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ type: "spring", bounce: 0, duration: 1, delay: i * 0.05 }}
              >
                {word}{" "}
              </motion.span>
            ))}
          </span>
        </p>
      ) : (
        <p>{text}</p>
      )}
    </motion.div>
  );
}

function DegreeRow({ degree, open, onToggle }: { degree: Degree; open: boolean; onToggle: () => void }) {
  const descriptionId = `education-${degree.id}`;
  return (
    <li className={styles.card}>
      <motion.h3 layout="position" transition={glide}>
        <button
          type="button"
          className={styles.row}
          aria-expanded={open}
          aria-controls={open ? descriptionId : undefined}
          onClick={onToggle}
        >
          <span className={styles.main}>
            <span className={styles.degree}>
              {degree.degree.map((line) => (
                <span key={line}>{line} </span>
              ))}
            </span>
            <span className={styles.school}>
              {degree.school.map((line) => (
                <span key={line}>{line} </span>
              ))}
            </span>
          </span>
          <span className={styles.meta}>
            <span className={styles.period}>
              <span>{degree.period[0]} </span>
              <span>{degree.period[1]}</span>
            </span>
            <span className={styles.arrow}>
              <ArrowIcon />
            </span>
          </span>
        </button>
      </motion.h3>
      <AnimatePresence initial={false}>{open && <Description id={descriptionId} text={degree.description} />}</AnimatePresence>
    </li>
  );
}

export function Education() {
  const [openId, setOpenId] = useState<string | null>(null);
  const openIndex = education.degrees.findIndex((degree) => degree.id === openId);

  return (
    <section className={`${styles.section} ${robotoLight.variable}`} aria-labelledby="education-label">
      <div className={styles.inner}>
        <div className={styles.header}>
          <Reveal>
            <h2 className="section-label" id="education-label">
              {education.label}
            </h2>
          </Reveal>
          <LineReveal as="p" parts={[{ text: education.intro }]} className={`${styles.intro} ${about.wholeWords}`} />
        </div>

        <Appear x={150} duration={3} className={styles.listSlot}>
          {/* One row can be open at a time; `data-open` holds its position for the styles. */}
          <ul className={styles.list} data-open={openIndex >= 0 ? openIndex + 1 : undefined}>
            {education.degrees.map((degree) => (
              <DegreeRow
                key={degree.id}
                degree={degree}
                open={degree.id === openId}
                onToggle={() => setOpenId((current) => (current === degree.id ? null : degree.id))}
              />
            ))}
          </ul>
        </Appear>
      </div>
    </section>
  );
}
