'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type { CountrySchema } from '@/lib/countries-data'

interface CountriesGridProps {
    countries: CountrySchema[]
    search?: string
}

const CONTINENTS = [
    { value: 'All', label: 'All' },
    { value: 'Europe', label: 'Europe' },
    { value: 'Asia', label: 'Asia' },
    { value: 'Africa', label: 'Africa' },
    { value: 'North America', label: 'North America' },
    { value: 'South America', label: 'South America' },
    { value: 'Oceania', label: 'Oceania' },
]

export default function CountriesGrid({ countries, search = '' }: CountriesGridProps) {
    const router = useRouter()
    const [activeContinent, setActiveContinent] = useState<string>('All')

    const filtered = activeContinent === 'All'
        ? countries
        : countries.filter(c => c.continent === activeContinent)

    const term = search.trim().toLowerCase()
    const displayed = term
        ? filtered.filter(c =>
            c.name.toLowerCase().includes(term) ||
            c.continent.toLowerCase().includes(term)
        )
        : filtered

    return (
        <div className="w-full max-w-7xl px-6 lg:px-8 py-12 flex flex-col gap-8 items-center">
            {/* Continent filter tabs */}
            <div className="flex flex-wrap gap-2 justify-center">
                {CONTINENTS.map((tab) => {
                    const isActive = activeContinent === tab.value
                    return (
                        <button
                            key={tab.value}
                            onClick={() => setActiveContinent(tab.value)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-150 border ${
                                isActive
                                    ? 'bg-[var(--brand)] text-white border-[var(--brand)]'
                                    : 'bg-[var(--bg-surface)] text-[var(--text-muted)] border-[var(--border)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)]'
                            }`}
                        >
                            {tab.label}
                        </button>
                    )
                })}
            </div>

            {/* Card grid or empty state */}
            {displayed.length === 0 ? (
                <div className="text-center py-20 text-[var(--text-muted)]">
                    <p className="text-lg">No countries found.</p>
                    <button
                        onClick={() => setActiveContinent('All')}
                        className="mt-4 text-[var(--accent)] underline text-sm hover:text-[var(--accent-hover)] transition-colors"
                    >
                        Clear filters
                    </button>
                </div>
            ) : (
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {displayed.map(country => {
                        const costDaily = Math.round(
                            country.avgHotelPrice + country.avgMealPrice * 2 + country.avgTransportCost
                        )

                        return (
                            <div
                                key={country.id}
                                onClick={() => router.push(`/country/${country.slug}`)}
                                className="cursor-pointer rounded-2xl overflow-hidden bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-sm hover:shadow-md hover:border-[var(--border)] transition-all duration-200 group"
                            >
                                {/* Foto principal */}
                                <div className="relative h-44 w-full bg-[var(--bg-subtle)]">
                                    <img
                                        src={`/covers/${country.isoCode.toLowerCase()}.jpg`}
                                        onError={(e) => { (e.currentTarget as HTMLImageElement).src = country.imageUrl }}
                                        alt={country.name}
                                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                    {/* Flag SVG in the bottom-left of the cover photo */}
                                    <div className="absolute bottom-2 left-2">
                                        <img
                                            src={`/flags/${country.isoCode.toLowerCase()}.svg`}
                                            alt={`Flag of ${country.name}`}
                                            className="w-8 h-5 object-cover rounded-sm shadow"
                                        />
                                    </div>
                                </div>

                                {/* Card content */}
                                <div className="p-4">
                                    <div className="flex items-start justify-between mb-1 gap-2">
                                        <h3 className="font-bold text-[var(--text-primary)] text-lg leading-tight">
                                            {country.name}
                                        </h3>
                                        <span className="text-xs bg-[var(--brand-subtle)] text-[var(--brand)] px-2 py-0.5 rounded-full shrink-0">
                      {country.continent}
                    </span>
                                    </div>
                                    <p className="text-sm text-[var(--text-muted)] mb-3">
                                        🏛 {country.capital}
                                    </p>
                                    <div className="flex items-center justify-between text-sm border-t border-[var(--border-subtle)] pt-3 mt-1">
                    <span className="text-[var(--text-body)]">
                      🛡 Safety: <strong>{country.safetyScore}/10</strong>
                    </span>
                                        <span className="text-[var(--text-body)] font-semibold">
                      ~€{costDaily}/day
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
