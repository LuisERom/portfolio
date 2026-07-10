// layout.tsx
import "./globals.css";
import { ReactNode } from "react";
import Link from "next/link";
import ThemeInit from "@/components/ThemeInit";


export const metadata = {
  title: "LERL — Portfolio",
  description: "Projects, research, and startups by Luis Román.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <meta name="color-scheme" content="dark light" />
        <style dangerouslySetInnerHTML={{
          __html: `html{background-color:#18181b!important;color:#fafafa!important}html:not(.dark){background-color:#f4f4f5!important;color:#09090b!important}body{background-color:#18181b!important;color:#fafafa!important;min-height:100vh}`
        }} />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{document.documentElement.classList.add('dark');localStorage.setItem('theme','dark');document.documentElement.style.cssText='background-color:#18181b!important;color:#fafafa!important';var s=document.createElement('style');s.textContent='body{background-color:#18181b!important;color:#fafafa!important}';document.head.appendChild(s)}catch(_){document.documentElement.style.cssText='background-color:#18181b!important;color:#fafafa!important';var s=document.createElement('style');s.textContent='body{background-color:#18181b!important;color:#fafafa!important}';document.head.appendChild(s)}})();`
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-zinc-100 text-black dark:bg-zinc-900 dark:text-white font-sans">
        <ThemeInit />
        <header className="sticky top-0 z-50 p-4 border-b border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-900 backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95">
          <nav className="flex justify-between max-w-5xl mx-auto">
            <h1 className="text-xl font-semibold">Luis E. Román Lizasoain</h1>
            <ul className="flex gap-4 text-sm items-center">
              <li><Link href="/" className="hover:underline">Projects</Link></li>
              <li><Link href="/contact" className="hover:underline">Contact</Link></li>
            </ul>
          </nav>
        </header>
        <main className="max-w-5xl mx-auto p-6 relative z-10 flex-1">{children}</main>
        <footer className="border-t border-zinc-200 dark:border-zinc-700 mt-auto">
          <div className="max-w-5xl mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-2 text-sm text-zinc-600 dark:text-zinc-400">
            <span>© {new Date().getFullYear()} Luis E. Román Lizasoain</span>
            <Link href="/privacy" className="hover:underline">
              Privacy
            </Link>
          </div>
        </footer>
      </body>
    </html>
  );
}
