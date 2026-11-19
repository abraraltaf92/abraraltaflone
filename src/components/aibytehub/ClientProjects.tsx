import { Rise } from "@/components/motion";
import { CaseStudySection } from "@/components/casestudy/CaseStudySection";
import styles from "./ClientProjects.module.css";

type Props = {
  /** Anchor id the Explore button scrolls to. */
  id: string;
  /** Section heading; also shown beside the pointer while it is over the section. */
  label: string;
  items: { title: string; href: string; image: string }[];
};

/** Grid of client sites: each card is a screenshot with the client's name, linking to the live site. */
export function ClientProjects({ id, label, items }: Props) {
  return (
    <CaseStudySection id={id} label={label} cursorLabel={label}>
      <ul className={styles.grid}>
        {items.map((project, i) => (
          <li key={project.href}>
            {/* left column rises 150px, right column 200px, so each pair lands slightly out of step */}
            <Rise y={i % 2 === 0 ? 150 : 200} duration={3} className={styles.rise}>
              <a
                className={styles.card}
                href={project.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${project.title} (opens the website in a new tab)`}
              >
                <span className={styles.thumb}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={project.image} alt="" width={1242} height={904} loading="lazy" decoding="async" />
                </span>
                <h3 className={styles.title}>{project.title}</h3>
              </a>
            </Rise>
          </li>
        ))}
      </ul>
    </CaseStudySection>
  );
}
