import type { ProjectCaseStudy, ProjectId } from "./types";

export const PROJECT_CASE_STUDIES: Record<
  ProjectId,
  ProjectCaseStudy
> = {
  "sigma-autonomous-car": {
    id:
      "sigma-autonomous-car",

    title:
      "Sigma Autonomous Car",

    type:
      "Embedded / Robotics Project",

    role:
      "Embedded Software Developer Intern",

    period:
      "September 2023 – October 2023",

    summary:
      "A hands-on autonomous RC-car project where I worked through the full build process — from planning the electrical schematic and assembling the hardware to programming the car, testing its behavior, and refining how it responded to different situations.",

    overview: [
      "I worked on the project from the electrical schematic to the physical assembly, wiring, programming, testing, and debugging.",
      "The project helped me understand how electrical design, hardware components, sensors, and software logic work together to create an autonomous system.",
    ],

    technologies: [
      "Embedded Systems",
      "C++",
      "Python",
      "Arduino",
      "Electronics",
      "Sensors",
      "Hardware Assembly",
      "System Testing",
    ],

    contributions: [
      "Planned and followed the electrical schematic needed to connect the car's components correctly.",
      "Assembled the physical car hardware, including the wiring, sensors, and electronic components.",
      "Programmed the car's logic so it could respond to its environment and operate autonomously.",
      "Tested, debugged, and refined the system to improve how the car behaved in different situations.",
    ],

    highlights: [
      {
        title:
          "What I worked on",

        text:
          "Electrical schematic planning, physical assembly, wiring, programming, testing, and debugging.",
      },
      {
        title:
          "Skills used",

        text:
          "Circuit planning, hardware assembly, embedded programming, sensor integration, debugging, and system testing.",
      },
      {
        title:
          "What I learned",

        text:
          "How electrical design, hardware components, and software logic work together in an autonomous system.",
      },
    ],

    images: [
      "/projects/sigma-autonomous-car/cover.jpg",
      "/projects/sigma-autonomous-car/image-1.jpg",
      "/projects/sigma-autonomous-car/image-2.jpg",
      "/projects/sigma-autonomous-car/image-3.jpg",
    ],

    video:
      "/projects/sigma-autonomous-car/demo.mp4",
  },

  podmanager: {
    id:
      "podmanager",

    title:
      "PodManager.ai",

    type:
      "Production Internship · Fullstack Development",

    role:
      "Fullstack Developer Intern",

    period:
      "September 2025 – April 2026",

    summary:
      "I worked as a fullstack intern on PodManager.ai, an AI-powered podcast platform. My work focused on media-editing features, publishing controls, and improving an existing production codebase.",

    overview: [
      "PodManager.ai gave me experience working in a real product environment with an existing codebase, team conventions, code reviews, and production requirements.",
      "Instead of building isolated demo features, I contributed to parts of the platform used for podcast editing and publishing. This helped me understand how frontend, backend, and product decisions connect in a fullstack application.",
    ],

    technologies: [
      "Next.js",
      "TypeScript",
      "FastAPI",
      "Python",
      "AI Workflows",
      "Production Codebase",
      "Code Reviews",
      "Fullstack Development",
    ],

    contributions: [
      "Implemented waveform visualization to make podcast audio easier to navigate and edit.",
      "Worked on the video-track strip to support a clearer visual editing experience.",
      "Added support for sound effects and music so users could enhance podcast episodes during editing.",
      "Built publish-page toggles for optional intro, outro, and watermark settings before export.",
      "Refactored existing components to improve readability, structure, and maintainability.",
      "Worked inside a real production codebase with team conventions, reviews, and active product requirements.",
    ],

    highlights: [
      {
        title:
          "Main focus",

        text:
          "Podcast editing: audio waveform, video track strip, music, sound effects, and publish controls.",
      },
      {
        title:
          "Impact",

        text:
          "Helped make editing and publishing podcast episodes more flexible and easier to navigate.",
      },
    ],

    images: [
      "/projects/podmanager/cover.png",
      "/projects/podmanager/image-1.png",
      "/projects/podmanager/image-2.png",
    ],

    externalUrl:
      "https://www.podmanager.ai/",

    externalLabel:
      "Visit PodManager.ai ↗",
  },

  practicepal: {
    id:
      "practicepal",

    title:
      "PracticePal",

    type:
      "Fullstack Web Application · Degree Project",

    role:
      "Creator & Fullstack Developer",

    period:
      "Degree Project",

    summary:
      "PracticePal is a calm music-practice planning and tracking platform designed to help musicians stay consistent without making the routine feel overwhelming. Users can set weekly targets, plan sessions, log practice quickly, review progress, and keep their goals visible in one place.",

    overview: [
      "The idea behind PracticePal was to make practice planning feel calm, clear, and easy to maintain. Instead of cluttering the experience with too many steps, the app keeps the most useful information visible: today's focus, weekly targets, streaks, completed minutes, and the next activity.",
      "The core flow is simple: set a plan for the week, log each practice session in under a minute, then check the statistics and adjust the routine. This helps musicians build a practice habit they can realistically keep.",
      "PracticePal was built as my degree project and combines account management, progress tracking, goal planning, statistics, and a Pro subscription flow in one fullstack application.",
    ],

    technologies: [
      "Next.js",
      "TypeScript",
      "MongoDB",
      "NextAuth",
      "Stripe",
      "Recharts",
    ],

    contributions: [
      "Built a weekly planning flow for setting practice targets, session lengths, and visible goals.",
      "Created a fast session-logging experience so musicians can record what they worked on without interrupting the practice routine.",
      "Added streak tracking, weekly progress summaries, and statistics to make progress easier to understand.",
      "Built authentication with credentials and social-login options.",
      "Integrated Stripe subscriptions and webhook handling for the Pro plan.",
      "Used MongoDB for account, practice-session, planning, and subscription data.",
    ],

    highlights: [
      {
        title:
          "Weekly clarity",

        text:
          "Goals, planned minutes, completed time, streaks, and the next activity stay visible so every session starts with direction.",
      },
      {
        title:
          "Fast logging",

        text:
          "Users can record what they practiced in under a minute without slowing down the session itself.",
      },
      {
        title:
          "Readable progress",

        text:
          "Charts and summaries show momentum without making the dashboard feel cluttered or overwhelming.",
      },
    ],

    images: [
      "/projects/practicepal/image-1.png",
      "/projects/practicepal/image-2.png",
      "/projects/practicepal/image-3.png",
    ],

    externalUrl: "https://practicepal-beige.vercel.app/",
    externalLabel: "Visit PracticePal ↗",

    githubUrl: "https://github.com/Julieanna97/practicepal",
    githubLabel: "View GitHub repo ↗",
  },

  "worldbite-market": {
    id: "worldbite-market",

    title: "WorldBite Market",

    type: "WordPress / WooCommerce Project",

    role: "WordPress & PHP Developer",

    period: "Portfolio Project",

    summary:
      "WorldBite Market is a custom WordPress and WooCommerce food marketplace built with PHP, MariaDB, phpMyAdmin, and Docker. I created a responsive theme, product catalogue, cart and checkout flow, and custom recipe collections.",

    overview: [
      "I built WorldBite Market as a WordPress-based marketplace for food products and recipe collections from different cuisines.",
      "The project helped me practice WordPress theme development, WooCommerce customization, PHP logic, database management with phpMyAdmin, and Docker-based local development.",
    ],

    technologies: [
      "WordPress",
      "PHP",
      "WooCommerce",
      "MariaDB",
      "phpMyAdmin",
      "Docker",
      "HTML",
      "CSS",
      "JavaScript",
    ],

    contributions: [
      "Built a custom responsive WordPress theme for the marketplace layout.",
      "Set up WooCommerce product browsing, cart, checkout, and account pages.",
      "Used MariaDB and phpMyAdmin to manage the WordPress database.",
      "Connected WordPress, MariaDB, and phpMyAdmin through Docker for local development.",
      "Created custom recipe collection features using PHP.",
    ],

    highlights: [
      {
        title: "Custom WordPress theme",
        text: "Designed and built a responsive theme for a global food marketplace.",
      },
      {
        title: "WooCommerce flow",
        text: "Added product browsing, cart, checkout, and marketplace-style shop pages.",
      },
      {
        title: "Docker setup",
        text: "Ran WordPress, MariaDB, and phpMyAdmin together in a local Docker environment.",
      },
    ],

    images: [
      "/projects/worldbite-market/cover.png",
      "/projects/worldbite-market/image-1.png",
      "/projects/worldbite-market/image-2.png",
    ],

    externalUrl: "https://worldbitemarket.freedev.app/",
    externalLabel: "Visit WorldBite Market ↗",

    githubUrl: "https://github.com/Julieanna97/worldbite-market",
    githubLabel: "View GitHub repo ↗",
  },
};

export const ABOUT_EXPERIENCE = [
  {
    role:
      "Fullstack Developer",

    company:
      "PodManager.ai",

    period:
      "Sep 2025 — Apr 2026",

    summary:
      "Worked on an AI-powered platform for podcast and audio editing.",

    points: [
      "Built audio and video editing features in the browser using React and TypeScript.",
      "Worked on waveform and video-timeline UI so editing felt smoother.",
      "Helped with APIs for projects, clips, and editing effects.",
    ],
  },
  {
    role:
      "Quality Assurance Analyst",

    company:
      "OneForma.com",

    period:
      "May 2026 — Ongoing",

    summary:
      "Freelance QA work for AI and data-related projects.",

    points: [
      "Reviewed multilingual data and checked that it followed project guidelines.",
      "Focused on making the final results accurate, clear, and natural.",
    ],
  },
  {
    role:
      "AI Data Specialist",

    company:
      "Appen.com",

    period:
      "Jan 2026 — Ongoing",

    summary:
      "Worked on AI training and evaluation tasks.",

    points: [
      "Worked with text, audio, and multilingual data.",
      "Reviewed transcriptions, labels, and content quality for AI projects.",
    ],
  },
  {
    role:
      "AI Trainer (Coder)",

    company:
      "Outlier",

    period:
      "Sep 2024 — Jun 2025",

    summary:
      "Worked on coding-related AI training tasks.",

    points: [
      "Reviewed and improved coding responses for AI models.",
      "Checked code quality, explanations, and problem-solving steps.",
    ],
  },
  {
    role:
      "Embedded Software Developer Intern",

    company:
      "Nodehill AB",

    period:
      "Jan 2024 — Apr 2024",

    summary:
      "Worked with embedded systems and wireless communication.",

    points: [
      "Built LoRa communication between two ESP32 microcontrollers.",
      "Worked on a long-range wireless-communication setup.",
    ],
  },
  {
    role:
      "Embedded Software Developer Intern",

    company:
      "Sigma Industry Evolution",

    period:
      "Sep 2023 — Oct 2023",

    summary:
      "Worked on an embedded project in an engineering environment.",

    points: [
      "Built a self-driving RC car using Arduino and sensors.",
      "Worked with C/C++ and Python for the car's control logic.",
    ],
  },
];

export const ABOUT_SKILL_GROUPS = [
  {
    title:
      "Languages",

    items: [
      "JavaScript",
      "TypeScript",
      "Python",
      "PHP",
      "C/C++",
      "HTML",
      "CSS",
    ],
  },
  {
    title:
      "Frontend",

    items: [
      "React",
      "Next.js",
      "Tailwind CSS",
      "Bootstrap",
    ],
  },
  {
    title:
      "Backend",

    items: [
      "Node.js",
      "Express",
      "FastAPI",
      "Flask",
      "PHP",
      "REST APIs",
      "ffmpeg",
      "Mailchimp",
    ],
  },
  {
    title:
      "Databases",

    items: [
      "SQL",
      "MongoDB",
      "MariaDB",
      "phpMyAdmin",
      "NoSQL",
    ],
  },
  {
    title:
      "Tools & Platforms",

    items: [
      "Git",
      "Jira",
      "VS Code",
      "Docker",
      "Azure",
      "WordPress",
      "Linux / Ubuntu",
    ],
  },
  {
    title:
      "Design",

    items: [
      "Figma",
      "Canva",
      "Web / Graphic Design",
    ],
  },
  {
    title:
      "Embedded & Other",

    items: [
      "RTOS / Zephyr",
      "Yocto",
      "UART / SPI / I2C / CAN",
      "GTest",
      "CMake",
    ],
  },
  {
    title:
      "Soft Skills",

    items: [
      "Problem Solving",
      "Team Communication",
    ],
  },
];

export const CREDIT_GROUPS = [
  {
    title:
      "Frontend",

    items: [
      "React",
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
    ],
  },
  {
    title:
      "3D stack",

    items: [
      "Three.js",
      "React Three Fiber",
      "Drei",
      "GLB models",
    ],
  },
  {
    title:
      "Motion",

    items: [
      "GSAP",
      "Camera zooms",
      "Scene transitions",
      "Lottie animation",
    ],
  },
  {
    title:
      "Visual direction",

    items: [
      "Cozy Tokyo-night atmosphere",
      "Soft color stories",
      "Playful interactions",
      "Small environmental details",
    ],
  },
  {
    title:
      "Behind the scenes",

    items: [
      "UI iteration",
      "Accessibility pass",
      "Responsive layouts",
      "Performance polish",
    ],
  },
];

