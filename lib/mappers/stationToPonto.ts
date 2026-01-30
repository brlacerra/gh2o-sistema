import type { Ponto } from "@/lib/utils";
import { tempoToDate } from "@/lib/utils"

export type StationApiItem = {
  codSta: string;
  nomeSta: string | null;
  aliasSta: string | null;
  codCliSta: string | null;
  latSta: number | null;
  longSta: number | null;
  resSta: number | null;
  perSta: number | null;
  ctlSta: number | null;
  latestData: null | {
    codSta: string;
    ts: string;
    pulsos: number | null;
    tempAvg: number | null;
    tempMin: number | null;
    tempMax: number | null;
    preAvg: number | null;
    preMin: number | null;
    preMax: number | null;
    umiAvg: number | null;
    umiMin: number | null;
    umiMax: number | null;
    lumAvg: number | null;
    lumMin: number | null;
    lumMax: number | null;
    vvAvg: number | null;
    vvMin: number | null;
    vvMax: number | null;
    dv: number | null;
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
    }));
}