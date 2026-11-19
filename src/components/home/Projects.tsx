"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { projects } from "@/content/site";
import { ArrowDown } from "@/components/icons";
import { Reveal, Rise } from "@/components/motion";
import { setScrollLocked } from "@/components/SmoothScroll";
import styles from "./Projects.module.css";

type Project = (typeof projects)[number];

function Tile({ project, onOpen }: { project: Project; onOpen: () => void }) {
  const inner = (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className={styles.image} src={project.image} alt="" loading="lazy" decoding="async" />
      <span className={styles.blur} />
      <span className={styles.description}>{project.description}</span>
      <span className={styles.view}>
        <ArrowDown className={styles.viewArrow} />
        <span className={styles.viewText}>view</span>
      </span>
    </>
  );
  if (project.href) {
    return (
      <a
        className={styles.tile}
        href={project.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${project.title} (opens the project on GitHub)`}
      >
        {inner}
      </a>
    );
  }
  return (
    <button type="button" className={styles.tile} onClick={onOpen} aria-label={`${project.title} (opens a larger preview)`}>
      {inner}
    </button>
  );
}

/** Full-screen view of a project's larger picture. Closes on Escape, the button, or a click on the backdrop. */
function Lightbox({ project, onClose }: { project: Project; onClose: () => void }) {
  const closeButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Keyboard focus moves into the dialog, and goes back to the tile that opened it afterwards.
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    closeButton.current?.focus();
    setScrollLocked(true);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      // the close button is the only control, so Tab stays on it
      if (e.key === "Tab") {
        e.preventDefault();
        closeButton.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      setScrollLocked(false);
      window.removeEventListener("keydown", onKey);
      opener?.focus();
    };
  }, [onClose]);

  return createPortal(
    // data-lenis-prevent leaves touch gestures inside the dialog to the browser, so the
    // picture can be pinch-zoomed on a phone.
    <div
      className={styles.lightbox}
      role="dialog"
      aria-modal="true"
      aria-label={project.title}
      data-lenis-prevent
      data-cursor-tone="light"
      data-cursor-label=""
      onClick={onClose}
    >
      {/* the picture and the close button are light, so the cursor goes back to dark over them */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className={styles.lightboxImage}
        src={project.preview ?? project.image}
        alt={project.title}
        data-cursor-tone="dark"
        onClick={(e) => e.stopPropagation()}
      />
      <button
        ref={closeButton}
        type="button"
        className={styles.lightboxClose}
        aria-label="Close"
        data-cursor-tone="dark"
        onClick={onClose}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      </button>
    </div>,
    document.body,
  );
}

export function Projects() {
  const [enlarged, setEnlarged] = useState<Project | null>(null);

  return (
    <section className={styles.section} id="projects" data-cursor-label="Projects" aria-labelledby="projects-label">
      <Reveal>
        <h2 className="section-label" id="projects-label">
          Projects
        </h2>
      </Reveal>

      <ul className={styles.grid}>
        {projects.map((project, i) => (
          <li key={project.title} className={styles.item}>
            {/* each column rises from a little further down, so a row lands slightly out of step */}
            <Rise y={150 + (i % 3) * 50} duration={3} className={styles.project}>
              <Tile project={project} onOpen={() => setEnlarged(project)} />
              <h3 className={styles.title}>{project.title}</h3>
            </Rise>
          </li>
        ))}
      </ul>

      {enlarged && <Lightbox project={enlarged} onClose={() => setEnlarged(null)} />}
    </section>
  );
}
