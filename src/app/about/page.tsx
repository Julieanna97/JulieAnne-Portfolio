import { Camera, Heart, Star } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { Paper, Polaroid, Tape } from "@/components/Scrap";
import { person, skillGroups } from "@/data/content";

export default function About() {
  const toolkit = skillGroups.flatMap(([_, ...items]) => items).slice(0, 12);

  return (
    <PageShell number="02" title="About Me" variant="paper">
      <section className="relative grid flex-1 items-center gap-10 lg:grid-cols-[1fr_420px]">
        <Paper className="notebook min-h-[720px] p-8 sm:p-12">
          <Tape className="-top-3 left-14" />
          <h1 className="inline-block rotate-[-1deg] bg-lavender/35 px-6 py-2 font-hand text-5xl">About Me</h1>
          <Star className="black-doodle absolute left-[38%] top-12" size={27} />

          <div className="mt-8 max-w-2xl space-y-6 font-mono text-sm leading-7 sm:text-base">
            <p>{person.intro}</p>
            <p>{person.softer}</p>
          </div>

          <Camera className="mt-9 text-black/35" size={48} />

          <div className="mt-14 rotate-[-1deg] bg-lavender/20 p-6 shadow-soft">
            <h2 className="font-hand text-3xl">My Toolkit</h2>
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
              {toolkit.map((item) => (
                <div key={item} className="grid min-h-16 place-items-center bg-paperLight p-2 text-center font-mono text-xs shadow-soft">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </Paper>

        <div className="relative mx-auto w-full max-w-sm">
          <Polaroid caption="Collect moments, not things." rotate="rotate-6" />
          <Heart className="black-doodle absolute -bottom-8 right-6" size={30} />
        </div>
      </section>
    </PageShell>
  );
}
