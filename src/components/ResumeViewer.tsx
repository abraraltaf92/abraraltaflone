"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { PDFDocumentProxy, RenderTask } from "pdfjs-dist";
import { site } from "@/content/site";
import { setScrollLocked } from "./SmoothScroll";
import styles from "./ResumeButton.module.css";

const ZOOMS = [1, 1.25, 1.5, 2, 2.5, 3];

const Icon = ({ d }: { d: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={d} />
  </svg>
);

/** Full-screen viewer for the resume PDF: page through it, zoom, download, close. */
export function ResumeViewer({ onClose }: { onClose: () => void }) {
  const stage = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [doc, setDoc] = useState<PDFDocumentProxy | null>(null);
  const [page, setPage] = useState(1);
  const [zoom, setZoom] = useState(0);
  const [failed, setFailed] = useState(false);

  // Load the PDF library and the file.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        // The "legacy" build runs on older browsers too; keep the worker file in /public/files in step with it.
        const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
        pdfjs.GlobalWorkerOptions.workerSrc = "/files/pdf.worker.min.mjs";
        const loaded = await pdfjs.getDocument({ url: site.resume.file }).promise;
        if (!cancelled) setDoc(loaded);
      } catch (error) {
        console.error("Resume viewer:", error);
        if (!cancelled) setFailed(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Lock page scroll and wire up the keyboard while open.
  useEffect(() => {
    setScrollLocked(true);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setPage((p) => Math.min(p + 1, doc?.numPages ?? p));
      if (e.key === "ArrowLeft") setPage((p) => Math.max(p - 1, 1));
    };
    window.addEventListener("keydown", onKey);
    return () => {
      setScrollLocked(false);
      window.removeEventListener("keydown", onKey);
    };
  }, [doc, onClose]);

  // Draw the current page, fitted to the viewer height (times the zoom step).
  const draw = useCallback(() => {
    const el = canvas.current;
    const box = stage.current;
    if (!doc || !el || !box) return () => {};
    let task: RenderTask | null = null;
    let cancelled = false;
    (async () => {
      const pdfPage = await doc.getPage(page);
      if (cancelled) return;
      const base = pdfPage.getViewport({ scale: 1 });
      const pad = getComputedStyle(box);
      const availH = box.clientHeight - parseFloat(pad.paddingTop) - parseFloat(pad.paddingBottom);
      const availW = box.clientWidth - parseFloat(pad.paddingLeft) - parseFloat(pad.paddingRight);
      const fit = Math.min(availH / base.height, availW / base.width);
      const cssScale = fit * ZOOMS[zoom];
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      const viewport = pdfPage.getViewport({ scale: cssScale * ratio });
      el.width = Math.floor(viewport.width);
      el.height = Math.floor(viewport.height);
      el.style.width = `${Math.floor(base.width * cssScale)}px`;
      el.style.height = `${Math.floor(base.height * cssScale)}px`;
      task = pdfPage.render({ canvas: el, viewport });
      task.promise.catch(() => {});
    })();
    return () => {
      cancelled = true;
      task?.cancel();
    };
  }, [doc, page, zoom]);

  useEffect(() => {
    let cleanup = draw();
    const onResize = () => {
      cleanup();
      cleanup = draw();
    };
    window.addEventListener("resize", onResize);
    return () => {
      cleanup();
      window.removeEventListener("resize", onResize);
    };
  }, [draw]);

  const pages = doc?.numPages ?? 0;

  return createPortal(
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-label="Resume"
      data-lenis-prevent
      data-cursor-tone="light"
      data-cursor-label=""
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        ref={stage}
        className={styles.stage}
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        {/* the page itself is white, so the cursor goes back to dark over it */}
        <canvas ref={canvas} data-cursor-tone="dark" />
      </div>

      {!doc && <p className={styles.status}>{failed ? "The resume could not be loaded." : "Loading…"}</p>}
      {pages > 0 && (
        <span className={styles.counter}>
          {page}/{pages}
        </span>
      )}

      <button type="button" className={`${styles.control} ${styles.close}`} aria-label="Close" onClick={onClose}>
        <Icon d="M18 6 6 18M6 6l12 12" />
      </button>
      <button
        type="button"
        className={`${styles.control} ${styles.zoomOut}`}
        aria-label="Zoom out"
        aria-disabled={zoom === 0}
        onClick={() => setZoom((z) => Math.max(z - 1, 0))}
      >
        <Icon d="M21 21l-4.3-4.3M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM8 11h6" />
      </button>
      <button
        type="button"
        className={`${styles.control} ${styles.zoomIn}`}
        aria-label="Zoom in"
        aria-disabled={zoom === ZOOMS.length - 1}
        onClick={() => setZoom((z) => Math.min(z + 1, ZOOMS.length - 1))}
      >
        <Icon d="M21 21l-4.3-4.3M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM8 11h6M11 8v6" />
      </button>
      <a
        className={`${styles.control} ${styles.download}`}
        aria-label="Download resume"
        href={site.resume.file}
        download={site.resume.downloadName}
      >
        <Icon d="M12 4v11m0 0-4-4m4 4 4-4M5 19h14" />
      </a>
      {pages > 1 && (
        <>
          <button
            type="button"
            className={`${styles.control} ${styles.prev}`}
            aria-label="Previous page"
            aria-disabled={page === 1}
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
          >
            <Icon d="M15 5l-7 7 7 7" />
          </button>
          <button
            type="button"
            className={`${styles.control} ${styles.next}`}
            aria-label="Next page"
            aria-disabled={page === pages}
            onClick={() => setPage((p) => Math.min(p + 1, pages))}
          >
            <Icon d="M9 5l7 7-7 7" />
          </button>
        </>
      )}
    </div>,
    document.body,
  );
}
