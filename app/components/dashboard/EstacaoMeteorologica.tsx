import { prisma } from "@/lib/prisma";
import { tempoToDate, formatDateBR } from "@/lib/utils";


function format1(v: number | null) {
  if (v == null) return "—";
  return v.toFixed(1);
}

export default async function EstacaoMeteorologicaDashboard({
  sensorId,
}: {
  sensorId: string;
}) {
  // sensorId aqui deve ser o codSta REAL (ex.: "M00002"), sem prefixo.
  const station = await prisma.sta.findUnique({
    where: { codSta: sensorId },
    select: {
      codSta: true,
      nomeSta: true,
      aliasSta: true,
    },
  });

  if (!station) {
    return (
      <section className="p-6">
        <h2 className="text-lg font-semibold">Estação não encontrada</h2>
        <p className="text-sm text-slate-600">ID: {sensorId}</p>
      </section>
    );
  }

  // TESTE: traz as últimas 200 leituras (ajuste como quiser)
  const rows = await prisma.data.findMany({
    where: { codSta: sensorId },
    orderBy: { ts: "desc" },
    take: 200,
    select: {
      ts: true,
      pulsos: true,
      tempAvg: true,
      tempMin: true,
      tempMax: true,
      preAvg: true,
      preMin: true,
      preMax: true,
      umiAvg: true,
      umiMin: true,
      umiMax: true,
      lumAvg: true,
      lumMin: true,
      lumMax: true,
      vvAvg: true,
      vvMin: true,
      vvMax: true,
      dv: true,
    },
  });

  return (
    <section className="p-6 space-y-4">
      <header>
        <h2 className="text-lg font-semibold">Dashboard da Estação Meteorológica</h2>
        <p className="text-sm text-slate-600">
          {station.aliasSta ?? station.nomeSta ?? station.codSta} (ID: {station.codSta})
        </p>
        <p className="text-xs text-slate-500">Mostrando {rows.length} leituras (mais recentes primeiro)</p>
      </header>

      <div className="overflow-auto border rounded-md">
        <table className="min-w-[1100px] w-full text-sm">
          <thead className="sticky top-0 bg-white border-b">
            <tr className="text-left">
              <th className="p-2">ts</th>
              <th className="p-2">Data/Hora</th>
              <th className="p-2">Temp Avg</th>
              <th className="p-2">Temp Min</th>
              <th className="p-2">Temp Max</th>
              <th className="p-2">Umi Avg</th>
              <th className="p-2">Pre Avg</th>
              <th className="p-2">Lum Avg</th>
              <th className="p-2">VV Avg</th>
              <th className="p-2">DV</th>
              <th className="p-2">Pulsos</th>
            </tr>
          </thead>

          <tbody>
            {rows.map(r => {
              const tsString = r.ts.toString();
              const dt = tempoToDate(tsString);

              return (
                <tr key={tsString} className="border-b last:border-b-0">
                  <td className="p-2 font-mono text-xs">{tsString}</td>
                  <td className="p-2 font-mono text-xs">{formatDateBR(dt)}</td>
                  <td className="p-2">{format1(r.tempAvg)}</td>
                  <td className="p-2">{format1(r.tempMin)}</td>
                  <td className="p-2">{format1(r.tempMax)}</td>
                  <td className="p-2">{format1(r.umiAvg)}</td>
                  <td className="p-2">{format1(r.preAvg)}</td>
                  <td className="p-2">{format1(r.lumAvg)}</td>
                  <td className="p-2">{format1(r.vvAvg)}</td>
                  <td className="p-2">{r.dv ?? "—"}</td>
                  <td className="p-2">{r.pulsos ?? "—"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}