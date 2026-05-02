import { ArrowRight, Coffee, Heart } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { Paper, ScenicPhoto, Tape } from "@/components/Scrap";
import { posts } from "@/data/content";

export default function Journal() {
  return (
    <PageShell number="06" title="Journal / Blog" variant="paper">
      <section className="relative mx-auto w-full max-w-4xl flex-1">
        <Paper className="p-8 sm:p-10">
          <Tape className="-top-2 left-12" />
          <h1 className="font-hand text-5xl">Journal <Heart className="inline text-black/35" /></h1>
          <p className="mt-3 font-hand text-xl">Thoughts, learnings and everything in between.</p>

          <div className="mt-8 grid gap-5">
            {posts.map((post, index) => (
              <article key={post.title} className="paper grid gap-5 p-4 sm:grid-cols-[170px_1fr]">
                <ScenicPhoto tone={index === 1 ? "night" : "sunset"} className="min-h-40" />
                <div>
                  <p className="font-mono text-xs uppercase text-black/50">{post.date}</p>
                  <h2 className="font-hand text-2xl">{post.title}</h2>
                  <p className="mt-2 font-mono text-sm leading-6">{post.desc}</p>
                  <a href="#" className="mt-3 inline-flex items-center gap-2 font-hand text-xl text-lavender">Read More <ArrowRight size={16} /></a>
                </div>
              </article>
            ))}
          </div>
          <p className="mt-5 text-center font-hand text-xl text-lavender">View all posts →</p>
          <Coffee className="black-doodle absolute bottom-8 right-10" size={54} />
        </Paper>
      </section>
    </PageShell>
  );
}
