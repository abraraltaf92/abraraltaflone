import { achievements } from "@/content/about";
import { LineReveal, Reveal } from "@/components/motion";
import { BookCard } from "./BookCard";
import about from "./About.module.css";
import styles from "./Achievements.module.css";

export function Achievements() {
  return (
    <section className={styles.section} aria-labelledby="achievements-label">
      <div className={styles.inner}>
        <div className={styles.header}>
          <Reveal>
            <h2 className="section-label" id="achievements-label">
              {achievements.label}
            </h2>
          </Reveal>
          <LineReveal as="p" parts={[{ text: achievements.intro }]} className={`${styles.intro} ${about.wholeWords}`} />
        </div>

        <BookCard />
      </div>
    </section>
  );
}
