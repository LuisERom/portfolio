import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "LERL OS — LERL",
  description:
    "LERL OS is a personal productivity dashboard with read-only Google Calendar integration.",
};

export default function CoworkPage() {
  return (
    <article className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">LERL OS</h1>

      <p className="text-zinc-600 dark:text-zinc-400 mb-6">
        LERL OS is a personal productivity dashboard built by Luis Roman. It helps
        organize daily work — tasks, logs, and calendar — in one local interface.
        This is a personal, single-user tool that runs on your own machine, not a
        public SaaS.
      </p>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Google Calendar Integration</h2>
        <p className="text-zinc-600 dark:text-zinc-400 mb-4">
          LERL OS requests read-only access to your Google Calendar (
          <code className="text-sm bg-zinc-200 dark:bg-zinc-800 px-1.5 py-0.5 rounded">
            calendar.readonly
          </code>
          ). It uses this to:
        </p>
        <ul className="list-disc list-inside space-y-2 text-zinc-600 dark:text-zinc-400 mb-4">
          <li>Display upcoming calendar events in the dashboard</li>
          <li>Include calendar context in daily briefings</li>
        </ul>
        <p className="text-zinc-600 dark:text-zinc-400">
          LERL OS does <strong>not</strong> create, edit, or delete calendar events.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">How Your Data Is Handled</h2>
        <ul className="list-disc list-inside space-y-2 text-zinc-600 dark:text-zinc-400">
          <li>
            Calendar data is fetched via the Google Calendar API and cached locally
            on your machine.
          </li>
          <li>
            Data is not sold, shared with third parties, or used for advertising.
          </li>
          <li>
            You can revoke access at any time in your{" "}
            <a
              href="https://myaccount.google.com/permissions"
              className="text-blue-600 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Account security settings
            </a>
            .
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Privacy</h2>
        <p className="text-zinc-600 dark:text-zinc-400">
          See our{" "}
          <Link href="/privacy" className="text-blue-600 hover:underline">
            Privacy Policy
          </Link>
          .
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">Contact</h2>
        <p className="text-zinc-600 dark:text-zinc-400">
          Questions:{" "}
          <a
            href="mailto:luiseroman21@gmail.com"
            className="text-blue-600 hover:underline"
          >
            luiseroman21@gmail.com
          </a>
        </p>
      </section>
    </article>
  );
}
