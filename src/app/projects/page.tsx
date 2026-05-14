"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";

const projects = [
  {
    title: "Portfolio Website",
    slug: "portfolio-website",
    type: "3D Portfolio",
    image: "/projects/portfolio.png",
    description:
      "A cozy interactive portfolio with 3D navigation, pastel visuals, and animated page transitions.",
    tags: ["Next.js", "React Three Fiber", "Tailwind"],
  },
  {
    title: "Study Planner App",
    slug: "study-planner",
    type: "Fullstack App",
    image: "/projects/study-planner.png",
    description:
      "A productivity app for organizing tasks, deadlines, notes, and study sessions.",
    tags: ["React", "Next.js", "Database"],
  },
  {
    title: "Creative UI Gallery",
    slug: "creative-ui-gallery",
    type: "UI Experiment",
    image: "/projects/creative-ui.png",
    description:
      "A collection of playful interface experiments using animation, glassmorphism, and soft visuals.",
    tags: ["Framer Motion", "UI/UX", "Animation"],
  },
];

export default function ProjectsPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentProject = projects[currentIndex];

  const goPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? projects.length - 1 : prev - 1));
  };

  const goNext = () => {
    setCurrentIndex((prev) => (prev === projects.length - 1 ? 0 : prev + 1));
  };

  return (
    <main
      className="min-h-screen w-full p-3 md:p-5"
      style={{
        background:
          "radial-gradient(circle at 20% 72%, rgba(255, 170, 190, 0.55), transparent 32%), radial-gradient(circle at 78% 68%, rgba(151, 207, 255, 0.5), transparent 34%), radial-gradient(circle at 50% 18%, rgba(255, 239, 204, 0.75), transparent 38%), linear-gradient(180deg, #fff7ec 0%, #f8dfe8 48%, #d8d5ff 100%)",
      }}
    >
      {/* === WINDOW FRAME (purple bezel only) === */}
      <div
        className="relative min-h-[calc(100vh-1.5rem)] w-full rounded-[1.5rem] p-4 md:p-6"
        style={{
          background:
            "linear-gradient(145deg, #d4c4e8 0%, #b8a1d5 50%, #a98ec7 100%)",
          boxShadow:
            "0 30px 80px rgba(168, 142, 199, 0.45), 0 10px 30px rgba(0,0,0,0.15), inset 0 1px 2px rgba(255,255,255,0.6)",
        }}
      >
        {/* Top window label */}
        <div className="mb-3 flex items-center justify-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-purple-900/30" />
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-purple-900/40">
            Window View · Projects
          </span>
          <div className="h-1.5 w-1.5 rounded-full bg-purple-900/30" />
        </div>

        {/* Frosted blue sky (directly inside the purple frame) */}
        <div
          className="relative overflow-hidden rounded-[1rem]"
          style={{
            background:
              "linear-gradient(160deg, #cde7e9 0%, #b8d8e3 25%, #c9dce8 55%, #d6e2ee 85%, #e0e8f3 100%)",
            boxShadow: "inset 0 0 30px rgba(168, 142, 199, 0.25)",
          }}
        >
          {/* Diagonal light rays */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.35) 35%, transparent 42%, transparent 55%, rgba(255,255,255,0.25) 60%, transparent 68%, transparent 78%, rgba(255,255,255,0.2) 82%, transparent 88%)",
            }}
          />

          {/* Frosted-glass noise overlay */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.18] mix-blend-overlay"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 30%, rgba(255,255,255,0.4) 0%, transparent 1.5%), radial-gradient(circle at 70% 60%, rgba(255,255,255,0.35) 0%, transparent 1.5%), radial-gradient(circle at 40% 80%, rgba(255,255,255,0.4) 0%, transparent 1.5%), radial-gradient(circle at 85% 25%, rgba(255,255,255,0.3) 0%, transparent 1.5%), radial-gradient(circle at 15% 75%, rgba(255,255,255,0.35) 0%, transparent 1.5%)",
              backgroundSize: "120px 120px",
            }}
          />

          {/* Outer glass glare */}
          <div
            className="pointer-events-none absolute inset-0 z-10"
            style={{
              background:
                "linear-gradient(115deg, rgba(255,255,255,0.18) 0%, transparent 30%, transparent 70%, rgba(255,255,255,0.12) 100%)",
            }}
          />

          {/* === CONTENT === */}
          <div className="relative z-20 px-6 py-10 md:px-12 md:py-12">
            {/* Header row */}
            <div className="mb-8 flex items-start justify-between gap-4">
              <div
                className="rounded-2xl bg-white/55 px-5 py-4 backdrop-blur-md"
                style={{
                  boxShadow:
                    "0 4px 16px rgba(168,142,199,0.15), inset 0 1px 1px rgba(255,255,255,0.6)",
                }}
              >
                <p className="text-xs font-black uppercase tracking-[0.35em] text-[#8d67cf]">
                  Projects
                </p>
                <h1 className="mt-2 font-display text-3xl font-bold text-[#3b2a45] md:text-5xl">
                  Things I&apos;ve Built
                </h1>
              </div>

              <Link
                href="/?from=projects"
                className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/85 px-5 py-3 text-sm font-semibold text-[#7a4d77] shadow-lg backdrop-blur-xl transition hover:scale-105 hover:bg-white"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to room
              </Link>
            </div>

            {/* Project card grid */}
            <div className="grid items-center gap-6 lg:grid-cols-[1.25fr_0.75fr]">
              <Link
                href={`/projects/${currentProject.slug}`}
                className="group block overflow-hidden rounded-[1.75rem] border border-white/70 bg-white/70 p-3 shadow-xl backdrop-blur-md transition hover:scale-[1.01]"
              >
                <div className="relative aspect-[16/10] overflow-hidden rounded-[1.25rem] bg-gradient-to-br from-pink-100 via-yellow-50 to-blue-100">
                  <img
                    src={currentProject.image}
                    alt={currentProject.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#2c2336]/45 via-transparent to-transparent opacity-80" />

                  <div className="absolute bottom-5 left-5 right-5">
                    <p className="text-xs font-black uppercase tracking-[0.25em] text-white/85">
                      Click to view case study
                    </p>
                    <h2 className="mt-2 text-3xl font-bold text-white md:text-5xl">
                      {currentProject.title}
                    </h2>
                  </div>
                </div>
              </Link>

              <div className="rounded-[1.75rem] border border-white/70 bg-white/75 p-6 text-[#3b2a45] shadow-xl backdrop-blur-md">
                <p className="text-xs font-black uppercase tracking-[0.25em] text-[#8d67cf]">
                  {currentProject.type}
                </p>

                <h3 className="mt-4 text-3xl font-bold">
                  {currentProject.title}
                </h3>

                <p className="mt-4 text-sm font-medium leading-relaxed text-[#625a73]">
                  {currentProject.description}
                </p>

                <div className="mt-6 flex flex-wrap gap-2">
                  {currentProject.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-[#f7d7e3] px-3 py-1 text-xs font-bold text-[#7a4d77]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <Link
                  href={`/projects/${currentProject.slug}`}
                  className="mt-8 inline-flex rounded-full border border-white/70 bg-[#3b2a45] px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:scale-105"
                >
                  View case study
                </Link>
              </div>
            </div>

            {/* Navigation row */}
            <div className="relative mt-8 flex items-center justify-between">
              <button
                onClick={goPrevious}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-white/70 bg-white/85 text-[#7a4d77] shadow-lg backdrop-blur-xl transition hover:scale-105 hover:bg-white"
                aria-label="Previous project"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <div className="flex gap-2">
                {projects.map((project, index) => (
                  <button
                    key={project.slug}
                    onClick={() => setCurrentIndex(index)}
                    className={`h-3 rounded-full transition ${
                      index === currentIndex
                        ? "w-9 bg-[#8d67cf]"
                        : "w-3 bg-white/80"
                    }`}
                    aria-label={`Go to ${project.title}`}
                  />
                ))}
              </div>

              <button
                onClick={goNext}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-white/70 bg-white/85 text-[#7a4d77] shadow-lg backdrop-blur-xl transition hover:scale-105 hover:bg-white"
                aria-label="Next project"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}