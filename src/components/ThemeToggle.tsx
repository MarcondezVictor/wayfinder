"use client";

import { useEffect, useSyncExternalStore } from "react";
import { Sun, Moon } from "lucide-react";

// The theme lives in localStorage ("dark" | "light"); with no saved choice it
// follows the system. It is read as an external store so the server render and
// the first client render agree (null = not known yet), with no setState in an effect.
const THEME_EVENT = "wayfinder:theme";

function readIsDark(): boolean {
    try {
        const saved = localStorage.getItem("theme");
        if (saved === "dark") return true;
        if (saved === "light") return false;
        return window.matchMedia("(prefers-color-scheme: dark)").matches;
    } catch {
        return false;
    }
}

function subscribe(onChange: () => void) {
    window.addEventListener(THEME_EVENT, onChange);
    return () => window.removeEventListener(THEME_EVENT, onChange);
}

export default function ThemeToggle() {
    const isDark = useSyncExternalStore<boolean | null>(subscribe, readIsDark, () => null);

    // Applies the class on <html> once the theme is known and whenever it changes.
    useEffect(() => {
        if (isDark !== null) document.documentElement.classList.toggle("dark", isDark);
    }, [isDark]);

    function toggle() {
        const next = !isDark;
        document.documentElement.classList.toggle("dark", next);
        try {
            localStorage.setItem("theme", next ? "dark" : "light");
        } catch {
            // localStorage unavailable — ignore
        }
        window.dispatchEvent(new Event(THEME_EVENT));
    }

    return (
        <button
            onClick={toggle}
            aria-label="Alternar tema claro/escuro"
            title="Alternar tema claro/escuro"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-colors cursor-pointer shrink-0"
        >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
    );
}
