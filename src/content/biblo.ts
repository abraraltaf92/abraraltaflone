// Copy for the Biblo case-study page (/biblo). Edit text, links and images here;
// layout and motion live in src/components/casestudy (shared) and src/components/biblo.

import type { TextPart } from "@/components/motion";

export type CaseStudyImage = { src: string; alt: string; width: number; height: number };
export type CaseStudyLink = { label: string; href: string };

export type Feature = {
  // The heading is two-tone: `lead` is printed in black, `rest` (including the emoji) in grey.
  lead: string;
  rest: string;
  description: string;
};

export const biblo = {
  // Page heading for screen readers and search engines (the design shows no visible title).
  title: "Biblo",
  path: "/biblo",

  intro: {
    label: "Introduction",
    // Each part is one run of text; `bold` picks the heavier weight.
    body: [
      { text: "Biblo", bold: true },
      {
        text: " is a community-driven social platform designed for book lovers and the independent bookstores that support literary culture. It connects readers with each other and with local bookshops, encouraging meaningful discovery, discussion, and shared appreciation for books enabling users to explore and purchase titles from indie bookstores, join book clubs, share recommendations, and engage in a thoughtful reading community. Built with intuitive design and a focus on human connection, Biblo aims to enhance the modern reading experience.",
      },
    ] satisfies TextPart[],
    image: {
      src: "/images/biblo/biblo-website.png",
      alt: "The Biblo website on a desktop screen, surrounded by illustrated readers and bookshelves",
      width: 610,
      height: 390,
    } satisfies CaseStudyImage,
    // Opens the product site in a new tab.
    visit: { label: "Visit Us", href: "https://www.bibloapp.com/" } satisfies CaseStudyLink,
    // Returns to the work-experience list on the home page.
    back: { label: "Back", href: "/#experience" } satisfies CaseStudyLink,
  },

  // Floating button that scrolls down to the feature list (`href` is the section's id).
  explore: { label: "Explore", href: "#key-features" } satisfies CaseStudyLink,

  features: {
    id: "key-features",
    label: "Key Features",
    // Maya, the Biblo mascot, stands beside the list (below it on narrow phones).
    character: {
      src: "/images/biblo/maya-character.png",
      alt: "Maya, Biblo's illustrated librarian, standing with her arms crossed",
      width: 832,
      height: 1248,
    } satisfies CaseStudyImage,
    // Numbered in display order.
    items: [
      {
        lead: "Reader",
        rest: "Connections 📕",
        description: "Find and connect with readers who share your taste, and exchange thoughts around books you love.",
      },
      {
        lead: "Book",
        rest: "Clubs & Discussions 👥",
        description: "Join curated book clubs to explore themes, discuss ideas, and read together.",
      },
      {
        lead: "Support",
        rest: "Indie Bookstores 🏪",
        description: "Browse and buy books directly from independent bookstores you care about.",
      },
      {
        lead: "Thoughtful",
        rest: "Book Gifting 🎁",
        description: "Gift books with personalized notes to make every recommendation more meaningful.",
      },
      {
        lead: "Built-In",
        rest: "Privacy & Security 🔒",
        description: "Your data and conversations are protected with secure, industry-standard encryption.",
      },
    ] satisfies Feature[],
  },
};
