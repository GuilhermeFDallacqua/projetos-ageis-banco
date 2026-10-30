"use client";

import { useState } from "react";
import {
  Droplet,
  Eye,
  EyeOff,
  Mail,
  Lock,
  ShieldCheck,
  ClipboardCheck,
  HeartHandshake,
} from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";
import { Spinner } from "@/components/States/states";
import { isValidEmail } from "@/utils/format";

const highlights = [
  { icon: ClipboardCheck, text: "Triagem guiada em etapas" },
  { icon: HeartHandshake, text: "Histórico completo de cada doadora" },
  { icon: ShieldCheck, text: "Dados protegidos e centralizados" },
];

export default function LoginPage() {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    if (!isValidEmail(email)) {
      setError("Informe um e-mail válido.");
      return;
    }

    if (!password) {
      setError("Informe sua senha.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await login(email, password);
    } catch (err) {
      setError(
        err.message === "Invalid login credentials"
          ? "E-mail ou senha incorretos."
          : err.message
      );
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-slate-50">

      {/* Painel de apresentação */}
      <section className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-gradient-to-br from-blue-500 to-blue-700 p-12 text-white lg:flex">

        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-white/5" />

        <div className="animate-fade-up relative flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
            <Droplet size={20} fill="currentColor" />
          </div>

          <span className="text-2xl font-bold">MilkTrace</span>
        </div>

        <div className="relative max-w-md">
          <h1
            className="animate-fade-up text-4xl font-bold leading-tight"
            style={{ "--i": 1 }}
          >
            Cada gota cuidada do início ao fim.
          </h1>

          <p
            className="animate-fade-up mt-4 text-blue-100"
            style={{ "--i": 2 }}
          >
            Sistema de triagem de doadoras do Banco de Leite Humano.
          </p>

          <ul className="mt-10 space-y-4">
            {highlights.map((item, index) => {
              const Icon = item.icon;

              return (
                <li
                  key={item.text}
                  className="animate-fade-up flex items-center gap-3"
                  style={{ "--i": index + 3 }}
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15">
                    <Icon size={18} />
                  </span>
                  {item.text}
                </li>
              );
            })}
          </ul>
        </div>

        <p className="relative text-sm text-blue-200">
          © {new Date().getFullYear()} MilkTrace
        </p>
      </section>


      {/* Formulário */}
      <section className="flex flex-1 items-center justify-center p-6">

        <form
          onSubmit={handleSubmit}
          noValidate
          className="animate-fade-up w-full max-w-sm"
        >
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500 text-white">
              <Droplet size={20} fill="currentColor" />
            </div>

            <span className="text-2xl font-bold text-slate-800">MilkTrace</span>
          </div>

          <h2 className="text-3xl font-bold text-slate-800">
            Bem-vindo(a)!
          </h2>

          <p className="mt-2 text-slate-500">
            Entre com sua conta para continuar.
          </p>

          <div className="mt-8 space-y-5">

            <label className="block">
              <span className="text-sm font-semibold text-slate-700">E-mail</span>

              <div className="relative mt-2">
                <Mail size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />

                <input
                  type="email"
                  autoComplete="email"
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full rounded-lg border border-slate-200 bg-white py-3 pl-10 pr-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                />
              </div>
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Senha</span>

              <div className="relative mt-2">
                <Lock size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />

                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Sua senha"
                  className="w-full rounded-lg border border-slate-200 bg-white py-3 pl-10 pr-11 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </label>

          </div>

          {error && (
            <p className="animate-fade-in mt-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-7 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-500 py-3 text-sm font-semibold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-blue-600 hover:shadow-md active:translate-y-0 active:scale-[0.98] disabled:translate-y-0 disabled:opacity-70"
          >
            {loading && <Spinner />}
            {loading ? "Entrando..." : "Entrar"}
          </button>

          <p className="mt-6 text-center text-xs text-slate-400">
            Não tem acesso? Solicite ao administrador do sistema.
          </p>
        </form>

      </section>
    </div>
  );
}
