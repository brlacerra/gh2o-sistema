export default function NiveladorDashboard( {sensorId} : {sensorId: string}) {
    return (
        <section>
            <h2>Dashboard do Nivelador</h2>
            <p>ID do Sensor: {sensorId}</p>
        </section>
    );
}