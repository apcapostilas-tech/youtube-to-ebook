"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Loader } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) { setError("As senhas não coincidem."); return; }
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    setLoading(false);
    if (!data.ok) { setError(data.error); return; }
    router.push("/login?registered=1");
  };

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center mb-4">
            <BookOpen size={18} />
          </div>
          <h1 className="text-2xl font-black">Criar conta</h1>
          <p className="text-white/40 text-sm mt-1">Use o email da sua compra</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            required
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-red-500/50 transition-colors"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Criar senha (mín. 6 caracteres)"
            required
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-red-500/50 transition-colors"
          />
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Confirmar senha"
            required
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-red-500/50 transition-colors"
          />

          {error && <p className="text-red-400 text-sm px-1">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 transition-all cursor-pointer"
          >
            {loading ? <><Loader size={16} className="animate-spin" /> Registrando...</> : "Criar minha conta"}
          </button>
        </form>

        <p className="text-center text-white/30 text-sm mt-6">
          Já tem conta?{" "}
          <a href="/login" className="text-orange-400 hover:text-orange-300 transition-colors">Entrar</a>
        </p>
      </div>
    </main>
  );
}
