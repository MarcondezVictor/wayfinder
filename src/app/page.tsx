"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import InteractiveMap from "@/components/InteractiveMap";
import { getCountries } from "@/lib/db-countries";
import { CountrySchema } from "@/lib/countries-data";

export default function Home() {
  const [countries, setCountries] = useState<CountrySchema[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCountries().then((data) => {
      setCountries(data || []);
      setLoading(false);
    });
  }, []);

  const recentlyAdded = countries.slice(-4);

  const filteredCountries = countries.filter((country) =>
    country.name.toLowerCase().includes(search.toLowerCase()) ||
    country.continent.toLowerCase().includes(search.toLowerCase())
  );

  const getSafetyBadgeStyle = (score: number) => {
    if (score >= 8) {
      return "bg-[var(--success-bg)] text-[var(--success)] border-[var(--success-border)]";
    }
    if (score >= 5) {
      return "bg-[var(--warning-bg)] text-[var(--warning)] border-[var(--warning-border)]";
    }
    return "bg-[var(--danger-bg)] text-[var(--danger)] border-[var(--danger-border)]";
  };

  return (
    <main className="w-full min-h-screen bg-[var(--bg-page)] text-[var(--text-body)] flex flex-col items-center">
      
      {/* HERO */}
      <section className="bg-[var(--bg-surface)] border-b border-[var(--border-subtle)] w-full flex justify-center">
        <div className="mx-auto max-w-3xl px-6 py-16 text-center flex flex-col items-center w-full">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-[var(--text-primary)] mb-3">
            Planeia a tua próxima viagem
          </h1>
          <p className="text-base text-[var(--text-muted)] mb-8 leading-relaxed max-w-xl">
            Vistos, custos, segurança e clima para 20 países, tudo num só lugar.
          </p>
          
          <div className="relative w-full max-w-md mx-auto">
            <input
              type="text"
              placeholder="Pesquisar país ou continente..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2.5 text-sm border border-[var(--border)] rounded-lg bg-[var(--bg-surface)] text-[var(--text-primary)] placeholder:text-[var(--text-faint)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/10 transition-colors"
            />
          </div>
        </div>
      </section>

      {/* MAPA */}
      <section className="bg-[var(--bg-page)] border-b border-[var(--border-subtle)] w-full flex justify-center">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-10 flex flex-col items-center w-full">
          <div className="mb-5 text-center flex flex-col items-center">
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">
              Mapa interativo
            </h2>
            <p className="text-sm text-[var(--text-muted)] mt-1 max-w-md">
              Clica num país para ver a análise completa
            </p>
          </div>
          
          <div
            className="rounded-xl border border-[var(--border)] overflow-hidden bg-[var(--bg-surface)] w-full max-w-5xl"
            style={{ height: "480px" }}
          >
            <InteractiveMap countries={countries} />
          </div>
        </div>
      </section>

      {/* ADICIONADOS RECENTEMENTE */}
      <section className="bg-[var(--bg-surface)] border-b border-[var(--border-subtle)] w-full flex justify-center">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-10 flex flex-col items-center w-full">
          <div className="text-center mb-6 flex flex-col items-center">
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">
              Adicionados recentemente
            </h2>
            <p className="text-sm text-[var(--text-muted)] mt-1 max-w-md">
              Os últimos destinos integrados na plataforma.
            </p>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="h-40 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-page)] animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
              {recentlyAdded.map((country) => (
                <Link
                  key={country.slug}
                  href={`/country/${country.slug}`}
                  className="group flex flex-col bg-[var(--bg-page)] rounded-xl border border-[var(--border-subtle)] hover:border-[var(--border)] transition-all p-5 shadow-sm text-left"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl" role="img" aria-label={country.name}>
                      {country.flagEmoji}
                    </span>
                    <span className="font-semibold text-[var(--text-primary)] text-[15px] group-hover:text-[var(--brand)] transition-colors">
                      {country.name}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text-muted)] line-clamp-2 leading-relaxed flex-grow mb-4">
                    {country.tagline}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-auto">
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded border ${getSafetyBadgeStyle(country.safetyScore)}`}>
                      Segurança: {country.safetyScore}/10
                    </span>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-muted)]">
                      €{Math.round(country.avgHotelPrice + country.avgMealPrice * 2 + country.avgTransportCost)}/dia
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section className="bg-[var(--bg-page)] border-b border-[var(--border-subtle)] w-full flex justify-center">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-14 flex flex-col items-center w-full">
          <div className="flex flex-col gap-1 text-center mb-10 flex flex-col items-center">
            <h2 className="text-xl font-semibold text-[var(--text-primary)] tracking-tight">
              Como funciona
            </h2>
            <p className="text-sm text-[var(--text-muted)] font-normal max-w-md">
              Três passos simples para planear a sua próxima viagem.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
            {[
              {
                step: "01",
                title: "Pesquisa o destino",
                description: "Procura pelo nome do país ou explora o mapa global para ver detalhes de segurança, custos e vistos.",
              },
              {
                step: "02",
                title: "Compara dados",
                description: "Analisa requisitos de entrada de forma consistente e estima o orçamento diário médio.",
              },
              {
                step: "03",
                title: "Guarda favoritos",
                description: "Cria uma conta para marcar países de interesse e acompanhar o planeamento de forma simples.",
              },
            ].map((item) => (
              <div key={item.step} className="flex flex-col gap-3 p-6 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-sm text-center items-center">
                <span className="text-2xl font-semibold text-[var(--brand)] tracking-tight">
                  {item.step}
                </span>
                <h3 className="text-base font-semibold text-[var(--text-primary)]">
                  {item.title}
                </h3>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed font-normal">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TODOS OS PAÍSES */}
      <section className="bg-[var(--bg-surface)] w-full flex justify-center">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-10 pb-20 flex flex-col items-center w-full">
          <div className="flex flex-col items-center gap-1 mb-6 text-center">
            <h2 className="text-xl font-semibold text-[var(--text-primary)] tracking-tight">
              Todos os países
            </h2>
            <p className="text-sm text-[var(--text-muted)] font-normal max-w-md">
              Lista completa de destinos disponíveis para pesquisa e comparação.
            </p>
            {!loading && (
              <span className="text-xs text-[var(--text-muted)] font-medium mt-1">
                {filteredCountries.length} {filteredCountries.length === 1 ? "país encontrado" : "países encontrados"}
              </span>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
              {[1, 2, 3, 6].map((n) => (
                <div key={n} className="h-32 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] animate-pulse" />
              ))}
            </div>
          ) : filteredCountries.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-[var(--border)] rounded-xl bg-[var(--bg-surface)] w-full max-w-md mx-auto">
              <p className="text-sm text-[var(--text-muted)] font-normal">
                Nenhum país encontrado para a pesquisa.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
              {filteredCountries.map((country) => (
                <Link
                  key={country.slug}
                  href={`/country/${country.slug}`}
                  className="group flex flex-col bg-[var(--bg-surface)] rounded-xl border border-[var(--border-subtle)] hover:border-[var(--border)] transition-all p-5 shadow-sm text-left"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl" role="img" aria-label={country.name}>
                      {country.flagEmoji}
                    </span>
                    <span className="font-semibold text-[var(--text-primary)] text-[15px] group-hover:text-[var(--brand)] transition-colors">
                      {country.name}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-auto text-[10px] font-medium">
                    <span className={`px-2 py-0.5 rounded border ${getSafetyBadgeStyle(country.safetyScore)}`}>
                      Segurança: {country.safetyScore}/10
                    </span>
                    <span className="px-2 py-0.5 rounded border border-[var(--border-subtle)] bg-[var(--bg-page)] text-[var(--text-muted)]">
                      €{Math.round(country.avgHotelPrice + country.avgMealPrice * 2 + country.avgTransportCost)}/dia
                    </span>
                    <span className="px-2 py-0.5 rounded border border-[var(--border-subtle)] bg-[var(--bg-page)] text-[var(--text-muted)] uppercase tracking-wider">
                      {country.continent}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

    </main>
  );
}
