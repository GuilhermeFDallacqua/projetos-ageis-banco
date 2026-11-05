import Link from "next/link";
import { Droplet } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-6 text-center">
      <div className="animate-fade-up mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500 text-white shadow-sm">
        <Droplet size={26} fill="currentColor" />
      </div>

      <h1 className="animate-fade-up text-3xl font-bold text-slate-800" style={{ "--i": 1 }}>
        Página não encontrada
      </h1>

      <p className="animate-fade-up mt-2 text-slate-500" style={{ "--i": 2 }}>
        O endereço acessado não existe ou foi removido.
      </p>

      <Link
        href="/"
        className="animate-fade-up mt-8 rounded-lg bg-blue-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-blue-600 hover:shadow-md"
        style={{ "--i": 3 }}
      >
        Voltar para o início
      </Link>
    </div>
  );
}
