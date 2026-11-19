import { footerNav, site } from "@/content/site";
import { PillLink } from "./PillLink";
import { SiteLink } from "./SiteLink";
import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer} data-cursor-tone="light" data-cursor-label="">
      <div className={styles.top}>
        <div className={styles.lead}>
          <div className={styles.headingBlock}>
            <h2 className={styles.heading}>{site.footer.heading}</h2>
            <p className={styles.email}>
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </p>
          </div>
          <PillLink href={`mailto:${site.email}`} variant="secondary" newTab>
            {site.footer.cta}
          </PillLink>
        </div>

        <div className={styles.links}>
          <ul className={styles.column}>
            {footerNav.map((item) => (
              <li key={item.label}>
                {item.external ? (
                  <a href={item.href} target="_blank" rel="noopener noreferrer">
                    {item.label}
                  </a>
                ) : (
                  <SiteLink href={item.href}>{item.label}</SiteLink>
                )}
              </li>
            ))}
          </ul>
          <ul className={styles.column}>
            {site.socials.map((item) => (
              <li key={item.label}>
                <a href={item.href} target="_blank" rel="noopener noreferrer">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className={styles.note}>{site.footer.note}</p>
    </footer>
  );
}
