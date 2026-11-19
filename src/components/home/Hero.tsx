import { hero, site, skills, type SkillIcon } from "@/content/site";
import { BarsIcon, CloudIcon, CodeIcon, GearIcon, ServerIcon } from "@/components/icons";
import { Lanyard } from "@/components/lanyard/Lanyard";
import { LineReveal, Reveal, Rise } from "@/components/motion";
import { PillLink } from "@/components/PillLink";
import styles from "./Hero.module.css";

const icons: Record<SkillIcon, { Icon: typeof CodeIcon; width: number; height: number }> = {
  code: { Icon: CodeIcon, width: 51, height: 30 },
  gear: { Icon: GearIcon, width: 32, height: 33 },
  bars: { Icon: BarsIcon, width: 27, height: 27 },
  cloud: { Icon: CloudIcon, width: 39, height: 28 },
  server: { Icon: ServerIcon, width: 32, height: 28 },
};

// The profile buttons beside "Get In Touch", in this order. Labels and addresses come from
// the site's list of profiles.
const profiles = ["LinkedIn", "GitHub"].flatMap((label) => site.socials.filter((social) => social.label === label));

// Each skill card rises from a little further down than the one before it.
const riseFrom = [75, 100, 120, 140, 160];

export function Hero() {
  return (
    <div className={styles.group}>
      <section className={styles.hero} id="home" aria-label="Introduction">
        <Lanyard />

        <Reveal onMount x={20} delay={0.2} duration={1}>
          <p className={styles.eyebrow}>{hero.eyebrow}</p>
        </Reveal>

        <LineReveal
          onMount
          parts={hero.heading}
          className={styles.heading}
          toneClass={{ ink: styles.ink, muted: styles.muted }}
          boldClass={styles.bold}
        />

        <div className={styles.actions}>
          <Reveal onMount x={30} delay={0.2} duration={1.5} className={styles.action}>
            <PillLink href={hero.primaryCta.href} variant="primary" newTab>
              {hero.primaryCta.label}
            </PillLink>
          </Reveal>
          {profiles.map((profile, i) => (
            // each arrives one step after the button before it
            <Reveal key={profile.label} onMount x={40 + i * 10} delay={0.3 + i * 0.1} duration={1.5} className={styles.action}>
              <PillLink href={profile.href} variant="secondary" newTab>
                {profile.label}
              </PillLink>
            </Reveal>
          ))}
        </div>
      </section>

      <section className={styles.skills} aria-labelledby="skills-label">
        <Reveal onMount x={20} delay={0.2} duration={1}>
          <h2 className="section-label" id="skills-label">
            Core Skills
          </h2>
        </Reveal>

        <ul className={styles.cards}>
          {skills.map((skill, i) => {
            const { Icon, width, height } = icons[skill.icon];
            return (
              <li key={skill.title.join(" ")} className={styles.cardSlot}>
                <Rise onMount y={riseFrom[i] ?? 160} duration={2} className={styles.card}>
                  <Icon className={styles.icon} style={{ width, height }} />
                  <div className={styles.cardText}>
                    <h3 className={styles.cardTitle}>
                      {skill.title.map((line) => (
                        <span key={line}>{line}</span>
                      ))}
                    </h3>
                    <p className={styles.cardBody}>
                      {skill.lines.map((line) => (
                        <span key={line}>{line}</span>
                      ))}
                    </p>
                  </div>
                </Rise>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
