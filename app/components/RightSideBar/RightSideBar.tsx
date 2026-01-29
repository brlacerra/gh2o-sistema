"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import type { Ponto } from "@/app/components/FullScreenMap";
import { useRouter } from "next/navigation";

interface RightSidebarProps {
  pontoSelecionado: Ponto | null;
  onClearSelection: () => void;
}

export function RightSidebar({ pontoSelecionado, onClearSelection }: RightSidebarProps) {
  return (
    <>
      <DesktopSidebar pontoSelecionado={pontoSelecionado} onClearSelection={onClearSelection} />
      <MobileBottomSheet pontoSelecionado={pontoSelecionado} onClearSelection={onClearSelection} />
    </>
  );
}


function DesktopSidebar({
  pontoSelecionado,
  onClearSelection,
}: {
  pontoSelecionado: Ponto | null;
  onClearSelection: () => void;
}) {
  const router = useRouter();

  if (!pontoSelecionado) {
    return (
      <></>
    );
  }

  const p = pontoSelecionado;

  return (
    <aside className="hidden md:block absolute right-4 top-26 w-80 bg-white/95 shadow-lg p-4 z-10 border border-slate-200">
      <Header ponto={p} />
      <BasicInfo ponto={p} />
      <DetailsByTipo ponto={p} />

      <div className="mt-3 flex gap-2">
        <button
          className="flex-1 bg-emerald-600 hover:bg-emerald-500
                     text-white text-xs font-semibold py-1.5 transition"
          onClick={() => router.push(`/sensores/${p.id}`)}
        >
          Ver dashboard
        </button>

        <button
          className="px-2 py-1 border border-slate-300 text-[11px]
                     text-slate-600 hover:bg-slate-100 transition"
          onClick={onClearSelection}
        >
          Limpar
        </button>
      </div>
    </aside>
  );
}

/* ----------------------------- Mobile bottom sheet (<md) ----------------------------- */

function MobileBottomSheet({
  pontoSelecionado,
  onClearSelection,
}: {
  pontoSelecionado: Ponto | null;
  onClearSelection: () => void;
}) {
  const router = useRouter();
  const open = !!pontoSelecionado;

  const COLLAPSED_VH = 34; // ~1/3
  const EXPANDED_VH = 90;  // quase tela toda

  const [expanded, setExpanded] = useState(false);
  const [dragging, setDragging] = useState(false);

  const [topPx, setTopPx] = useState<number>(99999);

  const metricsRef = useRef<{
    viewportH: number;
    collapsedTop: number;
    expandedTop: number;
    closedTop: number;
  } | null>(null);

  const startYRef = useRef<number | null>(null);
  const startTopRef = useRef<number>(0);

  const recomputeMetrics = () => {
    const vh = window.innerHeight;
    const collapsedH = (vh * COLLAPSED_VH) / 100;
    const expandedH = (vh * EXPANDED_VH) / 100;

    metricsRef.current = {
      viewportH: vh,
      collapsedTop: vh - collapsedH,
      expandedTop: vh - expandedH,
      closedTop: vh, 
    };
  };

  useEffect(() => {
    recomputeMetrics();

    const onResize = () => {
      recomputeMetrics();
      const m = metricsRef.current!;
      if (!open) setTopPx(m.closedTop);
      else setTopPx(expanded ? m.expandedTop : m.collapsedTop);
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [open, expanded]);

  useEffect(() => {
    if (!metricsRef.current && typeof window !== "undefined") {
      recomputeMetrics();
    }
    const m = metricsRef.current;
    if (!m) return;

    if (open) {
      setExpanded(false); 
      setTopPx(m.collapsedTop);
    } else {
      setTopPx(m.closedTop);
    }
  }, [open]);

  const clamp = (value: number, min: number, max: number) =>
    Math.min(max, Math.max(min, value));

  const onPointerDown = (e: React.PointerEvent) => {
    if (!metricsRef.current) return;

    setDragging(true);
    startYRef.current = e.clientY;
    startTopRef.current = topPx;

    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging || startYRef.current == null || !metricsRef.current) return;

    const m = metricsRef.current;
    const delta = e.clientY - startYRef.current; 
    const nextTop = startTopRef.current + delta;

    const clamped = clamp(nextTop, m.expandedTop, m.closedTop);
    setTopPx(clamped);
  };

  const snapTo = (target: "expanded" | "collapsed" | "closed") => {
    const m = metricsRef.current;
    if (!m) return;

    if (target === "expanded") {
      setExpanded(true);
      setTopPx(m.expandedTop);
      return;
    }
    if (target === "collapsed") {
      setExpanded(false);
      setTopPx(m.collapsedTop);
      return;
    }
    // closed
    setExpanded(false);
    setTopPx(m.closedTop);
  };

  const onPointerUp = () => {
    if (!metricsRef.current) return;

    setDragging(false);
    startYRef.current = null;

    const m = metricsRef.current;

    const CLOSE_THRESHOLD_PX = 90;
    const EXPAND_THRESHOLD_PX = 70;

    const deltaFromStart = topPx - startTopRef.current; 

    if (deltaFromStart < -EXPAND_THRESHOLD_PX) {
      snapTo("expanded");
      return;
    }

    if (deltaFromStart > CLOSE_THRESHOLD_PX) {
      if (expanded) {
        snapTo("collapsed");
      } else {
        onClearSelection();
        snapTo("closed");
      }
      return;
    }

    const distToExpanded = Math.abs(topPx - m.expandedTop);
    const distToCollapsed = Math.abs(topPx - m.collapsedTop);

    if (distToExpanded < distToCollapsed) snapTo("expanded");
    else snapTo("collapsed");
  };

  const p = pontoSelecionado;

  return (
    <div className="md:hidden">
      {open && (
        <button
          className="fixed inset-0 bg-black/30 z-20"
          onClick={() => {
            onClearSelection();
            snapTo("closed");
          }}
          aria-label="Fechar detalhes"
        />
      )}

      <div
        className="fixed left-0 right-0 z-30 bg-white shadow-2xl border-t border-slate-200"
        style={{
          top: topPx,
          height: "100vh",
          transition: dragging ? "none" : "top 180ms ease-out",
          touchAction: "none",
        }}
      >
        <div
          className="h-10 flex items-center justify-center"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <div className="w-12 h-1.5 bg-slate-300 " />
        </div>

        <div className="px-4 pb-6 overflow-y-auto max-h-[90vh] text-slate-900">
          {!p ? (
            <p className="text-xs text-slate-600">
              Selecione um sensor no mapa para ver os detalhes.
            </p>
          ) : (
            <>
              <Header ponto={p} />
              <BasicInfo ponto={p} />
              <DetailsByTipo ponto={p} />

              <div className="mt-3 grid grid-cols-2 gap-2">
                <button
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold py-2 transition"
                  onClick={() => router.push(`/sensores/${p.id}`)}
                >
                  Dashboard
                </button>
                <button
                  className="border border-slate-300 text-sm font-semibold py-2 text-slate-700"
                  onClick={() => {
                    onClearSelection();
                    snapTo("closed");
                  }}
                >
                  Fechar
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ----------------------------- Shared content ----------------------------- */

function Header({ ponto }: { ponto: Ponto }) {
  return (
    <div className="mb-2 flex items-start justify-between gap-2">
      <div className="min-w-0">
        <h3 className="font-semibold text-slate-900 truncate">{ponto.nome}</h3>
        <p className="text-[11px] text-slate-500">
          ID: <span className="font-mono">{ponto.id}</span>
        </p>
      </div>

      <span className="shrink-0 px-2 py-0.5 text-[11px] font-medium capitalize bg-slate-100 text-slate-700">
        {ponto.tipo}
      </span>
    </div>
  );
}

function BasicInfo({ ponto }: { ponto: Ponto }) {
  return (
    <div className="space-y-0.5 text-xs text-slate-600">
      <p>
        Lat: <span className="font-mono">{ponto.latitude.toFixed(5)}</span>
      </p>
      <p>
        Lng: <span className="font-mono">{ponto.longitude.toFixed(5)}</span>
      </p>
    </div>
  );
}

function DetailsByTipo({ ponto }: { ponto: Ponto }) {

  if (ponto.tipo === "estacao") {
    return (
      <div className="mt-3 bg-slate-50 border border-slate-200 p-3 text-xs text-slate-700">
        <div className="font-semibold text-slate-800 mb-2">Resumo (Estação)</div>
        <ul className="space-y-1">
          <li>Temperatura: {ponto.temperatura ?? "-"}°C</li>
          <li>Umidade: {ponto.umidade ?? "-"}%</li>
          <li>Chuva (24h): {ponto.chuva24h ?? "-"} mm</li>
          <li>Luminosidade: {ponto.luminosidade ?? "-"}</li>
          <li>Pressão Atm.: {ponto.pressaoAt ?? "-"} hPa</li>
        </ul>
      </div>
    );
  }

  if (ponto.tipo === "horimetro") {
    return (
      <div className="mt-3 bg-slate-50 border border-slate-200 p-3 text-xs text-slate-700">
        <div className="font-semibold text-slate-800 mb-2">Resumo (Horímetro)</div>
        <ul className="space-y-1">
          <li>Uso atual: {ponto.usoAtual ?? "-"}</li>
          <li>Uso autorizado: {ponto.usoAutorizado ?? "-"}</li>
          <li>Uso hoje: {ponto.usoHoje ?? "-"}</li>
        </ul>
      </div>
    );
  }

  return (
    <div className="mt-3 bg-slate-50 border border-slate-200 p-3 text-xs text-slate-700">
      <div className="font-semibold text-slate-800 mb-2">Resumo (Nivelador)</div>
      <ul className="space-y-1">
        <li>Nível atual: {ponto.nivelAtual ?? "-"}</li>
        <li>Nível alerta: {ponto.nivelAlerta ?? "-"}</li>
      </ul>
    </div>
  );
}