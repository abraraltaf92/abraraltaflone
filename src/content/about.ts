// Copy and data for the About page. Edit text here; layout and motion live in src/components/about.

export const intro = {
  // Small title above the photo stack. `muted` parts are grey.
  title: [
    { text: "A Bit About ", tone: "ink" },
    { text: "Myself", tone: "muted" },
  ],
  // The headline that fades in once the photos have spread out.
  heading: [
    { text: "Turning complexity into clarity ", tone: "ink" },
    { text: "through software and data.", tone: "muted" },
  ],
};

/**
 * The photo stack. The first photo sits at the bottom of the pile and the last one on top.
 * `x` / `y` say where each photo ends up (in px from the centre) once the pile has spread out.
 */
export const photos: { src: string; alt: string; x: number; y: number }[] = [
  { src: "/images/about/hero-lake.jpg", alt: "A boat on a lake at sunset", x: 363, y: 334 },
  { src: "/images/about/hero-portrait.jpg", alt: "Abrar by the water at dusk", x: 528, y: 227 },
  { src: "/images/about/hero-beach.jpg", alt: "Abrar looking out at the sea", x: 528, y: -217 },
  { src: "/images/about/hero-bookstore.jpg", alt: "Abrar browsing the shelves of a bookstore", x: 363, y: -323 },
  { src: "/images/about/hero-desk.jpg", alt: "A desk with a monitor in warm evening light", x: -363, y: 334 },
  { src: "/images/about/hero-sunset.jpg", alt: "Abrar in silhouette against a sunset", x: -528, y: 227 },
  { src: "/images/about/hero-book.jpg", alt: "A copy of The Day I Met A Revolution on a stack of books", x: -528, y: -217 },
  { src: "/images/about/hero-reading.jpg", alt: "Abrar reading a book on a bus", x: -363, y: -323 },
];

export const whoAmI = {
  label: "Who Am I?",
  body: "I’m a software and data engineer focused on building clean, scalable systems that solve real-world problems. I enjoy working at the intersection of data, systems, and performance, where thoughtful architecture and clarity make complex challenges easier to understand and maintain. My approach emphasizes reliability, simplicity, and long-term scalability, ensuring that solutions remain effective as they grow. Driven by curiosity and continuous learning, I aim to build systems that are both technically sound and genuinely useful.",
  photo: { src: "/images/about/who-am-i.jpg", alt: "Abrar sitting in a cafe, looking at his phone" },
};

/**
 * The "My Journey" chart and the list under it. Both are drawn from this data, so adding,
 * removing or moving a point here is all it takes; the line, the shading and the cards follow.
 */
export const journey: {
  label: string;
  hint: string;
  description: string;
  years: { from: number; to: number };
  levels: string[];
  points: { id: number; title: string; period: string; details: string[]; date: string; level: number }[];
} = {
  label: "My Journey",
  hint: "Hover or tap a point to see what it involved.",
  // Read out by screen readers in place of the drawing.
  description:
    "Line chart of my path from 2020 to 2026, climbing from getting started in programming, through building apps, shipping products and production systems, to data and AI work.",
  // The first and last year marked along the bottom. Raise `to` when a new point needs the room.
  years: { from: 2020, to: 2027 },
  // The labels up the side, lowest first.
  levels: ["Getting started", "Building apps", "Shipping products", "Production systems", "Data & AI"],
  /**
   * The points, oldest first; they are numbered in this order. For each one:
   * - `title` and `period` show in the list and at the top of the card; `details` fill the card.
   * - `date` (year-month) is when it began, which is where its dot sits along the bottom.
   * - `level` is how high the dot sits: 1 is the lowest label above, 5 the highest,
   *   and 2.5 is halfway between the second and third.
   */
  points: [
    {
      id: 1,
      title: "Entry into programming & automation",
      period: "Nov 2020 – Dec 2020",
      details: [
        "Transitioned from UI interest to Python-based automation",
        "Built scripts, bots, voice tools, and web scrapers",
        "Focused on practical automation and system-level thinking",
      ],
      date: "2020-11",
      level: 1,
    },
    {
      id: 2,
      title: "First applications",
      period: "Jan 2021 – Mar 2021",
      details: [
        "Built complete applications used by peers",
        "Learned backend fundamentals, APIs, and authentication",
        "Integrated Google Maps and system-level services",
      ],
      date: "2021-01",
      level: 2,
    },
    {
      id: 3,
      title: "Research internship",
      period: "Apr 2021 – Sep 2021",
      details: [
        "Research internship at IIT Roorkee",
        "Worked on automated paper processing and computational linguistics",
        "Gained experience in structured coding and data handling",
      ],
      date: "2021-04",
      level: 2.5,
    },
    {
      id: 4,
      title: "Building products & starting Aibyte Hub",
      period: "Late 2021 – Present",
      details: [
        "Founded and led Aibyte Hub (solo)",
        "Built and shipped full-stack products",
        "Tech: Flutter, MongoDB, backend APIs, auth",
        "Delivered web, automation, backend, and AI solutions",
        "Owned development, deployment, and maintenance",
      ],
      date: "2021-12",
      level: 3,
    },
    {
      id: 5,
      title: "Software engineer",
      period: "Jan 2022 – Dec 2023",
      details: [
        "Software Engineer at Samsung Research Institute, Bangalore",
        "Started on network software: the 4G Layer-3 and RRC call stack, eNodeB, and early 6G work",
        "Moved to computer vision, camera systems, and gesture recognition",
        "Contributed to Samsung AI features, including Circle to Search",
      ],
      date: "2022-01",
      level: 4,
    },
    {
      id: 6,
      title: "MS in Data Science",
      period: "Sep 2024 – May 2026",
      details: [
        "Master’s in Data Science at Pace University, New York",
        "Projects included NYC School Bus Delay Prediction, Airbnb Pricing Analysis, and MVSA",
        "Focused on machine learning, data analysis, and applied AI",
      ],
      date: "2024-09",
      level: 5,
    },
    {
      id: 7,
      title: "Applied AI & product work",
      period: "Late 2024 – Present",
      details: [
        "Built Biblo as a solo founder (live site, MVP in production)",
        "Focused on AI-driven recommendations and product design",
        "Emphasis on applied AI and real-world impact",
      ],
      date: "2024-12",
      level: 5,
    },
    {
      id: 8,
      title: "Data engineering internship",
      period: "Sep 2025 – Dec 2025",
      details: [
        "Data Engineering Intern at Affordable Charter LLC",
        "Built data pipelines in Python and SQL across marketing, web, and operations data",
        "Built dashboards and automated tracking",
      ],
      date: "2025-09",
      level: 5,
    },
    {
      id: 9,
      title: "AI research & training",
      period: "Sep 2026 – Present",
      details: [
        "AI Research Analyst at Workada (since Nov 2026)",
        "Software engineer on AI training projects with Mercor (since Sep 2026)",
        "Writing and reviewing code used to train and evaluate AI models",
      ],
      date: "2026-09",
      level: 5,
    },
  ],
};

export const achievements = {
  label: "Achievements",
  intro:
    "A selection of milestones and accomplishments that reflect impactful work, strong outcomes, and meaningful results across projects, collaborations, and academic pursuits.",
  book: {
    heading: "Published a Book",
    title: "The Day I Met A Revolution",
    description:
      "A reflective exploration of how artificial intelligence is reshaping the way we think, build, and interact with technology. Through accessible ideas and forward-looking perspectives, the book examines the promises, challenges, and ethical questions surrounding AI, blending technical insight with thoughtful commentary on its impact on society. It serves as an invitation to understand not just the technology itself, but the broader shift it represents in how humans and machines evolve together.",
    // Both the button and the cover open this article in a new tab.
    interview: {
      label: "Interview @Midday",
      href: "https://www.mid-day.com/amp/brand-media/article/the-day-i-met-a-revolution-book-by-abrar-altaf-cto-at-lieper-books-is-release-23319230",
    },
    cover: { src: "/images/about/book-cover.png", alt: "Cover of The Day I Met A Revolution by Abrar Altaf" },
    // Text shown next to the cursor while it is over the book block.
    cursorLabel: "My Book",
  },
};

export const education: {
  label: string;
  intro: string;
  degrees: {
    id: string;
    // Each array is one line of text.
    degree: [string, string];
    school: [string, string];
    period: [string, string];
    description: string;
  }[];
} = {
  label: "My Education",
  intro:
    "A master’s in data science from Pace University, built on an electronics and communication degree from NIT Srinagar.",
  degrees: [
    {
      id: "masters",
      degree: ["Masters of Science in", "Data Science"],
      school: ["Pace University,", "Seidenberg School of CSIS"],
      period: ["Sep 2024 –", "May 2026"],
      description:
        "An in-depth exploration of data-driven problem solving, covering statistical analysis, machine learning, data engineering concepts, and real-world applications. The program emphasizes translating raw data into actionable insights while building scalable, reliable data systems to support informed decision-making.",
    },
    {
      id: "btech",
      degree: ["Bachelor of Technology in", "Electronics & Communication"],
      school: ["National Institute of", "Technology Srinagar"],
      period: ["Aug 2018 –", "July 2022"],
      description:
        "A comprehensive engineering education focused on core principles such as systems design, signal processing, and applied mathematics. This degree strengthened my analytical mindset and problem-solving skills, providing a solid technical foundation that continues to influence how I approach software, data, and system-level challenges.",
    },
  ],
};
