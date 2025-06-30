// Imports
import ThemeToggle from "@/components/ThemeToggle"; // Add this
import "./globals.css";
import { ReactNode } from "react";
import Link from "next/link";



export const metadata = {
  title: "Luis Román — Portfolio",
  description: "Projects, research, and startups by Luis Román.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
      (function () {
        try {
          const stored = localStorage.getItem('theme');
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          if (stored === 'dark' || (!stored && prefersDark)) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        } catch (_) {}
      })();
    `,
          }}
        />
      </head>
      <body className="min-h-screen bg-white text-black dark:bg-zinc-900 dark:text-white font-sans">
        <header className="p-4 border-b border-zinc-200 dark:border-zinc-700">
          <nav className="flex justify-between max-w-5xl mx-auto">
            <h1 className="text-xl font-semibold">Luis Román</h1>
            <ul className="flex gap-4 text-sm items-center">
              <li><Link href="/" className="hover:underline">Home</Link></li>
              <li><Link href="/projects" className="hover:underline">Projects</Link></li>
              <li><Link href="/experience" className="hover:underline">Experience</Link></li>
              <li><Link href="/contact" className="hover:underline">Contact</Link></li>
              <li><ThemeToggle /></li> {/* Replace button with component */}
            </ul>
          </nav>
        </header>
        <main className="max-w-5xl mx-auto p-6">{children}</main>
      </body>
    </html>
  );
}
