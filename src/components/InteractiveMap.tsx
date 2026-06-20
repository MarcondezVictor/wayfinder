"use client";

import { useEffect, useRef } from "react";
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
  { id: "BR", isoCode: "br", countryName: "Brasil", slug: "brazil" },
  { id: "UA", isoCode: "ua", countryName: "Ucrânia", slug: "ukraine" },
  { id: "FR", isoCode: "fr", countryName: "França", slug: "france" },
  { id: "ES", isoCode: "es", countryName: "Espanha", slug: "spain" },
  { id: "US", isoCode: "us", countryName: "Estados Unidos", slug: "united-states" },
  { id: "JP", isoCode: "jp", countryName: "Japão", slug: "japan" },
  { id: "GB", isoCode: "gb", countryName: "Reino Unido", slug: "united-kingdom" },
  { id: "IT", isoCode: "it", countryName: "Itália", slug: "italy" },
  { id: "SG", isoCode: "sg", countryName: "Singapura", slug: "singapore" },
  { id: "IL", isoCode: "il", countryName: "Israel", slug: "israel" },
  { id: "AE", isoCode: "ae", countryName: "Emirados Árabes Unidos", slug: "united-arab-emirates" },
  { id: "MA", isoCode: "ma", countryName: "Marrocos", slug: "morocco" },
  { id: "ZA", isoCode: "za", countryName: "África do Sul", slug: "south-africa" },
  { id: "EG", isoCode: "eg", countryName: "Egito", slug: "egypt" },
  { id: "AU", isoCode: "au", countryName: "Austrália", slug: "australia" },
  { id: "NZ", isoCode: "nz", countryName: "Nova Zelândia", slug: "new-zealand" },
  { id: "SE", isoCode: "se", countryName: "Suécia", slug: "sweden" },
  { id: "CL", isoCode: "cl", countryName: "Chile", slug: "chile" },
  { id: "IS", isoCode: "is", countryName: "Islândia", slug: "iceland" }
];

export default function InteractiveMap({ countries: _countries = [] }: InteractiveMapProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

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
      tooltipHTML: `<div style="display:flex;align-items:center;gap:8px;padding:4px 2px;font-size:13px;font-weight:600;color:#1e293b;">
        <img src="/flags/{isoCode}.svg" width="24" height="16" style="border-radius:2px;object-fit:cover;flex-shrink:0;" />
        <span>{countryName}</span>
      </div>`,
      interactive: true,
      cursorOverStyle: "pointer",
    });

    // Hover state: slightly dim/darken, don't change color
    polygonSeries.mapPolygons.template.states.create("hover", {
      fillOpacity: 0.75,
    });

    // Click handler
    polygonSeries.mapPolygons.template.events.on("click", (ev) => {
      const ctx = ev.target.dataItem?.dataContext as { id?: string; slug?: string; isoCode?: string; countryName?: string };
      if (ctx?.slug) {
        router.push(`/country/${ctx.slug}`);
      }
    });

    // Merge COUNTRY_DATA with colors for setting up the series data
    const mergedData = COUNTRY_DATA.map((item) => {
      const color = COUNTRY_COLORS[item.id] || "#E2E8F0";
      return {
        ...item,
        polygonSettings: {
          fill: am5.color(color),
          cursorOverStyle: "pointer",
        },
      };
    });

    polygonSeries.data.setAll(mergedData);

    // Bullet series for small countries
    const pointSeries = chart.series.push(
        am5map.MapPointSeries.new(root, {})
    );

    pointSeries.bullets.push((bulletRoot, _series, dataItem) => {
      const ctx = dataItem.dataContext as { id: string; countryName: string; slug: string };
      const color = COUNTRY_COLORS[ctx.id] || "#1A3055";

      const circle = am5.Circle.new(bulletRoot, {
        radius: 4,                      // PEQUENO: 4px
        fill: am5.color(color),         // SÓLIDO: mesma cor do país
        stroke: am5.color("#FFFFFF"),
        strokeWidth: 1,
        tooltipHTML: `<div style="display:flex;align-items:center;gap:8px;padding:4px 2px;font-size:13px;font-weight:600;color:#1e293b;">
          <img src="/flags/${ctx.id.toLowerCase()}.svg" width="24" height="16" style="border-radius:2px;object-fit:cover;flex-shrink:0;" />
          <span>${ctx.countryName}</span>
        </div>`,
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

    // Apenas micro-países cujo polígono é demasiado pequeno para clicar.
    // Países grandes o suficiente (ex.: Emirados Árabes) NÃO levam ponto —
    // clicam-se diretamente no mapa.
    pointSeries.data.setAll([
      {
        geometry: { type: "Point", coordinates: [103.8198, 1.3521] },
        countryName: "Singapura", slug: "singapore", id: "SG",
      },
      {
        geometry: { type: "Point", coordinates: [35.2137, 31.7683] },
        countryName: "Israel", slug: "israel", id: "IL",
      },
    ]);

    // Initial animations
    polygonSeries.appear(1000);
    chart.appear(1000, 100);

    return () => {
      root.dispose();
    };
  }, [router]);

  return (
      <div ref={chartRef} className="w-full h-full" />
  );
}
