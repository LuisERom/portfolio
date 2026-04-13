"use client";

/**
 * Tiny client helper: on load, forces the site into dark mode by adding the `dark` class on <html>
 * and saving `"dark"` in localStorage so the choice sticks. There is no button — the component returns null.
 */
import { useEffect } from "react";

export default function ThemeToggle() {
  useEffect(() => {
    // Always enforce dark mode
    document.documentElement.classList.add("dark");
    localStorage.setItem("theme", "dark");
  }, []);

  // Return null to hide the toggle button
  return null;
}
