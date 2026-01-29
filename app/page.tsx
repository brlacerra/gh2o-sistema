"use client";

import { useState } from "react";
import FullScreenMap, { Ponto, PontoTipo } from "./components/FullScreenMap";
import { NavbarClient } from "@/app/components/Navbar/NavbarClient";
import { LeftFilters } from "@/app/components/LeftFilters/LeftFilters";
import { RightSidebar } from "@/app/components/RightSideBar/RightSideBar";
import { SENSORES_MOCK } from "./lib/sensores-mock";

const PONTOS_MOCK = SENSORES_MOCK;

export default function HomePage() {
  const [selectedPonto, setSelectedPonto] = useState<Ponto | null>(null);
  const [focusPonto, setFocusPonto] = useState<Ponto | null>(null);

  const [activeTypes, setActiveTypes] = useState<PontoTipo[]>([
    "estacao",
    "horimetro",
    "nivelador",
  ]);
  const [searchTerm, setSearchTerm] = useState("");

  const pontosFiltrados = PONTOS_MOCK.filter(p =>
    activeTypes.includes(p.tipo),
  );

  const toggleType = (tipo: PontoTipo) => {
    setActiveTypes(prev =>
      prev.includes(tipo) ? prev.filter(t => t !== tipo) : [...prev, tipo],
    );
  };

  return (
    <main className="w-screen h-screen relative">
      <FullScreenMap
        pontos={pontosFiltrados}
        selectedPonto={selectedPonto}
        onSelectPonto={ponto => {
          setSelectedPonto(ponto);
        }}
        focusPonto={focusPonto}
      />

      <NavbarClient />

      <LeftFilters
        allPoints={PONTOS_MOCK}
        activeTypes={activeTypes}
        onToggleType={toggleType}
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        onSelectPonto={ponto => {
          setSelectedPonto(ponto);
          setFocusPonto(ponto ?? null);
        }}
      />

      <RightSidebar
        pontoSelecionado={selectedPonto}
        onClearSelection={() => {
          setSelectedPonto(null);
          setFocusPonto(null);
        }}
      />
    </main>
  );
}