import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";

export default function PodManagerPage() {
  return (
    <main className="min-h-screen bg-[#fff7ec] px-5 py-10 text-[#3b2a45]">
      <section className="mx-auto max-w-6xl">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#7a4d77] shadow"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to projects
        </Link>

        <div className="mt-10 rounded-[2rem] bg-white/75 p-6 shadow-xl backdrop-blur-md md:p-10">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-[#8d67cf]">
            Production Internship · Fullstack
          </p>

          <h1 className="mt-4 font-display text-4xl font-bold md:text-6xl">
            PodManager.ai
          </h1>

          <p className="mt-6 max-w-3xl leading-8 text-[#625a73]">
            During my internship at PodManager.ai, I worked inside an existing
            production codebase using Next.js, TypeScript, FastAPI, and AI-based
            workflows. I contributed to features around recording, editing,
            marketplace functionality, and real production development.
          </p>

          <a
            href="https://www.podmanager.ai/"
            target="_blank"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#3b2a45] px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:scale-105"
          >
            Visit PodManager.ai
            <ExternalLink className="h-4 w-4" />
          </a>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-[#f8dfe8] p-5">
              <h2 className="font-bold">My role</h2>
              <p className="mt-2 text-sm leading-6 text-[#625a73]">
                Fullstack intern working with frontend, backend, and production
                workflows.
              </p>
            </div>

            <div className="rounded-2xl bg-[#d8d5ff] p-5">
              <h2 className="font-bold">Tech stack</h2>
              <p className="mt-2 text-sm leading-6 text-[#625a73]">
                Next.js, TypeScript, FastAPI, Python, AI workflows, and
                production code reviews.
              </p>
            </div>

            <div className="rounded-2xl bg-[#fff0c9] p-5">
              <h2 className="font-bold">What I learned</h2>
              <p className="mt-2 text-sm leading-6 text-[#625a73]">
                I learned how to work in a real production environment with team
                conventions, code reviews, and deployment workflows.
              </p>
            </div>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <img
              src="/projects/podmanager/image-1.jpg"
              alt="PodManager project image 1"
              className="rounded-3xl object-cover shadow-lg"
            />
            <img
              src="/projects/podmanager/image-2.jpg"
              alt="PodManager project image 2"
              className="rounded-3xl object-cover shadow-lg"
            />
          </div>
        </div>
      </section>
    </main>
  );
}