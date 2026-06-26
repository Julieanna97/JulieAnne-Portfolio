"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";

const projects = [
  {
    title: "Sigma Autonomous Car",
    slug: "sigma-autonomous-car",
    type: "Embedded / Robotics Project",
    image: "/projects/sigma-autonomous-car/cover.jpg",
    description:
      "An autonomous car project where I handled the build from the electrical schematic to hardware assembly and programming, then tested and refined how the car responded to its environment.",
    tags: ["Embedded Systems", "C++", "Electronics", "Sensors"],
  },
  {
    title: "PodManager.ai",
    slug: "podmanager",
    type: "Production Internship",
    image: "/projects/podmanager/cover.png",
    description:
      "A production internship where I worked in a real Next.js and FastAPI codebase, contributing to recording, editing, AI workflows, and marketplace features.",
    tags: ["Next.js", "TypeScript", "FastAPI", "AI"],
  },
  {
    title: "PracticePal",
    slug: "practicepal",
    type: "Fullstack SaaS Project",
    image: "/projects/practicepal/cover.png",
    description:
      "A fullstack practice planning app built with Next.js, MongoDB, authentication, Stripe subscriptions, and progress tracking for music practice sessions.",
    tags: ["Next.js", "MongoDB", "Stripe", "Auth"],
  },
  {
    title: "WorldBite Market",
    slug: "worldbite-market",
    type: "WordPress / WooCommerce Project",
    image: "/projects/worldbite-market/cover.png",
    description:
      "A custom WordPress and WooCommerce food marketplace built with PHP, MariaDB, phpMyAdmin, and Docker. I created a responsive theme, product catalogue, cart and checkout flow, and custom recipe collections.",
    tags: ["WordPress", "PHP", "WooCommerce", "MariaDB", "Docker"],
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
      className="min-h-screen w-full overflow-hidden p-3 text-[#3b2a45] md:p-5"
      style={{
        background:
          "radial-gradient(circle at 20% 72%, rgba(255, 170, 190, 0.55), transparent 32%), radial-gradient(circle at 78% 68%, rgba(151, 207, 255, 0.5), transparent 34%), radial-gradient(circle at 50% 18%, rgba(255, 239, 204, 0.75), transparent 38%), linear-gradient(180deg, #fff7ec 0%, #f8dfe8 48%, #d8d5ff 100%)",
      }}
    >
      <div
        className="relative min-h-[calc(100vh-1.5rem)] w-full overflow-hidden rounded-[1.5rem] p-4 md:p-6"
        style={{
          background:
            "linear-gradient(145deg, #d4c4e8 0%, #b8a1d5 50%, #a98ec7 100%)",
          boxShadow:
            "0 30px 80px rgba(168, 142, 199, 0.45), 0 10px 30px rgba(0,0,0,0.15), inset 0 1px 2px rgba(255,255,255,0.6)",
        }}
      >
        <div className="mb-3 flex items-center justify-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-purple-900/30" />
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-purple-900/40">
            Window View · Projects
          </span>
          <div className="h-1.5 w-1.5 rounded-full bg-purple-900/30" />
        </div>

        <div
          className="relative overflow-hidden rounded-[1rem]"
          style={{
            background:
              "linear-gradient(160deg, #cde7e9 0%, #b8d8e3 25%, #c9dce8 55%, #d6e2ee 85%, #e0e8f3 100%)",
            boxShadow: "inset 0 0 30px rgba(168, 142, 199, 0.25)",
          }}
        >
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.35) 35%, transparent 42%, transparent 55%, rgba(255,255,255,0.25) 60%, transparent 68%, transparent 78%, rgba(255,255,255,0.2) 82%, transparent 88%)",
            }}
          />

          <div
            className="pointer-events-none absolute inset-0 opacity-[0.18] mix-blend-overlay"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 30%, rgba(255,255,255,0.4) 0%, transparent 1.5%), radial-gradient(circle at 70% 60%, rgba(255,255,255,0.35) 0%, transparent 1.5%), radial-gradient(circle at 40% 80%, rgba(255,255,255,0.4) 0%, transparent 1.5%), radial-gradient(circle at 85% 25%, rgba(255,255,255,0.3) 0%, transparent 1.5%), radial-gradient(circle at 15% 75%, rgba(255,255,255,0.35) 0%, transparent 1.5%)",
              backgroundSize: "120px 120px",
            }}
          />

          <div
            className="pointer-events-none absolute inset-0 z-10"
            style={{
              background:
                "linear-gradient(115deg, rgba(255,255,255,0.18) 0%, transparent 30%, transparent 70%, rgba(255,255,255,0.12) 100%)",
            }}
          />

          <div className="relative z-20 px-4 py-8 sm:px-6 md:px-12 md:py-12">
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div
                className="rounded-2xl bg-white/55 px-5 py-4 backdrop-blur-md transition duration-500 hover:-translate-y-1 hover:bg-white/65 hover:shadow-xl"
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
                className="group inline-flex w-fit items-center gap-2 rounded-full border border-white/70 bg-white/85 px-5 py-3 text-sm font-semibold text-[#7a4d77] shadow-lg backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:scale-105 hover:bg-white hover:shadow-xl"
              >
                <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
                Back to room
              </Link>
            </div>

            <div className="grid items-center gap-6 lg:grid-cols-[1.25fr_0.75fr]">
              <Link
                key={currentProject.slug}
                href={`/projects/${currentProject.slug}`}
                className="project-card group block overflow-hidden rounded-[1.75rem] border border-white/70 bg-white/70 p-3 shadow-xl backdrop-blur-md transition duration-500 hover:-translate-y-2 hover:scale-[1.015] hover:bg-white/80 hover:shadow-[0_28px_70px_rgba(168,142,199,0.42)]"
              >
                <div className="relative aspect-[16/10] overflow-hidden rounded-[1.25rem] bg-gradient-to-br from-pink-100 via-yellow-50 to-blue-100">
                  <div className="relative flex h-full w-full items-center justify-center bg-[#dfe9ef]">
                    <img
                      src={currentProject.image}
                      alt={currentProject.title}
                      className="max-h-full max-w-full object-contain transition duration-700 group-hover:scale-110 group-hover:rotate-[0.4deg]"
                    />
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-[#2c2336]/50 via-[#2c2336]/5 to-white/5 opacity-90 transition duration-500 group-hover:from-[#2c2336]/58" />

                  <div className="pointer-events-none absolute inset-0 translate-x-[-120%] bg-gradient-to-r from-transparent via-white/30 to-transparent transition duration-1000 group-hover:translate-x-[120%]" />

                  <div className="absolute bottom-5 left-5 right-5">
                    <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/85 sm:text-xs">
                      Click to view case study
                    </p>

                    <h2 className="mt-2 text-3xl font-bold leading-tight text-white md:text-5xl">
                      {currentProject.title}
                    </h2>
                  </div>

                  <div className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border border-white/60 bg-white/80 text-[#7a4d77] opacity-0 shadow-lg backdrop-blur-md transition duration-300 group-hover:rotate-6 group-hover:scale-110 group-hover:opacity-100">
                    <ExternalLink className="h-4 w-4" />
                  </div>
                </div>
              </Link>

              <div
                key={`${currentProject.slug}-info`}
                className="project-info rounded-[1.75rem] border border-white/70 bg-white/75 p-6 text-[#3b2a45] shadow-xl backdrop-blur-md transition duration-500 hover:-translate-y-2 hover:bg-white/85 hover:shadow-[0_28px_70px_rgba(168,142,199,0.36)]"
              >
                <p className="text-xs font-black uppercase tracking-[0.25em] text-[#8d67cf]">
                  {currentProject.type}
                </p>

                <h3 className="mt-4 text-3xl font-bold leading-tight">
                  {currentProject.title}
                </h3>

                <p className="mt-4 text-sm font-medium leading-relaxed text-[#625a73]">
                  {currentProject.description}
                </p>

                <div className="mt-6 flex flex-wrap gap-2">
                  {currentProject.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-[#f7d7e3]/90 px-3 py-1 text-xs font-bold text-[#7a4d77] shadow-sm transition duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-md"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <Link
                  href={`/projects/${currentProject.slug}`}
                  className="group mt-8 inline-flex items-center gap-2 rounded-full border border-white/70 bg-[#3b2a45] px-6 py-3 text-sm font-semibold text-white shadow-lg transition duration-300 hover:-translate-y-1 hover:scale-105 hover:bg-[#4a3658] hover:shadow-xl"
                >
                  View case study
                  <ExternalLink className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5" />
                </Link>
              </div>
            </div>

            <div className="relative mt-8 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={goPrevious}
                className="group flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/70 bg-white/85 text-[#7a4d77] shadow-lg backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:scale-110 hover:bg-white hover:shadow-xl"
                aria-label="Previous project"
              >
                <ChevronLeft className="h-5 w-5 transition-transform duration-300 group-hover:-translate-x-0.5" />
              </button>

              <div className="flex flex-wrap justify-center gap-2">
                {projects.map((project, index) => (
                  <button
                    key={project.slug}
                    type="button"
                    onClick={() => setCurrentIndex(index)}
                    className={`h-3 rounded-full transition duration-300 hover:scale-125 ${
                      index === currentIndex
                        ? "w-9 bg-[#8d67cf] shadow-[0_0_18px_rgba(141,103,207,0.45)]"
                        : "w-3 bg-white/80 hover:bg-white"
                    }`}
                    aria-label={`Go to ${project.title}`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={goNext}
                className="group flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/70 bg-white/85 text-[#7a4d77] shadow-lg backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:scale-110 hover:bg-white hover:shadow-xl"
                aria-label="Next project"
              >
                <ChevronRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes floatIn {
          0% {
            opacity: 0;
            transform: translateY(16px) scale(0.98);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .project-card,
        .project-info {
          animation: floatIn 0.55s ease both;
        }

        @media (prefers-reduced-motion: reduce) {
          .project-card,
          .project-info,
          .project-card *,
          .project-info * {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </main>
  );
}