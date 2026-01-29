"use client";

import type { Ponto } from "@/app/components/FullScreenMap";
import { useRouter } from "next/navigation";

interface RightSidebarProps {
  pontoSelecionado: Ponto | null;
    onClearSelection: () => void;
}

export function RightSidebar({ pontoSelecionado, onClearSelection }: RightSidebarProps) {
  if (!pontoSelecionado) {
    return (
      <></>
    );
  }

  const p = pontoSelecionado;
    const router = useRouter();



  return (
    <aside className="absolute top-26 right-4 w-80 bg-white/95 shadow-lg p-4 z-10 border border-slate-200">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <h2 className="font-semibold text-sm text-slate-900">{p.nome}</h2>
          <p className="text-[11px] text-slate-500 mt-0.5">
            ID: <span className="font-mono">{p.id}</span>
          </p>
        </div>

        <span
          className={`
            px-2 py-0.5 text-[11px] font-medium capitalize
            ${
              p.tipo === "horimetro"
                ? "bg-emerald-100 text-emerald-700"
                : p.tipo === "estacao"
                ? "bg-sky-100 text-sky-700"
                : "bg-indigo-100 text-indigo-700"
            }
          `}
        >
          {p.tipo}
        </span>
      </div>

      {/* Coordenadas */}
      <div className="space-y-0.5 text-xs text-slate-600 mb-3">
        <p>
          Latitude:{" "}
          <span className="font-mono">{p.latitude.toFixed(5)}</span>
        </p>
        <p>
          Longitude:{" "}
          <span className="font-mono">{p.longitude.toFixed(5)}</span>
        </p>
      </div>

      {/* Bloco específico por tipo */}
      {p.tipo === "estacao" && (
        <div className="mb-3 space-y-0.5 text-xs text-slate-700">
            <h2 className="font-semibold text-sm text-slate-900">
            Dados atuais:
          </h2>
          <p>
            Chuva (24h):{" "}
            <span className="font-semibold">
              {p.chuva24h != null ? `${p.chuva24h} mm` : "--"}
            </span>
          </p>
          <p>
            Luminosidade:{" "}
            <span className="font-semibold">
              {p.luminosidade != null ? `${p.luminosidade} %` : "--"}
            </span>
          </p>
          <p>
            Pressão:{" "}
            <span className="font-semibold">
              {p.pressaoAt != null ? `${p.pressaoAt} hPa` : "--"}
            </span>
          </p>
          <p>
            Temperatura:{" "}
            <span className="font-semibold">
              {p.temperatura != null ? `${p.temperatura} °C` : "--"}
            </span>
          </p>
          <p>
            Umidade:{" "}
            <span className="font-semibold">
              {p.umidade != null ? `${p.umidade} %` : "--"}
            </span>
          </p>
        </div>
      )}

      {p.tipo === "horimetro" && (
        <div className="mb-3 space-y-0.5 text-xs text-slate-700">
            <h2 className="font-semibold text-sm text-slate-900">
            Dados atuais:
          </h2>
          <p>
            Uso Atual:{" "}
            <span className="font-semibold">
              {p.usoAtual != null ? `${p.usoAtual} m³/h` : "--"}
            </span>
          </p>
          <p>
            Uso Autorizado (diário):{" "}
            <span className="font-semibold">
              {p.usoAutorizado != null ? `${p.usoAutorizado} m³/h` : "--"}
            </span>
          </p>
          <p>
            Consumo hoje:{" "}
            <span className="font-semibold">
              {p.usoHoje != null ? `${p.usoHoje} m³` : "--"}
            </span>
          </p>
        </div>
      )}

      {p.tipo === "nivelador" && (
        <div className="mb-3 space-y-0.5 text-xs text-slate-700">
            <h2 className="font-semibold text-sm text-slate-900">
            Dados atuais:
          </h2>
          <p>
            Nível atual:{" "}
            <span className="font-semibold">
              {p.nivelAtual != null ? `${p.nivelAtual} m` : "--"}
            </span>
          </p>
          <p>
            Nível de alerta:{" "}
            <span className="font-semibold">
              {p.nivelAlerta != null ? `${p.nivelAlerta} m` : "--"}
            </span>
          </p>
        </div>
      )}
      <div className="mt-2 flex gap-2">
        
        <button
          className="flex-1 bg-emerald-600 hover:bg-emerald-500 
                     text-white text-xs font-semibold py-1.5 transition"
          onClick={() => {
            router.push(`/sensores/${p.id}`);
          }}
        >
          Ver dashboard
        </button>
        <button
          className="px-2 py-1 border border-slate-300 text-[11px] 
                     text-slate-600 hover:bg-slate-300 transition"
          onClick={() => {
            onClearSelection();
          }}
        >
          Limpar
        </button>
      </div>
    </aside>
  );
}