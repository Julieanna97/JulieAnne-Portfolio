import Link from "next/link";
import {
  ArrowLeft,
  ExternalLink,
  Sparkles,
  Waves,
  Video,
  Music,
  ToggleLeft,
  RefreshCw,
  Code2,
} from "lucide-react";

const techStack = [
  "Next.js",
  "TypeScript",
  "FastAPI",
  "Python",
  "AI Workflows",
  "Production Codebase",
  "Code Reviews",
  "Fullstack Development",
];

const contributions = [
  {
    title: "Audio waveform",
    description:
      "Implemented waveform visualization to make podcast audio easier to navigate and edit.",
    icon: Waves,
    color: "bg-[#d8f3dc]",
  },
  {
    title: "Video track strip",
    description:
      "Worked on the video track strip to support a clearer visual editing experience.",
    icon: Video,
    color: "bg-[#d8d5ff]",
  },
  {
    title: "Sound effects & music",
    description:
      "Added support for sound effects and music so users could enhance podcast episodes during editing.",
    icon: Music,
    color: "bg-[#fff0c9]",
  },
  {
    title: "Publish controls",
    description:
      "Built publish-page toggles for optional intro, outro, and watermark settings before export.",
    icon: ToggleLeft,
    color: "bg-[#f8dfe8]",
  },
  {
    title: "Codebase refactoring",
    description:
      "Refactored existing components to improve readability, structure, and maintainability.",
    icon: RefreshCw,
    color: "bg-[#efe4ff]",
  },
  {
    title: "Production development",
    description:
      "Worked inside a real production codebase with team conventions, reviews, and active product requirements.",
    icon: Code2,
    color: "bg-[#ffe4d6]",
  },
];

export default function PodManagerPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#fff7ec] px-5 py-10 text-[#3b2a45]">
      <section className="mx-auto max-w-6xl">
        <Link
          href="/projects"
          className="group inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#7a4d77] shadow transition duration-300 hover:-translate-y-1 hover:bg-[#3b2a45] hover:text-white hover:shadow-xl"
        >
          <ArrowLeft className="h-4 w-4 transition duration-300 group-hover:-translate-x-1" />
          Back to projects
        </Link>

        <div className="mt-10 overflow-hidden rounded-[2rem] bg-white/75 shadow-xl backdrop-blur-md animate-[fadeIn_0.7s_ease-out]">
          <div className="relative p-6 md:p-10">
            <div className="absolute right-0 top-0 h-44 w-44 rounded-bl-full bg-[#d8d5ff]/70 blur-sm" />
            <div className="absolute bottom-0 left-0 h-36 w-36 rounded-tr-full bg-[#f8dfe8]/80 blur-sm" />

            <div className="relative">
              <p className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.25em] text-[#8d67cf] shadow-sm">
                <Sparkles className="h-4 w-4" />
                Production Internship · Fullstack Development
              </p>

              <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                <div>
                  <h1 className="font-display text-4xl font-bold transition duration-300 hover:text-[#8d67cf] md:text-6xl">
                    PodManager.ai
                  </h1>

                  <p className="mt-5 max-w-3xl text-lg leading-8 text-[#625a73]">
                    I worked as a fullstack intern on PodManager.ai, an
                    AI-powered podcast platform. My work focused on media
                    editing features, publishing controls, and improving the
                    existing production codebase.
                  </p>
                </div>

                <a
                  href="https://www.podmanager.ai/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex w-fit items-center gap-2 rounded-full bg-[#3b2a45] px-6 py-3 text-sm font-semibold text-white shadow-lg transition duration-300 hover:-translate-y-1 hover:scale-105 hover:bg-[#8d67cf] hover:shadow-2xl"
                >
                  Visit PodManager.ai
                  <ExternalLink className="h-4 w-4 transition duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                </a>
              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-3">
                <div className="group rounded-2xl bg-[#f8dfe8] p-5 transition duration-300 hover:-translate-y-2 hover:shadow-xl">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-[#8d67cf]">
                    Role
                  </p>
                  <h2 className="mt-2 font-display text-xl font-bold">
                    Fullstack Intern
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-[#625a73]">
                    Frontend, backend, feature work, and refactoring.
                  </p>
                </div>

                <div className="group rounded-2xl bg-[#d8d5ff] p-5 transition duration-300 hover:-translate-y-2 hover:shadow-xl">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-[#8d67cf]">
                    Main focus
                  </p>
                  <h2 className="mt-2 font-display text-xl font-bold">
                    Podcast Editing
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-[#625a73]">
                    Audio waveform, video track strip, music, and sound effects.
                  </p>
                </div>

                <div className="group rounded-2xl bg-[#fff0c9] p-5 transition duration-300 hover:-translate-y-2 hover:shadow-xl">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-[#8d67cf]">
                    Impact
                  </p>
                  <h2 className="mt-2 font-display text-xl font-bold">
                    Better Editing Flow
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-[#625a73]">
                    Helped make editing and publishing podcast episodes more
                    flexible.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-[#eadfcc] p-6 md:p-10">
            <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.3em] text-[#8d67cf]">
                  Overview
                </p>

                <h2 className="mt-3 font-display text-3xl font-bold md:text-4xl">
                  A real production internship
                </h2>

                <p className="mt-5 leading-8 text-[#625a73]">
                  PodManager.ai gave me experience working in a real product
                  environment with an existing codebase, team conventions, code
                  reviews, and production requirements.
                </p>

                <p className="mt-4 leading-8 text-[#625a73]">
                  Instead of building isolated demo features, I contributed to
                  parts of the platform used for podcast editing and publishing.
                  This helped me understand how frontend, backend, and product
                  decisions connect in a fullstack application.
                </p>
              </div>

              <div className="rounded-3xl bg-[#fffaf3] p-6 shadow-sm">
                <p className="text-xs font-black uppercase tracking-[0.3em] text-[#8d67cf]">
                  Key work
                </p>

                <h3 className="mt-3 font-display text-2xl font-bold">
                  What I contributed
                </h3>

                <p className="mt-4 leading-8 text-[#625a73]">
                  My main contributions were audio waveform visualization, a
                  video track strip, sound effects and music support, publish
                  toggles for intro/outro and watermark settings, and refactoring
                  parts of the codebase.
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-[#eadfcc] bg-[#fffaf3] p-6 md:p-10">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-[#8d67cf]">
              Contributions
            </p>

            <h2 className="mt-3 font-display text-3xl font-bold md:text-4xl">
              Features I worked on
            </h2>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {contributions.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className={`group rounded-3xl ${item.color} p-5 shadow-sm transition duration-300 hover:-translate-y-2 hover:scale-[1.02] hover:shadow-xl`}
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#8d67cf] shadow transition duration-300 group-hover:rotate-6 group-hover:scale-110">
                      <Icon className="h-5 w-5" />
                    </div>

                    <h3 className="mt-4 font-display text-xl font-bold transition duration-300 group-hover:text-[#8d67cf]">
                      {item.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-[#625a73]">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="border-t border-[#eadfcc] p-6 md:p-10">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-[#8d67cf]">
              Tech Stack
            </p>

            <h2 className="mt-3 font-display text-3xl font-bold md:text-4xl">
              Technologies I used
            </h2>

            <p className="mt-4 max-w-3xl leading-8 text-[#625a73]">
              I worked with a modern fullstack setup using Next.js, TypeScript,
              FastAPI, Python, AI workflows, and production development tools.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              {techStack.map((tech) => (
                <span
                  key={tech}
                  className="cursor-default rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#7a4d77] shadow transition duration-300 hover:-translate-y-1 hover:scale-105 hover:bg-[#3b2a45] hover:text-white hover:shadow-lg"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="border-t border-[#eadfcc] bg-[#fffaf3] p-6 md:p-10">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.3em] text-[#8d67cf]">
                  Preview
                </p>

                <h2 className="mt-3 font-display text-3xl font-bold md:text-4xl">
                  Website preview
                </h2>

                <p className="mt-4 max-w-2xl leading-8 text-[#625a73]">
                  A few screenshots from the PodManager.ai website and platform.
                </p>
              </div>

              <a
                href="https://www.podmanager.ai/"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex w-fit items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#7a4d77] shadow transition duration-300 hover:-translate-y-1 hover:bg-[#8d67cf] hover:text-white hover:shadow-xl"
              >
                Open live site
                <ExternalLink className="h-4 w-4 transition duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
              </a>
            </div>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <a
                href="/projects/podmanager/image-1.png"
                target="_blank"
                rel="noopener noreferrer"
                className="group block overflow-hidden rounded-3xl bg-white shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
              >
                <div className="relative">
                  <img
                    src="/projects/podmanager/image-1.png"
                    alt="Screenshot of the PodManager.ai website homepage"
                    className="h-72 w-full object-cover transition duration-500 group-hover:scale-110"
                  />

                  <div className="absolute inset-0 flex items-center justify-center bg-[#3b2a45]/0 transition duration-300 group-hover:bg-[#3b2a45]/40">
                    <span className="translate-y-4 rounded-full bg-white px-5 py-3 text-sm font-bold text-[#3b2a45] opacity-0 shadow transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                      View screenshot
                    </span>
                  </div>
                </div>
              </a>

              <a
                href="/projects/podmanager/image-2.png"
                target="_blank"
                rel="noopener noreferrer"
                className="group block overflow-hidden rounded-3xl bg-white shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
              >
                <div className="relative">
                  <img
                    src="/projects/podmanager/image-2.png"
                    alt="Screenshot of the PodManager.ai platform interface"
                    className="h-72 w-full object-cover transition duration-500 group-hover:scale-110"
                  />

                  <div className="absolute inset-0 flex items-center justify-center bg-[#3b2a45]/0 transition duration-300 group-hover:bg-[#3b2a45]/40">
                    <span className="translate-y-4 rounded-full bg-white px-5 py-3 text-sm font-bold text-[#3b2a45] opacity-0 shadow transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                      View screenshot
                    </span>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}