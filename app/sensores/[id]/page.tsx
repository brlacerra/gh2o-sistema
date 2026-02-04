import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

type SensorType = "estacao" | "horimetro" | "nivelador";

function parsePontoId(decoded: string): { type?: SensorType; dbId: string } {
  const idx = decoded.indexOf(":");
  if (idx === -1) return { dbId: decoded };
  return {
    type: decoded.slice(0, idx) as SensorType,
    dbId: decoded.slice(idx + 1),
  };
}

export default async function SensorGatewayPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const decoded = decodeURIComponent(id);
  const { type, dbId } = parsePontoId(decoded);
  if (!dbId) notFound();

  if (type === "estacao") {
    const station = await prisma.sta.findUnique({
      where: { codSta: dbId },
      select: { codSta: true },
    });
    if (!station) notFound();

    redirect(`/dashboard/estacao/${station.codSta}`);
  }

  if (type === "horimetro") {
    redirect(`/dashboard/horimetro/${dbId}`);
  }

  if (type === "nivelador") {
    redirect(`/dashboard/nivelador/${dbId}`);
  }

  // sem prefixo: tenta estação por compatibilidade
  const station = await prisma.sta.findUnique({
    where: { codSta: dbId },
    select: { codSta: true },
  });
  if (station) redirect(`/dashboard/estacao/${station.codSta}`);

  notFound();
}