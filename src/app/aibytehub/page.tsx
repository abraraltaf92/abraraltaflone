import type { Metadata } from "next";
import { aibytehub } from "@/content/aibytehub";
import { site } from "@/content/site";
import { CaseStudyFrame } from "@/components/casestudy/CaseStudyFrame";
import { CaseStudyIntro } from "@/components/casestudy/CaseStudyIntro";
import { ExploreButton } from "@/components/casestudy/ExploreButton";
import { ClientProjects } from "@/components/aibytehub/ClientProjects";
import tuning from "@/components/aibytehub/tuning.module.css";

export const metadata: Metadata = {
  openGraph: {
    type: "website",
    title: site.title,
    description: site.description,
    url: aibytehub.path,
    images: ["/images/og.png"],
  },
};

export default function AibyteHubPage() {
  const { title, intro, explore, projects } = aibytehub;
  return (
    <CaseStudyFrame title={title} className={tuning.tuning}>
      <CaseStudyIntro
        label={intro.label}
        body={intro.body}
        image={intro.image}
        visit={intro.visit}
        back={intro.back}
        hover="snap"
      />
      <ExploreButton label={explore.label} href={explore.href} arrow={false} />
      <ClientProjects id={projects.id} label={projects.label} items={projects.items} />
    </CaseStudyFrame>
  );
}
