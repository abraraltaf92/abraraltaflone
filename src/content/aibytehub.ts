// Copy for the Aibyte Hub case-study page (/aibytehub). Edit text, links and images here;
// layout and motion live in src/components/casestudy (shared) and src/components/aibytehub.

import type { TextPart } from "@/components/motion";

export type CaseStudyImage = { src: string; alt: string; width: number; height: number };
export type CaseStudyLink = { label: string; href: string };

export const aibytehub = {
  // Page heading for screen readers and search engines (the design shows no visible title).
  title: "Aibyte Hub",
  path: "/aibytehub",

  intro: {
    label: "Introduction",
    // Each part is one run of text (`bold: true` would pick the heavier weight).
    body: [
      {
        text: "Aibyte Hub is a digital solutions company focused on building reliable, high-impact technology for businesses. We specialize in custom web and app development, SEO-optimized digital experiences, and IT infrastructure solutions—particularly for healthcare and local service brands. Our work combines clean design, scalable engineering, and performance-driven strategy to help businesses improve visibility, streamline operations, and drive measurable growth both online and in day-to-day systems.",
      },
    ] satisfies TextPart[],
    image: {
      src: "/images/aibytehub/aibyte-hub.png",
      alt: "Aibyte Hub Private Limited logo above an illustration of people building websites",
      width: 610,
      height: 390,
    } satisfies CaseStudyImage,
    // Opens the company site in a new tab.
    visit: { label: "Visit Us", href: "https://www.aibytehub.com/" } satisfies CaseStudyLink,
    // Returns to the work-experience list on the home page.
    back: { label: "Back", href: "/#experience" } satisfies CaseStudyLink,
  },

  // Floating button that scrolls down to the projects list (`href` is the section's id).
  explore: { label: "Explore", href: "#projects" } satisfies CaseStudyLink,

  projects: {
    id: "projects",
    label: "Projects",
    // Client sites, in display order. Each card opens the live site in a new tab.
    items: [
      {
        title: "Tony’s Family Pharmacy",
        href: "https://tonysfamilyrx.com/",
        image: "/images/aibytehub/tonys-family-pharmacy.png",
      },
      {
        title: "Crossroads Chemists",
        href: "https://www.crossroadschemists.com/",
        image: "/images/aibytehub/crossroads-chemists.png",
      },
      {
        title: "Smile Pharmacy",
        href: "https://smilerxnj.com/",
        image: "/images/aibytehub/smile-pharmacy.png",
      },
      {
        title: "Harbor Pharmacy",
        href: "https://www.harborxnj.com/",
        image: "/images/aibytehub/harbor-pharmacy.png",
      },
    ] satisfies ClientProject[],
  },
};

export type ClientProject = { title: string; href: string; image: string };
