"use client";

import { useState } from "react";

interface SmartImageProps {
    /** Fonte principal (ex.: foto local em /covers/pt.jpg). */
    src: string;
    /** Fonte alternativa se a principal falhar (ex.: o image_url da BD). */
    fallbackSrc?: string | null;
    alt: string;
    className?: string;
    /** Carregar de imediato (ex.: hero). */
    eager?: boolean;
}

export default function SmartImage({
                                       src,
                                       fallbackSrc,
                                       alt,
                                       className = "",
                                       eager = false,
                                   }: SmartImageProps) {
    const [idx, setIdx] = useState(0);

    // Lista de fontes a tentar, por ordem (ignora vazias)
    const sources = [src, fallbackSrc].filter(Boolean) as string[];
    const current = sources[idx];

    // Esgotaram as fontes (ou nenhuma existe) -> placeholder
    if (!current) {
        return (
            <div
                className={`flex items-center justify-center bg-gradient-to-br from-[var(--brand-subtle)] to-[var(--bg-subtle)] ${className}`}
            >
                <span className="px-3 text-center text-sm font-medium text-[var(--text-muted)]">{alt}</span>
            </div>
        );
    }

    return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
            key={current}
            src={current}
            alt={alt}
            onError={() => setIdx((i) => i + 1)}
            loading={eager ? "eager" : "lazy"}
            className={className}
        />
    );
}
