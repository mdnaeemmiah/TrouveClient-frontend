"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

type MapPickerProps = {
  latitude: number;
  longitude: number;
  onChange: (latitude: number, longitude: number) => void;
};

const DEFAULT_CENTER: [number, number] = [48.8566, 2.3522];

export default function MapPicker({ latitude, longitude, onChange }: MapPickerProps) {
  const mapElement = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    if (!mapElement.current || mapRef.current) return;
    const hasCoordinates = Number.isFinite(latitude) && Number.isFinite(longitude);
    const center: [number, number] = hasCoordinates ? [latitude, longitude] : DEFAULT_CENTER;
    const map = L.map(mapElement.current, { scrollWheelZoom: false }).setView(center, hasCoordinates ? 13 : 5);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: "&copy; OpenStreetMap contributors" }).addTo(map);
    const marker = L.marker(center, { draggable: true }).addTo(map);
    marker.on("dragend", () => {
      const position = marker.getLatLng();
      onChangeRef.current(position.lat, position.lng);
    });
    map.on("click", (event) => {
      marker.setLatLng(event.latlng);
      onChangeRef.current(event.latlng.lat, event.latlng.lng);
    });
    mapRef.current = map;
    markerRef.current = marker;
    const timer = window.setTimeout(() => map.invalidateSize(), 100);
    return () => {
      window.clearTimeout(timer);
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current || !markerRef.current) return;
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return;
    const nextPosition = L.latLng(latitude, longitude);
    markerRef.current.setLatLng(nextPosition);
    mapRef.current.setView(nextPosition, Math.max(mapRef.current.getZoom(), 13));
  }, [latitude, longitude]);

  return <div ref={mapElement} className="h-64 w-full overflow-hidden rounded-xl border border-slate-200 bg-[#e7efeb]" />;
}
