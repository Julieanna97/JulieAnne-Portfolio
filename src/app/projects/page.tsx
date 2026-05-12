"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
    setCurrentIndex((prev) =>
      prev === 0 ? projects.length - 1 : prev - 1
    );
  };

  const goNext = () => {
    setCurrentIndex((prev) =>
      prev === projects.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <main
      className="min-h-screen w-full overflow-hidden px-6 py-8"
      style={{
        background:
          "radial-gradient(circle at 20% 72%, rgba(255, 170, 190, 0.55), transparent 32%), radial-gradient(circle at 78% 68%, rgba(151, 207, 255, 0.5), transparent 34%), radial-gradient(circle at 50% 18%, rgba(255, 239, 204, 0.75), transparent 38%), linear-gradient(180deg, #fff7ec 0%, #f8dfe8 48%, #d8d5ff 100%)",
      }}
    >
      <section className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl flex-col justify-center">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.35em] text-[#8d67cf]">
              Projects
            </p>
            <h1 className="mt-3 font-display text-4xl font-bold text-[#3b2a45] md:text-6xl">
              Things I&apos;ve Built
            </h1>
          </div>

        <Link
        href="/?from=projects"
        className="rounded-full border border-white/70 bg-white/85 px-5 py-3 text-sm font-semibold text-[#7a4d77] shadow-lg backdrop-blur-xl transition hover:scale-105 hover:bg-white"
        >
        Back to room
        </Link>
        </div>

        <div className="relative overflow-hidden rounded-[2.5rem] border border-white/70 bg-white/65 p-5 shadow-2xl backdrop-blur-xl md:p-8">
          <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-pink-300/30 blur-3xl" />
          <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-blue-300/30 blur-3xl" />

          <div className="relative grid items-center gap-8 lg:grid-cols-[1.25fr_0.75fr]">
            <Link
              href={`/projects/${currentProject.slug}`}
              className="group block overflow-hidden rounded-[2rem] border border-white/70 bg-white/70 p-3 shadow-xl transition hover:scale-[1.01]"
            >
              <div className="relative aspect-[16/10] overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-pink-100 via-yellow-50 to-blue-100">
                <img
                  src={currentProject.image}
                  alt={currentProject.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#2c2336]/45 via-transparent to-transparent opacity-80" />

                <div className="absolute bottom-5 left-5 right-5">
                  <p className="text-xs font-black uppercase tracking-[0.25em] text-white/80">
                    Click to view case study
                  </p>
                  <h2 className="mt-2 text-3xl font-bold text-white md:text-5xl">
                    {currentProject.title}
                  </h2>
                </div>
              </div>
            </Link>

            <div className="rounded-[2rem] border border-white/70 bg-white/70 p-6 text-[#3b2a45] shadow-xl backdrop-blur-xl">
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
      </section>
    </main>
  );
}