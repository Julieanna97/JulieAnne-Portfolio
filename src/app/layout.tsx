import type { Metadata } from "next";
import Script from "next/script";
import {
  Poppins,
  Plus_Jakarta_Sans,
  Space_Mono,
} from "next/font/google";
import "./globals.css";

const bodyFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-body",
});

const displayFont = Poppins({
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
  variable: "--font-display",
});

const monoFont = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Julie Anne's Town",
  description:
    "An immersive Tokyo-night portfolio by Julie Anne Cantillep, Fullstack Developer.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script id="theme-init" strategy="beforeInteractive">
          {`(() => {
            try {
              document.documentElement.dataset.theme = 'twilight';
              document.documentElement.style.colorScheme = 'dark';
            } catch (error) {
              document.documentElement.dataset.theme = 'twilight';
              document.documentElement.style.colorScheme = 'dark';
            }
          })();`}
        </Script>
      </head>

      <body
        className={`${bodyFont.variable} ${displayFont.variable} ${monoFont.variable} font-body`}
      >
        {children}
      </body>
    </html>
  );
}
