import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function jsonBigIntReplacer(_key: string, value: unknown) {
  return typeof value === "bigint" ? value.toString() : value;
}

export async function GET() {
  try {
    const stations = await prisma.sta.findMany({
      where : { is_public: true },
      select: {
        codSta: true,
        nomeSta: true,
        aliasSta: true,
        latSta: true,
        longSta: true,
        resSta: true,
        perSta: true,
      },
      orderBy: { codSta: "asc" },
    });


    const latestByStation = await prisma.data.findMany({
      distinct: ["codSta"],
      orderBy: [{ codSta: "asc" }, { ts: "desc" }],
      select: {
        codSta: true,
        ts: true,
        pulsos: true,
        tempAvg: true,
        preAvg: true,
        umiAvg: true,
        lumAvg: true,
        vvAvg: true,
        dv: true,
      },
    });

    const latestMap = new Map(latestByStation.map(d => [d.codSta, d]));

    const data = stations.map(s => ({
      ...s,
      latestData: latestMap.get(s.codSta) ?? null,
    }));


    return new NextResponse(JSON.stringify({ data }, jsonBigIntReplacer), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch stations" },
      { status: 500 },
    );
  }
}