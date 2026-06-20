"use client";

import { useEffect, useState } from "react";
import InteractiveMap from "@/components/InteractiveMap";
import CountriesGrid from "@/components/CountriesGrid";
import SearchBar from "@/components/Searchbar";
import { getCountries } from "@/lib/db-countries";
import { CountrySchema } from "@/lib/countries-data";

export default function Home() {
  const [countries, setCountries] = useState<CountrySchema[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCountries().then((data) => {
      setCountries(data || []);
      setLoading(false);
    });
  }, []);

  return (
      <main className="w-full min-h-screen bg-[var(--bg-page)] text-[var(--text-body)] flex flex-col items-center">

        {/* HERO + PESQUISA (dropdown ao estilo PlonkIt) */}
        <section className="relative z-30 w-full flex justify-center bg-[var(--bg-page)]">
          <div className="w-full max-w-3xl px-6 pt-14 pb-6 flex flex-col items-center text-center">
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-[var(--text-primary)] mb-2">
              Planeia a tua próxima viagem
            </h1>
            <p className="text-base text-[var(--text-muted)] mb-7 max-w-xl leading-relaxed">
              Vistos, custos, segurança e clima — explora o mapa ou pesquisa um país.
            </p>
            <SearchBar countries={countries} />
          </div>
        </section>

        {/* MAPA — grande, a toda a largura e sem borda pesada */}
        <section className="relative z-10 w-full flex justify-center bg-[var(--bg-page)]">
          <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 pb-12">
            <div
                className="w-full rounded-2xl overflow-hidden bg-[var(--bg-surface)]"
                style={{ height: "620px" }}
            >
              <InteractiveMap countries={countries} />
            </div>
          </div>
        </section>

        {/* GRID DE PAÍSES (navegar por continente) */}
        <section className="w-full flex justify-center bg-[var(--bg-surface)] border-t border-[var(--border-subtle)]">
          {loading ? (
              <div className="w-full max-w-7xl px-6 lg:px-8 py-20 text-center text-[var(--text-muted)]">
                <p className="text-lg">Carregando destinos...</p>
              </div>
          ) : (
              <CountriesGrid countries={countries} />
          )}
        </section>

        {/* COMO FUNCIONA */}
        <section className="bg-[var(--bg-page)] border-t border-[var(--border-subtle)] w-full flex justify-center">
          <div className="mx-auto max-w-7xl px-6 lg:px-8 py-14 flex flex-col items-center w-full">
            <div className="flex flex-col gap-1 text-center mb-10 items-center">
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

      </main>
  );
}
