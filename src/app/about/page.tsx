import type { Metadata } from "next";
import { Intro } from "@/components/about/Intro";
import { WhoAmI } from "@/components/about/WhoAmI";
import { Journey } from "@/components/about/Journey";
import { Achievements } from "@/components/about/Achievements";
import { Education } from "@/components/about/Education";
import { CalmMotion } from "@/components/about/CalmMotion";
import styles from "@/components/about/About.module.css";

export const metadata: Metadata = {
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <CalmMotion>
      <div className={styles.about}>
        <Intro />
        <div className={styles.sections}>
          <WhoAmI />
          <Journey />
          <Achievements />
          <Education />
        </div>
      </div>
    </CalmMotion>
  );
}
