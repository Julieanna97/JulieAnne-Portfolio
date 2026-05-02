export const person = {
  firstName: "Julie Anne",
  name: "Julie Anne Cantillep",
  role: "Fullstack Developer",
  email: "kisamae1997@gmail.com",
  phone: "+46760393202",
  location: "Sweden",
  github: "github.com/your-github",
  linkedin: "linkedin.com/in/your-linkedin",
  intro:
    "I’m a software developer with experience in fullstack development, embedded systems, and AI-related projects. I build user-friendly applications that combine clean design with practical technical solutions.",
  softer:
    "When I’m not coding, I’m probably learning something new, sketching interface ideas, or turning small moments into stories."
};

export const projects = [
  {
    title: "PracticePal",
    tags: ["Next.js", "MongoDB", "NextAuth", "Stripe"],
    desc: "A fullstack SaaS practice planning and analytics app for musicians with authentication, session tracking, practice plans, dashboards, and subscription flows.",
    tone: "red"
  },
  {
    title: "PodManager.ai",
    tags: ["React", "TypeScript", "Node.js", "Audio/Video"],
    desc: "Browser-based audio and video editing tools, including waveform UI, video track strips, effects components, and Node.js APIs for projects, clips, and effects.",
    tone: "purple"
  },
  {
    title: "NASA Near Earth Objects",
    tags: ["JavaScript", "NASA API", "DOM", "Responsive"],
    desc: "A responsive JavaScript application using NASA’s Near Earth Object API with dynamic interface, filtering, and sorting functionality.",
    tone: "blue"
  }
];

export const skillGroups = [
  ["Frontend", "React.js", "Next.js", "TypeScript", "JavaScript", "HTML", "CSS", "Tailwind CSS", "Bootstrap"],
  ["Backend", "Node.js", "Express.js", "REST APIs", "FastAPI", "Python Flask", "ffmpeg", "Authentication"],
  ["Database", "MongoDB", "SQL", "NoSQL", "phpMyAdmin"],
  ["Tools & Others", "Git", "GitHub", "Jira", "VS Code", "Docker", "Azure", "Figma", "WordPress", "Linux/Ubuntu"],
  ["Embedded", "C/C++", "Arduino", "ESP32", "LoRa", "RTOS/Zephyr", "Yocto", "UART/SPI/I2C/CAN"]
];

export const journey = [
  { year: "2026", title: "Fullstack Developer Graduate", text: "Graduating from The Media Institute with focus on frontend, databases, agile work, system development, e-commerce platforms, and third-party integrations." },
  { year: "2025 — 2026", title: "Fullstack Developer · PodManager.ai", text: "Worked on browser-based audio and video editing tools with React, TypeScript, Node.js APIs, GitHub, pull requests, and code reviews." },
  { year: "2026 — Current", title: "AI Data Specialist / QA Analyst", text: "Reviewing and improving multilingual AI training data, following strict guidelines, and keeping outputs accurate, consistent, and natural." },
  { year: "2024 — 2025", title: "AI Trainer · Outlier", text: "Developed, reviewed, and optimized AI-related coding outputs and training data for better model quality." },
  { year: "2024", title: "Embedded Intern · Nodehill AB", text: "Implemented a LoRa communication system using ESP32 microcontrollers and LoRa modules for long-range wireless communication." },
  { year: "2023", title: "Embedded Intern · Sigma Industry Evolution", text: "Worked on an Arduino-based autonomous radio-controlled car using sensors, C/C++, and Python." }
];

export const posts = [
  { date: "APR 12, 2026", title: "Thoughts on clean code", desc: "Why clean code matters and how small choices shape the whole app." },
  { date: "MAR 29, 2026", title: "How I structure my fullstack projects", desc: "A look into folders, architecture, reusable components, and calm project setup." },
  { date: "FEB 14, 2026", title: "Learning never stops", desc: "Resources, habits, and tiny routines that help me keep growing." }
];
