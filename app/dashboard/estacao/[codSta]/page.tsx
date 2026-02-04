export default async function EstacaoDashboardTestPage({
  params,
}: {
  params: Promise<{ codSta: string }>;
}) {
  const resolvedParams = await params;
  const { codSta } = resolvedParams;

  return (
    <main className="p-6">
      <h1 className="text-xl font-semibold">Dashboard estação (teste)</h1>
      <p className="mt-2">
        <strong>codSta:</strong> {codSta}
      </p>

      <pre className="mt-4 rounded bg-slate-100 p-3 text-sm">
        {JSON.stringify(resolvedParams, null, 2)}
      </pre>
    </main>
  );
}