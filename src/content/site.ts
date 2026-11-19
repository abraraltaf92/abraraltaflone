// All site copy lives in this folder. Edit text here; layout and motion live in src/components.

export const site = {
  name: "Abrar Altaf Lone",
  shortName: "Abrar A Lone",
  title: "Abrar Altaf Lone | SDE and Data Scientist",
  description:
    "A personal portfolio showcasing work in software and data engineering, focused on building scalable systems, thoughtful architecture, and reliable, real-world solutions.",
  url: "https://abraraltaflone.com",
  email: "abraraltaf92@gmail.com",
  phone: "+1 (332) 285-5373",
  phoneHref: "tel:+13322855373",
  resume: { file: "/files/AbrarResume.pdf", downloadName: "AbrarResume.pdf" },
  socials: [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/abraraltaf92" },
    { label: "Instagram", href: "https://www.instagram.com/abraraltaf92" },
    { label: "GitHub", href: "https://github.com/abraraltaf92" },
  ],
  footer: {
    heading: "Building thoughtful systems, one idea at a time.",
    cta: "Let's talk",
    note: "© 2026 Abrar Altaf Lone · Available for work",
  },
};

export const nav = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Projects", href: "/#projects" },
  { label: "Experience", href: "/#experience" },
];

export const footerNav = [
  { label: "Home", href: "/" },
  { label: "Work", href: "/#experience" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "mailto:abraraltaf92@gmail.com", external: true },
];

export const hero = {
  eyebrow: "Software Engineer . Data Scientist",
  // Each part is one run of text; `tone` picks the colour, `bold` the heavier weight.
  heading: [
    { text: "Hello, my name is ", tone: "ink" },
    { text: "Abrar Altaf Lone.", tone: "ink", bold: true },
    { text: " I build clean systems for complex data and software challenges.", tone: "muted" },
  ],
  primaryCta: { label: "Get In Touch", href: "mailto:abraraltaf92@gmail.com" },
};

/** The "page not found" screen, shown for any address that does not exist. */
export const notFound = {
  title: "Page not found",
  // "\n" marks where the heading breaks onto a new line on tablet and desktop.
  heading: [
    { text: "Oops!! Looks Like\nThis Page ", tone: "ink" },
    { text: "Doesn't Exist\nOr Has Been Moved.", tone: "muted" },
  ],
  cta: { label: "Go Back Home", href: "/" },
};

export type SkillIcon = "code" | "gear" | "bars" | "cloud" | "server";

export const skills: { icon: SkillIcon; title: string[]; lines: string[] }[] = [
  {
    icon: "code",
    title: ["Programming Languages", "& Frameworks"],
    lines: ["Python, C++,", "JavaScript (TypeScript, Next.js),", "Flutter (Dart), PHP (Laravel)"],
  },
  {
    icon: "gear",
    title: ["Machine Learning", "Algorithms"],
    lines: ["Regression, Decision Trees, SVM, CNN, NLP, Reinforcement Learning, Deep Learning"],
  },
  {
    icon: "bars",
    title: ["Data Analytics", "Tools"],
    lines: ["SQL, Pandas, NumPy, PySpark, Tensorflow,", "PyTorch, Keras,", "Scikit-Learn."],
  },
  {
    icon: "cloud",
    title: ["Visualization &", "Cloud"],
    lines: ["Matplotlib, Seaborn,", "Plotly,", "Amazon Web Services,", "Git"],
  },
  {
    icon: "server",
    title: ["Backend/", "MLOps"],
    lines: ["NodeJS, REST APIs,", "Flask,", "Automation Workflows,", "Model Integration"],
  },
];

export const projects: {
  title: string;
  description: string;
  /** The picture on the tile. */
  image: string;
  /** Where the tile links to. Leave out for a project with no public page. */
  href?: string;
  /** For a tile without a link: the larger picture that opens when it is clicked. */
  preview?: string;
}[] = [
  {
    title: "Kharchi Parchi — GST Billing Platform",
    description:
      "A GST billing platform for small shops in India. A mobile app and a web app run on one shared billing engine, print receipts on Bluetooth thermal printers, and give each business its own workspace and branding.",
    image: "/images/projects/kharchi-parchi.png",
    href: "https://kharchiparchi.com",
  },
  {
    title: "Robust Deepfake Detection",
    description:
      "An ensemble of five detectors that look for spatial, global-consistency and motion artefacts in video. Trained on FaceForensics++ and tested zero-shot on Celeb-DF v2 to measure how well it generalises, then served through a FastAPI backend.",
    image: "/images/projects/deepfake-detection.png",
    href: "https://github.com/abraraltaf92/deepfake-detection",
  },
  {
    title: "Mechanify — Keyboard Sounds for Mac",
    description:
      "A macOS menu-bar app that plays a mechanical-keyboard click for every key press, in any app. Sounds are cut from real switch recordings, placed in stereo by key position and played with minimal delay. Nothing typed is read or stored.",
    image: "/images/projects/mechanify.png",
    href: "https://github.com/abraraltaf92/mechanify",
  },
  {
    title: "NYC School Bus Delay Prediction",
    description:
      "A data-driven machine learning system that predicts school bus delays in New York City using over a million incident records. The project includes data cleaning, feature engineering, exploratory analysis, and both regression and classification models to estimate delay duration and categorize severity.",
    image: "/images/projects/nyc-school-bus.png",
    href: "https://github.com/abraraltaf92/nyc-school-bus-delay-prediction",
  },
  {
    title: "Analyzing Airbnb Pricing Dynamics in NYC",
    description:
      "A data mining project analyzing pricing trends of Airbnb listings in New York City. The analysis uses exploratory data analysis and clustering to find natural segments, then regression models are applied to identify major price drivers and predict listing prices.",
    image: "/images/projects/airbnb-pricing.png",
    href: "https://github.com/abraraltaf92/analyzing-airbnb-pricing-dynamics-in-newyork-city",
  },
  {
    title: "Multimodal Sentiment Analysis (MVSA)",
    description:
      "A combined text-and-image sentiment analysis system that fuses BERT-based text embeddings with image convolutional features to predict sentiment more accurately than single-modality models. The project explores data preprocessing, model training, and performance comparison across different modalities.",
    image: "/images/projects/mvsa.png",
    href: "https://github.com/abraraltaf92/multimodal-sentiment-analysis-mvsa",
  },
  {
    title: "Whatsdule — Automation & Scheduling Tool",
    description:
      "Whatsdule is a backend-focused automation project designed to handle scheduling and workflow logic programmatically. The project focuses on building reliable APIs, task execution flows, and time-based automation rather than UI-heavy features.",
    image: "/images/projects/whatsdule.png",
    href: "https://github.com/abraraltaf92/whatsdule",
  },
  {
    title: "Cubical",
    description:
      "Flutter mobile app where users sign in with Google, follow each other, and share photo posts with captions, likes, comments, and push notifications. The client handles onboarding, timeline, upload flow, and profiles; Firebase services store data and trigger follower updates automatically.",
    image: "/images/projects/cubical.png",
    href: "https://github.com/abraraltaf92/cubical",
  },
  {
    title: "Maya — AI Librarian",
    description:
      "Maya is an AI-based assistant designed to help users discover books, authors, and reading ideas inside the Biblo platform. The project focuses on making book discovery easier through structured recommendations and natural language-based interactions.",
    image: "/images/projects/maya.png",
    preview: "/images/projects/maya-preview.png",
  },
];

export const experience: {
  company: string;
  role: string;
  period: string;
  learnMore?: string;
  /** Shown under the row when it is opened. Leave out to make the row non-expanding. */
  description?: string;
}[] = [
  {
    company: "Workada",
    role: "AI Research Analyst",
    period: "(Nov 2026 – Present)",
    description:
      "Design and run evaluations of AI coding models: build realistic software tasks, grade the models' output against ground truth, and write up where and why they fail.",
  },
  {
    company: "Mercor",
    role: "SDE, AI Training",
    period: "(Sep 2026 – Present)",
    description:
      "Contract software engineer on AI training projects: write coding tasks, reference solutions and tests used to train and evaluate AI models, and review other engineers' submissions for correctness.",
  },
  {
    company: "Affordable Charter LLC",
    role: "Data Engineering Intern",
    period: "(Sep 2025 – Dec 2025)",
    description:
      "Built end-to-end data pipelines in Python and SQL across marketing, web and operations data, and the dashboards on top of them. Reporting effort fell 60% and organic traffic grew 40–55%.",
  },
  {
    company: "Biblo",
    role: "Founder",
    period: "(Oct 2024 – Present)",
    learnMore: "/biblo",
    description:
      "A social platform that connects readers with independent bookstores. It drew 50+ waitlist sign-ups at an in-person startup showcase at Pace University; the app is now being built on 25+ user interviews.",
  },
  {
    company: "Samsung R&D India",
    role: "SDE",
    period: "(Jan 2022-Dec 2023)",
    description:
      "Built network software at Samsung: the 4G Layer-3 and RRC call stack, eNodeB development and early 6G work. Later moved to computer vision, camera systems and gesture recognition for Samsung AI features.",
  },
  {
    company: "Aibyte Hub Pvt. Ltd.",
    role: "Founder",
    period: "(2021 – Present)",
    learnMore: "/aibytehub",
    description:
      "A digital solutions studio for custom websites, apps and IT systems. Built and launched sites for pharmacies and healthcare businesses, more than doubling their organic traffic, and built Kharchi Parchi, a GST billing platform.",
  },
];

export const aboutTeaser = {
  heading: [
    {
      text: "I enjoy turning ideas into well-crafted, intuitive systems. I care about clarity, thoughtful design, and ",
      tone: "ink",
    },
    {
      text: "building software that feels simple on the surface while handling real complexity underneath. Driven by curiosity and continuous learning, I focus on creating reliable, human-centered solutions that solve real problems.",
      tone: "muted",
    },
  ],
  cta: { label: "About Me", href: "/about" },
};

export const testimonials: { quote: string; name: string; role: string }[] = [
  {
    quote:
      "I worked with Abrar for nearly two years, beginning when he joined the team as a fresher. During this time, I saw steady growth in his understanding of the 4G Layer-3 and RRC call stack, along with eNodeB development. He is curious, asks thoughtful questions, collaborates well, accepts feedback positively, and consistently demonstrates ownership, reliability, and a strong learning mindset.",
    name: "Mohd Parvez Ahmad",
    role: "Staff Engineer, Samsung R&D",
  },
  {
    quote: "Very knowledgeable, with a strong grasp of core concepts and practical implementation.",
    name: "Ray Tara",
    role: "Founder, Celebration Caterer",
  },
  {
    quote:
      "I worked with Abrar across multiple projects, where his broad knowledge and technical expertise consistently added value. He encourages growth by introducing fresh perspectives and tackling complex challenges with clarity and calmness. Abrar is disciplined, dependable, and thoughtful in his approach, balancing strong delivery with consideration for ethics, collaboration, and overall well-being in professional environments.",
    name: "Aatik Ahmad",
    role: "UI/UX Designer, BibloApp",
  },
  {
    quote:
      "Abrar is a highly talented individual and a naturally curious learner who consistently seeks to deepen his understanding of complex concepts. Once he is motivated and engaged, he demonstrates a strong ability to take on challenges and successfully achieve even demanding goals. I had the opportunity to work with him on a Network Call–related project, where his dedication, technical insight, and willingness to learn were clearly evident throughout our collaboration.",
    name: "Yogesh Kandpal",
    role: "Director, Samsung Research Bangalore - India",
  },
  {
    quote:
      "Working with Abrar on rebuilding my website was a very positive experience. He was professional, reliable, and clear throughout the process, while also ensuring the project remained affordable. His communication and delivery met expectations, and the final outcome aligned well with my requirements. I would confidently recommend Abrar to clients seeking dependable and cost-effective web development services.",
    name: "Sam",
    role: "Director, Computech experts llc",
  },
  {
    quote:
      "Abrar is a promising young engineer whom I worked with shortly after he graduated from college. He was energetic, enthusiastic, and eager to explore unfamiliar areas. His curiosity and willingness to learn stood out early on, and he consistently showed initiative, adaptability, and a strong drive to grow his skills while contributing positively to the team.",
    name: "Debraj Chatterjee",
    role: "Architect, Samsung R&D",
  },
];
