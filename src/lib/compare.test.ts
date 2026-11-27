import { describe, expect, it } from "vitest";
import { Wallet, ShieldCheck } from "lucide-react";
import type { CountrySchema } from "./countries-data";
import { dailyCost, norm, toneColor, winnerOf, type Criterion } from "./compare";

// Only the fields the scoring reads; the rest of CountrySchema is irrelevant here.
const country = (fields: Partial<CountrySchema>) => fields as CountrySchema;

const safety: Criterion = {
  key: "safety",
  label: "Safety",
  icon: ShieldCheck,
  better: "high",
  get: (c) => c.safetyScore,
  format: (c) => `${c.safetyScore}/10`,
};

const cost: Criterion = {
  key: "cost",
  label: "Daily cost",
  icon: Wallet,
  better: "low",
  get: (c) => c.avgHotelPrice,
  format: (c) => `${c.avgHotelPrice}€`,
};

describe("dailyCost", () => {
  it("adds one hotel night, two meals and transport, rounded to whole euros", () => {
    expect(dailyCost(country({ avgHotelPrice: 80.4, avgMealPrice: 12, avgTransportCost: 5.3 }))).toBe(110);
  });
});

describe("winnerOf", () => {
  it('picks the higher value when higher is better ("high")', () => {
    expect(winnerOf(safety, country({ safetyScore: 9 }), country({ safetyScore: 6 }))).toBe("A");
    expect(winnerOf(safety, country({ safetyScore: 4 }), country({ safetyScore: 7 }))).toBe("B");
  });

  it('picks the lower value when lower is better ("low")', () => {
    expect(winnerOf(cost, country({ avgHotelPrice: 50 }), country({ avgHotelPrice: 90 }))).toBe("A");
    expect(winnerOf(cost, country({ avgHotelPrice: 120 }), country({ avgHotelPrice: 60 }))).toBe("B");
  });

  it("returns a tie when both values are equal", () => {
    expect(winnerOf(safety, country({ safetyScore: 8 }), country({ safetyScore: 8 }))).toBe("tie");
    expect(winnerOf(cost, country({ avgHotelPrice: 70 }), country({ avgHotelPrice: 70 }))).toBe("tie");
  });
});

describe("norm", () => {
  it("gives 1 to the better country and a proportional share to the other", () => {
    const a = country({ safetyScore: 8 });
    const b = country({ safetyScore: 4 });
    expect(norm(safety, 8, a, b)).toBe(1);
    expect(norm(safety, 4, a, b)).toBe(0.5);

    const cheap = country({ avgHotelPrice: 50 });
    const pricey = country({ avgHotelPrice: 100 });
    expect(norm(cost, 50, cheap, pricey)).toBe(1);
    expect(norm(cost, 100, cheap, pricey)).toBe(0.5);
  });

  it("returns 0.5 instead of dividing by zero when a value is 0", () => {
    const zeros = country({ safetyScore: 0 });
    expect(norm(safety, 0, zeros, zeros)).toBe(0.5);

    const free = country({ avgHotelPrice: 0 });
    expect(norm(cost, 0, free, country({ avgHotelPrice: 40 }))).toBe(0.5);
  });
});

describe("toneColor", () => {
  it("maps a 0..1 score to success, accent or danger", () => {
    expect(toneColor(0.9)).toBe("var(--success)");
    expect(toneColor(0.66)).toBe("var(--success)");
    expect(toneColor(0.5)).toBe("var(--accent)");
    expect(toneColor(0.4)).toBe("var(--accent)");
    expect(toneColor(0.1)).toBe("var(--danger)");
  });
});
