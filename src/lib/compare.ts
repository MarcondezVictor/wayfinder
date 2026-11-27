import type { LucideIcon } from "lucide-react";
import type { CountrySchema } from "./countries-data";

/* ----------------------------------------------------------------------------
 * Scoring helpers for the country comparison and the country page.
 * Pure functions, kept out of the pages so they can be unit tested.
 * -------------------------------------------------------------------------- */

// Estimated cost of one day: hotel night, two meals and local transport (EUR)
export const dailyCost = (c: CountrySchema) =>
    Math.round(c.avgHotelPrice + c.avgMealPrice * 2 + c.avgTransportCost);

export type Better = "high" | "low";

export interface Criterion {
  key: string;
  label: string;
  icon: LucideIcon;
  better: Better; // "high" = higher is better; "low" = lower is better
  get: (c: CountrySchema) => number;
  format: (c: CountrySchema) => string;
}

export function winnerOf(crit: Criterion, a: CountrySchema, b: CountrySchema): "A" | "B" | "tie" {
  const va = crit.get(a);
  const vb = crit.get(b);
  if (va === vb) return "tie";
  if (crit.better === "high") return va > vb ? "A" : "B";
  return va < vb ? "A" : "B";
}

// Normalizes the value within the pair to [0,1] (1 = better of the two)
export function norm(crit: Criterion, value: number, a: CountrySchema, b: CountrySchema): number {
  const va = crit.get(a);
  const vb = crit.get(b);
  if (crit.better === "high") {
    const best = Math.max(va, vb);
    return best > 0 ? value / best : 0.5;
  }
  const best = Math.min(va, vb);
  return value > 0 ? best / value : 0.5;
}

// Bar colour based on the "score" (0..1). Uses the design system's semantic tokens.
export function toneColor(ratio: number): string {
  if (ratio >= 0.66) return "var(--success)";
  if (ratio >= 0.4) return "var(--accent)";
  return "var(--danger)";
}
