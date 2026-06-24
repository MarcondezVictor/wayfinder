"use client";

import { useEffect, useState } from "react";
import {
    Globe2,
    MapPin,
    Ruler,
    Users,
    Phone,
    Clock,
    Car,
    Link2,
    ExternalLink,
    type LucideIcon,
} from "lucide-react";

interface Facts {
    officialName?: string;
    region?: string;
    subregion?: string;
    area?: number;
    demonym?: string;
    callingCode?: string;
    timezones?: string[];
    drivingSide?: string;
    tld?: string;
    mapsUrl?: string;
}

function Fact({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
    return (
        <div className="flex items-start gap-3 border-b border-[var(--border-subtle)] py-3 last:border-0 sm:border-0 sm:py-0">
            <Icon className="mt-0.5 h-5 w-5 shrink-0 text-[var(--text-muted)]" />
            <div className="min-w-0">
                <div className="text-xs uppercase tracking-wide text-[var(--text-faint)]">{label}</div>
                <div className="break-words font-medium text-[var(--text-body)]">{value}</div>
            </div>
        </div>
    );
}

export default function CountryFacts({ isoCode }: { isoCode: string }) {
    const [facts, setFacts] = useState<Facts | null>(null);
    const [state, setState] = useState<"loading" | "ok" | "error">("loading");

    useEffect(() => {
        let cancelled = false;
        setState("loading");

        const fields = "name,region,subregion,area,demonyms,idd,timezones,car,tld,maps";
        fetch(`https://restcountries.com/v3.1/alpha/${isoCode}?fields=${fields}`)
            .then((r) => (r.ok ? r.json() : Promise.reject(new Error("rest-countries"))))
            .then((data) => {
                if (cancelled) return;
                // O endpoint pode devolver objeto ou array — normalizamos.
                const c = Array.isArray(data) ? data[0] : data;
                if (!c) throw new Error("vazio");

                const idd =
                    c.idd?.root != null ? `${c.idd.root}${c.idd.suffixes?.[0] ?? ""}` : undefined;
                const demonym = c.demonyms?.eng?.m ?? c.demonyms?.por?.m ?? undefined;
                const drivingSide =
                    c.car?.side === "left" ? "Left" : c.car?.side === "right" ? "Right" : undefined;

                setFacts({
                    officialName: c.name?.official,
                    region: c.region,
                    subregion: c.subregion,
                    area: typeof c.area === "number" ? c.area : undefined,
                    demonym,
                    callingCode: idd,
                    timezones: Array.isArray(c.timezones) ? c.timezones : undefined,
                    drivingSide,
                    tld: c.tld?.[0],
                    mapsUrl: c.maps?.googleMaps,
                });
                setState("ok");
            })
            .catch(() => {
                if (!cancelled) setState("error");
            });

        return () => {
            cancelled = true;
        };
    }, [isoCode]);

    if (state === "loading") {
        return (
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-5 sm:p-6">
                <div className="grid gap-5 sm:grid-cols-2">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="flex flex-col gap-2">
                            <div className="h-3 w-20 animate-pulse rounded bg-[var(--bg-subtle)]" />
                            <div className="h-4 w-32 animate-pulse rounded bg-[var(--bg-subtle)]" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (state === "error" || !facts) {
        return (
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-5 sm:p-6">
                <p className="text-sm text-[var(--text-muted)]">Additional data currently unavailable.</p>
            </div>
        );
    }

    const rows: { icon: LucideIcon; label: string; value?: string }[] = [
        { icon: Globe2, label: "Official name", value: facts.officialName },
        { icon: MapPin, label: "Region", value: [facts.region, facts.subregion].filter(Boolean).join(" · ") || undefined },
        { icon: Ruler, label: "Area", value: facts.area ? `${facts.area.toLocaleString("en-US")} km²` : undefined },
        { icon: Users, label: "Demonym", value: facts.demonym },
        { icon: Phone, label: "Calling code", value: facts.callingCode },
        { icon: Clock, label: "Time zones", value: facts.timezones?.join(", ") },
        { icon: Car, label: "Driving side", value: facts.drivingSide },
        { icon: Link2, label: "Top-level domain", value: facts.tld },
    ].filter((r) => r.value);

    return (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-5 sm:p-6">
            <div className="grid gap-x-8 gap-y-0 sm:grid-cols-2 sm:gap-y-5">
                {rows.map((r) => (
                    <Fact key={r.label} icon={r.icon} label={r.label} value={r.value as string} />
                ))}
            </div>

            {facts.mapsUrl && (
                <a
                    href={facts.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex items-center gap-2 rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--text-body)] transition-colors hover:bg-[var(--bg-subtle)]"
                >
                    <ExternalLink className="h-4 w-4" />
                    View on Google Maps
                </a>
            )}
        </div>
    );
}
