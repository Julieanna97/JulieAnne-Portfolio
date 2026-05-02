import Link from "next/link";
import { ArrowRight, Frown, Home } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { Polaroid, Tape } from "@/components/Scrap";

export default function NotFound() {
  return (
    <PageShell number="08" title="404 Page" variant="hero">
      <section className="relative grid flex-1 items-center gap-10 lg:grid-cols-[1fr_420px]">
        <div className="absolute inset-0 mountain" />
        <div className="lighthouse" />
        <div className="relative z-10 max-w-xl px-7 sm:px-12">
          <h1 className="font-hand text-7xl">Lost? <Frown className="inline" size={54} /></h1>
          <p className="mt-8 font-mono text-lg leading-8 text-paper/85">Looks like you’ve wandered off the beaten path.</p>
          <div className="paper relative mt-10 max-w-sm rotate-[-5deg] p-8 font-hand text-2xl text-ink">
            <Tape className="-top-3 left-16" />
            Let’s get you back home. ♡
          </div>
          <Link href="/" className="mt-10 inline-flex items-center gap-3 bg-lavender px-8 py-4 font-hand text-2xl text-black shadow-paper">Go Home <ArrowRight /></Link>
        </div>
        <div className="relative z-10 hidden lg:block">
          <Polaroid caption="This way home." rotate="rotate-6" />
          <div className="mt-10 flex items-center justify-end gap-3 font-hand text-3xl text-paper"><Home /> HOME →</div>
        </div>
      </section>
    </PageShell>
  );
}
