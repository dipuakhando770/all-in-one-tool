"use client";
import { createContext, useContext, useState, useEffect } from "react";

type Theme = "light" | "dark" | "system";
const ThemeContext = createContext<{ theme: Theme; setTheme: (t: Theme) => void; resolved: "light" | "dark" }>({ theme: "system", setTheme: () => {}, resolved: "light" });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("system");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = (localStorage.getItem("theme") as Theme) || "system";
    setThemeState(stored);
  }, []);

  const resolvedValue = theme === "dark" ? "dark" : theme === "light" ? "light" : 
    (typeof window !== 'undefined' && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

  useEffect(() => {
    if (mounted) {
      document.documentElement.classList.toggle("dark", resolvedValue === "dark");
      localStorage.setItem("theme", theme);
    }
  }, [theme, resolvedValue, mounted]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme: setThemeState, resolved: resolvedValue }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
