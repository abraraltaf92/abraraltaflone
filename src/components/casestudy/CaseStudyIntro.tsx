import { LineReveal, Reveal, Rise, type TextPart } from "@/components/motion";
import { PillLink } from "@/components/PillLink";
import styles from "./CaseStudyIntro.module.css";

type Props = {
  /** Small heading above the text, e.g. "Introduction". */
  label: string;
  /** The paragraph, as runs of text (`bold: true` for emphasis); it appears line by line on load. */
  body: TextPart[];
  image: { src: string; alt: string; width: number; height: number };
  /** Grey button with an arrow; opens `href` in a new tab. */
  visit: { label: string; href: string };
  /** Black button; an in-site link. */
  back: { label: string; href: string };
  /**
   * How the two buttons react to the pointer.
   * "ease" (default): the site's standard pill. Fill, text and outline cross-fade and the
   * arrow turns 45 degrees.
   * "snap": the fill eases over more quickly, while the text colour changes at once, the
   * arrow jumps to pointing right (and dims under the pointer), and the outline is dropped
   * the moment the pointer leaves.
   */
  hover?: "ease" | "snap";
};

/** Opening block of a case study: text and two buttons beside (on smaller screens, above) an image. */
export function CaseStudyIntro({ label, body, image, visit, back, hover = "ease" }: Props) {
  return (
    <section className={styles.intro} aria-labelledby="intro-label">
      <div className={styles.text}>
        <div className={styles.copy}>
          <Reveal>
            <h2 className="section-label" id="intro-label">
              {label}
            </h2>
          </Reveal>
          <LineReveal as="p" onMount parts={body} className={styles.body} boldClass={styles.bold} />
        </div>

        <div className={hover === "snap" ? `${styles.actions} ${styles.snap}` : styles.actions}>
          <Reveal x={40} delay={0.3} duration={1.5} className={styles.action}>
            <PillLink
              href={visit.href}
              variant="secondary"
              icon="large"
              newTab
              className={styles.visit}
              iconClassName={styles.arrow}
            >
              {visit.label}
            </PillLink>
          </Reveal>
          <Reveal x={40} delay={0.3} duration={1.5} className={styles.action}>
            <PillLink href={back.href} variant="primary" icon="none" className={styles.back}>
              {back.label}
            </PillLink>
          </Reveal>
        </div>
      </div>

      <Rise onMount y={150} duration={2} className={styles.figure}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image.src} alt={image.alt} width={image.width} height={image.height} decoding="async" />
      </Rise>
    </section>
  );
}
