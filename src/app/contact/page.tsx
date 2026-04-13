export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Contact Me</h1>

      <p className="text-zinc-600 dark:text-zinc-400 mb-6">
        Feel free to reach out if you&rsquo;re interested in collaborating, have questions, or just want to connect.
      </p>

      <ul className="space-y-4 text-sm">
        <li>
          📧 Email: <a href="mailto:luiseroman21@gmail.com" className="text-blue-600 hover:underline">luiseroman21@gmail.com</a>
        </li>
        <li>
          💼 LinkedIn: <a href="https://www.linkedin.com/in/luiserom/" className="text-blue-600 hover:underline" target="_blank">linkedin.com/in/luiserom</a>
        </li>
        <li>
          💻 GitHub: <a href="https://github.com/LuisERom" className="text-blue-600 hover:underline" target="_blank">github.com/LuisERom</a>
        </li>
      </ul>
    </div>
  );
}
