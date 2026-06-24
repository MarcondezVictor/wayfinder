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
              Plan your next adventure
            </h1>
            <p className="text-base text-[var(--text-muted)] mb-7 max-w-xl leading-relaxed">
              Visas, costs, safety and climate — explore the map or search for a country.
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
                <p className="text-lg">Loading destinations...</p>
              </div>
          ) : (
              <CountriesGrid countries={countries} />
          )}
        </section>

      </main>
  );
}
