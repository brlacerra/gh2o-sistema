import { EstacaoSidebar } from "@/app/components/dashboard/shell/DashBoardNav";
import { NavbarClient } from "@/app/components/Navbar/NavbarClient";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function EstacaoLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ codSta: string }>;
}) {
  const { codSta } = await params;

  const station = await prisma.sta.findUnique({
    where: { codSta },
    select: {
      codSta: true,
      nomeSta: true,
      aliasSta: true,
      hasPulsos: true,
      hasTemp: true,
      hasUmidade: true,
      hasLum: true,
      hasPressao: true,
      hasVent: true,
      hasDv: true,
    },
  });

  if (!station) notFound();

  const stationLabel = station.aliasSta ?? station.nomeSta ?? station.codSta;

  return (
    <div className="min-h-screen bg-slate-50 overflow-hidden">
      <NavbarClient title={`Dashboard - ${stationLabel} ${station.codSta}`} />

      <div className="hidden md:block h-24" />

      <div className="flex flex-col md:flex-row min-h-[calc(100vh-96px)]">
        <div className="w-full md:w-[400px] md:shrink-0">
          <div className="md:sticky md:top-24 md:h-[calc(100vh-96px)]">
            <EstacaoSidebar
              codSta={station.codSta}
              stationLabel={stationLabel}
              capabilities={{
                hasPulsos: !!station.hasPulsos,
                hasTemp: !!station.hasTemp,
                hasUmidade: !!station.hasUmidade,
                hasLum: !!station.hasLum,
                hasPressao: !!station.hasPressao,
                hasVent: !!station.hasVent,
                hasDv: !!station.hasDv,
              }}
            />
          </div>
        </div>

        <main className="flex-1 min-w-0 p-6">{children}</main>
      </div>
    </div>
  );
}