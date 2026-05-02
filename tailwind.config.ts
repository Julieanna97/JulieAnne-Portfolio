import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#272322",
        night: "#171717",
        chalk: "#252525",
        paper: "#d9d0c0",
        paperLight: "#e9e0d3",
        lavender: "#a686d6",
        fadedLavender: "#c9addd",
        tape: "#b79d7f"
      },
      boxShadow: {
        scrapbook: "0 22px 70px rgba(0,0,0,.34)",
        paper: "0 14px 30px rgba(27,22,18,.24)",
        soft: "0 8px 22px rgba(0,0,0,.18)"
      },
      fontFamily: {
        hand: ["Comic Sans MS", "Bradley Hand", "Segoe Print", "cursive"],
        mono: ["Courier New", "monospace"],
        serif: ["Georgia", "serif"]
      },
      backgroundImage: {
        darkBoard: "radial-gradient(circle at 20% 10%, rgba(194,158,100,.13), transparent 30rem), radial-gradient(circle at 80% 20%, rgba(166,134,214,.13), transparent 26rem), linear-gradient(135deg, #2d2d2d 0%, #161616 60%, #101010 100%)",
        notebook: "linear-gradient(rgba(60,48,38,.07) 1px, transparent 1px), linear-gradient(90deg, rgba(60,48,38,.07) 1px, transparent 1px)",
        heroGlow: "linear-gradient(180deg, rgba(255,177,117,.32), rgba(40,40,45,.1)), radial-gradient(circle at 50% 5%, rgba(245,185,116,.5), transparent 28rem)"
      }
    }
  },
  plugins: []
};
export default config;
