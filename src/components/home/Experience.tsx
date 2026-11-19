import { aboutTeaser, experience } from "@/content/site";
import { LineReveal, Reveal } from "@/components/motion";
import { PillLink } from "@/components/PillLink";
import { ExperienceRow } from "./ExperienceRow";
import styles from "./Experience.module.css";

export function Experience() {
  return (
    <section
      className={styles.section}
      id="experience"
      data-cursor-label="Work Experience"
      aria-labelledby="experience-label"
    >
      <Reveal>
        <h2 className="section-label" id="experience-label">
          Work Experience
        </h2>
      </Reveal>

      <Reveal x={30} delay={0.2} duration={1.5} className={styles.listWrap}>
        <ul className={styles.list}>
          {experience.map((job) => (
            <ExperienceRow key={job.company} job={job} />
          ))}
        </ul>
      </Reveal>
    </section>
  );
}

export function AboutTeaser() {
  return (
    <section className={styles.about} data-cursor-label="About Me" aria-labelledby="about-label">
      <Reveal>
        <h2 className="section-label" id="about-label">
          About Me
        </h2>
      </Reveal>

      <LineReveal
        as="p"
        parts={aboutTeaser.heading}
        className={styles.aboutHeading}
        toneClass={{ ink: styles.ink, muted: styles.muted }}
      />

      <Reveal x={40} delay={0.3} duration={1.5} className={styles.aboutAction}>
        <PillLink href={aboutTeaser.cta.href} variant="secondary" icon="large">
          {aboutTeaser.cta.label}
        </PillLink>
      </Reveal>
    </section>
  );
}
