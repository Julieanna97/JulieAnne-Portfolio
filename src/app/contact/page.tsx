import { Github, Instagram, Linkedin, Mail, MapPin, Send, Star } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { Paper, Polaroid, Tape } from "@/components/Scrap";
import { person } from "@/data/content";

export default function Contact() {
  return (
    <PageShell number="07" title="Contact" variant="dark">
      <section className="relative grid flex-1 items-center gap-10 lg:grid-cols-[1fr_470px]">
        <Star className="star-doodle absolute left-[32%] top-[7%]" size={40} />
        <div>
          <h1 className="font-hand text-6xl">Let’s Connect ♡</h1>
          <p className="mt-5 max-w-md font-mono leading-7 text-paper/85">
            I’m currently open to junior developer roles, internships, new opportunities, and collaborations.
          </p>
          <div className="mt-10 space-y-5 font-mono text-paper/90">
            <p className="flex items-center gap-4"><Mail /> {person.email}</p>
            <p className="flex items-center gap-4"><Instagram /> @code.with.julie</p>
            <p className="flex items-center gap-4"><Github /> {person.github}</p>
            <p className="flex items-center gap-4"><Linkedin /> {person.linkedin}</p>
            <p className="flex items-center gap-4"><MapPin /> {person.location}</p>
          </div>
          <div className="mt-12 max-w-xs rotate-[-2deg] bg-lavender/80 p-5 font-hand text-xl text-black shadow-paper">
            Feel free to say hi! I don’t bite. ☺
          </div>
        </div>

        <Paper className="p-8">
          <Tape className="-top-3 left-20" />
          <form className="space-y-3">
            <input className="field" placeholder="Your Name" />
            <input className="field" placeholder="Your Email" type="email" />
            <input className="field" placeholder="Subject" />
            <textarea className="field min-h-40 resize-none" placeholder="Message" />
            <button className="mt-4 inline-flex items-center gap-3 bg-lavender px-8 py-3 font-hand text-xl text-black shadow-paper" type="button">
              Send Message <Send size={18} />
            </button>
          </form>
        </Paper>

        <Polaroid className="absolute bottom-6 left-10 hidden w-52 opacity-85 lg:block" caption="Say hello." rotate="rotate-[-7deg]" />
      </section>
    </PageShell>
  );
}
