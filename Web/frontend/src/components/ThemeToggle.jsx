// frontend/src/components/ThemeToggle.jsx
import React, { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(() => {
    const stored = localStorage.getItem("theme");
    if (stored) return stored === "dark";
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (dark) root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <button onClick={() => setDark((d) => !d)} className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border bg-white dark:bg-neutral-900 dark:border-neutral-800">
      {dark ? <Sun size={16} /> : <Moon size={16} />}
      <span className="text-sm">{dark ? "Light" : "Dark"}</span>
    </button>
  );
}
