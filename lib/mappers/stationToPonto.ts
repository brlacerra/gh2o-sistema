import type { Ponto } from "@/lib/utils";
import { tempoToDate } from "@/lib/utils"

export type ReadingHealth = "ok" | "warn" | "offline" | "unknown";

export type StationApiItem = {
  codSta: string;
  nomeSta: string | null;
  aliasSta: string | null;
  latSta: number | null;
  longSta: number | null;
  resSta: number | null;
  perSta: number | null;
  latestData: null | {
    codSta: string;
    ts: string;
    pulsos: number | null;
    tempAvg: number | null;
    preAvg: number | null;
    umiAvg: number | null;
    lumAvg: number | null;
    vvAvg: number | null;
  };
};

export type StationsApiResponse = { data: StationApiItem[] };

export function stationsToPontos(stations: StationApiItem[]): Ponto[] {
  return stations
    .filter(s => s.latSta != null && s.longSta != null)
    .map(s => ({
      id: `estacao:${s.codSta}`,
      tipo: "estacao",
      latitude: s.latSta as number,
      longitude: s.longSta as number,
      nome: s.aliasSta ?? s.nomeSta ?? s.codSta,

      temperatura: s.latestData?.tempAvg ?? undefined,
      umidade: s.latestData?.umiAvg ?? undefined,
      pressaoAt: s.latestData?.preAvg ?? undefined,
      luminosidade: s.latestData?.lumAvg ?? undefined,
      ultimaLeitura: tempoToDate(s.latestData?.ts),
      chuva24h: s.latestData?.pulsos ?? undefined,
    }));
}


export function healthFromLastReading(
  last?: Date | null,
  now = new Date()
): ReadingHealth {
  if (!last) return "unknown";

  const diffMs = now.getTime() - last.getTime();
  const diffMin = diffMs / 60000;

  if (diffMin <= 15) return "ok";     // até 15 min
  if (diffMin <= 600) return "warn";   // 15-600 min
  return "offline";                      // > 600 min
}