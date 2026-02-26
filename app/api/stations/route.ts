import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";

function jsonBigIntReplacer(_key: string, value: unknown) {
  return typeof value === "bigint" ? value.toString() : value;
}

export async function GET() {
  try {
    const user = await getCurrentUser();
    const where = !user
      ? { is_public: true }
      : user.role === "admin"
      ? {}
      : {
          OR: [ { is_public: true }, { codUsr: user.codUsr } ],
        };
    
    const stations = await prisma.sta.findMany({
      where,
      select: {
        codSta: true,
        nomeSta: true,
        aliasSta: true,
        latSta: true,
        longSta: true,
        resSta: true,
        perSta: true,
        is_public: true,
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

export async function POST(req: Request) {
  const user = await getCurrentUser();

  if(!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401});

  if(user.role !== "admin") return NextResponse.json({ error: "Forbidden"}, { status: 403});

  const body = await req.json();

  const {
    codSta,
    nomeSta,
    aliasSta,
    latSta,
    longSta,
    resSta,
    perSta,
    is_public,
    ownerCodUsr,
  } = body ?? {};

  if (!codSta || !nomeSta || latSta === undefined || longSta === undefined || ownerCodUsr === undefined) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
  }

  const station = await prisma.sta.create({
    data: {
      codSta: String(codSta),
      nomeSta: String(nomeSta),
      aliasSta: aliasSta ? String(aliasSta) : null,
      latSta: Number(latSta),
      longSta: Number(longSta),
      resSta: Number(resSta),
      perSta: Number(perSta),
      is_public: Boolean(is_public),
      codUsr: String(ownerCodUsr),
    }
  });

  return NextResponse.json({ station }, { status: 201 });
}