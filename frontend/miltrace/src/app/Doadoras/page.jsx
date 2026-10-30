"use client";

import { useState } from "react";
import Link from "next/link";
import Sidebar from "@/components/Sidebar/sidebar";
import {
  mockTriagens,
  formatCPF,
  formatPhone,
} from "@/data/mockTriagens";

export default function DoadorasPage() {
  // Conectar: carregar com trialService.getAll() e excluir com trialService.remove(id)
  const [doadoras, setDoadoras] = useState(mockTriagens);
  const [busca, setBusca] = useState("");

  const termo = busca.trim().toLowerCase();
  const termoNumerico = termo.replace(/\D/g, "");

  const filtradas = doadoras.filter(
    (doadora) =>
      doadora.full_name.toLowerCase().includes(termo) ||
      (termoNumerico && doadora.cpf?.includes(termoNumerico))
  );

  function handleDelete(id) {
    if (!window.confirm("Deseja realmente excluir esta doadora?")) return;

    setDoadoras((prev) => prev.filter((doadora) => doadora.id !== id));
  }

  return (
    <div className="min-h-screen bg-slate-50">

      <Sidebar />

      {/* Conteúdo principal */}
      <main className="ml-64 min-h-screen px-10 py-9">

        <div className="mx-auto max-w-7xl">

          {/* Cabeçalho */}
          <section className="mb-9 flex flex-wrap items-end justify-between gap-4 animate-fade-up">
            <div>
              <h1 className="text-3xl font-bold text-slate-800">
                Doadoras
              </h1>

              <p className="mt-2 text-slate-500">
                Consulte e gerencie as doadoras cadastradas.
              </p>
            </div>

            <Link
              href="/Triagem"
              className="rounded-lg bg-blue-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-blue-600 hover:shadow-md active:translate-y-0 active:scale-[0.98]"
            >
              ✚ Nova triagem
            </Link>
          </section>


          {/* Lista de doadoras */}
          <section
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm animate-fade-up"
            style={{ "--i": 3 }}
          >

            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 px-7 py-5">
              <div>
                <h2 className="text-lg font-semibold text-slate-800">
                  Doadoras Cadastradas
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  {filtradas.length} de {doadoras.length} doadoras
                </p>
              </div>

              <div className="relative w-full max-w-xs">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  ⌕
                </span>

                <input
                  type="text"
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  placeholder="Buscar por nome ou CPF"
                  className="w-full rounded-lg border border-slate-200 py-2.5 pl-9 pr-3 text-sm text-slate-700 outline-none transition focus:border-blue-500"
                />
              </div>
            </div>


            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="bg-slate-50">

                  <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                    <th className="px-7 py-4">ID da Doadora</th>
                    <th className="px-7 py-4">Nome</th>
                    <th className="px-7 py-4">CPF</th>
                    <th className="px-7 py-4">Telefone</th>
                    <th className="px-7 py-4">Zona</th>
                    <th className="px-7 py-4 text-right">Ação</th>
                  </tr>

                </thead>


                <tbody className="divide-y divide-slate-100">

                  {filtradas.map((doadora, index) => (

                    <tr
                      key={doadora.id}
                      className="animate-fade-in transition-colors hover:bg-slate-50"
                      style={{ "--i": index }}
                    >

                      <td className="px-7 py-5 text-sm font-semibold text-slate-700">
                        {doadora.id}
                      </td>

                      <td className="px-7 py-5 text-sm font-medium text-slate-600">
                        {doadora.full_name}
                      </td>

                      <td className="px-7 py-5 text-sm text-slate-500">
                        {formatCPF(doadora.cpf)}
                      </td>

                      <td className="px-7 py-5 text-sm text-slate-500">
                        {formatPhone(doadora.telephone_number)}
                      </td>

                      <td className="px-7 py-5">
                        <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold capitalize text-blue-600">
                          {doadora.zone?.toLowerCase() || "—"}
                        </span>
                      </td>

                      <td className="px-7 py-5 text-right">
                        <div className="flex justify-end gap-4">
                          <Link
                            href={`/Doadoras/${doadora.id}`}
                            className="text-sm font-semibold text-blue-500 transition hover:text-blue-700"
                          >
                            Visualizar
                          </Link>

                          <button
                            onClick={() => handleDelete(doadora.id)}
                            className="text-sm font-semibold text-red-400 transition hover:text-red-600"
                          >
                            Excluir
                          </button>
                        </div>
                      </td>

                    </tr>

                  ))}

                  {filtradas.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-7 py-10 text-center text-sm text-slate-400"
                      >
                        Nenhuma doadora encontrada.
                      </td>
                    </tr>
                  )}

                </tbody>

              </table>

            </div>

          </section>

        </div>

      </main>

    </div>
  );
}
