import { Code2, Heart, Layers, Lightbulb, Star } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { Paper, Polaroid, Tape } from "@/components/Scrap";
import { skillGroups } from "@/data/content";

export default function Skills() {
  return (
    <PageShell number="04" title="Skills" variant="dark">
      <section className="relative grid flex-1 items-center gap-10 lg:grid-cols-[1fr_360px]">
        <Paper className="p-8 sm:p-10">
          <Tape className="-top-2 left-12" />
          <h1 className="inline-block bg-lavender/35 px-6 py-2 font-hand text-5xl">Skills</h1>
          <Star className="black-doodle absolute left-[34%] top-9" size={34} />
          <div className="mt-8 grid gap-8 sm:grid-cols-2">
            {skillGroups.map(([title, ...items]) => (
              <div key={title}>
                <h2 className="mb-3 font-hand text-2xl">{title}</h2>
                <ul className="space-y-2 font-mono text-sm leading-6">
                  {items.map((item) => <li key={item}>• {item}</li>)}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-10 grid gap-5 text-center sm:grid-cols-4">
            {[ [Heart, "Empathy in Design"], [Code2, "Clean Code"], [Layers, "Learning"], [Lightbulb, "Impact"] ].map(([Icon, label]: any) => (
              <div key={label} className="font-hand text-lg"><Icon className="mx-auto mb-2" />{label}</div>
            ))}
          </div>
        </Paper>
        <div className="relative mx-auto max-w-xs">
          <Polaroid caption="Keep building." rotate="rotate-6" />
        </div>
      </section>
    </PageShell>
  );
}
