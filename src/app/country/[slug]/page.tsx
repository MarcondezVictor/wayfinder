import { getCountryBySlug, getCountries } from "@/lib/db-countries";
import { notFound } from "next/navigation";
import Link from "next/link";
import FavoriteButton from "@/components/FavoriteButton";
import { PointOfInterest } from "@/lib/countries-data";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Generate static params for all countries so it builds statically
export async function generateStaticParams() {
  const list = await getCountries();
  return list.map((c) => ({
    slug: c.slug,
  }));
}

export default async function CountryPage({ params }: PageProps) {
  const { slug } = await params;
  const country = await getCountryBySlug(slug);

  if (!country) {
    notFound();
  }

  // Visual helpers for scores
  const getScoreBadgeColor = (score: number) => {
    if (score >= 8) return "bg-[var(--success-bg)] text-[var(--success)] border border-[var(--success-border)]";
    if (score >= 5) return "bg-[var(--warning-bg)] text-[var(--warning)] border border-[var(--warning-border)]";
    return "bg-[var(--danger-bg)] text-[var(--danger)] border border-[var(--danger-border)]";
  };

  const getScoreBarColor = (score: number) => {
    if (score >= 8) return "bg-[var(--success)]";
    if (score >= 5) return "bg-[var(--warning)]";
    return "bg-[var(--danger)]";
  };

  return (
    <div className="w-full min-h-screen flex flex-col bg-[var(--bg-page)] pb-20 relative text-[var(--text-body)]">
      
      {/* Hero Banner Header */}
      <div className="relative w-full h-[320px] bg-[var(--bg-surface)] border-b border-[var(--border)] overflow-hidden">
        <img
          src={country.imageUrl}
          alt={country.name}
          className="w-full h-full object-cover opacity-20 filter brightness-105"
        />
        <div className="absolute inset-0 bg-[var(--bg-surface)]/60" />
        
        {/* Navigation Breadcrumb */}
        <div className="absolute top-8 left-6 md:left-12 z-10">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-md bg-[var(--bg-surface)] border border-[var(--border)] px-4 py-2 text-xs font-semibold text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] shadow-sm transition-all active:scale-[0.98]"
          >
            <span>Voltar ao Mapa</span>
          </Link>
        </div>

        {/* Hero Details */}
        <div className="absolute bottom-8 left-6 md:left-12 flex flex-col gap-2 max-w-4xl text-[var(--text-primary)]">
          <div className="flex items-center gap-3">
            <span className="text-5xl">{country.flagEmoji}</span>
            <div className="flex flex-col">
              <div className="inline-flex items-center gap-1.5 rounded bg-[var(--bg-subtle)] text-[var(--text-muted)] border border-[var(--border)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider w-max">
                {country.continent} · {country.isoCode}
              </div>
              <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-[var(--text-primary)] mt-0.5">
                {country.name}
              </h1>
            </div>
          </div>
          <p className="text-sm md:text-base text-[var(--text-muted)] font-medium italic leading-relaxed max-w-2xl">
            "{country.tagline}"
          </p>
        </div>
      </div>

      {/* Main Content Dashboard Grid */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-6 mt-12">
        
        {/* Column 1 & 2 - Primary Details */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* About & Demographics Grid */}
          <div className="p-6 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] hover:border-[var(--border-strong)] transition-colors overflow-hidden flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <h2 className="text-xl font-semibold text-[var(--text-primary)] tracking-tight">
                Sobre {country.name}
              </h2>
              <p className="text-sm md:text-base text-[var(--text-body)] leading-relaxed font-normal">
                {country.description}
              </p>
            </div>

            <hr className="border-[var(--border-subtle)]" />

            {/* Demographics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              
              {/* Capital */}
              <div className="flex flex-col p-3 rounded bg-[var(--bg-subtle)] border border-[var(--border-subtle)]">
                <span className="text-[9px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">Capital</span>
                <span className="text-xs font-semibold text-[var(--text-primary)] mt-1">{country.capital}</span>
              </div>

              {/* Population */}
              <div className="flex flex-col p-3 rounded bg-[var(--bg-subtle)] border border-[var(--border-subtle)]">
                <span className="text-[9px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">População</span>
                <span className="text-xs font-semibold text-[var(--text-primary)] mt-1">
                  {(country.population / 1000000).toFixed(1)}M
                </span>
              </div>

              {/* Languages */}
              <div className="flex flex-col p-3 rounded bg-[var(--bg-subtle)] border border-[var(--border-subtle)]">
                <span className="text-[9px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">Idiomas</span>
                <span className="text-xs font-semibold text-[var(--text-primary)] mt-1 truncate" title={country.languages}>
                  {country.languages}
                </span>
              </div>

              {/* Currency */}
              <div className="flex flex-col p-3 rounded bg-[var(--bg-subtle)] border border-[var(--border-subtle)]">
                <span className="text-[9px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">Moeda</span>
                <span className="text-xs font-semibold text-[var(--text-primary)] mt-1 truncate" title={country.currency}>
                  {country.currency}
                </span>
              </div>
            </div>
          </div>

          {/* Travel & Legal Requirements */}
          <div className="p-6 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] hover:border-[var(--border-strong)] transition-colors overflow-hidden flex flex-col gap-6">
            <h2 className="text-xl font-semibold text-[var(--text-primary)] tracking-tight">
              Requisitos Legais & Entrada
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Visa Requirements */}
              <div className="p-5 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border-subtle)] flex flex-col gap-2">
                <span className="font-semibold text-xs text-[var(--text-primary)]">Regime de Vistos</span>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed font-normal">
                  {country.visaRequirements}
                </p>
              </div>

              {/* Passport Requirements */}
              <div className="p-5 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border-subtle)] flex flex-col gap-2">
                <span className="font-semibold text-xs text-[var(--text-primary)]">Validade do Passaporte</span>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed font-normal">
                  {country.passportRequirements}
                </p>
              </div>

              {/* ETIAS / ESTA */}
              <div className="p-5 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border-subtle)] flex flex-col gap-2">
                <span className="font-semibold text-xs text-[var(--text-primary)]">ETIAS / ESTA / Autorizações</span>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed font-normal">
                  {country.etiasRequirements}
                </p>
              </div>

              {/* Vaccination */}
              <div className="p-5 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border-subtle)] flex flex-col gap-2">
                <span className="font-semibold text-xs text-[var(--text-primary)]">Vacinação e Saúde</span>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed font-normal">
                  {country.vaccineRequirements}
                </p>
              </div>
            </div>
          </div>

          {/* Points of Interest */}
          <div className="p-6 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] hover:border-[var(--border-strong)] transition-colors overflow-hidden flex flex-col gap-6">
            <h2 className="text-xl font-semibold text-[var(--text-primary)] tracking-tight">
              Pontos de Interesse & Atrações
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(country.topAttractions as PointOfInterest[]).map((poi, idx) => (
                <div key={idx} className="flex flex-col rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="relative h-36 w-full bg-[var(--bg-subtle)]">
                    <img
                      src={poi.imageUrl}
                      alt={poi.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="p-4 flex flex-col gap-1.5">
                    <h4 className="text-xs font-semibold text-[var(--text-primary)] leading-tight">
                      {poi.name}
                    </h4>
                    <p className="text-[10px] text-[var(--text-muted)] leading-relaxed line-clamp-3">
                      {poi.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Column 3 - Side Bar Widgets */}
        <div className="flex flex-col gap-6">
          
          {/* Action Card: Save Favorites or Compare */}
          <div className="p-6 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] hover:border-[var(--border-strong)] transition-colors overflow-hidden flex flex-col gap-4">
            <h3 className="text-base font-semibold text-[var(--text-primary)] tracking-tight">
              Ações de Destino
            </h3>
            
            <div className="flex flex-col gap-2.5">
              {/* Save to Favorites */}
              <FavoriteButton countryId={country.id} countryName={country.name} />

              {/* Compare Button — No icons inside main actions */}
              <Link
                href={`/compare?countryA=${country.slug}`}
                className="text-sm font-medium text-white px-5 py-2.5 rounded-md bg-[var(--brand)] hover:bg-[var(--brand-hover)] transition-colors text-center w-full"
              >
                Comparar este País
              </Link>
            </div>
          </div>

          {/* Safety & Alerts Widget */}
          <div className="p-6 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] hover:border-[var(--border-strong)] transition-colors overflow-hidden flex flex-col gap-6">
            <div className="flex flex-col">
              <span className="text-[10px] font-semibold text-[var(--text-faint)] uppercase tracking-wider leading-none">
                Segurança Geral
              </span>
              <span className="text-base font-semibold text-[var(--text-primary)] tracking-tight mt-2">
                Índice de Segurança
              </span>
            </div>

            {/* Visual Score Meter */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs font-medium text-[var(--text-muted)]">
                <span>Classificação de Segurança</span>
                <span className="text-[var(--brand)] font-semibold">{country.safetyScore} de 10</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-[var(--bg-subtle)] overflow-hidden">
                <div
                  className={`h-full rounded-full ${getScoreBarColor(country.safetyScore)}`}
                  style={{ width: `${country.safetyScore * 10}%` }}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2 text-xs">
              <div className="font-normal text-[var(--text-muted)]">
                Número de Emergência: <span className="font-semibold text-[var(--text-primary)]">{country.emergencyNumbers}</span>
              </div>
              {country.travelWarnings && (
                <div className="flex gap-2 rounded-md border border-[var(--danger-border)] bg-[var(--danger-bg)] p-3 text-[11px] text-[var(--danger)] font-medium leading-relaxed">
                  <span>{country.travelWarnings}</span>
                </div>
              )}
            </div>
          </div>

          {/* Budget Widget */}
          <div className="p-6 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] hover:border-[var(--border-strong)] transition-colors overflow-hidden flex flex-col gap-6">
            <div className="flex flex-col">
              <span className="text-[10px] font-semibold text-[var(--text-faint)] uppercase tracking-wider leading-none">
                Finanças e Custos
              </span>
              <span className="text-base font-semibold text-[var(--text-primary)] tracking-tight mt-2">
                Custos Médios Estimados
              </span>
            </div>

            {/* Living Index */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between text-xs font-medium text-[var(--text-muted)]">
                <span>Índice de Custo de Vida</span>
                <span className="text-[var(--brand)] font-semibold">{country.costLivingIndex} / 120</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[var(--bg-subtle)] overflow-hidden">
                <div
                  className="h-full rounded-full bg-[var(--brand)]"
                  style={{ width: `${(country.costLivingIndex / 120) * 100}%` }}
                />
              </div>
            </div>

            <hr className="border-[var(--border-subtle)]" />

            {/* Detailed breakdowns */}
            <div className="flex flex-col gap-3 text-xs font-normal text-[var(--text-muted)]">
              {/* Hotel */}
              <div className="flex justify-between">
                <span>Alojamento (Médio / Noite)</span>
                <span className="text-[var(--text-primary)] font-semibold">{country.avgHotelPrice}€</span>
              </div>

              {/* Meal */}
              <div className="flex justify-between">
                <span>Refeição Individual</span>
                <span className="text-[var(--text-primary)] font-semibold">{country.avgMealPrice}€</span>
              </div>

              {/* Transport */}
              <div className="flex justify-between">
                <span>Transporte Público</span>
                <span className="text-[var(--text-primary)] font-semibold">{country.avgTransportCost}€</span>
              </div>
            </div>
          </div>

          {/* Practical Metrics Widget */}
          <div className="p-6 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] hover:border-[var(--border-strong)] transition-colors overflow-hidden flex flex-col gap-5">
            <h3 className="text-base font-semibold text-[var(--text-primary)] tracking-tight">
              Informações Práticas
            </h3>

            <div className="flex flex-col gap-4 text-xs font-normal text-[var(--text-muted)]">
              {/* Power plug */}
              <div className="flex justify-between items-center">
                <span>Tomadas e Voltagem</span>
                <span className="rounded bg-[var(--bg-subtle)] border border-[var(--border)] px-2.5 py-1 font-semibold text-[var(--text-primary)]">
                  {country.powerPlugType}
                </span>
              </div>

              <hr className="border-[var(--border-subtle)]" />

              {/* Internet Quality */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between">
                  <span>Qualidade de Internet</span>
                  <span className="font-semibold text-[var(--text-primary)]">{country.internetQualityScore}/10</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[var(--bg-subtle)] overflow-hidden">
                  <div
                    className={`h-full rounded-full ${getScoreBarColor(country.internetQualityScore)}`}
                    style={{ width: `${country.internetQualityScore * 10}%` }}
                  />
                </div>
              </div>

              {/* Healthcare Quality */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between">
                  <span>Qualidade da Saúde</span>
                  <span className="font-semibold text-[var(--text-primary)]">{country.healthcareQualityScore}/10</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[var(--bg-subtle)] overflow-hidden">
                  <div
                    className={`h-full rounded-full ${getScoreBarColor(country.healthcareQualityScore)}`}
                    style={{ width: `${country.healthcareQualityScore * 10}%` }}
                  />
                </div>
              </div>

              {/* Transportation Quality */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between">
                  <span>Rede de Transportes</span>
                  <span className="font-semibold text-[var(--text-primary)]">{country.transportQualityScore}/10</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[var(--bg-subtle)] overflow-hidden">
                  <div
                    className={`h-full rounded-full ${getScoreBarColor(country.transportQualityScore)}`}
                    style={{ width: `${country.transportQualityScore * 10}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Tourism & Climate Widgets */}
          <div className="p-6 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] hover:border-[var(--border-strong)] transition-colors overflow-hidden flex flex-col gap-5">
            <h3 className="text-base font-semibold text-[var(--text-primary)] tracking-tight">
              Clima & Turismo
            </h3>

            <div className="flex flex-col gap-4 text-xs font-normal text-[var(--text-muted)]">
              {/* Climate badge */}
              <div className="flex justify-between items-center">
                <span>Clima Tipo</span>
                <span className="rounded-full bg-[var(--accent-subtle)] px-2.5 py-0.5 text-[var(--accent)] font-medium text-xs border border-[var(--accent)]/15">
                  {country.climateType}
                </span>
              </div>
              <p className="text-[11px] text-[var(--text-muted)] leading-normal">
                {country.climateDetails}
              </p>

              <hr className="border-[var(--border-subtle)]" />

              {/* Best time to visit */}
              <div className="flex flex-col gap-1">
                <span>Melhor Época para Visitar</span>
                <span className="text-[var(--text-primary)] font-medium leading-normal text-[11px]">
                  {country.bestTimeVisit}
                </span>
              </div>

              {/* Major Cities */}
              <div className="flex flex-col gap-2">
                <span>Cidades Principais</span>
                <div className="flex flex-wrap gap-1.5">
                  {country.majorCities.map((city, idx) => (
                    <span key={idx} className="rounded bg-[var(--bg-subtle)] border border-[var(--border)] px-2 py-0.5 text-[10px] font-medium text-[var(--text-body)]">
                      {city}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
