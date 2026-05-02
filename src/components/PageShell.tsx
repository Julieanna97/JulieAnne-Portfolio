import { Menu } from "./Menu";

export function PageShell({
  number,
  title,
  variant = "paper",
  children
}: {
  number: string;
  title: string;
  variant?: "paper" | "dark" | "hero";
  children: React.ReactNode;
}) {
  const bg =
    variant === "dark"
      ? "bg-darkBoard text-paper"
      : variant === "hero"
        ? "hero-scene text-paper"
        : "notebook text-ink";

  return (
    <main className={`noise page-frame relative min-h-screen overflow-hidden ${bg}`}>
      <Menu />
      <div className="mx-auto flex min-h-[calc(100vh-36px)] w-full max-w-[1500px] flex-col">
        <p className="relative z-10 mb-4 font-mono text-xs font-bold uppercase tracking-[.16em] opacity-80 sm:text-sm">
          {number} — {title}
        </p>
        {children}
      </div>
    </main>
  );
}
