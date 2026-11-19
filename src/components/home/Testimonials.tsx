"use client";

import { useEffect, useRef } from "react";
import { testimonials } from "@/content/site";
import { Reveal } from "@/components/motion";
import styles from "./Testimonials.module.css";

/** Scroll speed of the strip, in pixels per second. */
const SPEED = 50;

export function Testimonials() {
  const track = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let offset = 0;
    let last = performance.now();
    let frame = 0;
    let running = true;

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      // The list is rendered twice; once the first copy has fully passed, wrap around.
      const loop = el.scrollWidth / 2;
      offset = (offset + SPEED * dt) % loop;
      el.style.transform = `translate3d(${-offset}px, 0, 0)`;
      if (running) frame = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver((entries) => {
      const visible = entries.some((e) => e.isIntersecting);
      if (visible && !running) {
        running = true;
        last = performance.now();
        frame = requestAnimationFrame(tick);
      } else if (!visible) {
        running = false;
        cancelAnimationFrame(frame);
      }
    });
    io.observe(el);
    frame = requestAnimationFrame(tick);

    return () => {
      running = false;
      cancelAnimationFrame(frame);
      io.disconnect();
    };
  }, []);

  return (
    <section className={styles.section} aria-labelledby="testimonials-label">
      <Reveal>
        <h2 className="section-label" id="testimonials-label">
          Testimonials
        </h2>
      </Reveal>

      <div className={styles.viewport}>
        <ul ref={track} className={styles.track}>
          {[0, 1].map((copy) =>
            testimonials.map((t) => (
              <li key={`${copy}-${t.name}`} className={styles.card} aria-hidden={copy === 1 ? true : undefined}>
                <p className={styles.quote}>{t.quote}</p>
                <div className={styles.person}>
                  <p className={styles.name}>{t.name}</p>
                  <p className={styles.role}>{t.role}</p>
                </div>
              </li>
            )),
          )}
        </ul>
      </div>
    </section>
  );
}
