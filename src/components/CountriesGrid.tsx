'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useState } from 'react'
import type { CountrySchema } from '@/lib/countries-data'

interface CountriesGridProps {
  countries: CountrySchema[]
}

const CONTINENTS = [
  { value: 'All', label: 'Todos' },
  { value: 'Europa', label: 'Europa' },
  { value: 'Ásia', label: 'Ásia' },
  { value: 'África', label: 'África' },
  { value: 'América do Norte', label: 'América do Norte' },
  { value: 'América do Sul', label: 'América do Sul' },
  { value: 'Oceânia', label: 'Oceânia' },
]

export default function CountriesGrid({ countries }: CountriesGridProps) {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [activeContinent, setActiveContinent] = useState<string>('All')

  const filtered = activeContinent === 'All'
    ? countries
    : countries.filter(c => c.continent === activeContinent)

  const displayed = filtered.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="w-full max-w-7xl px-6 lg:px-8 py-10 flex flex-col gap-8">
      {/* Barra de pesquisa */}
      <div className="w-full max-w-md mx-auto">
        <input
          type="text"
          placeholder="Pesquisar país ou continente..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2.5 text-sm border border-slate-200 dark:border-black-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors shadow-sm"
        />
      </div>

      {/* Tabs de continente */}
      <div className="flex flex-wrap gap-2 justify-center">
        {CONTINENTS.map((tab) => {
          const isActive = activeContinent === tab.value
          return (
            <button
              key={tab.value}
              onClick={() => setActiveContinent(tab.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-150 border ${
                isActive
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700'
              }`}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Grid de Cards ou Estado Vazio */}
      {displayed.length === 0 ? (
        <div className="text-center py-20 text-slate-400 dark:text-slate-500">
          <p className="text-lg">Nenhum país encontrado.</p>
          <button
            onClick={() => { setSearch(''); setActiveContinent('All') }}
            className="mt-4 text-indigo-600 dark:text-indigo-400 underline text-sm hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
          >
            Limpar filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {displayed.map(country => {
            const costDaily = Math.round(
              country.avgHotelPrice + country.avgMealPrice * 2 + country.avgTransportCost
            )

            return (
              <div
                key={country.id}
                onClick={() => router.push(`/country/${country.slug}`)}
                className="cursor-pointer rounded-2xl overflow-hidden bg-white dark:bg-slate-800 shadow hover:shadow-lg transition-all duration-200 group border border-slate-100 dark:border-slate-700/50"
              >
                {/* Foto principal */}
                <div className="relative h-44 w-full">
                  <Image
                    src={country.imageUrl || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=80'}
                    alt={country.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Bandeira SVG no canto inferior esquerdo da foto */}
                  <div className="absolute bottom-2 left-2">
                    <img
                      src={`/flags/${country.isoCode.toLowerCase()}.svg`}
                      alt={`Bandeira de ${country.name}`}
                      className="w-8 h-5 object-cover rounded-sm shadow"
                    />
                  </div>
                </div>

                {/* Conteúdo do card */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="font-bold text-slate-900 dark:text-white text-lg leading-tight">
                      {country.name}
                    </h3>
                    <span className="text-xs bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-full ml-2 shrink-0">
                      {country.continent}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                    🏛 {country.capital}
                  </p>
                  <div className="flex items-center justify-between text-sm border-t border-slate-50 dark:border-slate-700/50 pt-3 mt-1">
                    <span className="text-slate-600 dark:text-slate-300">
                      🛡 Segurança: <strong>{country.safetyScore}/10</strong>
                    </span>
                    <span className="text-slate-600 dark:text-slate-300 font-semibold">
                      ~€{costDaily}/dia
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
