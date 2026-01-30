"use client";

import { useEffect, useRef, useState } from "react";
import Map, { Marker, MapRef } from "react-map-gl/maplibre";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faCloudSunRain, faWater } from "@fortawesome/free-solid-svg-icons";
import { type Ponto, type PontoTipo } from "@/lib/utils";


interface FullScreenMapProps {
  pontos: Ponto[];
  selectedPonto: Ponto | null;
  onSelectPonto: (p: Ponto | null) => void;
  focusPonto?: Ponto | null;
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
}: {
  tipo: PontoTipo;
  size: number;
  selected?: boolean;
}) {
  const style: React.CSSProperties = {
    width: size,
    height: size,
    fontSize: size * 0.6,
    transform: selected ? "scale(1.2)" : "scale(1)",
    transition: "transform 0.15s ease",
  };

  const color = selected ? "text-yellow-300" : "text";

  if (tipo === "horimetro") {
    return (
      <div style={style} className="text-purple-500">
        <FontAwesomeIcon icon={faClock} className={color} />
      </div>
    );
  }

  if (tipo === "estacao") {
    return (
      <div style={style} className="text-orange-500">
        <FontAwesomeIcon icon={faCloudSunRain} className={color} />
      </div>
    );
  }

  if (tipo === "nivelador") {
    return (
      <div style={style} className="text-blue-300">
        <FontAwesomeIcon icon={faWater} className={color} />
      </div>
    );
  }

  return (
    <div style={style}>
      <span className="text-[11px]">•</span>
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
    latitude: -18.637385,
    longitude: -47.45,
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
              />
            </button>
          </Marker>
        ))}
      </Map>
    </div>
  );
}