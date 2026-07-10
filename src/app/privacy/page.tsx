import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — LERL OS",
  description:
    "How LERL OS handles Google Calendar data: local storage, read-only access, and no third-party sharing.",
};

export default function PrivacyPage() {
  return (
    <article className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">Privacy Policy — LERL OS</h1>
      <p className="text-sm text-zinc-500 dark:text-zinc-500 mb-8">
        <strong>Last updated:</strong> July 10, 2026
      </p>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Overview</h2>
        <p className="text-zinc-600 dark:text-zinc-400">
          LERL OS (&ldquo;the App&rdquo;) is a personal productivity tool operated by
          Luis Roman. This policy describes how the App handles information when you
          authorize Google Calendar access.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Information We Access</h2>
        <p className="text-zinc-600 dark:text-zinc-400 mb-4">
          When you connect Google Calendar, the App requests read-only access to
          your Google Calendar data via the Google Calendar API. This includes event
          titles, times, locations, and descriptions for calendars you can view in
          Google Calendar.
        </p>
        <p className="text-zinc-600 dark:text-zinc-400">
          The App does not request write access to your calendar.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">How We Use Your Information</h2>
        <p className="text-zinc-600 dark:text-zinc-400 mb-4">
          Calendar data is used solely to:
        </p>
        <ul className="list-disc list-inside space-y-2 text-zinc-600 dark:text-zinc-400 mb-4">
          <li>Display your schedule in the LERL OS dashboard</li>
          <li>Provide calendar context in personal daily briefings</li>
        </ul>
        <p className="text-zinc-600 dark:text-zinc-400">
          Calendar data is not used for advertising, profiling, or any purpose
          unrelated to displaying your schedule locally.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Storage</h2>
        <p className="text-zinc-600 dark:text-zinc-400 mb-4">
          Calendar data and OAuth tokens are stored <strong>locally on your device</strong>,
          not on a remote server operated by LERL OS. Typical local files include:
        </p>
        <ul className="list-disc list-inside space-y-2 text-zinc-600 dark:text-zinc-400 mb-4">
          <li>OAuth credentials and refresh tokens (stored outside cloud-synced folders)</li>
          <li>A local cache of calendar events used by the dashboard</li>
        </ul>
        <p className="text-zinc-600 dark:text-zinc-400">
          You can delete this data at any time by removing the App&apos;s local
          credential and cache files.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Sharing</h2>
        <p className="text-zinc-600 dark:text-zinc-400">
          We do not sell, rent, or share your Google Calendar data with third parties.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Retention</h2>
        <p className="text-zinc-600 dark:text-zinc-400">
          Cached calendar data is refreshed periodically and retained locally until
          you delete it or revoke the App&apos;s access.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Revoking Access</h2>
        <p className="text-zinc-600 dark:text-zinc-400 mb-4">
          You can revoke the App&apos;s access to your Google account at any time:
        </p>
        <ol className="list-decimal list-inside space-y-2 text-zinc-600 dark:text-zinc-400">
          <li>
            Go to{" "}
            <a
              href="https://myaccount.google.com/permissions"
              className="text-blue-600 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Account → Security → Third-party apps with account access
            </a>
          </li>
          <li>Find &ldquo;LERL OS&rdquo; (or the OAuth client name shown on the consent screen)</li>
          <li>Select <strong>Remove Access</strong></li>
        </ol>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Contact</h2>
        <p className="text-zinc-600 dark:text-zinc-400">
          Questions about this policy:{" "}
          <a
            href="mailto:luiseroman21@gmail.com"
            className="text-blue-600 hover:underline"
          >
            luiseroman21@gmail.com
          </a>
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">Changes</h2>
        <p className="text-zinc-600 dark:text-zinc-400">
          We may update this policy from time to time. The &ldquo;Last updated&rdquo; date
          at the top will reflect the most recent revision.
        </p>
      </section>
    </article>
  );
}
