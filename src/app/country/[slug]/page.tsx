"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Compass,
  Info,
  Stamp,
  ShieldCheck,
  Wallet,
  CloudSun,
  Gauge,
  Camera,
  Building2,
  MapPin,
  Users,
  Languages,
  CalendarDays,
  Plug,
  Euro,
  Phone,
  AlertTriangle,
  Wifi,
  Bus,
  HeartPulse,
  Thermometer,
  Hotel,
  Utensils,
  Coins,
  FileText,
  Syringe,
  Globe,
  ChevronRight,
  Loader2,
  ArrowLeft,
  type LucideIcon,
} from "lucide-react";

import { getCountryBySlug, getCountries } from "@/lib/db-countries";
import type { CountrySchema, PointOfInterest } from "@/lib/countries-data";
import FavoriteButton from "@/components/FavoriteButton";
/* ----------------------------------------------------------------------------
 * Section navigation (each id matches a <Section/> with the same id)
 * -------------------------------------------------------------------------- */
const SECTIONS: { id: string; label: string; icon: LucideIcon }[] = [
  { id: "overview", label: "Overview", icon: Compass },
  { id: "entry", label: "Entry & Visas", icon: Stamp },
  { id: "safety", label: "Safety", icon: ShieldCheck },
  { id: "costs", label: "Costs", icon: Wallet },
  { id: "climate", label: "Climate", icon: CloudSun },
  { id: "metrics", label: "Metrics", icon: Gauge },
  { id: "attractions", label: "Attractions", icon: Camera },
  { id: "cities", label: "Cities", icon: Building2 },
];

/* ----------------------------------------------------------------------------
 * Helpers
 * -------------------------------------------------------------------------- */
const eur = (value: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(value);

// Bar colour based on the "score" (0..1). Uses the design system's semantic tokens.
function toneColor(ratio: number): string {
  if (ratio >= 0.66) return "var(--success)";
  if (ratio >= 0.4) return "var(--accent)";
  return "var(--danger)";
}

/* ----------------------------------------------------------------------------
 * Reusable components (local to this page)
 * -------------------------------------------------------------------------- */
function Card({
                children,
                className = "",
              }: {
  children: ReactNode;
  className?: string;
}) {
  return (
      <div
          className={`rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-5 sm:p-6 ${className}`}
      >
        {children}
      </div>
  );
}

function Section({
                   id,
                   eyebrow,
                   title,
                   icon: Icon,
                   children,
                 }: {
  id: string;
  eyebrow: string;
  title: string;
  icon: LucideIcon;
  children: ReactNode;
}) {
  return (
      <section id={id} className="scroll-mt-32">
        <div className="mb-1 flex items-center gap-2">
          <Icon className="h-4 w-4 text-[var(--brand)]" />
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--brand)]">
          {eyebrow}
        </span>
        </div>
        <h2 className="mb-5 text-2xl font-bold text-[var(--text-primary)] sm:text-3xl">
          {title}
        </h2>
        {children}
      </section>
  );
}

function InfoRow({
                   icon: Icon,
                   label,
                   value,
                 }: {
  icon: LucideIcon;
  label: string;
  value: ReactNode;
}) {
  return (
      <div className="flex items-start gap-3 border-b border-[var(--border-subtle)] py-3 last:border-0">
        <Icon className="mt-0.5 h-5 w-5 shrink-0 text-[var(--text-muted)]" />
        <div className="min-w-0">
          <div className="text-xs uppercase tracking-wide text-[var(--text-faint)]">
            {label}
          </div>
          <div className="break-words font-medium text-[var(--text-body)]">
            {value}
          </div>
        </div>
      </div>
  );
}

function Metric({
                  icon: Icon,
                  label,
                  value,
                  max = 10,
                }: {
  icon: LucideIcon;
  label: string;
  value: number;
  max?: number;
}) {
  const ratio = Math.max(0, Math.min(1, value / max));
  return (
      <div>
        <div className="mb-1.5 flex items-center justify-between">
        <span className="flex items-center gap-2 text-sm font-medium text-[var(--text-body)]">
          <Icon className="h-4 w-4 text-[var(--text-muted)]" />
          {label}
        </span>
          <span className="text-sm font-semibold text-[var(--text-primary)]">
          {value}
            <span className="text-[var(--text-faint)]">/{max}</span>
        </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--bg-subtle)]">
          <div
              className="h-full rounded-full transition-[width] duration-500"
              style={{ width: `${ratio * 100}%`, backgroundColor: toneColor(ratio) }}
          />
        </div>
      </div>
  );
}

function Chip({ children }: { children: ReactNode }) {
  return (
      <span className="inline-flex items-center rounded-full border border-[var(--border)] bg-[var(--bg-subtle)] px-3 py-1 text-sm font-medium text-[var(--text-body)]">
      {children}
    </span>
  );
}

function AttractionCard({ poi, iso, index }: { poi: PointOfInterest; iso: string; index: number }) {
  return (
      <article className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)]">
        <div className="relative aspect-[16/10] w-full bg-[var(--bg-subtle)]">
          {/* Local photo of the landmark (e.g. /attractions/pt-1.jpg). If it doesn't
            exist yet, use the DB imageUrl and, as a last resort, the placeholder. */}
          <img
              src={`/attractions/${iso.toLowerCase()}-${index + 1}.jpg`}
              onError={(e) => { (e.currentTarget as HTMLImageElement).src = poi.imageUrl }}
              alt={poi.name}
              className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-[var(--text-primary)]">{poi.name}</h3>
          <p className="mt-1 text-sm leading-relaxed text-[var(--text-muted)]">
            {poi.description}
          </p>
        </div>
      </article>
  );
}

/* ----------------------------------------------------------------------------
 * Cost calculator (local state: number of days)
 * -------------------------------------------------------------------------- */
function CostCalculator({ country }: { country: CountrySchema }) {
  const dailyEstimate =
      country.avgHotelPrice + country.avgMealPrice * 2 + country.avgTransportCost;
  const [days, setDays] = useState(3);
  const total = dailyEstimate * Math.max(1, days);

  const breakdown: { icon: LucideIcon; label: string; value: number }[] = [
    { icon: Hotel, label: "Accommodation (1 night)", value: country.avgHotelPrice },
    { icon: Utensils, label: "Meals (2/day)", value: country.avgMealPrice * 2 },
    { icon: Bus, label: "Transport (1 day)", value: country.avgTransportCost },
  ];

  return (
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-[var(--text-faint)]">
            Estimated daily cost
          </h3>
          <div className="space-y-3">
            {breakdown.map((row) => (
                <div key={row.label} className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-[var(--text-body)]">
                <row.icon className="h-4 w-4 text-[var(--text-muted)]" />
                {row.label}
              </span>
                  <span className="font-medium text-[var(--text-primary)]">
                {eur(row.value)}
              </span>
                </div>
            ))}
            <div className="mt-2 flex items-center justify-between border-t border-[var(--border-subtle)] pt-3">
              <span className="font-semibold text-[var(--text-primary)]">Per day</span>
              <span className="text-lg font-bold text-[var(--brand)]">
              {eur(dailyEstimate)}
            </span>
            </div>
          </div>
        </Card>

        <Card className="flex flex-col justify-between">
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-[var(--text-faint)]">
              Plan your trip
            </h3>
            <label
                htmlFor="days"
                className="mb-2 block text-sm text-[var(--text-muted)]"
            >
              Number of days
            </label>
            <input
                id="days"
                type="number"
                min={1}
                value={days}
                onChange={(e) => setDays(Math.max(1, Number(e.target.value) || 1))}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-page)] px-4 py-2.5 text-[var(--text-primary)] outline-none focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand-subtle)]"
            />
          </div>
          <div className="mt-5 rounded-xl border border-[var(--brand-subtle)] bg-[var(--brand-subtle)] p-4">
            <div className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
              Estimated total · {Math.max(1, days)}{" "}
              {Math.max(1, days) === 1 ? "day" : "days"}
            </div>
            <div className="mt-1 text-3xl font-bold text-[var(--brand)]">
              {eur(total)}
            </div>
            <p className="mt-1 text-xs text-[var(--text-faint)]">
              Indicative estimate, flights not included.
            </p>
          </div>
        </Card>
      </div>
  );
}

/* ----------------------------------------------------------------------------
 * Page
 * -------------------------------------------------------------------------- */
export default function CountryPage() {
  const { slug } = useParams<{ slug: string }>();

  const [country, setCountry] = useState<CountrySchema | null>(null);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<string>(SECTIONS[0].id);
  const [flagError, setFlagError] = useState(false);
  const [related, setRelated] = useState<CountrySchema[]>([]);

  // Load country by slug
  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!slug) return;
      setLoading(true);
      setFlagError(false);
      try {
        const data = await getCountryBySlug(slug);
        if (!cancelled) setCountry(data ?? null);
      } catch {
        if (!cancelled) setCountry(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  // Highlight the active section on scroll
  useEffect(() => {
    if (!country) return;
    const observer = new IntersectionObserver(
        (entries) => {
          const visible = entries
              .filter((e) => e.isIntersecting)
              .sort(
                  (a, b) => a.boundingClientRect.top - b.boundingClientRect.top
              );
          if (visible[0]) setActive(visible[0].target.id);
        },
        { rootMargin: "-130px 0px -65% 0px", threshold: 0 }
    );
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [country]);

  // Load other countries in the same continent for the "Keep exploring" section
  useEffect(() => {
    if (!country) {
      setRelated([]);
      return;
    }
    let cancelled = false;
    getCountries()
        .then((all) => {
          if (cancelled) return;
          const sameContinent = all
              .filter((c) => c.continent === country.continent && c.slug !== country.slug)
              .slice(0, 6);
          setRelated(sameContinent);
        })
        .catch(() => {
          if (!cancelled) setRelated([]);
        });
    return () => {
      cancelled = true;
    };
  }, [country]);

  const flagSrc = useMemo(
      () => (country ? `/flags/${country.isoCode.toLowerCase()}.svg` : ""),
      [country]
  );

  function goToSection(id: string) {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setActive(id);
    }
  }

  /* ---- Estado: a carregar ---- */
  if (loading) {
    return (
        <div className="grid min-h-[60vh] place-items-center text-[var(--text-muted)]">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-7 w-7 animate-spin" />
            <span>Loading country…</span>
          </div>
        </div>
    );
  }

  /* ---- State: not found ---- */
  if (!country) {
    return (
        <div className="grid min-h-[60vh] place-items-center px-4">
          <div className="max-w-md text-center">
            <Globe className="mx-auto mb-4 h-10 w-10 text-[var(--text-faint)]" />
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">
              Country not found
            </h1>
            <p className="mt-2 text-[var(--text-muted)]">
              We couldn&apos;t find a country for this address.
            </p>
            <Link
                href="/"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[var(--brand)] px-4 py-2.5 font-medium text-[var(--bg-surface)] transition-colors hover:bg-[var(--brand-hover)]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to home
            </Link>
          </div>
        </div>
    );
  }

  /* ---- Content ---- */
  return (
      <div className="w-full bg-[var(--bg-page)]">
        {/* HERO full-bleed */}
        <header className="relative">
          <div className="relative h-[58vh] min-h-[420px] w-full">
            <img
                src={`/covers/${country.isoCode.toLowerCase()}.jpg`}
                onError={(e) => { (e.currentTarget as HTMLImageElement).src = country.imageUrl }}
                alt={country.name}
                className="absolute inset-0 h-full w-full object-cover"
            />
            {/* Dark gradient for legibility — always dark, so white text is readable
              in both themes (this is not a "themeable" surface). */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/10" />

            <div className="absolute inset-x-0 bottom-0">
              <div className="mx-auto max-w-5xl px-4 pb-8 sm:px-6 lg:px-8">
                <div className="flex items-end justify-between gap-4">
                  <div className="min-w-0">
                    <div className="mb-4 flex items-center gap-3">
                    <span className="grid h-12 w-16 place-items-center overflow-hidden rounded-md border border-white/25 bg-white/10 backdrop-blur-sm">
                      {!flagError ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                              src={flagSrc}
                              alt={`Flag of ${country.name}`}
                              className="h-full w-full object-cover"
                              onError={() => setFlagError(true)}
                          />
                      ) : (
                          <span className="text-2xl">{country.flagEmoji}</span>
                      )}
                    </span>
                      <Chip>
                        <MapPin className="mr-1.5 h-3.5 w-3.5" />
                        {country.continent}
                      </Chip>
                    </div>

                    <h1 className="text-4xl font-extrabold leading-tight text-white drop-shadow-sm sm:text-5xl lg:text-6xl">
                      {country.name}
                    </h1>
                    <p className="mt-2 max-w-2xl text-base text-white/85 sm:text-lg">
                      {country.tagline}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                    <span className="inline-flex items-center rounded-full border border-white/25 bg-white/15 px-3 py-1 text-sm text-white backdrop-blur-sm">
                      <Building2 className="mr-1.5 h-3.5 w-3.5" />
                      {country.capital}
                    </span>
                      <span className="inline-flex items-center rounded-full border border-white/25 bg-white/15 px-3 py-1 text-sm text-white backdrop-blur-sm">
                      <Euro className="mr-1.5 h-3.5 w-3.5" />
                        {country.currency}
                    </span>
                    </div>
                  </div>

                  <div className="shrink-0">
                    <FavoriteButton
                        countryId={country.id}
                        countryName={country.name}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Section NAV (sticky below the 56px Navbar) */}
        <nav className="sticky top-14 z-30 border-b border-[var(--border)] bg-[var(--bg-surface)]">
          <div className="mx-auto max-w-5xl px-2 sm:px-4 lg:px-6">
            <ul className="flex gap-1 overflow-x-auto py-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {SECTIONS.map((s) => {
                const isActive = active === s.id;
                return (
                    <li key={s.id}>
                      <button
                          type="button"
                          onClick={() => goToSection(s.id)}
                          className={`flex items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                              isActive
                                  ? "bg-[var(--brand-subtle)] text-[var(--brand)]"
                                  : "text-[var(--text-muted)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-body)]"
                          }`}
                      >
                        <s.icon className="h-4 w-4" />
                        {s.label}
                      </button>
                    </li>
                );
              })}
            </ul>
          </div>
        </nav>

        {/* CONTENT */}
        <div className="mx-auto max-w-5xl space-y-16 px-4 py-12 sm:px-6 lg:px-8">
          {/* Overview */}
          <Section id="overview" eyebrow="The essentials" title="Overview" icon={Compass}>
            <div className="grid gap-4 lg:grid-cols-3">
              <Card className="lg:col-span-2">
                <p className="leading-relaxed text-[var(--text-body)]">
                  {country.description}
                </p>
              </Card>
              <Card>
                <InfoRow
                    icon={Users}
                    label="Population"
                    value={country.population.toLocaleString("en-US")}
                />
                <InfoRow
                    icon={Languages}
                    label="Languages"
                    value={country.languages}
                />
                <InfoRow
                    icon={CalendarDays}
                    label="Best time to visit"
                    value={country.bestTimeVisit}
                />
                <InfoRow
                    icon={Plug}
                    label="Power plug type"
                    value={country.powerPlugType}
                />
              </Card>
            </div>
          </Section>


          {/* Entrada & Vistos */}
          <Section
              id="entry"
              eyebrow="For Portuguese citizens"
              title="Entry &amp; Visas"
              icon={Stamp}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Card>
                <InfoRow
                    icon={Stamp}
                    label="Visa"
                    value={country.visaRequirements}
                />
                <InfoRow
                    icon={FileText}
                    label="Passport"
                    value={country.passportRequirements}
                />
              </Card>
              <Card>
                <InfoRow
                    icon={Globe}
                    label="ETIAS"
                    value={country.etiasRequirements}
                />
                <InfoRow
                    icon={Syringe}
                    label="Vaccinations"
                    value={country.vaccineRequirements}
                />
              </Card>
            </div>
          </Section>

          {/* Safety */}
          <Section id="safety" eyebrow="Peace of mind" title="Safety" icon={ShieldCheck}>
            <div className="grid gap-4 sm:grid-cols-2">
              <Card>
                <div className="mb-4">
                  <Metric
                      icon={ShieldCheck}
                      label="Safety score"
                      value={country.safetyScore}
                      max={10}
                  />
                </div>
                <InfoRow
                    icon={Phone}
                    label="Emergency numbers"
                    value={country.emergencyNumbers}
                />
              </Card>

              {country.travelWarnings ? (
                  <div className="rounded-2xl border border-[var(--warning-border)] bg-[var(--warning-bg)] p-5 sm:p-6">
                    <div className="mb-2 flex items-center gap-2 font-semibold text-[var(--warning)]">
                      <AlertTriangle className="h-5 w-5" />
                      Travel warnings
                    </div>
                    <p className="leading-relaxed text-[var(--text-body)]">
                      {country.travelWarnings}
                    </p>
                  </div>
              ) : (
                  <Card className="flex items-center gap-3">
                    <ShieldCheck className="h-5 w-5 text-[var(--success)]" />
                    <span className="text-[var(--text-body)]">
                  No active travel warnings.
                </span>
                  </Card>
              )}
            </div>
          </Section>

          {/* Custos */}
          <Section id="costs" eyebrow="Budget (EUR)" title="Costs" icon={Wallet}>
            <CostCalculator country={country} />
            <Card className="mt-4">
              <Metric
                  icon={Coins}
                  label="Cost of living index"
                  value={country.costLivingIndex}
                  max={120}
              />
              <p className="mt-2 text-xs text-[var(--text-faint)]">
                Scale 1–120 (relative reference across countries).
              </p>
            </Card>
          </Section>

          {/* Climate */}
          <Section id="climate" eyebrow="When to go" title="Climate" icon={CloudSun}>
            <Card>
              <div className="mb-4 flex items-center gap-2">
                <Thermometer className="h-5 w-5 text-[var(--accent)]" />
                <span className="font-semibold text-[var(--text-primary)]">
                {country.climateType}
              </span>
              </div>
              <p className="leading-relaxed text-[var(--text-body)]">
                {country.climateDetails}
              </p>
            </Card>
          </Section>

          {/* Practical metrics */}
          <Section
              id="metrics"
              eyebrow="On the ground"
              title="Practical metrics"
              icon={Gauge}
          >
            <Card className="grid gap-5 sm:grid-cols-3">
              <Metric
                  icon={Wifi}
                  label="Internet"
                  value={country.internetQualityScore}
              />
              <Metric
                  icon={Bus}
                  label="Transport"
                  value={country.transportQualityScore}
              />
              <Metric
                  icon={HeartPulse}
                  label="Healthcare"
                  value={country.healthcareQualityScore}
              />
            </Card>
          </Section>

          {/* Attractions */}
          <Section id="attractions" eyebrow="Must-see" title="Attractions" icon={Camera}>
            {country.topAttractions.length > 0 ? (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {country.topAttractions.map((poi, i) => (
                      <AttractionCard key={poi.name} poi={poi} iso={country.isoCode} index={i} />
                  ))}
                </div>
            ) : (
                <Card>
                  <p className="text-[var(--text-muted)]">
                    No attractions listed for this country yet.
                  </p>
                </Card>
            )}
          </Section>

          {/* Cidades */}
          <Section id="cities" eyebrow="Where to go" title="Major cities" icon={Building2}>
            {country.majorCities.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {country.majorCities.map((city) => (
                      <span
                          key={city}
                          className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--bg-surface)] px-4 py-2 text-sm font-medium text-[var(--text-body)]"
                      >
                  <MapPin className="h-4 w-4 text-[var(--brand)]" />
                        {city}
                </span>
                  ))}
                </div>
            ) : (
                <Card>
                  <p className="text-[var(--text-muted)]">No cities listed.</p>
                </Card>
            )}
          </Section>

          {/* Keep exploring — links to other countries in the same continent */}
          {related.length > 0 && (
              <section id="explore" className="scroll-mt-32">
                <div className="mb-1 flex items-center gap-2">
                  <Globe className="h-4 w-4 text-[var(--brand)]" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-[var(--brand)]">
                Keep exploring
              </span>
                </div>
                <h2 className="mb-5 text-2xl font-bold text-[var(--text-primary)] sm:text-3xl">
                  More in {country.continent}
                </h2>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {related.map((c) => (
                      <Link
                          key={c.slug}
                          href={`/country/${c.slug}`}
                          className="group flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] p-3 transition-colors hover:border-[var(--border-strong)] hover:bg-[var(--bg-subtle)]"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={`/flags/${c.isoCode.toLowerCase()}.svg`}
                            alt={`Flag of ${c.name}`}
                            className="h-8 w-12 shrink-0 rounded-sm object-cover shadow"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="truncate font-medium text-[var(--text-primary)]">{c.name}</div>
                          <div className="truncate text-xs text-[var(--text-muted)]">{c.capital}</div>
                        </div>
                        <ChevronRight className="h-4 w-4 shrink-0 text-[var(--text-faint)] transition-transform group-hover:translate-x-0.5" />
                      </Link>
                  ))}
                </div>
              </section>
          )}
        </div>
      </div>
  );
}
