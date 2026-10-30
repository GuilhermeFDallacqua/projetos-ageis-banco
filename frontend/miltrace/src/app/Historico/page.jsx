"use client";

import { useState } from "react";
import Link from "next/link";
import Sidebar from "@/components/Sidebar/sidebar";
import {
  mockTriagens,
  formatDate,
  formatTime,
} from "@/data/mockTriagens";

const filtros = ["Todas", "Concluída", "Em andamento"];

export default function HistoricoPage() {
  // Conectar: carregar com trialService.getAll()
  const [triagens] = useState(mockTriagens);
  const [filtro, setFiltro] = useState("Todas");

  const filtradas = triagens.filter(
    (triagem) => filtro === "Todas" || triagem.status === filtro
  );

  return (
    <div className="min-h-screen bg-slate-50">

      <Sidebar />

      {/* Conteúdo principal */}
      <main className="ml-64 min-h-screen px-10 py-9">

        <div className="mx-auto max-w-7xl">

          {/* Cabeçalho */}
          <section className="mb-9 animate-fade-up">
            <h1 className="text-3xl font-bold text-slate-800">
              Histórico
            </h1>

            <p className="mt-2 text-slate-500">
              Todas as triagens realizadas no banco de leite.
            </p>
          </section>


          {/* Resumo */}
          <section className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {filtros.map((item) => {
              const total =
                item === "Todas"
                  ? triagens.length
                  : triagens.filter((t) => t.status === item).length;

              return (
                <div
                  key={item}
                  className="animate-fade-up rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md"
                  style={{ "--i": filtros.indexOf(item) + 1 }}
                >
                  <p className="text-sm text-slate-500">
                    {item === "Todas" ? "Total de triagens" : item}
                  </p>

                  <p className="mt-2 text-3xl font-bold text-slate-800">
                    {total}
                  </p>
                </div>
              );
            })}
          </section>


          {/* Lista */}
          <section
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm animate-fade-up"
            style={{ "--i": 3 }}
          >

            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 px-7 py-5">
              <div>
                <h2 className="text-lg font-semibold text-slate-800">
                  Triagens
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  Filtre pelo status da triagem.
                </p>
              </div>

              <div className="flex gap-2">
                {filtros.map((item) => (
                  <button
                    key={item}
                    onClick={() => setFiltro(item)}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                      filtro === item
                        ? "bg-blue-50 text-blue-600"
                        : "text-slate-500 hover:bg-slate-50 hover:text-blue-600"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>


            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="bg-slate-50">

                  <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                    <th className="px-7 py-4">ID da Doadora</th>
                    <th className="px-7 py-4">Nome</th>
                    <th className="px-7 py-4">Data</th>
                    <th className="px-7 py-4">Horário</th>
                    <th className="px-7 py-4">Status</th>
                    <th className="px-7 py-4 text-right">Ação</th>
                  </tr>

                </thead>


                <tbody className="divide-y divide-slate-100">

                  {filtradas.map((triagem, index) => (

                    <tr
                      key={triagem.id}
                      className="animate-fade-in transition-colors hover:bg-slate-50"
                      style={{ "--i": index }}
                    >

                      <td className="px-7 py-5 text-sm font-semibold text-slate-700">
                        {triagem.id}
                      </td>

                      <td className="px-7 py-5 text-sm font-medium text-slate-600">
                        {triagem.full_name}
                      </td>

                      <td className="px-7 py-5 text-sm text-slate-500">
                        {formatDate(triagem.created_at)}
                      </td>

                      <td className="px-7 py-5 text-sm text-slate-500">
                        {formatTime(triagem.created_at)}
                      </td>

                      <td className="px-7 py-5">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            triagem.status === "Concluída"
                              ? "bg-green-50 text-green-600"
                              : "bg-orange-50 text-orange-500"
                          }`}
                        >
                          {triagem.status}
                        </span>
                      </td>

                      <td className="px-7 py-5 text-right">
                        <Link
                          href={`/Doadoras/${triagem.id}`}
                          className="text-sm font-semibold text-blue-500 transition hover:text-blue-700"
                        >
                          Visualizar
                        </Link>
                      </td>

                    </tr>

                  ))}

                  {filtradas.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-7 py-10 text-center text-sm text-slate-400"
                      >
                        Nenhuma triagem encontrada.
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
