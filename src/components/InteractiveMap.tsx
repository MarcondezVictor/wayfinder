"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { CountrySchema, countriesData as ALL_COUNTRIES } from "@/lib/countries-data";
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

export default function InteractiveMap({ countries = [] }: InteractiveMapProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Fallback to ALL_COUNTRIES if the list is empty
  const activeCountries = countries.length > 0 ? countries : ALL_COUNTRIES;

  useEffect(() => {
    if (!chartRef.current) return;

    // Initialize amCharts Root element
    const root = am5.Root.new(chartRef.current);

    // Create chart
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

    // Create polygon series for the world map
    const polygonSeries = chart.series.push(
      am5map.MapPolygonSeries.new(root, {
        geoJSON: am5geodata_worldLow,
        exclude: ["AQ"], // Exclude Antarctica
      })
    );

    // Configure map polygons template
    polygonSeries.mapPolygons.template.setAll({
      templateField: "polygonSettings", // reads settings from data
      fill: am5.color("#E2E8F0"),       // default: light gray
      stroke: am5.color("#FFFFFF"),
      strokeWidth: 0.5,
      interactive: true,
    });

    // Hover state: slightly dim/darken, don't change color
    polygonSeries.mapPolygons.template.states.create("hover", {
      fillOpacity: 0.75,
    });

    // Pass colors via data for featured countries
    polygonSeries.data.setAll(
      Object.entries(COUNTRY_COLORS).map(([id, color]) => ({
        id,
        polygonSettings: {
          fill: am5.color(color),
          cursorOverStyle: "pointer",
        },
      }))
    );

    // Click handler
    polygonSeries.mapPolygons.template.events.on("click", (ev) => {
      const id = (ev.target.dataItem?.dataContext as any)?.id;
      const country = activeCountries.find((c) => c.isoCode.toUpperCase() === id?.toUpperCase());
      if (country) {
        router.push(`/country/${country.slug}`);
      }
    });

    // Bullet series for small countries
    const pointSeries = chart.series.push(
      am5map.MapPointSeries.new(root, {})
    );

    pointSeries.bullets.push((bulletRoot, series, dataItem) => {
      const ctx = dataItem.dataContext as any;
      const color = COUNTRY_COLORS[ctx.id] || "#1A3055";

      const circle = am5.Circle.new(bulletRoot, {
        radius: 4,                      // PEQUENO: 4px
        fill: am5.color(color),         // SÓLIDO: mesma cor do país
        stroke: am5.color("#FFFFFF"),
        strokeWidth: 1,
        tooltipText: ctx.countryName,
        cursorOverStyle: "pointer",
        interactive: true,
      });

      circle.states.create("hover", {
        radius: 6,
        strokeWidth: 1.5,
      });

      circle.events.on("click", () => {
        if (ctx?.slug) {
          router.push(`/country/${ctx.slug}`);
        }
      });

      return am5.Bullet.new(bulletRoot, { sprite: circle });
    });

    // Small countries data with coordinates
    pointSeries.data.setAll([
      {
        geometry: { type: "Point", coordinates: [103.8198, 1.3521] },
        countryName: "Singapura", slug: "singapore", id: "SG",
      },
      {
        geometry: { type: "Point", coordinates: [35.2137, 31.7683] },
        countryName: "Israel", slug: "israel", id: "IL",
      },
      {
        geometry: { type: "Point", coordinates: [54.3773, 24.4764] },
        countryName: "Emirados Árabes", slug: "united-arab-emirates",
        id: "AE",
      },
    ]);

    // Initial animations
    polygonSeries.appear(1000);
    chart.appear(1000, 100);

    return () => {
      root.dispose();
    };
  }, [activeCountries, router]);

  return (
    <div ref={chartRef} className="w-full h-full" />
  );
}
