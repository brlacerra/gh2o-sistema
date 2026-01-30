import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  EstacaoMeteorologicaDashboard,
  HorimetroDashboard,
  NiveladorDashboard,
} from "@/app/components/dashboard";
import { error } from "console";

type SensorType = "estacao" | "horimetro" | "nivelador";

function parsePontoId(raw: string): { type?: SensorType; dbId: string } {
  const decoded = decodeURIComponent(raw);
  const idx = decoded.indexOf(":");
  if (idx === -1) return { dbId: decoded };
  return {
    type: decoded.slice(0, idx) as SensorType,
    dbId: decoded.slice(idx + 1),
  };
}

async function getSensorById(rawId: string): Promise<{ id: string; type: SensorType }> {
  const { type, dbId } = parsePontoId(rawId);
  if (!dbId) error("Invalid sensor ID");
  const count = await prisma.sta.count();
const first = await prisma.sta.findFirst({ select: { codSta: true } });

console.log("[db check] sta.count =", count, "first =", first);
console.log("[db check] dbId =", JSON.stringify(dbId));


  if (type === "estacao") {
    const station = await prisma.sta.findUnique({
      where: { codSta: dbId }, 
      select: { codSta: true },
    });
    if (!station) notFound();
    return { id: station.codSta, type: "estacao" };
  }

  if (type === "horimetro") {
    // quando existir tabela/model:
    notFound();
  }

  if (type === "nivelador") {
    // quando existir tabela/model:
    notFound();
  }

  // sem prefixo: tenta achar (hoje só estação)
  const station = await prisma.sta.findUnique({
    where: { codSta: dbId },
    select: { codSta: true },
  });
  if (station) return { id: station.codSta, type: "estacao" };

  notFound();
}

export default async function SensorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const decodedId = decodeURIComponent(id); // <- resolve %3A para :
  const sensor = await getSensorById(decodedId);

  switch (sensor.type) {
    case "estacao":
      return <EstacaoMeteorologicaDashboard sensorId={sensor.id} />;
    case "horimetro":
      return <HorimetroDashboard sensorId={sensor.id} />;
    case "nivelador":
      return <NiveladorDashboard sensorId={sensor.id} />;
    default:
      notFound();
  }
}