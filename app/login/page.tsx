"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    password
                }),
            });

            if (!res.ok) {
                const json = (await res.json().catch(() => null)) as { error: string } | null;
                setError(json?.error || "Erro ao realizar o login");
                return;
            }

            router.push("/");
            router.refresh();

        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="min-h-screen flex items-center justify-center p-6">
            <form
                onSubmit={onSubmit}
                className="w-full max-w-md bg-white shadow-md border border-gray-400 p-6 space-y-4"
            >
                <h1 className="text-2xl font-semibold text-slate-800">Login</h1>

                <div className="space-y-1">
                    <label className="text-sm text-slate-700 ">Email</label>
                    <input
                        className="w-full border border-gray-400 px-3 py-2"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        autoComplete="email"
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-sm text-slate-700">Senha</label>
                    <input
                        className="w-full border border-gray-400 px-3 py-2"
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        autoComplete="current-password"
                    />
                </div>

                {error && (
                    <div className="text-sm text-red-600 border border-red-200 bg-red-50 p-2">
                        {error}
                    </div>
                )}

                <button
                    className="w-full px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-white disabled:opacity-60"
                    disabled={loading}
                    type="submit"
                >
                    {loading ? "Entrando..." : "Entrar"}
                </button>
            </form>
        </main>
    );
}