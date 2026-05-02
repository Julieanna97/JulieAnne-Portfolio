import { Heart, Star } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { Paper, ScenicPhoto, Tape } from "@/components/Scrap";
import { journey } from "@/data/content";

export default function Journey() {
  return (
    <PageShell number="05" title="Journey" variant="dark">
      <section className="relative grid flex-1 items-center gap-10 lg:grid-cols-[1fr_380px]">
        <Paper className="p-8 sm:p-10">
          <Tape className="-top-2 left-12" />
          <h1 className="inline-block bg-lavender/35 px-6 py-2 font-hand text-5xl">My Journey</h1>
          <p className="mt-4 font-hand text-2xl">A few chapters so far...</p>
          <Star className="black-doodle absolute right-16 top-16" size={42} />

          <div className="mt-8 space-y-6 border-l-2 border-lavender pl-7">
            {journey.map((item) => (
              <div key={`${item.year}-${item.title}`} className="relative">
                <span className="absolute -left-[36px] top-1 h-4 w-4 rounded-full bg-lavender" />
                <p className="font-mono text-xs text-black/55">{item.year}</p>
                <h2 className="font-hand text-2xl">{item.title}</h2>
                <p className="mt-1 font-mono text-sm leading-6">{item.text}</p>
              </div>
            ))}
          </div>
        </Paper>

        <div className="space-y-8">
          <div className="polaroid rotate-6 p-3 pb-8">
            <ScenicPhoto tone="sunset" />
          </div>
          <div className="paper relative rotate-[-3deg] p-6 font-hand text-xl leading-8 text-ink shadow-paper">
            <Tape className="-top-3 left-12 tape-small" />
            Every step, every bug, every late night — they all shaped me. <Heart className="mt-2" />
          </div>
        </div>
      </section>
    </PageShell>
  );
}
