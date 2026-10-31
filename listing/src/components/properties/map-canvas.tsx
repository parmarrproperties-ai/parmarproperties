"use client";

import * as React from "react";
import L from "leaflet";
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from "react-leaflet";

import "leaflet/dist/leaflet.css";

/**
 * A CSS-only marker. Leaflet's default icon points at bundled PNGs that do not
 * resolve reliably through the bundler, so this avoids the broken-image pin.
 */
const pinIcon = L.divIcon({
  className: "",
  html: `<span style="
    display:block;width:18px;height:18px;border-radius:9999px;
    background:var(--primary);border:3px solid white;
    box-shadow:0 1px 6px rgba(0,0,0,.45);
  "></span>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

function ClickHandler({
  onPick,
}: {
  onPick: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(event) {
      onPick(
        Number(event.latlng.lat.toFixed(7)),
        Number(event.latlng.lng.toFixed(7))
      );
    },
  });

  return null;
}

function Recenter({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();

  React.useEffect(() => {
    map.setView([lat, lng], map.getZoom(), { animate: true });
  }, [lat, lng, map]);

  return null;
}

export interface MapCanvasProps {
  latitude: number | null;
  longitude: number | null;
  onPick: (lat: number, lng: number) => void;
  /** Used when the property has no coordinates yet. */
  fallbackCenter?: [number, number];
}

export default function MapCanvas({
  latitude,
  longitude,
  onPick,
  fallbackCenter = [18.5204, 73.8567],
}: MapCanvasProps) {
  const hasPin = latitude != null && longitude != null;
  const center: [number, number] = hasPin
    ? [latitude, longitude]
    : fallbackCenter;

  return (
    <MapContainer
      center={center}
      zoom={hasPin ? 15 : 11}
      scrollWheelZoom
      className="h-72 w-full rounded-lg"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ClickHandler onPick={onPick} />
      {hasPin ? (
        <>
          <Recenter lat={latitude} lng={longitude} />
          <Marker
            position={[latitude, longitude]}
            icon={pinIcon}
            draggable
            eventHandlers={{
              dragend(event) {
                const { lat, lng } = event.target.getLatLng();
                onPick(Number(lat.toFixed(7)), Number(lng.toFixed(7)));
              },
            }}
          />
        </>
      ) : null}
    </MapContainer>
  );
}
