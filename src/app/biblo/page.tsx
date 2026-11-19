import type { Metadata } from "next";
import { biblo } from "@/content/biblo";
import { site } from "@/content/site";
import { CaseStudyFrame } from "@/components/casestudy/CaseStudyFrame";
import { CaseStudyIntro } from "@/components/casestudy/CaseStudyIntro";
import { ExploreButton } from "@/components/casestudy/ExploreButton";
import { KeyFeatures } from "@/components/biblo/KeyFeatures";
import spacing from "@/components/biblo/spacing.module.css";

export const metadata: Metadata = {
  alternates: { canonical: biblo.path },
  openGraph: {
    type: "website",
    title: site.title,
    description: site.description,
    url: biblo.path,
    images: ["/images/og.png"],
  },
};

export default function BibloPage() {
  const { title, intro, explore, features } = biblo;
  return (
    <CaseStudyFrame title={title} className={spacing.spacing}>
      <CaseStudyIntro
        label={intro.label}
        body={intro.body}
        image={intro.image}
        visit={intro.visit}
        back={intro.back}
      />
      <ExploreButton label={explore.label} href={explore.href} />
      <KeyFeatures id={features.id} label={features.label} character={features.character} items={features.items} />
    </CaseStudyFrame>
  );
}
