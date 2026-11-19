import type { ReactNode } from "react";
import { Reveal } from "@/components/motion";
import styles from "./CaseStudySection.module.css";

type Props = {
  /** Anchor id; in-page links such as the Explore button scroll here. */
  id: string;
  /** Small heading above the content, e.g. "Key Features". */
  label: string;
  /** Decoration drawn behind the content (position it yourself, relative to the section). */
  backdrop?: ReactNode;
  /** Text shown beside the site's custom pointer while it is over the section. */
  cursorLabel?: string;
  className?: string;
  children: ReactNode;
};

/** A labelled section of a case study. The label slides in when the section scrolls into view. */
export function CaseStudySection({ id, label, backdrop, cursorLabel, className, children }: Props) {
  const labelId = `${id}-label`;
  return (
    <section
      id={id}
      className={[styles.section, className].filter(Boolean).join(" ")}
      data-cursor-label={cursorLabel}
      aria-labelledby={labelId}
    >
      {backdrop}
      <div className={styles.content}>
        <Reveal>
          <h2 className="section-label" id={labelId}>
            {label}
          </h2>
        </Reveal>
        {children}
      </div>
    </section>
  );
}
