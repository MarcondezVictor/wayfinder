"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import type { CountrySchema } from "@/lib/countries-data";

interface SearchBarProps {
    countries: CountrySchema[];
}

export default function SearchBar({ countries }: SearchBarProps) {
    const router = useRouter();
    const [query, setQuery] = useState("");
    const [open, setOpen] = useState(false);
    const [highlight, setHighlight] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    const results = useMemo(() => {
        const term = query.trim().toLowerCase();
        if (!term) return [];
        return countries
            .filter(
                (c) =>
                    c.name.toLowerCase().includes(term) ||
                    c.continent.toLowerCase().includes(term) ||
                    c.capital.toLowerCase().includes(term)
            )
            .slice(0, 8);
    }, [query, countries]);

    // Fecha o dropdown ao clicar fora
    useEffect(() => {
        function onClickOutside(e: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", onClickOutside);
        return () => document.removeEventListener("mousedown", onClickOutside);
    }, []);

    function goTo(slug: string) {
        setOpen(false);
        setQuery("");
        router.push(`/country/${slug}`);
    }

    function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (!open || results.length === 0) return;
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setHighlight((h) => (h + 1) % results.length);
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setHighlight((h) => (h - 1 + results.length) % results.length);
        } else if (e.key === "Enter") {
            e.preventDefault();
            const selected = results[highlight];
            if (selected) goTo(selected.slug);
        } else if (e.key === "Escape") {
            setOpen(false);
        }
    }

    return (
        <div ref={containerRef} className="relative w-full max-w-md">
            <input
                type="text"
                placeholder="Search country, capital or continent..."
                value={query}
                onChange={(e) => {
                    setQuery(e.target.value);
                    setOpen(true);
                    setHighlight(0);
                }}
                onFocus={() => query.trim() && setOpen(true)}
                onKeyDown={onKeyDown}
                className="w-full px-4 py-3 text-sm rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] text-[var(--text-primary)] placeholder:text-[var(--text-faint)] shadow-sm focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/15 transition-colors"
            />

            {open && results.length > 0 && (
                <ul className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] shadow-lg max-h-80 overflow-y-auto text-left">
                    {results.map((c, i) => (
                        <li key={c.id}>
                            <button
                                type="button"
                                onMouseEnter={() => setHighlight(i)}
                                onClick={() => goTo(c.slug)}
                                className={`flex w-full items-center gap-3 px-4 py-2.5 text-sm transition-colors cursor-pointer ${
                                    i === highlight ? "bg-[var(--bg-subtle)]" : "bg-transparent"
                                }`}
                            >
                                <img
                                    src={`/flags/${c.isoCode.toLowerCase()}.svg`}
                                    alt=""
                                    className="w-6 h-4 object-cover rounded-sm shrink-0 border border-[var(--border-subtle)]"
                                />
                                <span className="font-medium text-[var(--text-primary)]">{c.name}</span>
                                <span className="ml-auto text-xs text-[var(--text-muted)]">{c.continent}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            {open && query.trim() && results.length === 0 && (
                <div className="absolute z-50 mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] shadow-lg px-4 py-3 text-sm text-[var(--text-muted)] text-left">
                    No countries found.
                </div>
            )}
        </div>
    );
}
