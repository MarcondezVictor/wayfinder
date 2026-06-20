"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
    const [isDark, setIsDark] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Inicializa o tema no cliente: lê a preferência guardada e, na ausência
    // dela, segue a do sistema. Aplica a classe no <html>. (Faz o trabalho que
    // antes estava no script do layout — agora sem risco para o html/body.)
    useEffect(() => {
        let dark = false;
        try {
            const saved = localStorage.getItem("theme");
            if (saved === "dark") dark = true;
            else if (saved === "light") dark = false;
            else dark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        } catch {
            dark = false;
        }
        document.documentElement.classList.toggle("dark", dark);
        setIsDark(dark);
        setMounted(true);
    }, []);

    function toggle() {
        const next = !isDark;
        setIsDark(next);
        document.documentElement.classList.toggle("dark", next);
        try {
            localStorage.setItem("theme", next ? "dark" : "light");
        } catch {
            // localStorage indisponível — ignora
        }
    }

    return (
        <button
            onClick={toggle}
            aria-label="Alternar tema claro/escuro"
            title="Alternar tema claro/escuro"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-colors cursor-pointer shrink-0"
        >
            {mounted && isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
    );
}
