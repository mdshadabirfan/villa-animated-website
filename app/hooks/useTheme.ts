"use client";

import { useEffect, useState, useCallback } from "react";

export type Theme = "dark" | "light";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    // Check saved local preference
    const saved = localStorage.getItem("villa-theme") as Theme | null;
    if (saved === "light" || saved === "dark") {
      setTheme(saved);
      if (saved === "light") {
        document.documentElement.classList.add("light");
        document.documentElement.setAttribute("data-theme", "light");
      } else {
        document.documentElement.classList.remove("light");
        document.documentElement.setAttribute("data-theme", "dark");
      }
    } else {
      // Default to dark luxury architectural palette
      document.documentElement.classList.remove("light");
      document.documentElement.setAttribute("data-theme", "dark");
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const nextTheme: Theme = prev === "dark" ? "light" : "dark";
      try {
        localStorage.setItem("villa-theme", nextTheme);
      } catch {
        // Safe in private browsing
      }
      if (nextTheme === "light") {
        document.documentElement.classList.add("light");
        document.documentElement.setAttribute("data-theme", "light");
      } else {
        document.documentElement.classList.remove("light");
        document.documentElement.setAttribute("data-theme", "dark");
      }
      return nextTheme;
    });
  }, []);

  return { theme, toggleTheme };
}

export default useTheme;

