"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  Code2,
  Server,
  Sparkles,
  Briefcase,
  GraduationCap,
  Wrench,
} from "lucide-react";

export default function AboutPage() {
return (
    <main
      className="min-h-screen w-full"
      style={{
        background:
          "radial-gradient(circle at 20% 72%, rgba(255, 170, 190, 0.55), transparent 32%), radial-gradient(circle at 78% 68%, rgba(151, 207, 255, 0.5), transparent 34%), radial-gradient(circle at 50% 18%, rgba(255, 239, 204, 0.75), transparent 38%), linear-gradient(180deg, #fff7ec 0%, #f8dfe8 48%, #d8d5ff 100%)",
      }}
    >
      {/* === LAPTOP FRAME (full-bleed) === */}
      <div className="w-full">
        {/* Outer pink laptop body */}
        <div
          className="relative p-3 shadow-2xl md:p-5"
          style={{
            background:
              "linear-gradient(145deg, #f5b5c8 0%, #e89cb5 50%, #d88aa3 100%)",
            boxShadow:
              "0 30px 80px rgba(216, 138, 163, 0.4), 0 10px 30px rgba(0,0,0,0.15), inset 0 1px 2px rgba(255,255,255,0.6)",
          }}
        >
          {/* Camera notch on top bezel */}
          <div className="mb-2 flex items-center justify-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-pink-900/30" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-pink-900/40">
              Julie&apos;s MacBook
            </span>
            <div className="h-1.5 w-1.5 rounded-full bg-pink-900/30" />
          </div>

          {/* Black inner screen border */}
          <div
            className="relative overflow-hidden p-2 md:p-3"
            style={{
              background: "linear-gradient(160deg, #1a1a24 0%, #2a2638 100%)",
              boxShadow: "inset 0 0 30px rgba(0,0,0,0.5)",
            }}
          >
            {/* The actual screen content area */}
            <div
              className="relative overflow-hidden"
              style={{
                background:
                  "linear-gradient(180deg, #fff7ec 0%, #fde4ee 50%, #ede0ff 100%)",
              }}
            >
              {/* Screen glare overlay */}
              <div
                className="pointer-events-none absolute inset-0 z-10"
                style={{
                  background:
                    "linear-gradient(115deg, rgba(255,255,255,0.18) 0%, transparent 30%, transparent 70%, rgba(255,255,255,0.1) 100%)",
                }}
              />

              {/* === SCREEN CONTENT === */}
              <div className="relative z-20 px-6 py-10 md:px-12 md:py-14">
                {/* Top "browser bar" feel */}
                <div className="mb-8 flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                    <div className="h-3 w-3 rounded-full bg-[#febc2e]" />
                    <div className="h-3 w-3 rounded-full bg-[#28c840]" />
                  </div>
                  <div className="ml-4 flex-1 rounded-full bg-white/60 px-4 py-1.5 text-[11px] font-medium text-[#8d67cf] backdrop-blur-sm">
                    julieanne.dev / about
                  </div>
                </div>

                {/* Hero */}
                <div className="text-center">
                  <p className="text-xs font-black uppercase tracking-[0.35em] text-[#8d67cf] md:text-sm">
                    About Me
                  </p>
                  <h1 className="mt-4 font-display text-4xl font-bold text-[#3b2a45] md:text-6xl">
                    Hi, I&apos;m Julie Anne ✨
                  </h1>
                  <p className="mt-2 text-sm font-semibold text-[#7a4d77] md:text-base">
                    Software Developer · Fullstack · Embedded · AI
                  </p>

                  <p className="mx-auto mt-6 max-w-2xl text-sm font-medium leading-relaxed text-[#625a73] md:text-base">
                    I&apos;m a software developer with experience in fullstack
                    development, embedded systems, and AI-related projects. I
                    build user-friendly applications that combine clean design
                    with practical technical solutions — reliable,
                    well-structured software that&apos;s both functional and a
                    joy to use.
                  </p>
                </div>

                {/* Quick categories */}
                <div className="mx-auto mt-10 grid max-w-4xl gap-4 md:grid-cols-3">
                  <CategoryCard
                    icon={<Code2 className="h-5 w-5" />}
                    title="Frontend"
                    text="React, Next.js, TypeScript, Tailwind CSS, and thoughtful UI details that feel polished and alive."
                  />
                  <CategoryCard
                    icon={<Server className="h-5 w-5" />}
                    title="Backend"
                    text="Node.js, Express, FastAPI, Flask. APIs, auth flows, SQL/NoSQL databases, and clean app structure."
                  />
                  <CategoryCard
                    icon={<Sparkles className="h-5 w-5" />}
                    title="Creative & Embedded"
                    text="3D web (Three.js), animations, plus embedded systems with C/C++, ESP32, LoRa, and Arduino."
                  />
                </div>

                {/* === EXPERIENCE === */}
                <SectionHeader icon={<Briefcase />} title="Work Experience" />

                <div className="mx-auto mt-6 max-w-4xl space-y-4">
                  <ExperienceCard
                    role="Fullstack Developer"
                    company="PodManager.ai"
                    blurb="AI-driven SaaS platform for podcast and audio editing."
                    period="Sep 2025 — Apr 2026"
                    points={[
                      "Built browser-based audio/video editing tools with React + TypeScript",
                      "Implemented interactive waveform and video track strip UI",
                      "Contributed to Node.js APIs managing projects, clips, and effects",
                    ]}
                  />
                  <ExperienceCard
                    role="Quality Assurance Analyst"
                    company="Oneforma.com"
                    blurb="Freelance AI-related work, data annotation and QA."
                    period="May 2026 — Ongoing"
                    points={[
                      "Reviewed and improved multilingual training data quality",
                      "Applied strict QA guidelines while keeping a natural tone",
                    ]}
                  />
                  <ExperienceCard
                    role="AI Data Specialist"
                    company="Appen.com"
                    blurb="AI training and evaluation projects."
                    period="Jan 2026 — Ongoing"
                    points={[
                      "Worked across text, audio, and multilingual data",
                      "Transcription review, labeling, and content evaluation",
                    ]}
                  />
                  <ExperienceCard
                    role="AI Trainer (Coder)"
                    company="Outlier"
                    blurb="Advanced AI solutions, ML, and AI-driven tools."
                    period="Sep 2024 — Jun 2025"
                    points={[
                      "Developed, reviewed, and optimized AI models",
                      "Collaborated cross-functionally for high-quality training data",
                    ]}
                  />
                  <ExperienceCard
                    role="Embedded Software Developer Intern"
                    company="Nodehill AB"
                    blurb="Embedded systems and wireless comms."
                    period="Jan 2024 — Apr 2024"
                    points={[
                      "Implemented LoRa comms with two ESP32 microcontrollers",
                      "Long-range wireless communication module",
                    ]}
                  />
                  <ExperienceCard
                    role="Embedded Software Developer Intern"
                    company="Sigma Industry Evolution"
                    blurb="Engineering solutions for industrial sectors."
                    period="Sep 2023 — Oct 2023"
                    points={[
                      "Built a self-driving RC car with Arduino + sensors",
                      "C/C++ and Python control logic",
                    ]}
                  />
                </div>

                {/* === SKILLS === */}
                <SectionHeader icon={<Wrench />} title="Skills" />

                <div className="mx-auto mt-6 max-w-4xl">
                  <SkillGroup
                    title="Languages"
                    skills={["JavaScript", "TypeScript", "Python", "C/C++", "HTML", "CSS"]}
                  />
                  <SkillGroup
                    title="Frontend"
                    skills={["React", "Next.js", "Tailwind CSS", "Bootstrap"]}
                  />
                  <SkillGroup
                    title="Backend"
                    skills={[
                      "Node.js",
                      "Express",
                      "FastAPI",
                      "Flask",
                      "REST APIs",
                      "ffmpeg",
                      "Mailchimp",
                    ]}
                  />
                  <SkillGroup
                    title="Databases"
                    skills={["SQL", "MongoDB", "phpMyAdmin", "NoSQL"]}
                  />
                  <SkillGroup
                    title="Tools & Platforms"
                    skills={["Git", "Jira", "VSCode", "Docker", "Azure", "WordPress", "Linux/Ubuntu"]}
                  />
                  <SkillGroup
                    title="Design"
                    skills={["Figma", "Canva", "Web/Graphic Design"]}
                  />
                  <SkillGroup
                    title="Embedded & Other"
                    skills={[
                      "RTOS / Zephyr",
                      "Yocto",
                      "UART / SPI / I2C / CAN",
                      "GTest",
                      "CMake",
                    ]}
                  />
                  <SkillGroup
                    title="Soft Skills"
                    skills={["Problem Solving", "Team Communication"]}
                  />
                </div>

                {/* === EDUCATION === */}
                <SectionHeader icon={<GraduationCap />} title="Education" />

                <div className="mx-auto mt-6 grid max-w-4xl gap-4 md:grid-cols-2">
                  <EducationCard
                    school="The Media Institute"
                    program="Fullstack Developer"
                    year="2026"
                    highlights={[
                      "Frontend & system development",
                      "Database technology",
                      "Agile project development",
                      "E-commerce platforms",
                    ]}
                  />
                  <EducationCard
                    school="Movant University of Applied Science"
                    program="Embedded Software Development"
                    year="2024"
                    highlights={[
                      "High academic performance",
                      "Led autonomous car collaborative project",
                    ]}
                  />
                </div>

                {/* === CONTACT === */}
                <SectionHeader icon={<Mail />} title="Let's Connect" />

                <div className="mx-auto mt-6 max-w-4xl">
                  <div className="grid gap-3 md:grid-cols-2">
                    <ContactLink
                      icon={<Mail className="h-4 w-4" />}
                      label="kisamae1997@gmail.com"
                      href="mailto:kisamae1997@gmail.com"
                    />
                    <ContactLink
                      icon={<Phone className="h-4 w-4" />}
                      label="+46 760 393 202"
                      href="tel:+46760393202"
                    />
                    <ContactLink
                      icon={<Linkedin className="h-4 w-4" />}
                      label="LinkedIn"
                      href="#"
                    />
                    <ContactLink
                      icon={<Github className="h-4 w-4" />}
                      label="GitHub"
                      href="#"
                    />
                  </div>
                  <div className="mt-4 flex items-center justify-center gap-2 text-xs text-[#7a4d77]">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>Malmö, Sweden</span>
                  </div>
                </div>

                {/* Back button */}
                <div className="mt-12 flex justify-center">
                  <Link
                    href="/?from=about"
                    className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/85 px-7 py-3 text-sm font-semibold text-[#7a4d77] shadow-lg backdrop-blur-xl transition hover:scale-105 hover:bg-white"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to room
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Laptop "base" hinge - subtle bar below screen */}
          <div className="mt-3 flex justify-center">
            <div className="h-1 w-32 rounded-full bg-pink-900/15" />
          </div>
        </div>

        {/* Laptop base (the trackpad/keyboard part — implied shadow only) */}
        <div className="mx-auto mt-1 h-3 max-w-6xl rounded-b-3xl bg-gradient-to-b from-pink-900/10 to-transparent" />
      </div>
    </main>
  );
}

/* ============ Subcomponents ============ */

function SectionHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="mx-auto mt-14 flex max-w-4xl items-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-pink-200 to-purple-200 text-[#8d67cf] shadow-sm">
        {icon}
      </div>
      <h2 className="font-display text-2xl font-bold text-[#3b2a45] md:text-3xl">
        {title}
      </h2>
      <div className="ml-2 h-px flex-1 bg-gradient-to-r from-[#8d67cf]/30 to-transparent" />
    </div>
  );
}

function CategoryCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-3xl border border-white/70 bg-white/65 p-5 text-left shadow-lg backdrop-blur-xl transition hover:scale-[1.02] hover:shadow-xl">
      <div className="flex items-center gap-2 text-[#8d67cf]">
        {icon}
        <p className="text-xs font-black uppercase tracking-[0.2em]">{title}</p>
      </div>
      <p className="mt-3 text-sm font-medium leading-relaxed text-[#625a73]">
        {text}
      </p>
    </div>
  );
}

function ExperienceCard({
  role,
  company,
  blurb,
  period,
  points,
}: {
  role: string;
  company: string;
  blurb: string;
  period: string;
  points: string[];
}) {
  return (
    <div className="rounded-3xl border border-white/70 bg-white/65 p-5 shadow-lg backdrop-blur-xl">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="font-display text-lg font-bold text-[#3b2a45]">
            {role}
          </h3>
          <p className="text-sm font-semibold text-[#8d67cf]">{company}</p>
          <p className="mt-0.5 text-xs italic text-[#9b8aab]">{blurb}</p>
        </div>
        <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-bold text-[#7a4d77]">
          {period}
        </span>
      </div>
      <ul className="mt-3 space-y-1.5">
        {points.map((p) => (
          <li
            key={p}
            className="flex gap-2 text-sm leading-relaxed text-[#625a73]"
          >
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#d88aa3]" />
            <span>{p}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SkillGroup({ title, skills }: { title: string; skills: string[] }) {
  return (
    <div className="mt-4 flex flex-wrap items-center gap-2">
      <span className="text-xs font-black uppercase tracking-[0.2em] text-[#8d67cf]">
        {title}:
      </span>
      {skills.map((s) => (
        <span
          key={s}
          className="rounded-full bg-white/75 px-3 py-1 text-xs font-bold text-[#7a4d77] shadow-sm"
        >
          {s}
        </span>
      ))}
    </div>
  );
}

function EducationCard({
  school,
  program,
  year,
  highlights,
}: {
  school: string;
  program: string;
  year: string;
  highlights: string[];
}) {
  return (
    <div className="rounded-3xl border border-white/70 bg-white/65 p-5 shadow-lg backdrop-blur-xl">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-display text-base font-bold text-[#3b2a45]">
            {program}
          </h3>
          <p className="text-sm font-medium text-[#8d67cf]">{school}</p>
        </div>
        <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-bold text-[#7a4d77]">
          {year}
        </span>
      </div>
      <ul className="mt-3 space-y-1">
        {highlights.map((h) => (
          <li
            key={h}
            className="flex gap-2 text-sm leading-relaxed text-[#625a73]"
          >
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#d88aa3]" />
            <span>{h}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ContactLink({
  icon,
  label,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  href: string;
}) {
  return (
    <a
      href={href}
      className="flex items-center gap-3 rounded-2xl border border-white/70 bg-white/65 px-4 py-3 text-sm font-semibold text-[#7a4d77] shadow-sm backdrop-blur-xl transition hover:scale-[1.02] hover:bg-white"
    >
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-pink-200 to-purple-200 text-[#8d67cf]">
        {icon}
      </span>
      <span>{label}</span>
    </a>
  );
}