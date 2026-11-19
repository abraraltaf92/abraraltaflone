import type { Feature } from "@/content/biblo";
import { LineReveal, Reveal, Rise } from "@/components/motion";
import { CaseStudySection } from "@/components/casestudy/CaseStudySection";
import styles from "./KeyFeatures.module.css";

type Props = {
  id: string;
  label: string;
  character: { src: string; alt: string; width: number; height: number };
  items: Feature[];
};

/** Numbered feature list with the mascot standing clear of it: to its right, or below it on a narrow phone. */
export function KeyFeatures({ id, label, character, items }: Props) {
  return (
    <CaseStudySection
      id={id}
      label={label}
      className={styles.features}
      backdrop={
        <Rise y={150} duration={2} className={styles.character}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={character.src}
            alt={character.alt}
            width={character.width}
            height={character.height}
            loading="lazy"
            decoding="async"
          />
        </Rise>
      }
    >
      <ol className={styles.list}>
        {items.map((item) => (
          <li key={item.lead} className={styles.item}>
            <Reveal x={30} delay={0.2} duration={1.5} className={styles.headingSlot}>
              <LineReveal
                as="h3"
                parts={[{ text: `${item.lead} `, tone: "ink" }, { text: item.rest }]}
                className={styles.heading}
                toneClass={{ ink: styles.ink }}
              />
            </Reveal>
            <div className={styles.descriptionSlot}>
              <Reveal>
                <p className={styles.description}>{item.description}</p>
              </Reveal>
            </div>
          </li>
        ))}
      </ol>
    </CaseStudySection>
  );
}
