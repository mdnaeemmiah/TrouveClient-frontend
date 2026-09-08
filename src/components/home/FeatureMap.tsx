"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

type FeatureMapProps = { latitude?: number; longitude?: number; label: string };
const DEFAULT_CENTER: [number, number] = [48.8566, 2.3522];

export default function FeatureMap({ latitude, longitude, label }: FeatureMapProps) {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!elementRef.current) return;
    const hasCoordinates = Number.isFinite(latitude) && Number.isFinite(longitude);
    const center: [number, number] = hasCoordinates ? [latitude as number, longitude as number] : DEFAULT_CENTER;
    const map = L.map(elementRef.current, { scrollWheelZoom: false, dragging: false }).setView(center, hasCoordinates ? 13 : 5);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: "&copy; OpenStreetMap contributors" }).addTo(map);
    L.marker(center).addTo(map).bindTooltip(label, { permanent: true, direction: "bottom", offset: [0, 12] });
    const timer = window.setTimeout(() => map.invalidateSize(), 100);
    return () => {
      window.clearTimeout(timer);
      map.remove();
    };
  }, [latitude, longitude, label]);

  // isolation:isolate creates a new stacking context so Leaflet's internal
  // z-indexes (400+) are scoped inside and cannot bleed over modals/popups.
  return (
    <div style={{ isolation: "isolate", position: "relative", zIndex: 0 }}>
      <div ref={elementRef} className="h-[220px] w-full overflow-hidden rounded-2xl bg-[#e3e5e8]" />
    </div>
  );
}
