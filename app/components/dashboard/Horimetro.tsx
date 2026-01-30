export default function HorimetroDashBoard( {sensorId} : {sensorId: string}) {
    return (
        <section>
            <h2>Dashboard do Horímetro</h2>
            <p>ID do Sensor: {sensorId}</p>
        </section>
    );
}