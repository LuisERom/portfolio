"use client";

/**
 * Runs in the browser on first paint: ensures dark mode is on (`document.documentElement` + localStorage).
 * Wrapped in try/catch so SSR or locked storage cannot throw. Invisible — no DOM output from this component.
 */
import { useEffect } from "react";

export default function ThemeInit() {
  useEffect(() => {
    try {
      // Always enforce dark mode
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } catch { }
  }, []);

  return null;
}
