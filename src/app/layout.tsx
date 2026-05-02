import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Julie Anne Cantillep | Fullstack Developer",
  description: "A scrapbook-inspired developer portfolio for Julie Anne Cantillep."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
