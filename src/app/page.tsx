"use client";

import dynamic from "next/dynamic";
import { Sparkles } from "lucide-react";

const HeroScene = dynamic(() => import("@/components/HeroScene"), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-screen items-center justify-center bg-[#03030a] text-white">
      <div className="flex flex-col items-center gap-3 text-center">
        <Sparkles className="h-6 w-6 animate-pulse text-cyan-300" />
        <p className="text-sm font-medium">Loading 3D scene...</p>
      </div>
    </div>
  )
});

export default function HomePage() {
  return (
    <main
      className="h-screen w-screen overflow-hidden"
      style={{
        background:
          "radial-gradient(circle at 20% 72%, rgba(255, 170, 190, 0.55), transparent 32%), radial-gradient(circle at 78% 68%, rgba(151, 207, 255, 0.5), transparent 34%), radial-gradient(circle at 50% 18%, rgba(255, 239, 204, 0.75), transparent 38%), linear-gradient(180deg, #fff7ec 0%, #f8dfe8 48%, #d8d5ff 100%)"
      }}
    >
      <HeroScene />
    </main>
  );
}