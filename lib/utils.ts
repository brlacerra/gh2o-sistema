export type PontoTipo = "estacao" | "horimetro" | "nivelador";

export interface Ponto {
  id: string;
  tipo: PontoTipo;
  latitude: number;
  longitude: number;
  nome: string;
  ultimaLeitura?: Date;

  chuva24h?: number;
  luminosidade?: number;
  pressaoAt?: number;
  temperatura?: number;
  umidade?: number;

  usoAtual?: number;
  usoAutorizado?: number;
  usoHoje?: number;

  nivelAtual?: number;
  nivelAlerta?: number;
}

export function tempoToDate(epochString?: string | null): Date | undefined {
  if (!epochString) return undefined;

  const n = Number(epochString);
  if (!Number.isFinite(n)) return undefined;

  const ms = n < 1e12 ? n * 1000 : n;

  const d = new Date(ms);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

export function formatDateBR(d?: Date) {
  if (!d) return "—";
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "medium",
  }).format(d);
}