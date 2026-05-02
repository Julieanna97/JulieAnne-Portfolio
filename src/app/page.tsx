import Link from "next/link";
import { ArrowRight, Heart, Star } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { Polaroid, ScenicPhoto, Tape } from "@/components/Scrap";
import { person } from "@/data/content";

export default function Home() {
  return (
    <PageShell number="01" title="Home" variant="hero">
      <section className="relative grid flex-1 overflow-hidden rounded-sm lg:grid-cols-[1fr_470px]">
        <div className="absolute inset-0 mountain" />
        <div className="lighthouse" />
        <Star className="star-doodle absolute left-[9%] top-[8%]" size={32} />
        <Star className="star-doodle absolute left-[31%] top-[36%]" size={35} />
        <Star className="star-doodle absolute right-[13%] top-[9%]" size={17} />

        <div className="relative z-10 flex min-h-[820px] flex-col justify-center px-7 pb-32 pt-16 sm:px-14 lg:pb-20">
          <p className="font-hand text-2xl text-paper/80">EP. 01 ☆</p>
          <h1 className="mt-20 max-w-2xl font-hand text-5xl leading-tight text-paper sm:text-7xl">
            Hi, I’m
            <span className="block text-lavender drop-shadow">{person.name}</span>
          </h1>
          <div className="mt-5 w-fit rotate-[-1deg] bg-paper px-5 py-2 font-mono text-base text-ink shadow-paper sm:text-lg">
            {person.role}
          </div>
          <p className="mt-8 max-w-xl font-mono text-base leading-8 text-paper/90">
            I build meaningful, scalable and beautiful web experiences with clean code, thoughtful design, and a creative mind.
          </p>
          <Link href="/projects" className="mt-8 inline-flex w-fit items-center gap-3 bg-lavender px-7 py-4 font-hand text-xl text-black shadow-paper transition hover:-translate-y-1">
            Explore My Work <ArrowRight size={20} />
          </Link>
        </div>

        <div className="relative z-10 hidden items-end justify-center pb-24 lg:flex">
          <div className="relative h-[620px] w-[310px]">
            <div className="absolute bottom-0 left-1/2 h-[520px] w-[210px] -translate-x-1/2 rounded-t-full bg-black/40 blur-xl" />
            <div className="absolute bottom-4 left-1/2 h-[500px] w-[170px] -translate-x-1/2 rounded-t-[90px] bg-gradient-to-b from-zinc-800 to-black shadow-2xl" />
            <div className="absolute bottom-[440px] left-1/2 h-28 w-28 -translate-x-1/2 rounded-full bg-[#2b211d]" />
            <div className="absolute bottom-[250px] left-[89px] h-64 w-32 rounded-full border-[18px] border-zinc-700/80" />
          </div>
        </div>

        <div className="paper absolute bottom-8 left-8 z-20 max-w-xs rotate-[-5deg] p-6 font-hand text-xl leading-8 text-ink shadow-paper sm:left-12">
          <Tape className="-top-4 left-12" />
          I believe in ordinary moments making extraordinary stories. <Heart className="mt-3" />
        </div>

        <div className="absolute bottom-8 right-10 z-20 hidden w-64 rotate-[-4deg] sm:block">
          <div className="polaroid p-3 pb-8">
            <ScenicPhoto tone="sunset" className="min-h-44" />
          </div>
        </div>
      </section>
    </PageShell>
  );
}
