"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { getCountries } from "@/lib/db-countries";
import type { CountrySchema } from "@/lib/countries-data";
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
  type LucideIcon,
} from "lucide-react";

/* ----------------------------------------------------------------------------
 * Critérios pontuáveis (todos numéricos -> dá para placar e ponderação)
 * O visto fica de fora porque é texto livre; aparece nos painéis como info.
 * -------------------------------------------------------------------------- */
const dailyCost = (c: CountrySchema) =>
    Math.round(c.avgHotelPrice + c.avgMealPrice * 2 + c.avgTransportCost);

type Better = "high" | "low";

interface Criterion {
  key: string;
  label: string;
  icon: LucideIcon;
  better: Better; // "high" = maior é melhor; "low" = menor é melhor
  get: (c: CountrySchema) => number;
  format: (c: CountrySchema) => string;
}

const CRITERIA: Criterion[] = [
  { key: "cost", label: "Custo diário", icon: Wallet, better: "low", get: dailyCost, format: (c) => `${dailyCost(c)}€/dia` },
  { key: "safety", label: "Segurança", icon: ShieldCheck, better: "high", get: (c) => c.safetyScore, format: (c) => `${c.safetyScore}/10` },
  { key: "internet", label: "Internet", icon: Wifi, better: "high", get: (c) => c.internetQualityScore, format: (c) => `${c.internetQualityScore}/10` },
  { key: "health", label: "Saúde", icon: HeartPulse, better: "high", get: (c) => c.healthcareQualityScore, format: (c) => `${c.healthcareQualityScore}/10` },
  { key: "transport", label: "Transportes", icon: Bus, better: "high", get: (c) => c.transportQualityScore, format: (c) => `${c.transportQualityScore}/10` },
];

const WEIGHT_LABELS = ["Ignorar", "Pouco", "Médio", "Normal", "Muito", "Máx."];

function winnerOf(crit: Criterion, a: CountrySchema, b: CountrySchema): "A" | "B" | "tie" {
  const va = crit.get(a);
  const vb = crit.get(b);
  if (va === vb) return "tie";
  if (crit.better === "high") return va > vb ? "A" : "B";
  return va < vb ? "A" : "B";
}

// Normaliza o valor dentro do par para [0,1] (1 = melhor dos dois)
function norm(crit: Criterion, value: number, a: CountrySchema, b: CountrySchema): number {
  const va = crit.get(a);
  const vb = crit.get(b);
  if (crit.better === "high") {
    const best = Math.max(va, vb);
    return best > 0 ? value / best : 0.5;
  }
  const best = Math.min(va, vb);
  return value > 0 ? best / value : 0.5;
}

/* ----------------------------------------------------------------------------
 * Pequenos componentes de apresentação
 * -------------------------------------------------------------------------- */
function Best() {
  return (
      <span className="inline-flex items-center gap-0.5 rounded border border-[var(--success-border)] bg-[var(--success-bg)] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--success)]">
      melhor
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
        {/* Cabeçalho */}
        <div className="flex items-center gap-3">
          <img
              src={`/flags/${country.isoCode.toLowerCase()}.svg`}
              alt={`Bandeira de ${country.name}`}
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

        {/* Segurança */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-faint)]">Segurança</span>
          <div className="flex items-center justify-between text-sm font-medium text-[var(--text-body)]">
          <span className="flex items-center gap-1.5">
            Índice de segurança {winSafety && <Best />}
          </span>
            <span className={`rounded border px-2 py-0.5 text-xs font-medium ${safetyBadge}`}>{country.safetyScore} / 10</span>
          </div>
          <p className="text-xs font-normal leading-normal text-[var(--text-muted)]">
            {country.travelWarnings ?? "Sem avisos de segurança registados."}
          </p>
        </div>

        <hr className="border-[var(--border-subtle)]" />

        {/* Custo */}
        <div className="flex flex-col gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-faint)]">Custo e Finanças</span>
          <div className="flex items-baseline gap-1">
            <span className={`text-3xl font-semibold ${winCost ? "text-[var(--success)]" : "text-[var(--text-primary)]"}`}>{cost}€</span>
            <span className="text-xs font-normal text-[var(--text-muted)]">/ dia em média</span>
            {winCost && <span className="ml-1"><Best /></span>}
          </div>

          <div className="flex flex-col gap-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-subtle)] p-4 text-xs text-[var(--text-muted)]">
            <BreakdownRow label="Alojamento (Médio):" value={`${country.avgHotelPrice}€`} win={winHotel} />
            <BreakdownRow label="Alimentação (Médio):" value={`${country.avgMealPrice}€`} win={winMeal} />
            <BreakdownRow label="Transporte (Médio):" value={`${country.avgTransportCost}€`} win={winTransport} />
            <BreakdownRow label="Índice de Custo de Vida:" value={`${country.costLivingIndex} / 120`} win={winLiving} />
          </div>
        </div>

        <hr className="border-[var(--border-subtle)]" />

        {/* Visto */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-faint)]">Informações Legais &amp; Visto</span>
          <p className="text-xs font-normal leading-relaxed text-[var(--text-body)]">{country.visaRequirements}</p>
        </div>

        <hr className="border-[var(--border-subtle)]" />

        {/* Clima */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-faint)]">Ambiente &amp; Clima</span>
          <div className="text-xs font-semibold text-[var(--text-primary)]">Clima {country.climateType}</div>
          <p className="text-xs font-normal leading-normal text-[var(--text-muted)]">{country.climateDetails}</p>
        </div>

        <Link
            href={`/country/${country.slug}`}
            className="mt-auto cursor-pointer rounded-md border border-[var(--border)] px-5 py-2.5 text-center text-sm font-medium text-[var(--text-body)] transition-colors hover:bg-[var(--bg-subtle)]"
        >
          Ver Detalhes
        </Link>
      </div>
  );
}

/* ----------------------------------------------------------------------------
 * Página
 * -------------------------------------------------------------------------- */
function CompareContent() {
  const searchParams = useSearchParams();
  const [countryASlug, setCountryASlug] = useState("");
  const [countryBSlug, setCountryBSlug] = useState("");
  const [countries, setCountries] = useState<CountrySchema[]>([]);
  const [weights, setWeights] = useState<Record<string, number>>(() =>
      Object.fromEntries(CRITERIA.map((c) => [c.key, 3]))
  );

  // Inicializar a partir do URL (?countryA=&countryB=)
  useEffect(() => {
    const cA = searchParams.get("countryA");
    const cB = searchParams.get("countryB");
    if (cA) setCountryASlug(cA);
    if (cB) setCountryBSlug(cB);
  }, [searchParams]);

  // Carregar todos os países da base de dados
  useEffect(() => {
    getCountries()
        .then(setCountries)
        .catch(() => setCountries([]));
  }, []);

  const countryA = countries.find((c) => c.slug === countryASlug) || null;
  const countryB = countries.find((c) => c.slug === countryBSlug) || null;

  // Análise (placar + recomendação ponderada)
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
              Voltar ao Início
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            <div className="inline-flex w-max items-center gap-1.5 rounded-full border border-[var(--accent)]/20 bg-[var(--accent-subtle)] px-3 py-1 text-xs font-medium text-[var(--accent)]">
              <Scale className="h-4 w-4" />
              <span>Ferramenta de Comparação</span>
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-[var(--text-primary)]">Comparar Países Lado a Lado</h1>
            <p className="max-w-2xl text-sm font-normal leading-relaxed text-[var(--text-muted)]">
              Escolha dois destinos abaixo para confrontar requisitos legais, custos diários e índices de segurança.
            </p>
          </div>
        </section>

        {/* Seletores */}
        <section className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] p-6 shadow-sm md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium uppercase tracking-wider text-[var(--text-muted)]">País A (Esquerda)</label>
              <select
                  value={countryASlug}
                  onChange={(e) => setCountryASlug(e.target.value)}
                  className="w-full rounded-md border border-[var(--border)] bg-[var(--bg-surface)] px-4 py-2.5 text-sm text-[var(--text-primary)] outline-none transition-colors focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/10"
              >
                <option value="">-- Selecione o País A --</option>
                {countries.map((c) => (
                    <option key={c.slug} value={c.slug} disabled={c.slug === countryBSlug}>
                      {c.name}
                    </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium uppercase tracking-wider text-[var(--text-muted)]">País B (Direita)</label>
              <select
                  value={countryBSlug}
                  onChange={(e) => setCountryBSlug(e.target.value)}
                  className="w-full rounded-md border border-[var(--border)] bg-[var(--bg-surface)] px-4 py-2.5 text-sm text-[var(--text-primary)] outline-none transition-colors focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/10"
              >
                <option value="">-- Selecione o País B --</option>
                {countries.map((c) => (
                    <option key={c.slug} value={c.slug} disabled={c.slug === countryASlug}>
                      {c.name}
                    </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Comparação */}
        <section className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
          {countryA && countryB && analysis ? (
              <>
                {/* ---- Recomendação por prioridades (sliders) ---- */}
                <div className="flex flex-col gap-5 rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] p-6 shadow-sm">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <SlidersHorizontal className="h-5 w-5 text-[var(--brand)]" />
                      <h3 className="text-sm font-semibold text-[var(--text-primary)]">O que importa para ti?</h3>
                    </div>
                    <p className="text-xs text-[var(--text-muted)]">Ajusta o peso de cada critério — a recomendação atualiza em tempo real.</p>
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
                        <p className="text-sm text-[var(--text-muted)]">Aumenta o peso de pelo menos um critério para veres a recomendação.</p>
                    ) : (
                        <div className="flex flex-col gap-3">
                          <div className="flex items-center gap-2 text-sm">
                            <Trophy className="h-5 w-5 shrink-0 text-[var(--brand)]" />
                            {analysis.recommended ? (
                                <span className="text-[var(--text-primary)]">
                          Para as tuas prioridades, recomendamos{" "}
                                  <span className="font-bold text-[var(--brand)]">{analysis.recommended.name}</span>.
                        </span>
                            ) : (
                                <span className="text-[var(--text-primary)]">Empate técnico para estas prioridades.</span>
                            )}
                          </div>
                          <ScoreBar name={countryA.name} pct={analysis.pctA} lead={analysis.pctA >= analysis.pctB} />
                          <ScoreBar name={countryB.name} pct={analysis.pctB} lead={analysis.pctB > analysis.pctA} />
                        </div>
                    )}
                  </div>
                </div>

                {/* ---- Placar (vencedor por critério) ---- */}
                <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] shadow-sm">
                  <div className="flex items-center justify-between gap-4 border-b border-[var(--border)] px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Scale className="h-5 w-5 text-[var(--brand)]" />
                      <h3 className="text-sm font-semibold text-[var(--text-primary)]">Placar</h3>
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

                {/* ---- Painéis lado a lado ---- */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <CountryPanel label="PAÍS A" country={countryA} other={countryB} />
                  <CountryPanel label="PAÍS B" country={countryB} other={countryA} />
                </div>
              </>
          ) : (
              <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-[var(--border-strong)] bg-[var(--bg-surface)] p-20 text-center shadow-sm">
                <div className="flex h-16 w-16 shrink-0 animate-pulse items-center justify-center rounded-full bg-[var(--brand-subtle)] text-[var(--brand)]">
                  <Compass className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold tracking-tight text-[var(--text-primary)]">Aguardando Seleção de Países</h3>
                <p className="max-w-sm text-xs font-normal leading-relaxed text-[var(--text-muted)]">
                  Por favor, selecione dois países diferentes nos campos de seleção acima para ver a comparação detalhada.
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
              <span className="text-xs font-medium text-[var(--text-muted)]">A carregar ferramenta de comparação...</span>
            </div>
          }
      >
        <CompareContent />
      </Suspense>
  );
}
