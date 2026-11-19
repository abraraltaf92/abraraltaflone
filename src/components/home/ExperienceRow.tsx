"use client";

import { useId, useState, type MouseEvent } from "react";
import Link from "next/link";
import type { experience } from "@/content/site";
import { ArrowDiagonal } from "@/components/icons";
import styles from "./Experience.module.css";

type Job = (typeof experience)[number];

/** One job. If it has a description, clicking the row (or its arrow) opens and closes it. */
export function ExperienceRow({ job }: { job: Job }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const expandable = Boolean(job.description);

  const name = <span className={styles.companyName}>{job.company}</span>;

  // The whole row is a click target, but links and the arrow button handle themselves.
  const onRowClick = (e: MouseEvent<HTMLDivElement>) => {
    if (!expandable || (e.target as HTMLElement).closest("a, button")) return;
    setOpen((v) => !v);
  };

  return (
    <li className={styles.row} data-open={open ? "" : undefined} data-expandable={expandable ? "" : undefined}>
      <div className={styles.main} onClick={onRowClick}>
        <h3 className={styles.company}>
          {job.learnMore ? (
            <Link href={job.learnMore}>
              {name} <span className={styles.learnMore}>[Learn more]</span>
            </Link>
          ) : (
            name
          )}
        </h3>
        <div className={styles.meta}>
          <p className={styles.role}>{job.role}</p>
          <p className={styles.period}>{job.period}</p>
          {expandable ? (
            <button
              type="button"
              className={styles.toggle}
              aria-expanded={open}
              aria-controls={panelId}
              aria-label={`${open ? "Hide" : "Show"} details for ${job.company}`}
              onClick={() => setOpen((v) => !v)}
            >
              <ArrowDiagonal className={styles.arrow} />
            </button>
          ) : (
            <ArrowDiagonal className={styles.arrow} />
          )}
        </div>
      </div>

      {expandable && (
        <div className={styles.panel} id={panelId} aria-hidden={!open}>
          <div className={styles.panelInner}>
            <p className={styles.description}>{job.description}</p>
          </div>
        </div>
      )}
    </li>
  );
}
