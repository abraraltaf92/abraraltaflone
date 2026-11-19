import type { ReactNode } from "react";
import styles from "./CaseStudyFrame.module.css";

type Props = {
  /** Page heading for screen readers and search engines (the design shows no visible title). */
  title: string;
  /** Optional class that sets the tuning variables documented in CaseStudyFrame.module.css. */
  className?: string;
  children: ReactNode;
};

/**
 * Vertical rhythm of a case-study page: a visually hidden page title, then the sections
 * stacked with the page's own spacing (which differs from the shared page frame).
 */
export function CaseStudyFrame({ title, className, children }: Props) {
  return (
    <div className={[styles.frame, className].filter(Boolean).join(" ")}>
      <h1 className="visually-hidden">{title}</h1>
      {children}
    </div>
  );
}
