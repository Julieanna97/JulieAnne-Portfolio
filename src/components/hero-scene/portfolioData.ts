import type {
  ProjectCaseStudy,
  ProjectId,
} from "./types";

export const PROJECT_CASE_STUDIES: Record<
  ProjectId,
  ProjectCaseStudy
> = {
  "sigma-autonomous-car": {
    id: "sigma-autonomous-car",

    title: "Sigma Autonomous Car",

    type: "Embedded / Robotics Project",

    role: "Embedded Software Developer Intern",

    period: "September 2023 – October 2023",

    summary:
      "An autonomous RC car I helped take from an electrical schematic to a working prototype. I assembled the hardware, wired the components, programmed the control logic, and tested how the car responded to its surroundings.",

    overview: [
      "This was a hands-on project where the hardware and software had to work closely together. A wiring problem, an unusual sensor reading, or a small change in the code could completely change how the car behaved.",
      "I was involved throughout the build, from planning and assembly to programming and testing. It gave me a much better understanding of how the different parts of an embedded system affect one another.",
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
      "Read and followed the electrical schematic for the car's components.",
      "Assembled the chassis, electronics, wiring, and sensors.",
      "Programmed the control logic so the car could react to its environment.",
      "Tested and adjusted both the hardware and code when the car behaved unexpectedly.",
    ],

    highlights: [
      {
        title: "From plan to prototype",
        text:
          "I followed the project through the full build process instead of working on only one isolated part.",
      },
      {
        title: "Hardware meets software",
        text:
          "The car depended on reliable wiring, useful sensor data, and control logic that could respond in real time.",
      },
      {
        title: "Hands-on debugging",
        text:
          "Testing often meant checking the physical connections and the code together to find the real cause of a problem.",
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
    id: "podmanager",

    title: "PodManager.ai",

    type:
      "Production Internship · Fullstack Development",

    role: "Fullstack Developer Intern",

    period: "September 2025 – April 2026",

    summary:
      "During my internship at PodManager.ai, I worked on the editing and publishing side of an AI-powered podcast platform. My tasks included waveform and timeline features, audio tools, publishing settings, and improvements to an existing production codebase.",

    overview: [
      "Joining an existing product was different from starting a school project from scratch. I had to understand the team's conventions, work within the current architecture, and make changes that fitted naturally into the platform.",
      "My work covered both frontend and backend concerns. It helped me understand how editing tools, API behaviour, and product decisions connect in a real fullstack application.",
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
      "Added waveform visualisation to make podcast audio easier to navigate.",
      "Worked on the video-track strip used in the browser-based editor.",
      "Added support for music and sound effects during editing.",
      "Created publishing controls for optional intros, outros, and watermarks.",
      "Refactored existing components when the surrounding code needed to be clearer or easier to maintain.",
      "Worked with team conventions, code reviews, and changing product requirements.",
    ],

    highlights: [
      {
        title: "Editing tools",
        text:
          "My main focus was the browser editor, including its waveform, video track, music, and sound-effect features.",
      },
      {
        title: "Publishing controls",
        text:
          "I added settings that let users decide which optional elements should be included before publishing.",
      },
      {
        title: "Production experience",
        text:
          "The internship taught me how to contribute carefully to a product that already has users, conventions, and an active development team.",
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
    id: "practicepal",

    title: "PracticePal",

    type:
      "Fullstack Web Application · Degree Project",

    role:
      "Creator & Fullstack Developer",

    period: "Degree Project",

    summary:
      "PracticePal is my degree project: a planning and progress app for musicians who want a little more structure without turning practice into another stressful task. It brings weekly goals, quick session logging, streaks, and progress statistics into one calm dashboard.",

    overview: [
      "I wanted the app to answer a few simple questions: What should I practise today? How much have I done this week? Am I keeping up with the goal I set for myself?",
      "The main flow stays intentionally simple. A musician creates a weekly plan, logs each session quickly, and checks their progress when they need it. The app also includes account management and a Pro subscription flow.",
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
      "Designed the weekly planning flow for targets, session lengths, and personal goals.",
      "Created a quick session form that does not interrupt the practice routine.",
      "Added streaks, weekly summaries, and charts for reviewing progress.",
      "Implemented credentials and social-login authentication.",
      "Connected Stripe subscriptions and webhook handling for the Pro plan.",
      "Structured the MongoDB data for accounts, sessions, plans, and subscriptions.",
    ],

    highlights: [
      {
        title: "A clear weekly plan",
        text:
          "The dashboard keeps the current goal, planned minutes, completed time, streak, and next activity easy to find.",
      },
      {
        title: "Quick session logging",
        text:
          "A musician can record what they practised in less than a minute and get back to playing.",
      },
      {
        title: "Progress without clutter",
        text:
          "The charts show useful patterns while keeping the overall experience calm and easy to read.",
      },
    ],

    images: [
      "/projects/practicepal/cover.png",
      "/projects/practicepal/image-1.png",
      "/projects/practicepal/image-2.png",
    ],

    externalUrl:
      "https://practicepal-beige.vercel.app/",

    externalLabel:
      "Visit PracticePal ↗",

    githubUrl:
      "https://github.com/Julieanna97/practicepal",

    githubLabel:
      "View GitHub repo ↗",
  },

  "naile-ecommerce": {
    id: "naile-ecommerce",

    title: "Nailé E-commerce Store",

    type:
      "Individual School Project · Search API & Fullstack E-commerce",

    role: "Fullstack Developer",

    period:
      "School Project · Portfolio Upgrade",

    summary:
      "Nailé started as a school assignment about connecting an e-commerce app to Google Custom Search. I later developed it into a fuller online store with its own catalogue search, Stripe checkout, delivery rules, order views, and a responsive admin dashboard.",

    overview: [
      "The original assignment used search results from a selected external shop and matched them to products saved in my own database. This let visitors move from a Google result to an internal Nailé product page instead of leaving the application.",
      "The assignment also involved moving the MySQL database online and deploying the React frontend and Express API as separate services.",
      "After the course, I continued working on the idea. I redesigned the storefront, replaced the dependency on external search with the shop's own product API, and added checkout, shipping, order management, and admin views.",
    ],

    technologies: [
      "React",
      "TypeScript",
      "Vite",
      "React Router",
      "Axios",
      "Google Custom Search JSON API",
      "Google Programmable Search Engine",
      "Node.js",
      "Express",
      "MySQL",
      "Aiven",
      "Stripe",
      "REST API",
      "Vercel",
    ],

    contributions: [
      "Connected Google Custom Search to the original e-commerce client.",
      "Configured a Programmable Search Engine for a selected external shop.",
      "Matched external results to products stored in the Nailé database.",
      "Moved the MySQL database to Aiven and connected it to the deployed API.",
      "Deployed the React frontend and Express backend separately on Vercel.",
      "Replaced the external search dependency with catalogue search from the application's own API.",
      "Added Stripe-hosted checkout and an order-confirmation flow.",
      "Applied a 49 SEK shipping fee below 499 SEK, with free shipping from 499 SEK.",
      "Added worldwide country selection and customer delivery details.",
      "Created a responsive read-only dashboard for orders, customers, products, inventory, collections, reviews, and analytics.",
    ],

    highlights: [
      {
        title: "Where it started",
        text:
          "The first version explored how Google search results could be connected to products inside a separate e-commerce database.",
      },
      {
        title: "A real deployed stack",
        text:
          "The frontend, Express API, and cloud-hosted MySQL database run as separate connected services.",
      },
      {
        title: "Growing beyond the assignment",
        text:
          "I kept developing the store after the course, adding a complete shopping flow and an administration dashboard.",
      },
    ],

    images: [
      "/projects/naile-ecommerce/cover.png",
      "/projects/naile-ecommerce/image-1.png",
      "/projects/naile-ecommerce/image-2.png",
      "/projects/naile-ecommerce/image-3.png",
    ],

    externalUrl:
      "https://naileshop.vercel.app/",

    externalLabel:
      "Visit Nailé store ↗",

    githubUrl:
      "https://github.com/Julieanna97/client",

    githubLabel:
      "View frontend repo ↗",
  },

  "worldbite-market": {
    id: "worldbite-market",

    title: "WorldBite Market",

    type:
      "WordPress / WooCommerce Project",

    role:
      "WordPress & PHP Developer",

    period: "Portfolio Project",

    summary:
      "WorldBite Market is a WordPress and WooCommerce food shop inspired by ingredients and recipes from different cuisines. I made the theme, configured the shopping flow, and added custom recipe collections with PHP.",

    overview: [
      "I used this project to get more comfortable working inside WordPress rather than treating it as a ready-made page builder.",
      "The local setup runs through Docker with WordPress, MariaDB, and phpMyAdmin. That gave me room to work on the theme, WooCommerce pages, PHP logic, and database content in one environment.",
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
      "Created a responsive WordPress theme for the marketplace.",
      "Configured the WooCommerce catalogue, cart, checkout, and account pages.",
      "Managed the WordPress data with MariaDB and phpMyAdmin.",
      "Set up the local WordPress environment with Docker.",
      "Added custom recipe collection features with PHP.",
    ],

    highlights: [
      {
        title: "Custom theme",
        text:
          "The visual design and responsive layouts were created specifically for the marketplace.",
      },
      {
        title: "WooCommerce shopping flow",
        text:
          "Visitors can browse products, manage a cart, and continue through the standard checkout experience.",
      },
      {
        title: "Docker-based setup",
        text:
          "WordPress, MariaDB, and phpMyAdmin run together in a repeatable local development environment.",
      },
    ],

    images: [
      "/projects/worldbite-market/cover.png",
      "/projects/worldbite-market/image-1.png",
      "/projects/worldbite-market/image-2.png",
    ],

    externalUrl:
      "https://worldbitemarket.freedev.app/",

    externalLabel:
      "Visit WorldBite Market ↗",

    githubUrl:
      "https://github.com/Julieanna97/worldbite-market",

    githubLabel:
      "View GitHub repo ↗",
  },

  asteroidwatch: {
    id: "asteroidwatch",

    title: "AsteroidWatch",

    type:
      "NASA API Dashboard · Vanilla JavaScript Project",

    role:
      "Frontend Developer & API Integration",

    period: "Portfolio Project",

    summary:
      "AsteroidWatch is a space-themed dashboard for exploring NASA Near Earth Object data. Visitors can search by date range or asteroid ID and compare details such as size, speed, miss distance, and hazard status.",

    overview: [
      "This began as a smaller school API exercise. I revisited it later and gave it a clearer dashboard structure, reusable JavaScript functions, and a visual style inspired by mission-control interfaces.",
      "The latest search is saved locally, so visitors can return without immediately losing their results. Individual asteroid views also show orbital details and close-approach history.",
    ],

    technologies: [
      "HTML",
      "CSS",
      "JavaScript",
      "NASA NeoWs API",
      "REST API",
      "localStorage",
      "Responsive Design",
    ],

    contributions: [
      "Created the responsive dashboard and search interface.",
      "Added date-range searches and individual asteroid lookup.",
      "Displayed size, velocity, miss distance, approach date, and hazard information.",
      "Created detailed asteroid pages with orbital and approach data.",
      "Saved the latest search with localStorage.",
      "Redesigned the original school project with a focused space-themed interface.",
    ],

    highlights: [
      {
        title: "Two ways to explore",
        text:
          "Visitors can scan a range of dates or look up a specific asteroid when they already know its ID.",
      },
      {
        title: "Useful comparisons",
        text:
          "The dashboard brings the fastest, closest, and potentially hazardous objects into a readable summary.",
      },
      {
        title: "Mission-log style",
        text:
          "The visual direction makes the scientific data feel approachable without hiding the important details.",
      },
    ],

    images: [
      "/projects/asteroidwatch/cover.png",
      "/projects/asteroidwatch/image-1.png",
      "/projects/asteroidwatch/image-2.png",
    ],

    externalUrl:
      "https://asteroidwatch.vercel.app/",

    externalLabel:
      "Visit AsteroidWatch ↗",

    githubUrl:
      "https://github.com/Julieanna97/NASA-Near-Earth-Objects-API-Project",

    githubLabel:
      "View GitHub repo ↗",
  },

  "ecommerce-rest-api": {
    id: "ecommerce-rest-api",

    title: "E-commerce REST API",

    type:
      "Backend API · TypeScript / MySQL Project",

    role: "Backend Developer",

    period: "Portfolio Project",

    summary:
      "A TypeScript and Express API for the backend of an e-commerce application. It handles products, customers, orders, authentication, and Stripe checkout sessions, with its data stored in MySQL.",

    overview: [
      "I returned to this school backend project and cleaned it up so it could run as a proper online service instead of only on my local machine.",
      "The database was moved from local XAMPP and phpMyAdmin to Aiven MySQL, while the Express API was prepared for Vercel. The result is a live API that can be opened and tested directly.",
    ],

    technologies: [
      "TypeScript",
      "Node.js",
      "Express",
      "MySQL",
      "Aiven",
      "Vercel",
      "JWT",
      "Stripe",
    ],

    contributions: [
      "Created REST routes for products, customers, orders, and order items.",
      "Connected the API to MySQL through environment-based configuration.",
      "Added register, login, refresh-token, and token-clearing routes.",
      "Added Stripe checkout-session routes for hosted and embedded payment flows.",
      "Moved the database from a local setup to Aiven MySQL.",
      "Resolved TypeScript and deployment issues before hosting the API on Vercel.",
    ],

    highlights: [
      {
        title: "A live API",
        text:
          "Routes such as /products, /customers, and /orders can be tested without running the project locally.",
      },
      {
        title: "MySQL-backed data",
        text:
          "Products, customers, orders, and order items are stored and retrieved through the database.",
      },
      {
        title: "From local to online",
        text:
          "Moving the project to Aiven and Vercel turned a local school exercise into a shareable backend project.",
      },
    ],

    images: [
      "/projects/ecommerce-rest-api/cover.png",
      "/projects/ecommerce-rest-api/image-1.png",
      "/projects/ecommerce-rest-api/image-2.png",
    ],

    externalUrl:
      "https://julie-ecommerce-api.vercel.app/",

    externalLabel:
      "Open live API ↗",

    githubUrl:
      "https://github.com/Julieanna97/ecommerce-api-new",

    githubLabel:
      "View GitHub repo ↗",
  },

  bookshop: {
    id: "bookshop",

    title: "Boklusen Bookshop",

    type:
      "Group Project · Frontend/API Integration",

    role:
      "Frontend & API Integration Developer",

    period: "School Group Project",

    summary:
      "Boklusen is a group-built online bookshop. My main responsibility was connecting the frontend to the products API and making sure the book catalogue loaded and displayed correctly.",

    overview: [
      "The shop lets visitors browse books, open product details, add titles to a cart, and continue through a demo checkout.",
      "For the portfolio version, I connected the project to a deployed backend and MongoDB Atlas, added more book data, translated the interface into English, and finished the demo shopping flow.",
    ],

    technologies: [
      "HTML",
      "CSS",
      "JavaScript",
      "Node.js",
      "Express",
      "MongoDB",
      "Mongoose",
      "Vercel",
    ],

    contributions: [
      "Connected the book catalogue to the backend products API.",
      "Rendered book information such as title, author, category, price, and cover image.",
      "Worked on the flow between browsing, product details, and the cart.",
      "Connected the portfolio version to a deployed Express and MongoDB backend.",
      "Added a demo checkout flow.",
      "Translated the visible interface text into English.",
    ],

    highlights: [
      {
        title: "API-powered catalogue",
        text:
          "The frontend loads the available books from the backend instead of relying on hardcoded product cards.",
      },
      {
        title: "Shopping flow",
        text:
          "Visitors can move from the catalogue to a book page, add items to the cart, and try the demo checkout.",
      },
      {
        title: "My role in the group",
        text:
          "I focused mainly on the connection between the frontend and the API, including how the book data appeared on the page.",
      },
    ],

    images: [
      "/projects/bookshop/cover.png",
      "/projects/bookshop/image-1.png",
      "/projects/bookshop/image-2.png",
    ],

    externalUrl:
      "https://bookshop-frontend-dun.vercel.app/",

    externalLabel:
      "Visit live site ↗",

    githubUrl:
      "https://github.com/Julieanna97/bookshop-frontend",

    githubLabel:
      "View GitHub repo ↗",
  },

  "restaurant-booking": {
    id: "restaurant-booking",

    title:
      "Seoulful Flavor Restaurant Booking",

    type:
      "Group Project · Booking System",

    role:
      "Frontend, Contact Page & Booking API Logic",

    period: "School Group Project",

    summary:
      "Seoulful Flavor is a group-built Korean BBQ website with an online reservation flow. I created the contact page and focused on the booking logic that checks existing reservations, calculates the remaining availability, and saves new bookings through the API.",

    overview: [
      "The availability shown to a visitor is based on the bookings already stored for the selected date and time. It is calculated from the API data rather than shown as a fixed number.",
      "When someone confirms a reservation, the new booking is sent back to the API. Future visitors then see availability based on the updated booking data.",
      "I also prepared the project for my portfolio by resolving TypeScript and Vercel issues, updating its branding, and making the demo admin area easier to test.",
    ],

    technologies: [
      "React",
      "TypeScript",
      "Vite",
      "REST API",
      "React Router",
      "CSS",
      "Vercel",
    ],

    contributions: [
      "Created the restaurant's contact page.",
      "Connected the reservation flow to the restaurant API.",
      "Fetched existing bookings for the selected date and time.",
      "Calculated the remaining availability from the current booking data.",
      "Sent confirmed reservations back to the API.",
      "Worked on the date, guest-count, time-slot, and customer-detail steps.",
      "Resolved TypeScript build and Vercel routing issues.",
      "Updated the demo admin login for portfolio visitors.",
    ],

    highlights: [
      {
        title: "Live availability",
        text:
          "The remaining spots come from the current reservation data instead of a hardcoded number.",
      },
      {
        title: "Complete reservation flow",
        text:
          "Visitors can choose a date, guest count, and time before entering their details and confirming the booking.",
      },
      {
        title: "Contact and admin views",
        text:
          "I created the contact page and helped prepare the booking-management view for the portfolio demo.",
      },
      {
        title: "Admin demo",
        text:
          "Bookings can be reviewed in the demo admin area. Demo password: demo-admin.",
      },
    ],

    images: [
      "/projects/restaurant/cover.png",
      "/projects/restaurant/image-1.png",
      "/projects/restaurant/image-2.png",
    ],

    externalUrl:
      "https://seoulful-flavor-booking.vercel.app/",

    externalLabel:
      "Visit live site ↗",

    githubUrl:
      "https://github.com/Julieanna97/seoulful-flavor-booking",

    githubLabel:
      "View GitHub repo ↗",
  },
};

export const ABOUT_EXPERIENCE = [
  {
    role: "Fullstack Developer",

    company: "PodManager.ai",

    period: "Sep 2025 — Apr 2026",

    summary:
      "Joined the product team as a fullstack intern, mainly working on browser-based podcast editing and publishing tools.",

    points: [
      "Added waveform and video-timeline features with React and TypeScript.",
      "Worked across the editor interface and its supporting APIs.",
      "Improved existing components while following the team's review process.",
    ],
  },
  {
    role: "Quality Assurance Analyst",

    company: "OneForma.com",

    period: "May 2026 — Ongoing",

    summary:
      "Freelance quality-assurance work on multilingual AI and data projects.",

    points: [
      "Review data against detailed project guidelines.",
      "Check that the final content is accurate, clear, and natural.",
    ],
  },
  {
    role: "AI Data Specialist",

    company: "Appen.com",

    period: "Jan 2026 — Ongoing",

    summary:
      "AI data work involving text, audio, transcription, and multilingual content.",

    points: [
      "Review labels, transcriptions, and other training data.",
      "Check content quality and consistency before submission.",
    ],
  },
  {
    role: "AI Trainer (Coder)",

    company: "Outlier",

    period: "Sep 2024 — Jun 2025",

    summary:
      "Reviewed coding tasks used to train and evaluate AI models.",

    points: [
      "Checked code for correctness, clarity, and maintainability.",
      "Improved technical explanations and problem-solving steps.",
    ],
  },
  {
    role:
      "Embedded Software Developer Intern",

    company: "Nodehill AB",

    period: "Jan 2024 — Apr 2024",

    summary:
      "An embedded internship focused on long-range wireless communication.",

    points: [
      "Set up LoRa communication between two ESP32 microcontrollers.",
      "Tested communication behaviour across a long-range wireless setup.",
    ],
  },
  {
    role:
      "Embedded Software Developer Intern",

    company:
      "Sigma Industry Evolution",

    period: "Sep 2023 — Oct 2023",

    summary:
      "A hands-on embedded internship centred on an autonomous RC car.",

    points: [
      "Assembled and programmed a self-driving car using Arduino and sensors.",
      "Used C/C++ and Python for its control and testing logic.",
    ],
  },
];

export const ABOUT_SKILL_GROUPS = [
  {
    title: "Languages",

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
    title: "Frontend",

    items: [
      "React",
      "Next.js",
      "Tailwind CSS",
      "Bootstrap",
    ],
  },
  {
    title: "Backend",

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
    title: "Databases",

    items: [
      "SQL",
      "MySQL",
      "MongoDB",
      "MariaDB",
      "Aiven",
      "phpMyAdmin",
      "NoSQL",
    ],
  },
  {
    title: "Tools & Platforms",

    items: [
      "Git",
      "Jira",
      "VS Code",
      "Docker",
      "Vercel",
      "Azure",
      "WordPress",
      "Linux / Ubuntu",
    ],
  },
  {
    title: "Design",

    items: [
      "Figma",
      "Canva",
      "Web / Graphic Design",
    ],
  },
  {
    title: "Embedded & Other",

    items: [
      "RTOS / Zephyr",
      "Yocto",
      "UART / SPI / I2C / CAN",
      "GTest",
      "CMake",
    ],
  },
  {
    title: "Soft Skills",

    items: [
      "Problem Solving",
      "Team Communication",
    ],
  },
];

export const CREDIT_GROUPS = [
  {
    title: "Frontend",

    items: [
      "React",
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Lucide React",
    ],
  },
  {
    title: "3D & rendering",

    items: [
      "Three.js",
      "React Three Fiber",
      "Drei",
      "GLB / glTF models",
      "WebGL rendering",
    ],
  },
  {
    title: "Motion & interaction",

    items: [
      "Framer Motion",
      "GSAP",
      "Lottie animation",
      "Camera animations",
      "Mouse, touch & wheel controls",
    ],
  },
  {
    title: "Post-processing",

    items: [
      "React Three Postprocessing",
      "Bloom",
      "SSAO",
      "Vignette",
      "ACES filmic tone mapping",
    ],
  },
  {
    title: "Media & accessibility",

    items: [
      "Ambient background audio",
      "Music mute controls",
      "Keyboard navigation",
      "Reduced-motion support",
      "Accessible modal dialogs",
    ],
  },
  {
    title: "Visual direction",

    items: [
      "Cozy Tokyo-night atmosphere",
      "Moody color palette",
      "Playful interactions",
      "Small environmental details",
      "Responsive interface design",
    ],
  },
  {
    title: "Behind the scenes",

    items: [
      "UI iteration",
      "Responsive layouts",
      "Performance optimisation",
      "Asset optimisation",
      "Cross-device testing",
    ],
  },
];