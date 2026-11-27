"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { CountrySchema } from "@/lib/countries-data";
import * as am5 from "@amcharts/amcharts5";
import * as am5map from "@amcharts/amcharts5/map";
import am5geodata_worldLow from "@amcharts/amcharts5-geodata/worldLow";

interface InteractiveMapProps {
  countries?: CountrySchema[];
}

const COUNTRY_COLORS: Record<string, string> = {
  "PT": "#1A6B5A", "BR": "#2D6A4F", "UA": "#1A5276",
  "FR": "#5B2C6F", "ES": "#922B21", "US": "#1F618D",
  "JP": "#A04000", "GB": "#1A3A5C", "IT": "#1E8449",
  "SG": "#7D3C98", "IL": "#2E86C1", "AE": "#B7770D",
  "MA": "#BA4A00", "ZA": "#1D8348", "EG": "#C0392B",
  "AU": "#0E6655", "NZ": "#154360", "SE": "#2874A6",
  "CL": "#6C3483", "IS": "#2471A3",
};

const COUNTRY_DATA = [
  { id: "PT", isoCode: "pt", countryName: "Portugal", slug: "portugal" },
  { id: "BR", isoCode: "br", countryName: "Brazil", slug: "brazil" },
  { id: "UA", isoCode: "ua", countryName: "Ukraine", slug: "ukraine" },
  { id: "FR", isoCode: "fr", countryName: "France", slug: "france" },
  { id: "ES", isoCode: "es", countryName: "Spain", slug: "spain" },
  { id: "US", isoCode: "us", countryName: "United States", slug: "united-states" },
  { id: "JP", isoCode: "jp", countryName: "Japan", slug: "japan" },
  { id: "GB", isoCode: "gb", countryName: "United Kingdom", slug: "united-kingdom" },
  { id: "IT", isoCode: "it", countryName: "Italy", slug: "italy" },
  { id: "SG", isoCode: "sg", countryName: "Singapore", slug: "singapore" },
  { id: "IL", isoCode: "il", countryName: "Israel", slug: "israel" },
  { id: "AE", isoCode: "ae", countryName: "United Arab Emirates", slug: "united-arab-emirates" },
  { id: "MA", isoCode: "ma", countryName: "Morocco", slug: "morocco" },
  { id: "ZA", isoCode: "za", countryName: "South Africa", slug: "south-africa" },
  { id: "EG", isoCode: "eg", countryName: "Egypt", slug: "egypt" },
  { id: "AU", isoCode: "au", countryName: "Australia", slug: "australia" },
  { id: "NZ", isoCode: "nz", countryName: "New Zealand", slug: "new-zealand" },
  { id: "SE", isoCode: "se", countryName: "Sweden", slug: "sweden" },
  { id: "CL", isoCode: "cl", countryName: "Chile", slug: "chile" },
  { id: "IS", isoCode: "is", countryName: "Iceland", slug: "iceland" },
];

function tooltipHtml(isoCode: string, countryName: string) {
  return `<div style="display:flex;align-items:center;gap:8px;padding:4px 2px;font-size:13px;font-weight:600;color:#0f172a;">
    <img src="/flags/${isoCode}.svg" width="24" height="16" style="border-radius:2px;object-fit:cover;flex-shrink:0;" />
    <span>${countryName}</span>
  </div>`;
}

export default function InteractiveMap({ countries: _countries = [] }: InteractiveMapProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [isDark, setIsDark] = useState(false);

  // Tracks the theme (light/dark) and rebuilds the map when it changes.
  useEffect(() => {
    const el = document.documentElement;
    const update = () => setIsDark(el.classList.contains("dark"));
    update();
    const observer = new MutationObserver(update);
    observer.observe(el, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!chartRef.current) return;

    // Colours that contrast with the background in each theme
    const UNAVAILABLE_FILL = isDark ? "#3E4C61" : "#E2E8F0"; // countries without data
    const BORDER_COLOR = isDark ? "#101826" : "#CBD5E1";     // visible borders

    const root = am5.Root.new(chartRef.current);

    const chart = root.container.children.push(
        am5map.MapChart.new(root, {
          projection: am5map.geoNaturalEarth1(),
          panX: "rotateX",
          panY: "translateY",
          wheelY: "zoom",
          maxZoomLevel: 8,
          homeGeoPoint: { longitude: 10, latitude: 20 },
        })
    );

    const polygonSeries = chart.series.push(
        am5map.MapPolygonSeries.new(root, {
          geoJSON: am5geodata_worldLow,
          exclude: ["AQ"],
        })
    );

    // Base template: "unavailable" colour, borders, NOT interactive by default.
    polygonSeries.mapPolygons.template.setAll({
      templateField: "polygonSettings",
      fill: am5.color(UNAVAILABLE_FILL),
      stroke: am5.color(BORDER_COLOR),
      strokeWidth: 0.5,
      interactive: false,
    });

    // Only show a tooltip if the country has data (countryName). Otherwise, nothing.
    polygonSeries.mapPolygons.template.adapters.add("tooltipHTML", (html, target) => {
      const ctx = target.dataItem?.dataContext as { countryName?: string; isoCode?: string } | undefined;
      if (ctx?.countryName && ctx?.isoCode) {
        return tooltipHtml(ctx.isoCode, ctx.countryName);
      }
      return "";
    });

    // Hover only affects interactive ones (countries with data)
    polygonSeries.mapPolygons.template.states.create("hover", {
      fillOpacity: 0.75,
    });

    polygonSeries.mapPolygons.template.events.on("click", (ev) => {
      const ctx = ev.target.dataItem?.dataContext as { slug?: string } | undefined;
      if (ctx?.slug) router.push(`/country/${ctx.slug}`);
    });

    // Countries with data: own colour + interactive
    const mergedData = COUNTRY_DATA.map((item) => ({
      ...item,
      polygonSettings: {
        fill: am5.color(COUNTRY_COLORS[item.id] || UNAVAILABLE_FILL),
        interactive: true,
        cursorOverStyle: "pointer",
      },
    }));
    polygonSeries.data.setAll(mergedData);

    // Points for micro-countries (Singapore, Israel)
    const pointSeries = chart.series.push(am5map.MapPointSeries.new(root, {}));

    pointSeries.bullets.push((bulletRoot, _series, dataItem) => {
      const ctx = dataItem.dataContext as { id: string; isoCode: string; countryName: string; slug: string };
      const color = COUNTRY_COLORS[ctx.id] || "#1A3055";

      const circle = am5.Circle.new(bulletRoot, {
        radius: 4,
        fill: am5.color(color),
        stroke: am5.color(isDark ? "#0F172A" : "#FFFFFF"),
        strokeWidth: 1,
        tooltipHTML: tooltipHtml(ctx.isoCode, ctx.countryName),
        cursorOverStyle: "pointer",
        interactive: true,
      });

      circle.states.create("hover", { radius: 6, strokeWidth: 1.5 });
      circle.events.on("click", () => {
        if (ctx?.slug) router.push(`/country/${ctx.slug}`);
      });

      return am5.Bullet.new(bulletRoot, { sprite: circle });
    });

    pointSeries.data.setAll([
      { geometry: { type: "Point", coordinates: [103.8198, 1.3521] }, isoCode: "sg", countryName: "Singapore", slug: "singapore", id: "SG" },
      { geometry: { type: "Point", coordinates: [35.2137, 31.7683] }, isoCode: "il", countryName: "Israel", slug: "israel", id: "IL" },
    ]);

    polygonSeries.appear(1000);
    chart.appear(1000, 100);

    return () => root.dispose();
  }, [router, isDark]);

  return <div ref={chartRef} className="w-full h-full" />;
}
