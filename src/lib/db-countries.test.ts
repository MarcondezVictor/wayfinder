import { beforeEach, describe, expect, it, vi } from "vitest";
import { countriesData } from "./countries-data";

// Fake Supabase query builder: each test sets the result the query resolves to.
const query = vi.hoisted(() => ({
  result: { data: null as unknown, error: null as { message: string } | null },
}));

vi.mock("./supabase", () => {
  const builder = {
    select: () => builder,
    order: () => Promise.resolve(query.result),
    eq: () => builder,
    single: () => Promise.resolve(query.result),
  };
  return { supabase: { from: () => builder } };
});

import { getCountries, getCountryBySlug } from "./db-countries";

// A row as it comes from the countries table (snake_case, numerics as strings)
const row = {
  id: "1",
  name: "Japan",
  slug: "japan",
  iso_code: "JP",
  capital: "Tokyo",
  continent: "Asia",
  population: "125000000",
  languages: "Japanese",
  currency: "Japanese Yen (JPY)",
  visa_requirements: "Visa-free for 90 days.",
  passport_requirements: "Valid for the whole stay.",
  etias_requirements: "Not applicable.",
  vaccine_requirements: "None.",
  safety_score: 9,
  emergency_numbers: "110 / 119",
  travel_warnings: null,
  avg_hotel_price: "110.50",
  avg_meal_price: "15",
  avg_transport_cost: "12",
  cost_living_index: 80,
  climate_type: "Temperate",
  climate_details: "Four seasons.",
  top_attractions: [{ name: "Fushimi Inari", description: "Shrine", imageUrl: "" }],
  major_cities: ["Tokyo", "Osaka"],
  best_time_visit: "Spring",
  power_plug_type: "A, B",
  internet_quality_score: 9,
  transport_quality_score: 10,
  healthcare_quality_score: 9,
  image_url: null,
  flag_emoji: "🇯🇵",
  tagline: null,
  description: null,
};

beforeEach(() => {
  vi.spyOn(console, "warn").mockImplementation(() => {});
  query.result = { data: null, error: null };
});

describe("getCountries", () => {
  it("maps database rows to camelCase and turns numeric strings into numbers", async () => {
    query.result = { data: [row], error: null };

    const [japan] = await getCountries();

    expect(japan).toMatchObject({
      isoCode: "JP",
      population: 125000000,
      avgHotelPrice: 110.5,
      avgMealPrice: 15,
      safetyScore: 9,
      majorCities: ["Tokyo", "Osaka"],
    });
    // nullable text columns become empty strings, so the UI never prints "null"
    expect(japan.imageUrl).toBe("");
    expect(japan.tagline).toBe("");
  });

  it("falls back to the local dataset when Supabase returns an error", async () => {
    query.result = { data: null, error: { message: "network down" } };

    await expect(getCountries()).resolves.toBe(countriesData);
  });

  it("falls back to the local dataset when the table is empty", async () => {
    query.result = { data: [], error: null };

    await expect(getCountries()).resolves.toBe(countriesData);
  });
});

describe("getCountryBySlug", () => {
  it("uses the local dataset when the row is missing, and returns null for unknown slugs", async () => {
    query.result = { data: null, error: { message: "not found" } };
    const local = countriesData[0];

    await expect(getCountryBySlug(local.slug)).resolves.toBe(local);
    await expect(getCountryBySlug("atlantis")).resolves.toBeNull();
  });
});

describe("local dataset", () => {
  it("has unique slugs, 2-letter ISO codes and 1-10 scores", () => {
    const slugs = countriesData.map((c) => c.slug);
    expect(new Set(slugs).size).toBe(slugs.length);

    for (const c of countriesData) {
      expect(c.isoCode).toMatch(/^[A-Z]{2}$/);
      for (const score of [c.safetyScore, c.internetQualityScore, c.transportQualityScore, c.healthcareQualityScore]) {
        expect(score).toBeGreaterThanOrEqual(1);
        expect(score).toBeLessThanOrEqual(10);
      }
    }
  });
});
