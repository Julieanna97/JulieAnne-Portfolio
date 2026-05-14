"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  Box,
  Code2,
  Heart,
  Music,
  Palette,
  Sparkles,
} from "lucide-react";

const OUTLINE = "#3a2e3f";
const OUTLINE_THIN = "rgba(58, 46, 63, 0.85)";

export default function CreditsPage() {
  return (
    <main
      className="relative min-h-screen w-full overflow-hidden"
      style={{
        background:
          "radial-gradient(circle at 20% 72%, rgba(255, 170, 190, 0.4), transparent 32%), radial-gradient(circle at 78% 68%, rgba(151, 207, 255, 0.35), transparent 34%), radial-gradient(circle at 50% 18%, rgba(255, 239, 204, 0.6), transparent 38%), linear-gradient(180deg, #fff7ec 0%, #f8dfe8 48%, #d8d5ff 100%)",
      }}
    >
      {/* Soft ambient blobs */}
      <div className="pointer-events-none absolute -left-20 top-20 h-72 w-72 rounded-full bg-pink-300/25 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-1/3 h-80 w-80 rounded-full bg-blue-300/25 blur-3xl" />
      <div className="pointer-events-none absolute bottom-1/4 left-1/3 h-72 w-72 rounded-full bg-yellow-200/20 blur-3xl" />

      <Wall />

      {/* Back button only */}
      <Link
        href="/?from=credits"
        className="fixed left-6 bottom-6 z-50 inline-flex w-fit items-center gap-2 rounded-full border border-white/70 bg-white/90 px-5 py-3 text-sm font-semibold text-[#7a4d77] shadow-lg backdrop-blur-xl transition hover:scale-105 hover:bg-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to room
      </Link>

      {/* Kitchen scene */}
      <div className="relative z-10 flex w-full items-end justify-center px-3 pb-24 pt-4 md:px-6 md:pt-6">
        <div className="relative flex w-full max-w-[2000px] items-end justify-center gap-3">
          <Ladder />
          <Door />
          <KitchenWall />
          <Fridge />
        </div>
      </div>

      <Floor />
      <SceneStyles />
    </main>
  );
}

/* ============================================================
   WALL
   ============================================================ */
function Wall() {
  return <div className="pointer-events-none absolute inset-x-0 top-0 h-[55%] w-full" />;
}

/* ============================================================
   FLOOR
   ============================================================ */
function Floor() {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40">
      <div
        className="h-full w-full"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, #ece8d3 55%, #dcd7a8 100%)",
          borderTop: `3px solid ${OUTLINE}`,
        }}
      />
    </div>
  );
}

/* ============================================================
   LADDER
   ============================================================ */
function Ladder() {
  return (
    <div className="relative hidden h-[760px] w-[140px] shrink-0 lg:block">
      <div
        className="absolute left-4 top-0 h-full w-5"
        style={{
          background: "linear-gradient(180deg, #c9a98d 0%, #a88766 100%)",
          border: `2.5px solid ${OUTLINE}`,
          borderRadius: 4,
          transform: "skewX(-3deg)",
        }}
      />

      <div
        className="absolute right-4 top-0 h-full w-5"
        style={{
          background: "linear-gradient(180deg, #c9a98d 0%, #a88766 100%)",
          border: `2.5px solid ${OUTLINE}`,
          borderRadius: 4,
          transform: "skewX(-3deg)",
        }}
      />

      {Array.from({ length: 7 }).map((_, index) => (
        <div
          key={index}
          className="absolute left-4"
          style={{
            top: `${10 + index * 13}%`,
            width: 108,
            height: 16,
            background: "#d9bd9a",
            border: `2.5px solid ${OUTLINE}`,
            borderRadius: 3,
            transform: "skewX(-3deg)",
          }}
        />
      ))}
    </div>
  );
}

/* ============================================================
   DOOR
   ============================================================ */
function Door() {
  return (
    <div
      className="relative hidden h-[760px] w-[240px] shrink-0 md:block"
      style={{
        border: `3px solid ${OUTLINE}`,
        borderRadius: "6px 6px 0 0",
        background: "#d5bc9e",
        boxShadow: "inset 0 0 0 8px #b89878",
      }}
    >
      <div className="absolute inset-5 grid grid-cols-2 grid-rows-4 gap-2.5">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            style={{
              background: "#e8e8f0",
              border: `2px solid ${OUTLINE_THIN}`,
              borderRadius: 3,
              boxShadow:
                "inset 2px 2px 0 rgba(255,255,255,0.6), inset -1px -1px 0 rgba(180,180,200,0.3)",
            }}
          />
        ))}
      </div>

      <div
        className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 rounded-full"
        style={{
          background: "#2c2336",
          border: `2px solid ${OUTLINE}`,
        }}
      />

      <div
        className="absolute right-7 top-[58%] h-20 w-2 rounded-full"
        style={{
          background: "linear-gradient(180deg, #d0d0d0 0%, #888 100%)",
          border: `1.5px solid ${OUTLINE_THIN}`,
        }}
      />
    </div>
  );
}

/* ============================================================
   KITCHEN WALL
   ============================================================ */
function KitchenWall() {
  return (
    <div className="relative flex h-[760px] w-full max-w-[1200px] flex-1 flex-col">
      <WallClock />
      <WallPlant />
      <CreditsBoard />

      <SubwayTiles />

      {/* Upper cabinets */}
      <div className="relative z-10 mb-1.5 flex h-56 gap-2 px-1">
        <UpperCabinet
          icon={<Code2 className="h-4 w-4" />}
          title="Frontend"
          items={["React", "Next.js", "TypeScript", "Tailwind"]}
        />
        <UpperCabinet
          icon={<Box className="h-4 w-4" />}
          title="3D Stack"
          items={["Three.js", "R3F", "Drei", "GLB models"]}
        />
        <UpperCabinet
          icon={<Sparkles className="h-4 w-4" />}
          title="Motion"
          items={["GSAP", "Camera zooms", "Page transitions"]}
        />
        <UpperCabinet
          icon={<Palette className="h-4 w-4" />}
          title="Visuals"
          items={["Pastel palette", "Cloud UI", "Cozy details"]}
        />
      </div>

      <div
        className="relative z-10 h-4"
        style={{
          background: "#f4ecd9",
          borderTop: `2.5px solid ${OUTLINE}`,
          borderBottom: `2.5px solid ${OUTLINE}`,
        }}
      />

      {/* Countertop */}
      <div
        className="relative z-10 flex h-44 items-end gap-4 px-4 pb-2"
        style={{ background: "#f4ecd9" }}
      >
        <Stove />
        <JarSet />
        <Sink />
      </div>

      <div
        className="relative z-10 h-3"
        style={{
          background: "#e5d8b8",
          borderTop: `2px solid ${OUTLINE_THIN}`,
        }}
      />

      {/* Lower cabinets */}
      <div className="relative z-10 flex h-[290px] gap-2 px-1 pt-1.5">
        <MiniSideShelf />
        <Dishwasher />
        <LowerCabinets />
      </div>
    </div>
  );
}

/* ============================================================
   WALL DECORATIONS
   ============================================================ */
function WallClock() {
  return (
    <div
      className="absolute left-8 top-2 z-20 flex h-20 w-20 items-center justify-center rounded-full"
      style={{
        background: "#fdfbf3",
        border: `3px solid ${OUTLINE}`,
        boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
      }}
    >
      <div className="relative h-full w-full">
        {[0, 90, 180, 270].map((angle) => (
          <div
            key={angle}
            className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#3a2e3f]"
            style={{
              transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-28px)`,
            }}
          />
        ))}

        <div
          className="absolute left-1/2 top-1/2 h-6 w-1 -translate-x-1/2 origin-bottom rounded-full bg-[#3a2e3f]"
          style={{ transform: "translate(-50%, -100%) rotate(45deg)" }}
        />

        <div
          className="absolute left-1/2 top-1/2 h-8 w-0.5 -translate-x-1/2 origin-bottom rounded-full bg-[#3a2e3f]"
          style={{ transform: "translate(-50%, -100%) rotate(135deg)" }}
        />

        <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#8d67cf]" />
      </div>
    </div>
  );
}

function WallPlant() {
  return (
    <div className="absolute right-6 top-0 z-20 flex flex-col items-center">
      <div className="relative h-16 w-20">
        <div
          className="absolute left-1/2 top-0 h-12 w-3 -translate-x-1/2 -rotate-12 rounded-full"
          style={{ background: "#7da06a", border: `2px solid ${OUTLINE}` }}
        />
        <div
          className="absolute left-1/2 top-1 h-14 w-3 -translate-x-1/2 rounded-full"
          style={{ background: "#95b58a", border: `2px solid ${OUTLINE}` }}
        />
        <div
          className="absolute left-1/2 top-0 h-12 w-3 -translate-x-1/2 rotate-12 rounded-full"
          style={{ background: "#7da06a", border: `2px solid ${OUTLINE}` }}
        />
      </div>

      <div
        className="-mt-2 h-8 w-12 rounded-b-md"
        style={{
          background: "linear-gradient(180deg, #d4a8a8 0%, #b88888 100%)",
          border: `2.5px solid ${OUTLINE}`,
        }}
      />
    </div>
  );
}

function CreditsBoard() {
  return (
    <div className="pointer-events-none absolute left-1/2 top-2 z-20 -translate-x-1/2 -rotate-2">
      <div
        className="absolute -top-3 left-1/2 h-6 w-16 -translate-x-1/2 rotate-[6deg] opacity-80"
        style={{ background: "#c4a8d4" }}
      />

      <div
        className="rounded-sm bg-[#fdfbf3] px-10 py-4 text-center"
        style={{
          border: `3px solid ${OUTLINE}`,
          boxShadow: "4px 5px 0 rgba(58,46,63,0.12)",
          backgroundImage:
            "repeating-linear-gradient(180deg, transparent 0, transparent 22px, rgba(180,160,200,0.15) 22px, rgba(180,160,200,0.15) 23px)",
        }}
      >
        <p
          className="font-display text-2xl font-bold text-[#8d67cf]"
          style={{ letterSpacing: "0.05em" }}
        >
          Credits
        </p>

        <div className="mt-1 flex justify-center gap-2 text-base">
          <span className="text-[#ff8aaf]">♡</span>
          <span className="text-[#c4a8d4]">✿</span>
          <span className="text-[#ff8aaf]">♡</span>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   SUBWAY TILES
   ============================================================ */
function SubwayTiles() {
  return (
    <div
      className="relative z-0 h-28"
      style={{
        backgroundImage: `
          repeating-linear-gradient(
            0deg,
            #ffffff 0px,
            #ffffff 22px,
            #c8c0b0 22px,
            #c8c0b0 24px
          ),
          repeating-linear-gradient(
            90deg,
            #ffffff 0px,
            #ffffff 44px,
            #c8c0b0 44px,
            #c8c0b0 46px
          )
        `,
        backgroundBlendMode: "multiply",
        borderBottom: `2.5px solid ${OUTLINE_THIN}`,
      }}
    />
  );
}

/* ============================================================
   UPPER CABINET
   ============================================================ */
function UpperCabinet({
  icon,
  title,
  items,
}: {
  icon: React.ReactNode;
  title: string;
  items: string[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="clickable-ware relative flex-1 overflow-hidden rounded-sm"
      style={{
        background: "#dccdb8",
        border: `2.5px solid ${OUTLINE}`,
        perspective: "900px",
      }}
    >
      {/* Content inside */}
      <div
        className={`absolute inset-x-4 top-10 bottom-3 z-10 transition-all duration-700 ${
          open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        }`}
      >
        <div className="flex items-center gap-1.5 text-[#8d67cf]">
          {icon}
          <p className="text-xs font-black uppercase tracking-[0.18em]">
            {title}
          </p>
        </div>

        <div className="mt-2 space-y-1 text-sm font-semibold leading-tight text-[#5a3a6e]">
          {items.map((item) => (
            <p key={item}>♡ {item}</p>
          ))}
        </div>
      </div>

      {/* Door */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="absolute inset-0 z-20 rounded-sm transition-transform duration-700"
        style={{
          transform: open
            ? "translateY(-86%) rotateX(-6deg)"
            : "translateY(0) rotateX(0deg)",
          transformStyle: "preserve-3d",
          background: "linear-gradient(180deg, #faf2e0 0%, #ebdcc0 100%)",
          border: `2.5px solid ${OUTLINE}`,
          transitionTimingFunction: "cubic-bezier(0.22, 0.61, 0.36, 1)",
        }}
      >
        <div
          className={`absolute left-1/2 top-6 flex -translate-x-1/2 flex-col items-center gap-1.5 text-[#5a3a6e] transition-opacity duration-300 ${
            open ? "opacity-0" : "opacity-100"
          }`}
        >
          {icon}
          <p className="text-xs font-black uppercase tracking-[0.18em]">
            {title}
          </p>
        </div>

        <div
          className="absolute bottom-4 left-1/2 h-2 w-16 -translate-x-1/2 rounded-full"
          style={{
            background: "#8a6e4a",
            border: `1.5px solid ${OUTLINE}`,
          }}
        />

        {!open && (
          <span className="absolute bottom-9 left-1/2 -translate-x-1/2 text-[10px] font-black uppercase tracking-[0.3em] text-[#8a7259]/55">
            click to open
          </span>
        )}
      </button>
    </div>
  );
}

/* ============================================================
   STOVE
   ============================================================ */
function Stove() {
  return (
    <div
      className="relative h-20 w-52 shrink-0 rounded-sm"
      style={{
        background: "#2c2730",
        border: `2.5px solid ${OUTLINE}`,
      }}
    >
      <div className="absolute inset-2 grid grid-cols-2 gap-2">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-full"
            style={{
              background:
                "radial-gradient(circle, #ff7a4a 0%, #c64a2a 65%, #1a1a1a 100%)",
              border: `1.5px solid ${OUTLINE_THIN}`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   JAR SET
   ============================================================ */
function JarSet() {
  return (
    <div className="flex h-32 shrink-0 items-end gap-2">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="relative flex flex-col items-center">
          <div
            className="h-3 w-10"
            style={{
              background: "#b89878",
              border: `2px solid ${OUTLINE}`,
              borderRadius: 2,
            }}
          />
          <div
            className="h-20 w-10 rounded-b-sm"
            style={{
              background: "#fdfbf3",
              border: `2px solid ${OUTLINE}`,
              borderTop: "none",
            }}
          />
        </div>
      ))}
    </div>
  );
}

/* ============================================================
   SINK
   ============================================================ */
function Sink() {
  return (
    <div className="relative h-32 flex-1 shrink-0">
      <div className="absolute left-1/2 top-0 -translate-x-1/2">
        <div
          className="mx-auto h-14 w-2 rounded"
          style={{
            background: "linear-gradient(180deg, #d0d0d0 0%, #888 100%)",
            border: `1.5px solid ${OUTLINE_THIN}`,
          }}
        />
        <div
          className="-mt-1 h-2.5 w-16 -translate-x-[28px] rounded"
          style={{
            background: "linear-gradient(180deg, #d0d0d0 0%, #888 100%)",
            border: `1.5px solid ${OUTLINE_THIN}`,
          }}
        />
        <div
          className="ml-[-28px] h-4 w-2.5"
          style={{
            background: "#888",
            border: `1.5px solid ${OUTLINE_THIN}`,
          }}
        />
      </div>

      <div
        className="absolute inset-x-0 bottom-0 h-20 rounded-sm"
        style={{
          background: "#c0c4cc",
          border: `2.5px solid ${OUTLINE}`,
        }}
      >
        <div
          className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ background: "#5a5246", border: `1.5px solid ${OUTLINE}` }}
        />
        <div
          className="absolute left-3 bottom-1.5 h-7 w-4 rounded-sm"
          style={{ background: "#c4a8d4", border: `2px solid ${OUTLINE}` }}
        />
        <div
          className="absolute left-9 bottom-1.5 h-6 w-4 rounded-sm"
          style={{ background: "#d4a8a8", border: `2px solid ${OUTLINE}` }}
        />
      </div>
    </div>
  );
}

/* ============================================================
   MINI SIDE SHELF
   ============================================================ */
function MiniSideShelf() {
  return (
    <div
      className="relative w-[88px] shrink-0 rounded-sm"
      style={{
        background: "#d4b896",
        border: `2.5px solid ${OUTLINE}`,
      }}
    >
      <div className="grid h-full grid-rows-3 gap-1.5 p-2">
        <div
          className="flex items-end justify-center gap-0.5 rounded-sm"
          style={{ background: "#c9a98d" }}
        >
          <div
            className="h-10 w-3 rounded-sm"
            style={{ background: "#fdfbf3", border: `1.5px solid ${OUTLINE}` }}
          />
          <div
            className="h-11 w-3 rounded-sm"
            style={{ background: "#fdfbf3", border: `1.5px solid ${OUTLINE}` }}
          />
          <div
            className="h-10 w-3 rounded-sm"
            style={{ background: "#fdfbf3", border: `1.5px solid ${OUTLINE}` }}
          />
        </div>

        <div
          className="rounded-sm"
          style={{ background: "#a8c4d8", border: `2px solid ${OUTLINE}` }}
        />

        <div className="relative rounded-sm" style={{ background: "#c9a98d" }}>
          <div className="absolute inset-1.5 flex items-end justify-center gap-0.5">
            <div
              className="h-6 w-2 rounded-full"
              style={{ background: "#95b58a", border: `1.5px solid ${OUTLINE}` }}
            />
            <div
              className="h-8 w-2 rounded-full"
              style={{ background: "#7da06a", border: `1.5px solid ${OUTLINE}` }}
            />
            <div
              className="h-6 w-2 rounded-full"
              style={{ background: "#95b58a", border: `1.5px solid ${OUTLINE}` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   DISHWASHER
   ============================================================ */
function Dishwasher() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative w-56 shrink-0" style={{ perspective: 1000 }}>
      <div
        className="clickable-ware relative h-full overflow-hidden rounded-sm"
        style={{
          background: "#b8b8b0",
          border: `2.5px solid ${OUTLINE}`,
        }}
      >
        <div
          className={`absolute left-3 right-3 top-3 z-0 transition-all duration-700 ${
            open ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
          }`}
        >
          <CompactPanel
            tape="#ff8aaf"
            rotate={-1.5}
            icon={<Code2 className="h-3.5 w-3.5" />}
            title="Libraries"
            items={["Next.js", "R3F · Three.js", "GSAP · Tailwind"]}
          />

          <div className="mt-2">
            <CompactPanel
              tape="#b8d4e8"
              rotate={1}
              icon={<Sparkles className="h-3.5 w-3.5" />}
              title="Code"
              items={["TypeScript", "Drei helpers", "Clean components"]}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="absolute inset-0 origin-bottom transition-transform duration-700"
          style={{
            transform: open ? "rotateX(80deg)" : "rotateX(0deg)",
            transformStyle: "preserve-3d",
            background: "linear-gradient(180deg, #d8d8d0 0%, #b8b8b0 100%)",
            border: `2.5px solid ${OUTLINE}`,
            transitionTimingFunction: "cubic-bezier(0.22, 0.61, 0.36, 1)",
          }}
        >
          <div
            className="absolute left-1/2 top-4 h-2 w-3/4 -translate-x-1/2 rounded-full"
            style={{ background: "#888", border: `1.5px solid ${OUTLINE_THIN}` }}
          />

          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-[#5a3a6e]">
            <Code2 className="h-5 w-5 opacity-60" />
            <p className="text-xs font-black uppercase tracking-[0.25em]">
              Dishwasher
            </p>

            {!open && (
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#5a3a6e]/55">
                click to open
              </span>
            )}
          </div>
        </button>
      </div>
    </div>
  );
}

/* ============================================================
   LOWER CABINETS
   ============================================================ */
function LowerCabinets() {
  return (
    <div className="relative flex flex-1 gap-2">
      <LowerCabinet
        icon={<Box className="h-3.5 w-3.5" />}
        title="3D Model"
        items={["Isometric Room", "room.glb", "Creator credit"]}
        tape="#fff5b8"
      />
      <LowerCabinet
        icon={<Music className="h-3.5 w-3.5" />}
        title="Music"
        items={["ambient.mp3", "Artist credit", "License info"]}
        tape="#d8f5d0"
      />
      <LowerCabinet
        icon={<Heart className="h-3.5 w-3.5" />}
        title="Thanks"
        items={["Mentors", "Friends", "Community"]}
        tape="#ffd6e8"
      />
    </div>
  );
}

function LowerCabinet({
  icon,
  title,
  items,
  tape,
}: {
  icon: React.ReactNode;
  title: string;
  items: string[];
  tape: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="clickable-ware relative flex-1 overflow-hidden rounded-sm"
      style={{
        background: "#9a7757",
        border: `2.5px solid ${OUTLINE}`,
        perspective: 1000,
      }}
    >
      <div
        className={`absolute left-3 right-3 top-3 z-0 transition-all duration-700 ${
          open ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
        }`}
      >
        <CreditPanel
          tape={tape}
          rotate={1}
          icon={icon}
          title={title}
          items={items}
        />
      </div>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="absolute inset-0 origin-left rounded-sm transition-transform duration-700"
        style={{
          transform: open ? "rotateY(-84deg)" : "rotateY(0deg)",
          transformStyle: "preserve-3d",
          background: "linear-gradient(180deg, #b89878 0%, #9a7757 100%)",
          border: `2.5px solid ${OUTLINE}`,
          transitionTimingFunction: "cubic-bezier(0.22, 0.61, 0.36, 1)",
        }}
      >
        <div className="absolute left-1/2 top-8 flex -translate-x-1/2 flex-col items-center gap-2 text-white/85">
          {icon}
          <p className="text-xs font-black uppercase tracking-[0.18em]">
            {title}
          </p>
        </div>

        <div
          className="absolute right-3 top-1/2 h-16 w-2 -translate-y-1/2 rounded-full"
          style={{ background: "#5a3a1a", border: `1.5px solid ${OUTLINE}` }}
        />

        {!open && (
          <span className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-black uppercase tracking-[0.3em] text-white/55">
            click to open
          </span>
        )}
      </button>
    </div>
  );
}

/* ============================================================
   FRIDGE
   ============================================================ */
function Fridge() {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative ml-1 h-[760px] w-[360px] shrink-0 md:w-[420px]"
      style={{ perspective: 1400 }}
    >
      <div
        className="clickable-ware absolute inset-0 overflow-hidden rounded-3xl"
        style={{
          background: "#f5f1ea",
          border: `3px solid ${OUTLINE}`,
        }}
      >
        <div
          className={`absolute inset-5 rounded-md transition-all duration-700 ${
            open ? "opacity-100" : "opacity-0"
          }`}
          style={{
            background: "linear-gradient(180deg, #eef3f5 0%, #dbe3e8 100%)",
            border: `2px solid ${OUTLINE_THIN}`,
          }}
        >
          <FridgeInterior open={open} />
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="absolute inset-0 origin-left rounded-3xl transition-transform duration-1000"
          style={{
            transform: open ? "rotateY(-105deg)" : "rotateY(0deg)",
            transformStyle: "preserve-3d",
            background: "linear-gradient(180deg, #fdfbf6 0%, #ebe5dc 100%)",
            border: `3px solid ${OUTLINE}`,
            transitionTimingFunction: "cubic-bezier(0.22, 0.61, 0.36, 1)",
          }}
        >
          <div
            className="absolute left-5 right-5 top-[28%] h-[2.5px]"
            style={{ background: OUTLINE_THIN }}
          />

          <div
            className="absolute right-4 top-1/2 h-24 w-2.5 -translate-y-1/2 rounded-full"
            style={{
              background: "linear-gradient(180deg, #d0d0d0 0%, #888 100%)",
              border: `1.5px solid ${OUTLINE}`,
            }}
          />

          <div className="absolute left-6 top-[36%] flex flex-col gap-2.5">
            <Magnet color="#ff8aaf" />
            <Magnet color="#a8d4e8" />
            <Magnet color="#fff5b8" />
            <Magnet color="#c4a8d4" />
          </div>

          <div
            className="absolute left-1/2 top-1/2 w-44 -translate-x-1/2 -translate-y-1/2 rotate-[-3deg] rounded-sm p-4 text-center"
            style={{
              background: "#fff5b8",
              border: `2.5px solid ${OUTLINE}`,
            }}
          >
            <p className="font-display text-xl font-bold text-[#5a3a6e]">
              Open me ✨
            </p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.15em] text-[#7a4d77]">
              Credits inside ♡
            </p>
          </div>
        </button>
      </div>

      <div className="absolute -bottom-2 left-1/2 h-4 w-[88%] -translate-x-1/2 rounded-full bg-black/15 blur-md" />
    </div>
  );
}

function FridgeInterior({ open }: { open: boolean }) {
  return (
    <div className="relative h-full w-full p-4">
      <FridgeNote
        className="absolute left-3 top-3 w-[260px]"
        rotate={2}
        tape="#c4a8d4"
        open={open}
        delay={180}
      >
        <div className="flex items-center justify-center gap-1.5 text-[#5a3a6e]">
          <Sparkles className="h-3.5 w-3.5" />
          <p className="text-sm font-bold">Tools & Tech</p>
        </div>

        <div className="mt-2.5 grid grid-cols-3 gap-1.5">
          <Pill color="#ffd6c2">HTML</Pill>
          <Pill color="#c8e8ff">CSS</Pill>
          <Pill color="#fff5b8">JS</Pill>
          <Pill color="#d8f5d0">React</Pill>
          <Pill color="#f0ddff">GSAP</Pill>
          <Pill color="#ffd6e8">Three</Pill>
        </div>
      </FridgeNote>

      <FridgeNote
        className="absolute left-4 top-[240px] w-[200px]"
        rotate={-3}
        tape="#fff5b8"
        open={open}
        delay={320}
      >
        <div className="flex items-center justify-center gap-1.5 text-[#5a3a6e]">
          <Sparkles className="h-3.5 w-3.5" />
          <p className="text-sm font-bold">Inspiration</p>
        </div>

        <div className="mt-2 space-y-1 text-sm font-semibold leading-snug text-[#5a3a6e]">
          <p>· Cozy spaces</p>
          <p>· Pastel dreams</p>
          <p>· Tiny details</p>
        </div>
      </FridgeNote>

      <FridgeNote
        className="absolute right-3 bottom-3 w-[220px]"
        rotate={-2}
        tape="#ff8aaf"
        open={open}
        delay={460}
      >
        <div className="flex items-center justify-center gap-1.5 text-[#7a3a55]">
          <Heart className="h-3.5 w-3.5 fill-[#ff8aaf]" />
          <p className="text-sm font-bold">Special Thanks</p>
        </div>

        <div className="mt-2 space-y-1 text-sm font-semibold leading-snug text-[#5a3a55]">
          <p>♡ My mentor</p>
          <p>♡ Friends</p>
          <p>♡ Community</p>
          <p>♡ You! 💜</p>
        </div>
      </FridgeNote>
    </div>
  );
}

/* ============================================================
   PANELS
   ============================================================ */
function CreditPanel({
  icon,
  title,
  items,
  tape,
  rotate,
}: {
  icon?: React.ReactNode;
  title: string;
  items: string[];
  tape: string;
  rotate: number;
}) {
  return (
    <div
      className="relative w-full rounded-sm p-3"
      style={{
        transform: `rotate(${rotate}deg)`,
        background: "#fdfbf3",
        border: `2px solid ${OUTLINE_THIN}`,
      }}
    >
      <div
        className="absolute -top-2.5 left-1/2 h-3.5 w-14 -translate-x-1/2 rotate-[-6deg] opacity-80"
        style={{ background: tape }}
      />

      <div className="flex items-center gap-1.5 text-[#8d67cf]">
        {icon}
        <p className="text-xs font-black uppercase tracking-[0.18em]">
          {title}
        </p>
      </div>

      <div className="mt-1.5 space-y-0.5 text-sm font-semibold leading-tight text-[#5a3a6e]">
        {items.map((item) => (
          <p key={item}>· {item}</p>
        ))}
      </div>
    </div>
  );
}

function CompactPanel({
  icon,
  title,
  items,
  tape,
  rotate,
}: {
  icon?: React.ReactNode;
  title: string;
  items: string[];
  tape: string;
  rotate: number;
}) {
  return (
    <div
      className="relative w-full rounded-sm px-3 py-2.5"
      style={{
        transform: `rotate(${rotate}deg)`,
        background: "#fdfbf3",
        border: `2px solid ${OUTLINE_THIN}`,
      }}
    >
      <div
        className="absolute -top-2.5 left-1/2 h-3.5 w-14 -translate-x-1/2 rotate-[-6deg] opacity-80"
        style={{ background: tape }}
      />

      <div className="flex items-center gap-1.5 text-[#8d67cf]">
        {icon}
        <p className="text-xs font-black uppercase tracking-[0.18em]">
          {title}
        </p>
      </div>

      <div className="mt-1.5 space-y-0.5 text-sm font-semibold leading-tight text-[#5a3a6e]">
        {items.map((item) => (
          <p key={item}>· {item}</p>
        ))}
      </div>
    </div>
  );
}

function FridgeNote({
  children,
  className = "",
  rotate = 0,
  tape = "#c4a8d4",
  open,
  delay,
}: {
  children: React.ReactNode;
  className?: string;
  rotate?: number;
  tape?: string;
  open: boolean;
  delay: number;
}) {
  return (
    <div
      className={`relative rounded-sm bg-[#fdfbf3] p-3 transition-all duration-700 hover:scale-[1.04] hover:rotate-0 ${className} ${
        open ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
      }`}
      style={{
        transform: `rotate(${rotate}deg)`,
        transitionDelay: `${delay}ms`,
        border: `2px solid ${OUTLINE_THIN}`,
      }}
    >
      <div
        className="absolute -top-2.5 left-1/2 h-3.5 w-16 -translate-x-1/2 rotate-[-6deg] opacity-85"
        style={{ background: tape }}
      />
      {children}
    </div>
  );
}

function Pill({
  children,
  color,
}: {
  children: React.ReactNode;
  color: string;
}) {
  return (
    <div
      className="rounded-sm px-1.5 py-1 text-center text-xs font-bold text-[#5a3a6e]"
      style={{
        background: color,
        border: `1.5px solid ${OUTLINE_THIN}`,
      }}
    >
      {children}
    </div>
  );
}

function Magnet({ color }: { color: string }) {
  return (
    <div
      className="h-4 w-4 rounded-full"
      style={{
        background: color,
        border: `2px solid ${OUTLINE}`,
      }}
    />
  );
}

/* ============================================================
   GLOBAL STYLES
   ============================================================ */
function SceneStyles() {
  return (
    <style jsx global>{`
      .clickable-ware {
        transition:
          box-shadow 250ms ease,
          transform 250ms ease,
          filter 250ms ease;
      }

      .clickable-ware:hover {
        filter: brightness(1.04);
        box-shadow:
          0 0 0 2px rgba(255, 255, 255, 0.6),
          0 0 18px rgba(168, 117, 216, 0.25),
          0 6px 16px rgba(90, 58, 110, 0.15);
      }
    `}</style>
  );
}