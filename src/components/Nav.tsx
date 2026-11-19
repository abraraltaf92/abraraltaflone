"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { nav, site } from "@/content/site";
import { ResumeButton } from "./ResumeButton";
import { SiteLink } from "./SiteLink";
import styles from "./Nav.module.css";

export function Nav() {
  const [open, setOpen] = useState(false);

  // Close the phone menu when the viewport grows past the phone layout.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 810px)");
    const close = () => mq.matches && setOpen(false);
    mq.addEventListener("change", close);
    return () => mq.removeEventListener("change", close);
  }, []);

  return (
    <header className={styles.wrap}>
      <motion.div
        className={styles.bar}
        data-open={open ? "" : undefined}
        initial={{ opacity: 0.001, y: -150 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", bounce: 0.2, duration: 2 }}
      >
        <div className={styles.row}>
          <SiteLink href="/" className={styles.logo} onClick={() => setOpen(false)}>
            {site.shortName}
          </SiteLink>

          <nav className={styles.links} aria-label="Main">
            {nav.map((item) => (
              <SiteLink key={item.href} href={item.href} className={styles.link} data-text={item.label}>
                <span>{item.label}</span>
              </SiteLink>
            ))}
          </nav>

          <div className={styles.cta}>
            <ResumeButton />
          </div>

          <button
            type="button"
            className={styles.burger}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>

        <div className={styles.drawer} aria-hidden={!open}>
          <div className={styles.drawerInner}>
          <nav className={styles.drawerLinks} aria-label="Main">
            {nav.map((item) => (
              <SiteLink
                key={item.href}
                href={item.href}
                className={styles.link}
                data-text={item.label}
                tabIndex={open ? 0 : -1}
                onClick={() => setOpen(false)}
              >
                <span>{item.label}</span>
              </SiteLink>
            ))}
          </nav>
          <div className={styles.drawerCta}>
            <ResumeButton tabIndex={open ? 0 : -1} />
          </div>
          </div>
        </div>
      </motion.div>
    </header>
  );
}
