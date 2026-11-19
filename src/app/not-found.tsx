import type { Metadata } from "next";
import { notFound, site } from "@/content/site";
import { LineReveal, Reveal } from "@/components/motion";
import { PillLink } from "@/components/PillLink";
import styles from "./not-found.module.css";

export const metadata: Metadata = {
  title: `${notFound.title} | ${site.name}`,
  robots: { index: false },
};

/** Shown for any address that does not match a page. */
export default function NotFound() {
  return (
    <section className={styles.notFound} aria-label={notFound.title}>
      <LineReveal
        onMount
        parts={notFound.heading}
        className={styles.heading}
        toneClass={{ ink: styles.ink, muted: styles.muted }}
      />
      <Reveal onMount x={30} delay={0.2} duration={1.5} className={styles.action}>
        <PillLink href={notFound.cta.href} variant="primary" className={styles.button}>
          {notFound.cta.label}
        </PillLink>
      </Reveal>
    </section>
  );
}
