"use client";

import { Html } from "@react-three/drei";

const Loader = () => {
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-white/80 px-5 py-4 text-[#7a6297] shadow-soft backdrop-blur-xl">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#d8c7ec] border-t-[#8d67cf]" />
        <p className="text-sm font-medium">Loading 3D model...</p>
      </div>
    </Html>
  );
};

export default Loader;