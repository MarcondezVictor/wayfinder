"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { getCountries } from "@/lib/db-countries";
import type { CountrySchema } from "@/lib/countries-data";
import { dailyCost, norm, winnerOf, type Criterion } from "@/lib/compare";
import {
  Scale,
  Compass,
  Wallet,
  ShieldCheck,
  Wifi,
  HeartPulse,
  Bus,
  Trophy,
  Crown,
  SlidersHorizontal,
} from "lucide-react";

/* ----------------------------------------------------------------------------
 * Scored criteria (all numeric -> usable for the scoreboard and weighting)
 * Visa is left out because it is free text; it shows in the panels as info.
 * -------------------------------------------------------------------------- */
const CRITERIA: Criterion[] = [
  { key: "cost", label: "Daily cost", icon: Wallet, better: "low", get: dailyCost, format: (c) => `${dailyCost(c)}€/day` },
  { key: "safety", label: "Safety", icon: ShieldCheck, better: "high", get: (c) => c.safetyScore, format: (c) => `${c.safetyScore}/10` },
  { key: "internet", label: "Internet", icon: Wifi, better: "high", get: (c) => c.internetQualityScore, format: (c) => `${c.internetQualityScore}/10` },
  { key: "health", label: "Healthcare", icon: HeartPulse, better: "high", get: (c) => c.healthcareQualityScore, format: (c) => `${c.healthcareQualityScore}/10` },
  { key: "transport", label: "Transport", icon: Bus, better: "high", get: (c) => c.transportQualityScore, format: (c) => `${c.transportQualityScore}/10` },
];

const WEIGHT_LABELS = ["Ignore", "Low", "Medium", "Normal", "High", "Max"];

/* ----------------------------------------------------------------------------
 * Small presentational components
 * -------------------------------------------------------------------------- */
function Best() {
  return (
      <span className="inline-flex items-center gap-0.5 rounded border border-[var(--success-border)] bg-[var(--success-bg)] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--success)]">
      best
    </span>
  );
}

function ScoreCell({ text, win, align }: { text: string; win: boolean; align: "left" | "right" }) {
  return (
      <div className={`flex ${align === "right" ? "justify-end" : "justify-start"}`}>
      <span
          className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-sm ${
              win
                  ? "border border-[var(--success-border)] bg-[var(--success-bg)] font-semibold text-[var(--success)]"
                  : "text-[var(--text-muted)]"
          }`}
      >
        {win && <Crown className="h-3.5 w-3.5" />}
        {text}
      </span>
      </div>
  );
}

function ScoreBar({ name, pct, lead }: { name: string; pct: number; lead: boolean }) {
  return (
      <div className="flex items-center gap-3">
        <span className="w-28 shrink-0 truncate text-xs font-medium text-[var(--text-body)]">{name}</span>
        <div className="h-2.5 flex-grow overflow-hidden rounded-full bg-[var(--bg-subtle)]">
          <div
              className="h-full rounded-full transition-all duration-300"
              style={{ width: `${pct}%`, backgroundColor: lead ? "var(--success)" : "var(--text-faint)" }}
          />
        </div>
        <span className="w-10 shrink-0 text-right text-xs font-semibold text-[var(--text-primary)]">{Math.round(pct)}</span>
      </div>
  );
}

function BreakdownRow({ label, value, win }: { label: string; value: string; win: boolean }) {
  return (
      <div className="flex justify-between font-normal">
        <span>{label}</span>
        <span className={`flex items-center gap-1.5 font-semibold ${win ? "text-[var(--success)]" : "text-[var(--text-primary)]"}`}>
        {value}
          {win && <Best />}
      </span>
      </div>
  );
}

function CountryPanel({ label, country, other }: { label: string; country: CountrySchema; other: CountrySchema }) {
  const cost = dailyCost(country);
  const winCost = cost < dailyCost(other);
  const winSafety = country.safetyScore > other.safetyScore;
  const winHotel = country.avgHotelPrice < other.avgHotelPrice;
  const winMeal = country.avgMealPrice < other.avgMealPrice;
  const winTransport = country.avgTransportCost < other.avgTransportCost;
  const winLiving = country.costLivingIndex < other.costLivingIndex;

  const safetyBadge =
      country.safetyScore >= 8
          ? "bg-[var(--success-bg)] text-[var(--success)] border-[var(--success-border)]"
          : country.safetyScore >= 5
              ? "bg-[var(--warning-bg)] text-[var(--warning)] border-[var(--warning-border)]"
              : "bg-[var(--danger-bg)] text-[var(--danger)] border-[var(--danger-border)]";

  return (
      <div className="flex animate-fade-in-up flex-col gap-6 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] p-6 transition-colors hover:border-[var(--border-strong)]">
        {/* Header */}
        <div className="flex items-center gap-3">
          <img
              src={`/flags/${country.isoCode.toLowerCase()}.svg`}
              alt={`Flag of ${country.name}`}
              className="h-8 w-12 rounded-sm object-cover shadow"
          />
          <div className="flex flex-col">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-faint)]">{label}</span>
            <Link
                href={`/country/${country.slug}`}
                className="text-xl font-semibold text-[var(--text-primary)] transition-colors hover:text-[var(--accent)]"
            >
              {country.name}
            </Link>
          </div>
        </div>

        <p className="text-xs font-normal italic leading-relaxed text-[var(--text-muted)]">&quot;{country.tagline}&quot;</p>

        <hr className="border-[var(--border-subtle)]" />

        {/* Safety */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-faint)]">Safety</span>
          <div className="flex items-center justify-between text-sm font-medium text-[var(--text-body)]">
          <span className="flex items-center gap-1.5">
            Safety index {winSafety && <Best />}
          </span>
            <span className={`rounded border px-2 py-0.5 text-xs font-medium ${safetyBadge}`}>{country.safetyScore} / 10</span>
          </div>
          <p className="text-xs font-normal leading-normal text-[var(--text-muted)]">
            {country.travelWarnings ?? "No active travel warnings."}
          </p>
        </div>

        <hr className="border-[var(--border-subtle)]" />

        {/* Cost */}
        <div className="flex flex-col gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-faint)]">Costs &amp; Budget</span>
          <div className="flex items-baseline gap-1">
            <span className={`text-3xl font-semibold ${winCost ? "text-[var(--success)]" : "text-[var(--text-primary)]"}`}>{cost}€</span>
            <span className="text-xs font-normal text-[var(--text-muted)]">/ day on average</span>
            {winCost && <span className="ml-1"><Best /></span>}
          </div>

          <div className="flex flex-col gap-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-subtle)] p-4 text-xs text-[var(--text-muted)]">
            <BreakdownRow label="Accommodation (avg):" value={`${country.avgHotelPrice}€`} win={winHotel} />
            <BreakdownRow label="Meals (avg):" value={`${country.avgMealPrice}€`} win={winMeal} />
            <BreakdownRow label="Transport (avg):" value={`${country.avgTransportCost}€`} win={winTransport} />
            <BreakdownRow label="Cost of Living Index:" value={`${country.costLivingIndex} / 120`} win={winLiving} />
          </div>
        </div>

        <hr className="border-[var(--border-subtle)]" />

        {/* Visto */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-faint)]">Legal &amp; Visa</span>
          <p className="text-xs font-normal leading-relaxed text-[var(--text-body)]">{country.visaRequirements}</p>
        </div>

        <hr className="border-[var(--border-subtle)]" />

        {/* Climate */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-faint)]">Climate</span>
          <div className="text-xs font-semibold text-[var(--text-primary)]">{country.climateType} climate</div>
          <p className="text-xs font-normal leading-normal text-[var(--text-muted)]">{country.climateDetails}</p>
        </div>

        <Link
            href={`/country/${country.slug}`}
            className="mt-auto cursor-pointer rounded-md border border-[var(--border)] px-5 py-2.5 text-center text-sm font-medium text-[var(--text-body)] transition-colors hover:bg-[var(--bg-subtle)]"
        >
          View Details
        </Link>
      </div>
  );
}

/* ----------------------------------------------------------------------------
 * Page
 * -------------------------------------------------------------------------- */
function CompareContent() {
  const searchParams = useSearchParams();
  const [countryASlug, setCountryASlug] = useState("");
  const [countryBSlug, setCountryBSlug] = useState("");
  const [countries, setCountries] = useState<CountrySchema[]>([]);
  const [weights, setWeights] = useState<Record<string, number>>(() =>
      Object.fromEntries(CRITERIA.map((c) => [c.key, 3]))
  );

  // Initialise from URL query params (?countryA=&countryB=)
  useEffect(() => {
    const cA = searchParams.get("countryA");
    const cB = searchParams.get("countryB");
    if (cA) setCountryASlug(cA);
    if (cB) setCountryBSlug(cB);
  }, [searchParams]);

  // Load all countries from the database
  useEffect(() => {
    getCountries()
        .then(setCountries)
        .catch(() => setCountries([]));
  }, []);

  const countryA = countries.find((c) => c.slug === countryASlug) || null;
  const countryB = countries.find((c) => c.slug === countryBSlug) || null;

  // Compute scorecard + weighted recommendation
  const analysis = useMemo(() => {
    if (!countryA || !countryB) return null;

    const rows = CRITERIA.map((crit) => ({ crit, winner: winnerOf(crit, countryA, countryB) }));
    const winsA = rows.filter((r) => r.winner === "A").length;
    const winsB = rows.filter((r) => r.winner === "B").length;

    const totalWeight = CRITERIA.reduce((s, c) => s + (weights[c.key] ?? 0), 0);
    let scoreA = 0;
    let scoreB = 0;
    for (const crit of CRITERIA) {
      const w = weights[crit.key] ?? 0;
      scoreA += w * norm(crit, crit.get(countryA), countryA, countryB);
      scoreB += w * norm(crit, crit.get(countryB), countryA, countryB);
    }
    const pctA = totalWeight > 0 ? (scoreA / totalWeight) * 100 : 0;
    const pctB = totalWeight > 0 ? (scoreB / totalWeight) * 100 : 0;
    const recommended = totalWeight === 0 || pctA === pctB ? null : pctA > pctB ? countryA : countryB;

    return { rows, winsA, winsB, pctA, pctB, recommended, totalWeight };
  }, [countryA, countryB, weights]);

  return (
      <div className="relative flex min-h-screen w-full flex-col bg-[var(--bg-page)] pb-20 text-[var(--text-body)]">
        {/* Header */}
        <section className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 pb-6 pt-12 sm:px-6 lg:px-8">
          <div>
            <Link href="/" className="text-xs font-semibold text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]">
              Back to Home
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            <div className="inline-flex w-max items-center gap-1.5 rounded-full border border-[var(--accent)]/20 bg-[var(--accent-subtle)] px-3 py-1 text-xs font-medium text-[var(--accent)]">
              <Scale className="h-4 w-4" />
              <span>Comparison Tool</span>
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-[var(--text-primary)]">Compare Countries Side by Side</h1>
            <p className="max-w-2xl text-sm font-normal leading-relaxed text-[var(--text-muted)]">
              Pick two destinations below to compare legal requirements, daily costs and safety scores.
            </p>
          </div>
        </section>

        {/* Seletores */}
        <section className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] p-6 shadow-sm md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium uppercase tracking-wider text-[var(--text-muted)]">Country A (Left)</label>
              <select
                  value={countryASlug}
                  onChange={(e) => setCountryASlug(e.target.value)}
                  className="w-full rounded-md border border-[var(--border)] bg-[var(--bg-surface)] px-4 py-2.5 text-sm text-[var(--text-primary)] outline-none transition-colors focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/10"
              >
                <option value="">-- Select Country A --</option>
                {countries.map((c) => (
                    <option key={c.slug} value={c.slug} disabled={c.slug === countryBSlug}>
                      {c.name}
                    </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium uppercase tracking-wider text-[var(--text-muted)]">Country B (Right)</label>
              <select
                  value={countryBSlug}
                  onChange={(e) => setCountryBSlug(e.target.value)}
                  className="w-full rounded-md border border-[var(--border)] bg-[var(--bg-surface)] px-4 py-2.5 text-sm text-[var(--text-primary)] outline-none transition-colors focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/10"
              >
                <option value="">-- Select Country B --</option>
                {countries.map((c) => (
                    <option key={c.slug} value={c.slug} disabled={c.slug === countryASlug}>
                      {c.name}
                    </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Comparison */}
        <section className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
          {countryA && countryB && analysis ? (
              <>
                {/* ---- Recommendation by priorities (sliders) ---- */}
                <div className="flex flex-col gap-5 rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] p-6 shadow-sm">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <SlidersHorizontal className="h-5 w-5 text-[var(--brand)]" />
                      <h3 className="text-sm font-semibold text-[var(--text-primary)]">What matters to you?</h3>
                    </div>
                    <p className="text-xs text-[var(--text-muted)]">Adjust the weight of each criterion — the recommendation updates in real time.</p>
                  </div>

                  <div className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
                    {CRITERIA.map((crit) => (
                        <div key={crit.key} className="flex flex-col gap-1.5">
                          <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-[var(--text-body)]">
                        <crit.icon className="h-4 w-4 text-[var(--text-muted)]" />
                        {crit.label}
                      </span>
                            <span className="text-xs font-semibold text-[var(--text-muted)]">{WEIGHT_LABELS[weights[crit.key]]}</span>
                          </div>
                          <input
                              type="range"
                              min={0}
                              max={5}
                              step={1}
                              value={weights[crit.key]}
                              onChange={(e) => setWeights((w) => ({ ...w, [crit.key]: Number(e.target.value) }))}
                              className="w-full cursor-pointer accent-[var(--brand)]"
                          />
                        </div>
                    ))}
                  </div>

                  <div className="rounded-lg border border-[var(--brand-subtle)] bg-[var(--brand-subtle)] p-5">
                    {analysis.totalWeight === 0 ? (
                        <p className="text-sm text-[var(--text-muted)]">Increase the weight of at least one criterion to see the recommendation.</p>
                    ) : (
                        <div className="flex flex-col gap-3">
                          <div className="flex items-center gap-2 text-sm">
                            <Trophy className="h-5 w-5 shrink-0 text-[var(--brand)]" />
                            {analysis.recommended ? (
                                <span className="text-[var(--text-primary)]">
                          Based on your priorities, we recommend{" "}
                                  <span className="font-bold text-[var(--brand)]">{analysis.recommended.name}</span>.
                        </span>
                            ) : (
                                <span className="text-[var(--text-primary)]">It&apos;s a tie for these priorities.</span>
                            )}
                          </div>
                          <ScoreBar name={countryA.name} pct={analysis.pctA} lead={analysis.pctA >= analysis.pctB} />
                          <ScoreBar name={countryB.name} pct={analysis.pctB} lead={analysis.pctB > analysis.pctA} />
                        </div>
                    )}
                  </div>
                </div>

                {/* ---- Scoreboard (winner per criterion) ---- */}
                <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] shadow-sm">
                  <div className="flex items-center justify-between gap-4 border-b border-[var(--border)] px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Scale className="h-5 w-5 text-[var(--brand)]" />
                      <h3 className="text-sm font-semibold text-[var(--text-primary)]">Scorecard</h3>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-semibold">
                  <span className={analysis.winsA >= analysis.winsB ? "text-[var(--success)]" : "text-[var(--text-muted)]"}>
                    {countryA.name} {analysis.winsA}
                  </span>
                      <span className="text-[var(--text-faint)]">×</span>
                      <span className={analysis.winsB > analysis.winsA ? "text-[var(--success)]" : "text-[var(--text-muted)]"}>
                    {analysis.winsB} {countryB.name}
                  </span>
                    </div>
                  </div>

                  <div className="divide-y divide-[var(--border-subtle)]">
                    {analysis.rows.map(({ crit, winner }) => (
                        <div key={crit.key} className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 px-4 py-3 sm:px-6">
                          <ScoreCell text={crit.format(countryA)} win={winner === "A"} align="right" />
                          <div className="flex min-w-[96px] flex-col items-center gap-0.5 px-2">
                            <crit.icon className="h-4 w-4 text-[var(--text-muted)]" />
                            <span className="text-center text-[10px] uppercase tracking-wider text-[var(--text-faint)]">{crit.label}</span>
                          </div>
                          <ScoreCell text={crit.format(countryB)} win={winner === "B"} align="left" />
                        </div>
                    ))}
                  </div>
                </div>

                {/* ---- Side-by-side panels ---- */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <CountryPanel label="COUNTRY A" country={countryA} other={countryB} />
                  <CountryPanel label="COUNTRY B" country={countryB} other={countryA} />
                </div>
              </>
          ) : (
              <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-[var(--border-strong)] bg-[var(--bg-surface)] p-20 text-center shadow-sm">
                <div className="flex h-16 w-16 shrink-0 animate-pulse items-center justify-center rounded-full bg-[var(--brand-subtle)] text-[var(--brand)]">
                  <Compass className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold tracking-tight text-[var(--text-primary)]">Waiting for Country Selection</h3>
                <p className="max-w-sm text-xs font-normal leading-relaxed text-[var(--text-muted)]">
                  Please select two different countries from the dropdowns above to see the detailed comparison.
                </p>
              </div>
          )}
        </section>
      </div>
  );
}

export default function ComparePage() {
  return (
      <Suspense
          fallback={
            <div className="flex min-h-screen w-full flex-col items-center justify-center gap-4 bg-[var(--bg-page)]">
              <div className="flex h-12 w-12 animate-spin rounded-full border-4 border-[var(--brand)] border-t-transparent" />
              <span className="text-xs font-medium text-[var(--text-muted)]">Loading comparison tool...</span>
            </div>
          }
      >
        <CompareContent />
      </Suspense>
  );
}
