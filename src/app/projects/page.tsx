import { ArrowRight, Coffee, Heart, Star } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { Paper, ProjectPhoto, Tape } from "@/components/Scrap";
import { projects } from "@/data/content";

export default function Projects() {
  return (
    <PageShell number="03" title="Projects" variant="dark">
      <section className="relative mx-auto w-full max-w-5xl flex-1 pb-10">
        <h1 className="inline-block rotate-[-2deg] bg-paper px-12 py-4 font-hand text-5xl text-ink shadow-paper">Projects</h1>
        <Star className="star-doodle absolute left-72 top-4" size={42} />
        <Star className="star-doodle absolute right-20 top-8" size={20} />
        <p className="mt-5 font-hand text-2xl text-paper/80">Things I’ve built with love <Heart className="inline" size={22} /></p>

        <div className="mt-6 grid gap-5">
          {projects.map((project, index) => (
            <Paper key={project.title} className="grid gap-5 p-4 sm:grid-cols-[260px_1fr]">
              {index === 0 && <Tape className="right-10 top-2" />}
              <div className="polaroid rotate-[-1deg] p-3 pb-3">
                <ProjectPhoto tone={project.tone} />
              </div>
              <div className="py-2">
                <h2 className="font-hand text-3xl">{project.title}</h2>
                <div className="mt-2 flex flex-wrap gap-2">
                  {project.tags.map((tag) => <span className="bg-black/10 px-2 py-1 font-mono text-xs" key={tag}>{tag}</span>)}
                </div>
                <p className="mt-4 font-mono text-sm leading-7 sm:text-base">{project.desc}</p>
                <a href="#" className="mt-4 inline-flex items-center gap-2 font-hand text-xl text-lavender">View Project <ArrowRight size={18} /></a>
              </div>
            </Paper>
          ))}
        </div>
        <p className="mt-5 text-center font-hand text-xl text-paper/70">More coming soon ... 🦋</p>
        <Coffee className="absolute bottom-10 right-2 text-paper/45" size={44} />
      </section>
    </PageShell>
  );
}
