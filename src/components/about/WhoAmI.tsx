import { whoAmI } from "@/content/about";
import { LineReveal, Reveal } from "@/components/motion";
import { Appear } from "./Appear";
import about from "./About.module.css";
import styles from "./WhoAmI.module.css";

export function WhoAmI() {
  return (
    <section className={styles.section} id="who-am-i" aria-labelledby="who-am-i-label">
      <div className={styles.text}>
        <Reveal>
          <h2 className="section-label" id="who-am-i-label">
            {whoAmI.label}
          </h2>
        </Reveal>
        <LineReveal as="p" parts={[{ text: whoAmI.body }]} className={`${styles.body} ${about.wholeWords}`} />
      </div>

      {/* The photo slides up each time it comes on screen. */}
      <Appear y={66} duration={0.4} once={false} className={styles.photo}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={whoAmI.photo.src} alt={whoAmI.photo.alt} loading="lazy" decoding="async" />
      </Appear>
    </section>
  );
}
