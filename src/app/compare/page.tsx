"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { countriesData } from "@/lib/countries-data";
import Link from "next/link";
import { Compass, Scale } from "lucide-react";

function CompareContent() {
  const searchParams = useSearchParams();
  const [countryASlug, setCountryASlug] = useState("");
  const [countryBSlug, setCountryBSlug] = useState("");

  // Initialize from search queries if present
  useEffect(() => {
    const cA = searchParams.get("countryA");
    const cB = searchParams.get("countryB");
    if (cA) setCountryASlug(cA);
    if (cB) setCountryBSlug(cB);
  }, [searchParams]);

  const countryA = countriesData.find((c) => c.slug === countryASlug) || null;
  const countryB = countriesData.find((c) => c.slug === countryBSlug) || null;

  // Analysis helpers
  const getCheaperCountry = () => {
    if (!countryA || !countryB) return null;
    const costA = Math.round(countryA.avgHotelPrice + countryA.avgMealPrice * 2 + countryA.avgTransportCost);
    const costB = Math.round(countryB.avgHotelPrice + countryB.avgMealPrice * 2 + countryB.avgTransportCost);
    if (costA < costB) return countryA;
    if (costB < costA) return countryB;
    return null;
  };

  const getSaferCountry = () => {
    if (!countryA || !countryB) return null;
    if (countryA.safetyScore > countryB.safetyScore) return countryA;
    if (countryB.safetyScore > countryA.safetyScore) return countryB;
    return null;
  };

  const cheaper = getCheaperCountry();
  const safer = getSaferCountry();

  return (
    <div className="w-full min-h-screen flex flex-col bg-[var(--bg-page)] pb-20 relative text-[var(--text-body)]">
      
      {/* Header Banner */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-6 flex flex-col gap-4">
        <div>
          <Link
            href="/"
            className="text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          >
            Voltar ao Início
          </Link>
        </div>

        <div className="flex flex-col gap-2">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[var(--accent-subtle)] px-3 py-1 text-xs font-medium text-[var(--accent)] border border-[var(--accent)]/20 w-max">
            <Scale className="h-4 w-4" />
            <span>Ferramenta de Comparação</span>
          </div>
          <h1 className="text-3xl font-semibold text-[var(--text-primary)] tracking-tight">
            Comparar Países Lado a Lado
          </h1>
          <p className="text-sm font-normal text-[var(--text-muted)] leading-relaxed max-w-2xl">
            Escolha dois destinos abaixo para confrontar requisitos legais, custos diários e índices de segurança.
          </p>
        </div>
      </section>

      {/* Selectors Bar */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] p-6 shadow-sm">
          
          {/* Select A */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
              País A (Esquerda)
            </label>
            <select
              value={countryASlug}
              onChange={(e) => setCountryASlug(e.target.value)}
              className="w-full text-sm text-[var(--text-primary)] bg-[var(--bg-surface)] border border-[var(--border)] rounded-md px-4 py-2.5 outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/10 transition-colors placeholder:text-[var(--text-faint)]"
            >
              <option value="">-- Selecione o País A --</option>
              {countriesData.map((c) => (
                <option key={c.slug} value={c.slug} disabled={c.slug === countryBSlug}>
                  {c.flagEmoji} {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Select B */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
              País B (Direita)
            </label>
            <select
              value={countryBSlug}
              onChange={(e) => setCountryBSlug(e.target.value)}
              className="w-full text-sm text-[var(--text-primary)] bg-[var(--bg-surface)] border border-[var(--border)] rounded-md px-4 py-2.5 outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/10 transition-colors placeholder:text-[var(--text-faint)]"
            >
              <option value="">-- Selecione o País B --</option>
              {countriesData.map((c) => (
                <option key={c.slug} value={c.slug} disabled={c.slug === countryASlug}>
                  {c.flagEmoji} {c.name}
                </option>
              ))}
            </select>
          </div>

        </div>
      </section>

      {/* Comparison Grid */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6">
        {countryA && countryB ? (
          <>
            {/* Quick Analysis Alert Banner */}
            <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--brand-subtle)] text-[var(--brand)] shrink-0">
                  <Scale className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[var(--text-primary)] tracking-tight">
                    Análise WayFinder Inteligente
                  </h3>
                  <div className="text-xs font-normal leading-relaxed mt-1 flex flex-col gap-2">
                    {cheaper && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded bg-[var(--warning-bg)] text-[var(--warning)] border border-[var(--warning-border)] w-max">
                        Custo: {cheaper.name} tem o custo de vida mais acessível.
                      </span>
                    )}
                    {safer && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded bg-[var(--success-bg)] text-[var(--success)] border border-[var(--success-border)] w-max">
                        Segurança: {safer.name} é avaliado como mais seguro.
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-xs font-semibold text-[var(--text-faint)] uppercase tracking-wider">
                Análise ativa
              </div>
            </div>

            {/* Side by side cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Country A Panel */}
              <div className="bg-[var(--bg-surface)] rounded-xl border border-[var(--border)] hover:border-[var(--border-strong)] transition-colors overflow-hidden p-6 flex flex-col gap-6 animate-fade-in-up">
                
                {/* Heading */}
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{countryA.flagEmoji}</span>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-faint)]">
                      PAÍS A
                    </span>
                    <Link href={`/country/${countryA.slug}`} className="text-xl font-semibold text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors">
                      {countryA.name}
                    </Link>
                  </div>
                </div>

                <p className="text-xs text-[var(--text-muted)] leading-relaxed font-normal italic">
                  "{countryA.tagline}"
                </p>

                <hr className="border-[var(--border-subtle)]" />

                {/* Safety block */}
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-semibold text-[var(--text-faint)] uppercase tracking-wider">
                    Segurança
                  </span>
                  <div className="flex items-center justify-between text-sm font-medium text-[var(--text-body)]">
                    <span>Índice de segurança</span>
                    <span className={
                      countryA.safetyScore >= 8 
                        ? "text-xs font-medium px-2 py-0.5 rounded bg-[var(--success-bg)] text-[var(--success)] border border-[var(--success-border)]"
                        : countryA.safetyScore >= 5
                        ? "text-xs font-medium px-2 py-0.5 rounded bg-[var(--warning-bg)] text-[var(--warning)] border border-[var(--warning-border)]"
                        : "text-xs font-medium px-2 py-0.5 rounded bg-[var(--danger-bg)] text-[var(--danger)] border border-[var(--danger-border)]"
                    }>
                      {countryA.safetyScore} / 10
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text-muted)] leading-normal font-normal">
                    {countryA.travelWarnings ?? "Sem avisos de segurança registados."}
                  </p>
                </div>

                <hr className="border-[var(--border-subtle)]" />

                {/* Cost block */}
                <div className="flex flex-col gap-3">
                  <span className="text-xs font-semibold text-[var(--text-faint)] uppercase tracking-wider">
                    Custo e Finanças
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-semibold text-[var(--text-primary)]">{Math.round(countryA.avgHotelPrice + countryA.avgMealPrice * 2 + countryA.avgTransportCost)}€</span>
                    <span className="text-xs font-normal text-[var(--text-muted)]">/ dia em média</span>
                  </div>
                  
                  {/* Detailed breakdowns */}
                  <div className="flex flex-col gap-2 rounded-lg bg-[var(--bg-subtle)] p-4 border border-[var(--border-subtle)] text-xs text-[var(--text-muted)]">
                    <div className="flex justify-between font-normal">
                      <span>Alojamento (Médio):</span>
                      <span className="text-[var(--text-primary)] font-semibold">{countryA.avgHotelPrice}€</span>
                    </div>
                    <div className="flex justify-between font-normal mt-1">
                      <span>Alimentação (Médio):</span>
                      <span className="text-[var(--text-primary)] font-semibold">{countryA.avgMealPrice}€</span>
                    </div>
                    <div className="flex justify-between font-normal mt-1">
                      <span>Transporte (Médio):</span>
                      <span className="text-[var(--text-primary)] font-semibold">{countryA.avgTransportCost}€</span>
                    </div>
                    <div className="flex justify-between font-normal mt-1">
                      <span>Índice de Custo de Vida:</span>
                      <span className="text-[var(--text-primary)] font-semibold">{countryA.costLivingIndex} / 120</span>
                    </div>
                  </div>
                </div>

                <hr className="border-[var(--border-subtle)]" />

                {/* Visa info */}
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-semibold text-[var(--text-faint)] uppercase tracking-wider">
                    Informações Legais & Visto
                  </span>
                  <p className="text-xs text-[var(--text-body)] leading-relaxed font-normal">
                    {countryA.visaRequirements}
                  </p>
                </div>

                <hr className="border-[var(--border-subtle)]" />

                {/* Climate info */}
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-semibold text-[var(--text-faint)] uppercase tracking-wider">
                    Ambiente & Clima
                  </span>
                  <div className="text-xs font-semibold text-[var(--text-primary)]">
                    Clima {countryA.climateType}
                  </div>
                  <p className="text-xs text-[var(--text-muted)] leading-normal font-normal">
                    {countryA.climateDetails}
                  </p>
                </div>

                <Link
                  href={`/country/${countryA.slug}`}
                  className="text-sm font-medium text-[var(--text-body)] px-5 py-2.5 rounded-md border border-[var(--border)] hover:bg-[var(--bg-subtle)] transition-colors text-center mt-auto cursor-pointer"
                >
                  Ver Detalhes
                </Link>

              </div>

              {/* Country B Panel */}
              <div className="bg-[var(--bg-surface)] rounded-xl border border-[var(--border)] hover:border-[var(--border-strong)] transition-colors overflow-hidden p-6 flex flex-col gap-6 animate-fade-in-up">
                
                {/* Heading */}
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{countryB.flagEmoji}</span>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-faint)]">
                      PAÍS B
                    </span>
                    <Link href={`/country/${countryB.slug}`} className="text-xl font-semibold text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors">
                      {countryB.name}
                    </Link>
                  </div>
                </div>

                <p className="text-xs text-[var(--text-muted)] leading-relaxed font-normal italic">
                  "{countryB.tagline}"
                </p>

                <hr className="border-[var(--border-subtle)]" />

                {/* Safety block */}
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-semibold text-[var(--text-faint)] uppercase tracking-wider">
                    Segurança
                  </span>
                  <div className="flex items-center justify-between text-sm font-medium text-[var(--text-body)]">
                    <span>Índice de segurança</span>
                    <span className={
                      countryB.safetyScore >= 8 
                        ? "text-xs font-medium px-2 py-0.5 rounded bg-[var(--success-bg)] text-[var(--success)] border border-[var(--success-border)]"
                        : countryB.safetyScore >= 5
                        ? "text-xs font-medium px-2 py-0.5 rounded bg-[var(--warning-bg)] text-[var(--warning)] border border-[var(--warning-border)]"
                        : "text-xs font-medium px-2 py-0.5 rounded bg-[var(--danger-bg)] text-[var(--danger)] border border-[var(--danger-border)]"
                    }>
                      {countryB.safetyScore} / 10
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text-muted)] leading-normal font-normal">
                    {countryB.travelWarnings ?? "Sem avisos de segurança registados."}
                  </p>
                </div>

                <hr className="border-[var(--border-subtle)]" />

                {/* Cost block */}
                <div className="flex flex-col gap-3">
                  <span className="text-xs font-semibold text-[var(--text-faint)] uppercase tracking-wider">
                    Custo e Finanças
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-semibold text-[var(--text-primary)]">{Math.round(countryB.avgHotelPrice + countryB.avgMealPrice * 2 + countryB.avgTransportCost)}€</span>
                    <span className="text-xs font-normal text-[var(--text-muted)]">/ dia em média</span>
                  </div>
                  
                  {/* Detailed breakdowns */}
                  <div className="flex flex-col gap-2 rounded-lg bg-[var(--bg-subtle)] p-4 border border-[var(--border-subtle)] text-xs text-[var(--text-muted)]">
                    <div className="flex justify-between font-normal">
                      <span>Alojamento (Médio):</span>
                      <span className="text-[var(--text-primary)] font-semibold">{countryB.avgHotelPrice}€</span>
                    </div>
                    <div className="flex justify-between font-normal mt-1">
                      <span>Alimentação (Médio):</span>
                      <span className="text-[var(--text-primary)] font-semibold">{countryB.avgMealPrice}€</span>
                    </div>
                    <div className="flex justify-between font-normal mt-1">
                      <span>Transporte (Médio):</span>
                      <span className="text-[var(--text-primary)] font-semibold">{countryB.avgTransportCost}€</span>
                    </div>
                    <div className="flex justify-between font-normal mt-1">
                      <span>Índice de Custo de Vida:</span>
                      <span className="text-[var(--text-primary)] font-semibold">{countryB.costLivingIndex} / 120</span>
                    </div>
                  </div>
                </div>

                <hr className="border-[var(--border-subtle)]" />

                {/* Visa info */}
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-semibold text-[var(--text-faint)] uppercase tracking-wider">
                    Informações Legais & Visto
                  </span>
                  <p className="text-xs text-[var(--text-body)] leading-relaxed font-normal">
                    {countryB.visaRequirements}
                  </p>
                </div>

                <hr className="border-[var(--border-subtle)]" />

                {/* Climate info */}
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-semibold text-[var(--text-faint)] uppercase tracking-wider">
                    Ambiente & Clima
                  </span>
                  <div className="text-xs font-semibold text-[var(--text-primary)]">
                    Clima {countryB.climateType}
                  </div>
                  <p className="text-xs text-[var(--text-muted)] leading-normal font-normal">
                    {countryB.climateDetails}
                  </p>
                </div>

                <Link
                  href={`/country/${countryB.slug}`}
                  className="text-sm font-medium text-[var(--text-body)] px-5 py-2.5 rounded-md border border-[var(--border)] hover:bg-[var(--bg-subtle)] transition-colors text-center mt-auto cursor-pointer"
                >
                  Ver Detalhes
                </Link>

              </div>

            </div>
          </>
        ) : (
          /* Empty State Selector */
          <div className="rounded-xl border border-dashed border-[var(--border-strong)] p-20 flex flex-col items-center justify-center text-center gap-4 bg-[var(--bg-surface)] shadow-sm">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--brand-subtle)] text-[var(--brand)] shrink-0 animate-pulse">
              <Compass className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold text-[var(--text-primary)] tracking-tight">
              Aguardando Seleção de Países
            </h3>
            <p className="text-xs text-[var(--text-muted)] max-w-sm font-normal leading-relaxed">
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
    <Suspense fallback={
      <div className="w-full min-h-screen flex flex-col items-center justify-center bg-[var(--bg-page)] gap-4">
        <div className="flex h-12 w-12 animate-spin rounded-full border-4 border-[var(--brand)] border-t-transparent" />
        <span className="text-xs font-medium text-[var(--text-muted)]">A carregar ferramenta de comparação...</span>
      </div>
    }>
      <CompareContent />
    </Suspense>
  );
}
