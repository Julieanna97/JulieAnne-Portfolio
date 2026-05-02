import Image from "next/image";
import { Star } from "lucide-react";

export function Tape({ className = "" }: { className?: string }) {
  return <span className={`tape ${className}`} />;
}

export function Paper({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`paper torn relative ${className}`}>{children}</div>;
}

export function Polaroid({ caption, className = "", rotate = "rotate-3" }: { caption: string; className?: string; rotate?: string }) {
  return (
    <div className={`polaroid ${rotate} ${className}`}>
      <div className="relative aspect-[4/4] w-full overflow-hidden bg-black/10">
        <Image src="/avatar.jpg" alt="Julie Anne portrait" fill className="object-cover" priority />
      </div>
      <p className="mt-3 text-center font-hand text-lg leading-tight text-ink">{caption}</p>
    </div>
  );
}

export function ScenicPhoto({ tone = "sunset", className = "" }: { tone?: "sunset" | "night" | "library" | "purple"; className?: string }) {
  const toneClass = {
    sunset: "from-orange-200 via-slate-600 to-zinc-950",
    night: "from-cyan-950 via-slate-950 to-red-950",
    library: "from-amber-950 via-stone-900 to-black",
    purple: "from-indigo-950 via-zinc-900 to-purple-800"
  }[tone];

  return (
    <div className={`relative min-h-44 overflow-hidden bg-gradient-to-br ${toneClass} mountain ${className}`}>
      <div className="lighthouse" />
      <div className="forest">
        {Array.from({ length: 12 }).map((_, i) => (
          <span key={i} style={{ left: `${i * 9}%`, height: `${50 + (i % 5) * 16}px`, opacity: .55 + (i % 4) * .1 }} />
        ))}
      </div>
      <div className="absolute left-8 top-8 h-12 w-12 rounded-full bg-orange-200/80 blur-sm" />
      <div className="absolute inset-0 bg-black/15" />
    </div>
  );
}

export function ProjectPhoto({ tone = "red" }: { tone?: string }) {
  const classes: Record<string, string> = {
    red: "from-black via-red-950 to-orange-950",
    purple: "from-black via-indigo-950 to-purple-900",
    blue: "from-black via-slate-900 to-cyan-950"
  };

  return (
    <div className={`relative h-full min-h-44 overflow-hidden bg-gradient-to-br ${classes[tone] || classes.red}`}>
      <div className="absolute left-5 top-7 h-20 w-28 rounded-sm border border-red-300/40 bg-black/35" />
      <div className="absolute bottom-0 left-0 h-20 w-full bg-black/45" />
      <div className="absolute bottom-8 left-7 h-16 w-20 bg-orange-200/20 blur-xl" />
      <div className="absolute right-7 top-10 h-8 w-8 rounded-full bg-white/45 blur-sm" />
      <p className="absolute left-7 top-10 font-hand text-lg text-red-200/80">case study</p>
    </div>
  );
}

export function Doodles({ dark = false }: { dark?: boolean }) {
  const cls = dark ? "star-doodle" : "black-doodle";
  return (
    <>
      <Star className={`absolute left-[16%] top-[8%] ${cls}`} size={34} />
      <Star className={`absolute right-[12%] top-[18%] ${cls}`} size={20} />
      <Star className={`absolute bottom-[12%] left-[9%] ${cls}`} size={22} />
    </>
  );
}
