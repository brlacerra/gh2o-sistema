"use client";

import { useEffect, useRef, useState } from "react";
import Map, { Marker, MapRef } from "react-map-gl/maplibre";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faCloudSunRain, faWater } from "@fortawesome/free-solid-svg-icons";
import { type Ponto, type PontoTipo } from "@/lib/utils";
import { healthFromLastReading, ReadingHealth } from "@/lib/mappers/stationToPonto";


interface FullScreenMapProps {
  pontos: Ponto[];
  selectedPonto: Ponto | null;
  onSelectPonto: (p: Ponto | null) => void;
  focusPonto?: Ponto | null;
}

function colorClass(health: ReadingHealth, selected?: boolean){
  if (selected) return "text-yellow-300";

  switch(health){
    case "ok":
      return "text-green-500";
    case "warn":
      return "text-orange-500";
    case "offline":
      return "text-red-500";
    case "unknown":
    default:
      return "text-gray-500";
  }
}

function getIconSizeByZoom(zoom: number) {
  if (zoom < 5) return 40;
  if (zoom < 10) return 50;
  if (zoom < 15) return 60;
  return 100;
}

function IconByTipo({
  tipo,
  size,
  selected,
  health,
}: {
  tipo: PontoTipo;
  size: number;
  selected?: boolean;
  health: ReadingHealth;
}) {
  const style: React.CSSProperties = {
    width: size,
    height: size,
    fontSize: size * 0.6,
    transform: selected ? "scale(1.2)" : "scale(1)",
    transition: "transform 0.15s ease",
  };

  const icon = tipo === "horimetro" ? faClock : tipo === "estacao" ? faCloudSunRain : faWater;

  return (
    <div style={style} className={colorClass(health, selected)}>
      <FontAwesomeIcon icon={icon} />
    </div>
  );
}

export default function FullScreenMap({
  pontos,
  selectedPonto,
  onSelectPonto,
  focusPonto,
}: FullScreenMapProps) {
  const [viewState, setViewState] = useState({
    latitude: -18.7315157,
    longitude: -47.5004928,
    zoom: 11,
  });

  const mapRef = useRef<MapRef | null>(null);

  const maptilerKey = process.env.NEXT_PUBLIC_MAPTILER_KEY;
  const iconSize = getIconSizeByZoom(viewState.zoom);

  useEffect(() => {
    if (!focusPonto || !mapRef.current) return;

    mapRef.current.flyTo({
      center: [focusPonto.longitude, focusPonto.latitude],
      zoom: Math.max(viewState.zoom, 13),
      essential: true,
      duration: 200,
    });
  }, [focusPonto, viewState.zoom]);

  return (
    <div className="w-screen h-screen relative">
      <Map
        ref={mapRef}
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        style={{ width: "100%", height: "100%" }}
        mapLib={maplibregl}
        mapStyle={`https://api.maptiler.com/maps/satellite-v4/style.json?key=${maptilerKey}`}
      >

        {pontos.map(ponto => (
          <Marker
            key={ponto.id}
            longitude={ponto.longitude}
            latitude={ponto.latitude}
            anchor="right"
          >
            <button
              title={ponto.nome}
              onClick={e => {
                e.stopPropagation();
                onSelectPonto(ponto);
              }}
            >
              <IconByTipo
                tipo={ponto.tipo}
                size={iconSize}
                selected={selectedPonto?.id === ponto.id} 
                health={healthFromLastReading(ponto.ultimaLeitura)}
              />
            </button>
          </Marker>
        ))}
      </Map>
    </div>
  );
}