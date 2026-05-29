import type { Metadata } from "next";
import { Pacifico, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const bodyFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-body",
});

const displayFont = Pacifico({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "Julie Anne Cantillep | Fullstack Developer",
  description:
    "A cozy pastel portfolio website for Julie Anne Cantillep, Fullstack Developer.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${bodyFont.variable} ${displayFont.variable} font-body`}>
        {children}
      </body>
    </html>
  );
}