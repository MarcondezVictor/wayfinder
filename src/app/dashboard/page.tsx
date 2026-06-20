"use client";

import { useEffect, useState, useMemo } from "react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import type { Database } from "@/types/database.types";
import Link from "next/link";
import {
  Heart,
  Trash2,
  Compass,
  Shield,
  Coins,
  Globe,
  ArrowRight
} from "lucide-react";

type CountryRow = Database["public"]["Tables"]["countries"]["Row"];
type FavoriteWithCountry = {
  country_id: string;
  countries: CountryRow;
};

export default function DashboardPage() {
  const { user, profile, preferences, loading } = useAuth();
  const router = useRouter();

  const [favLoading, setFavLoading] = useState(true);
  const [favorites, setFavorites] = useState<FavoriteWithCountry[]>([]);
  const [imageError, setImageError] = useState(false);

  // Fetch favorites with robust loading state handling
  useEffect(() => {
    // Se loading do AuthProvider ainda está a decorrer, aguardar
    if (loading) return;

    // Se não há utilizador, não há favoritos para buscar
    if (!user) {
      setFavLoading(false); // CRÍTICO: resolver mesmo quando user=null
      return;
    }

    const fetchFavorites = async () => {
      try {
        const { data, error } = await supabase
            .from("favorites")
            .select("country_id, countries(*)")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });

        if (error) throw error;
        if (data) {
          setFavorites(data as unknown as FavoriteWithCountry[]);
        }
      } catch (err) {
        console.error("Favorites fetch error:", err);
      } finally {
        setFavLoading(false); // SEMPRE corre
      }
    };

    fetchFavorites();
  }, [user, loading]); // loading como dependência

  // Reset image error state if the avatar url changes
  useEffect(() => {
    setImageError(false);
  }, [profile?.avatar_url]);

  // Remove a favorite country
  const removeFavorite = async (countryId: string) => {
    try {
      await supabase
          .from("favorites")
          .delete()
          .eq("user_id", user!.id)
          .eq("country_id", countryId);

      setFavorites((prev) => prev.filter((f) => f.country_id !== countryId));
    } catch (err) {
      console.error("Error removing favorite:", err);
    }
  };

  // Map travel styles to display badges with emojis
  const travelStyleMap: Record<string, string> = {
    "Turismo": "Turismo",
    "Trabalho": "Trabalho",
    "Estudos": "Estudos",
    "Emigração": "Emigração",
    "Nómada Digital": "Nómada Digital",
  };

  const travelStyleLabel = preferences?.preferred_travel_style
      ? (travelStyleMap[preferences.preferred_travel_style] || preferences.preferred_travel_style)
      : "🧳 Turismo";

  // Initials for avatar fallback
  const initials = useMemo(() => {
    const name = profile?.full_name || "";
    if (name) {
      const parts = name.trim().split(/\s+/);
      if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
      }
      if (parts.length === 1 && parts[0]) {
        return parts[0][0].toUpperCase();
      }
    }
    return user?.email ? user.email[0].toUpperCase() : "?";
  }, [profile, user]);

  // Statistics calculation
  const stats = useMemo(() => {
    if (favorites.length === 0) return null;

    const total = favorites.length;

    // Determine the most frequent continent
    const continentCounts: Record<string, number> = {};
    favorites.forEach((f) => {
      const continent = f.countries?.continent;
      if (continent) {
        continentCounts[continent] = (continentCounts[continent] || 0) + 1;
      }
    });

    let mostFrequentContinent = "N/A";
    let maxCount = 0;
    for (const [continent, count] of Object.entries(continentCounts)) {
      if (count > maxCount) {
        maxCount = count;
        mostFrequentContinent = continent;
      }
    }

    // Determine the cheapest country based on daily cost
    let cheapestCountry: CountryRow | null = null;
    let minCost = Infinity;

    for (const f of favorites) {
      const country = f.countries;
      if (country) {
        const cost = Math.round(
            country.avg_hotel_price +
            country.avg_meal_price * 2 +
            country.avg_transport_cost
        );
        if (cost < minCost) {
          minCost = cost;
          cheapestCountry = country;
        }
      }
    }

    const cheapestCost = cheapestCountry
        ? Math.round(
            cheapestCountry.avg_hotel_price +
            cheapestCountry.avg_meal_price * 2 +
            cheapestCountry.avg_transport_cost
        )
        : null;

    return {
      total,
      mostFrequentContinent,
      cheapestCountryName: cheapestCountry ? cheapestCountry.name : "N/A",
      cheapestCountryFlag: cheapestCountry ? cheapestCountry.flag_emoji : "",
      cheapestCost,
    };
  }, [favorites]);

  // AuthProvider ainda a carregar
  if (loading) {
    return (
        <div className="flex-grow flex flex-col items-center justify-center p-20 gap-4 bg-[var(--bg-page)]">
          <div className="flex h-12 w-12 animate-spin rounded-full border-4 border-[var(--brand)] border-t-transparent" />
          <span className="text-sm font-medium text-[var(--text-muted)]">A carregar o seu painel...</span>
        </div>
    );
  }

  // Não autenticado (fallback — proxy.ts devia ter bloqueado)
  if (!user) {
    router.push("/login");
    return null;
  }

  // Favoritos a carregar
  if (favLoading) {
    return (
        <div className="w-full min-h-screen bg-[var(--bg-page)] pb-20">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 flex flex-col gap-8">

            {/* Skeleton de perfil */}
            <section className="rounded-2xl bg-[var(--bg-surface)] border border-[var(--border)] shadow-sm p-6 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 animate-pulse">
              <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
                <div className="h-20 w-20 rounded-full bg-[var(--bg-subtle)] shrink-0" />
                <div className="flex flex-col gap-2">
                  <div className="h-4 bg-[var(--bg-subtle)] rounded w-24" />
                  <div className="h-6 bg-[var(--bg-subtle)] rounded w-48" />
                  <div className="h-4 bg-[var(--bg-subtle)] rounded w-36" />
                </div>
              </div>
              <div className="h-10 bg-[var(--bg-subtle)] rounded w-32 shrink-0" />
            </section>

            {/* Skeleton de favoritos */}
            <section className="flex flex-col gap-6 animate-pulse">
              <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
                <div className="h-8 bg-[var(--bg-subtle)] rounded w-64" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((n) => (
                    <div key={n} className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] overflow-hidden shadow-sm flex flex-col h-72">
                      <div className="h-40 bg-[var(--bg-subtle)] w-full" />
                      <div className="p-5 flex flex-col gap-3 flex-grow justify-between">
                        <div className="h-5 bg-[var(--bg-subtle)] rounded w-1/2" />
                        <div className="h-4 bg-[var(--bg-subtle)] rounded w-3/4" />
                        <div className="h-8 bg-[var(--bg-subtle)] rounded w-full mt-2" />
                      </div>
                    </div>
                ))}
              </div>
            </section>

          </div>
        </div>
    );
  }

  // Conteúdo real (Dashboard)
  return (
      <div className="w-full min-h-screen bg-[var(--bg-page)] pb-20">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 flex flex-col gap-8">

          {/* Secção 1 — Perfil */}
          <section className="rounded-2xl bg-[var(--bg-surface)] border border-[var(--border)] shadow-sm p-6 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
              <div className="h-20 w-20 rounded-full overflow-hidden border-2 border-[var(--brand-subtle)] shadow-sm bg-[var(--brand-subtle)] shrink-0 flex items-center justify-center relative">
                {profile?.avatar_url && !imageError ? (
                    <img
                        src={profile.avatar_url}
                        alt="Avatar"
                        className="h-full w-full object-cover"
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <span className="text-2xl font-bold text-[var(--brand)]">
                  {initials}
                </span>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-semibold tracking-wider text-[var(--brand)] uppercase">
                Painel Pessoal
              </span>
                <h1 className="text-2xl font-bold text-[var(--text-primary)] leading-tight">
                  {profile?.full_name || user.email?.split("@")[0]}
                </h1>
                <p className="text-sm font-normal text-[var(--text-muted)]">
                  {user.email} {profile?.nationality && `· ${profile.nationality}`}
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center sm:items-end gap-1.5 shrink-0">
            <span className="text-xs font-semibold text-[var(--text-faint)] uppercase tracking-wider">
              Estilo de Viagem
            </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--brand-subtle)] px-4 py-2 text-sm font-semibold text-[var(--brand)] border border-[var(--brand-subtle)]">
              {travelStyleLabel}
            </span>
            </div>
          </section>

          {/* Secção 3 — Stats (se houver favoritos) */}
          {stats && (
              <section className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up">
                <div className="p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border)] shadow-sm flex items-center gap-4 hover:shadow-md transition-all">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--brand-subtle)] text-[var(--brand)] shrink-0">
                    <Compass className="h-6 w-6" />
                  </div>
                  <div className="flex flex-col">
                <span className="text-xs font-medium text-[var(--text-faint)] uppercase tracking-wider">
                  Total de Favoritos
                </span>
                    <span className="text-xl font-bold text-[var(--text-primary)] mt-0.5">
                  {stats.total} {stats.total === 1 ? "destino" : "destinos"}
                </span>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border)] shadow-sm flex items-center gap-4 hover:shadow-md transition-all">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--accent-subtle)] text-[var(--accent)] shrink-0">
                    <Globe className="h-6 w-6" />
                  </div>
                  <div className="flex flex-col">
                <span className="text-xs font-medium text-[var(--text-faint)] uppercase tracking-wider">
                  Continente Frequente
                </span>
                    <span className="text-xl font-bold text-[var(--text-primary)] mt-0.5">
                  {stats.mostFrequentContinent}
                </span>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border)] shadow-sm flex items-center gap-4 hover:shadow-md transition-all">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--warning-bg)] text-[var(--warning)] shrink-0">
                    <Coins className="h-6 w-6" />
                  </div>
                  <div className="flex flex-col">
                <span className="text-xs font-medium text-[var(--text-faint)] uppercase tracking-wider">
                  País Mais Barato
                </span>
                    <span className="text-xl font-bold text-[var(--text-primary)] mt-0.5 flex items-center gap-1.5">
                  <span>{stats.cheapestCountryFlag}</span>
                  <span>{stats.cheapestCountryName}</span>
                  <span className="text-sm font-normal text-[var(--text-muted)]">
                    ({stats.cheapestCost}€/dia)
                  </span>
                </span>
                  </div>
                </div>
              </section>
          )}

          {/* Secção 2 — Favoritos */}
          <section className="flex flex-col gap-6">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
              <h2 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">
                Os Seus Destinos Guardados
              </h2>
              {!favLoading && favorites.length > 0 && (
                  <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                {favorites.length} Países
              </span>
              )}
            </div>

            {favorites.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {favorites.map((item) => {
                    const country = item.countries;
                    if (!country) return null;

                    const dailyCost = Math.round(
                        country.avg_hotel_price +
                        country.avg_meal_price * 2 +
                        country.avg_transport_cost
                    );

                    return (
                        <div
                            key={item.country_id}
                            className="group relative flex flex-col rounded-2xl bg-[var(--bg-surface)] border border-[var(--border)] shadow-sm hover:shadow-md transition-all overflow-hidden animate-fade-in-up"
                        >
                          <div className="relative h-40 w-full overflow-hidden bg-[var(--bg-page)]">
                            <img
                                src={country.image_url || "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=400&q=80"}
                                alt={country.name}
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />

                            <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-lg bg-[var(--bg-surface)]/95 px-2.5 py-1 text-xs font-semibold text-[var(--text-primary)] border border-[var(--border-subtle)] shadow-sm">
                              <span>{country.flag_emoji}</span>
                              <span>{country.name}</span>
                            </div>

                            <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  removeFavorite(country.id);
                                }}
                                className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-[var(--bg-surface)]/90 hover:bg-[var(--danger-bg)] text-[var(--text-muted)] hover:text-[var(--danger)] border border-[var(--border-subtle)] shadow-sm hover:scale-105 transition-all cursor-pointer"
                                title="Remover dos favoritos"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>

                          <div className="p-5 flex flex-col gap-4 flex-grow justify-between">
                            <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-bold text-[var(--brand)] uppercase tracking-widest leading-none truncate">
                          {country.tagline}
                        </span>
                              <p className="text-xs text-[var(--text-muted)] font-normal leading-relaxed line-clamp-2 mt-1">
                                {country.description}
                              </p>
                            </div>

                            <div className="grid grid-cols-2 gap-2 mt-2 pt-3 border-t border-[var(--border-subtle)] text-[11px] font-medium text-[var(--text-muted)]">
                              <div className="flex items-center gap-1.5 p-2 rounded-lg bg-[var(--success-bg)] text-[var(--success)]">
                                <Shield className="h-3.5 w-3.5 text-[var(--success)] shrink-0" />
                                <span>Segurança: {country.safety_score}/10</span>
                              </div>
                              <div className="flex items-center gap-1.5 p-2 rounded-lg bg-[var(--warning-bg)] text-[var(--warning)]">
                                <Coins className="h-3.5 w-3.5 text-[var(--warning)] shrink-0" />
                                <span>Custo: {dailyCost}€/dia</span>
                              </div>
                            </div>

                            <Link
                                href={`/country/${country.slug}`}
                                className="mt-4 flex items-center justify-center gap-1.5 rounded-xl bg-[var(--bg-subtle)] hover:bg-[var(--brand-subtle)] text-[var(--text-body)] hover:text-[var(--brand)] py-2.5 text-xs font-semibold border border-[var(--border-subtle)] hover:border-[var(--brand-subtle)] transition-all"
                            >
                              <span>Ver Detalhes</span>
                              <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
                          </div>
                        </div>
                    );
                  })}
                </div>
            ) : (
                <div className="rounded-2xl border border-dashed border-[var(--border-strong)] p-16 flex flex-col items-center justify-center text-center gap-4 bg-[var(--bg-surface)] shadow-sm animate-fade-in-up">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--brand-subtle)] text-[var(--brand)]">
                    <Heart className="h-7 w-7" />
                  </div>
                  <h3 className="text-lg font-bold text-[var(--text-primary)] tracking-tight">
                    Nenhum destino guardado
                  </h3>
                  <p className="text-xs text-[var(--text-muted)] max-w-sm font-normal leading-relaxed">
                    Consulte o nosso mapa interativo global e adicione os seus destinos preferidos aos favoritos para os ver listados aqui!
                  </p>
                  <Link
                      href="/"
                      className="mt-2 flex items-center gap-1.5 rounded-xl bg-[var(--brand)] hover:bg-[var(--brand-hover)] text-white px-5 py-2.5 text-xs font-semibold shadow-sm transition-all"
                  >
                    <span>Voltar ao Mapa</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
            )}
          </section>

        </div>
      </div>
  );
}
