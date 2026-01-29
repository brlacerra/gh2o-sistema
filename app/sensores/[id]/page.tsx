import { notFound } from "next/navigation";
import { SENSORES_MOCK } from "@/app/lib/sensores-mock";
import { Ponto } from "@/app/components/FullScreenMap";


interface SensorPageProps {
    params: { id: string };
}


function getSensorById(id: string): Ponto | undefined {
  return SENSORES_MOCK.find(s => s.id === id);
}
export default async function SensorPage({ params }: SensorPageProps){

  const { id } = await params;
    const sensor = getSensorById(id);

    if (!sensor) {
        return notFound();
    }

    let dashboardView: React.ReactNode = null;

  if (sensor.tipo === "estacao") {
    dashboardView = (
      <div className="border rounded-md p-4">
        <h2 className="font-semibold mb-2">Dashboard Estação</h2>
        <p>Aqui vão os gráficos e dados completos da estação {sensor.nome}.</p>
      </div>
    );
  } else if (sensor.tipo === "horimetro") {
    dashboardView = (
      <div className="border rounded-md p-4">
        <h2 className="font-semibold mb-2">Dashboard Horímetro</h2>
        <p>Aqui vão os dados de uso/volume do horímetro {sensor.nome}.</p>
      </div>
    );
  } else if (sensor.tipo === "nivelador") {
    dashboardView = (
      <div className="border rounded-md p-4">
        <h2 className="font-semibold mb-2">Dashboard Nivelador</h2>
        <p>Aqui vão os dados de nível/alertas do nivelador {sensor.nome}.</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">

      <div className="max-w-6xl mx-auto pt-20 px-4">
        <header className="mb-6">
          <h1 className="text-xl font-semibold">
            Sensor {sensor.nome} (ID: {sensor.id})
          </h1>
          <p className="text-sm text-slate-400 capitalize">
            Tipo: {sensor.tipo}
          </p>
        </header>

        {dashboardView}
      </div>
    </main>
  );
}