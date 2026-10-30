"use client";

import { Suspense, useCallback, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Download, ChevronLeft, ChevronRight } from "lucide-react";

import PageLayout, { PageHeader } from "@/components/PageLayout/pageLayout";
import TrialTable from "@/components/TrialTable/trialTable";
import { SkeletonBlock } from "@/components/States/states";
import { useAsync } from "@/hooks/useAsync";
import { trialService } from "@/services/trialService";
import {
  sortByNewest,
  onlyDigits,
  formatDate,
  formatTime,
  formatCPF,
  formatZone,
  formatTrialCode,
  getTrialStatus,
} from "@/utils/format";

const periodos = [
  { value: "todas", label: "Todas", days: null },
  { value: "hoje", label: "Hoje", days: 0 },
  { value: "7", label: "7 dias", days: 7 },
  { value: "30", label: "30 dias", days: 30 },
];

const statusFiltros = [
  { value: "todos", label: "Todos os status" },
  { value: "pendente", label: "Pendentes" },
  { value: "aprovada", label: "Aprovadas" },
  { value: "recusada", label: "Recusadas" },
];

const statusOf = (trial) => (trial.status || "pendente").toLowerCase();

const POR_PAGINA = 10;

function inPeriod(trial, days) {
  if (days === null) return true;
  if (!trial.created_at) return false;

  const start = new Date();
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - days);

  return new Date(trial.created_at) >= start;
}

function exportCSV(trials) {
  const header = ["Código", "Doadora", "CPF", "Data", "Horário", "Zona", "Status", "Motivo da recusa"];
  const rows = trials.map((trial) => [
    formatTrialCode(trial.id),
    trial.full_name,
    formatCPF(trial.cpf),
    formatDate(trial.created_at),
    formatTime(trial.created_at),
    formatZone(trial.zone),
    getTrialStatus(trial.status).label,
    trial.rejection_reason || "",
  ]);

  const csv = [header, ...rows]
    .map((row) => row.map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`).join(";"))
    .join("\n");

  // BOM para o Excel reconhecer acentos
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `triagens-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export default function HistoricoPage() {
  return (
    <Suspense>
      <Historico />
    </Suspense>
  );
}

function Historico() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState(searchParams.get("status") || "todos");
  const [periodo, setPeriodo] = useState("todas");
  const [busca, setBusca] = useState("");
  const [pagina, setPagina] = useState(1);

  const loadTrials = useCallback(() => trialService.getAll(), []);
  const { data, loading, error, reload } = useAsync(loadTrials);

  const trials = sortByNewest(data || []);
  const days = periodos.find((item) => item.value === periodo).days;
  const termo = busca.trim().toLowerCase();
  const termoNumerico = onlyDigits(termo);

  const filtradas = trials.filter(
    (trial) =>
      inPeriod(trial, days) &&
      (status === "todos" || statusOf(trial) === status) &&
      (trial.full_name?.toLowerCase().includes(termo) ||
        (termoNumerico && trial.cpf?.includes(termoNumerico)))
  );

  const totalPaginas = Math.max(1, Math.ceil(filtradas.length / POR_PAGINA));
  const paginaAtual = Math.min(pagina, totalPaginas);
  const visiveis = filtradas.slice(
    (paginaAtual - 1) * POR_PAGINA,
    paginaAtual * POR_PAGINA
  );

  // Resumo do período por status (independe do filtro de status)
  const doPeriodo = trials.filter((trial) => inPeriod(trial, days));

  const resumo = [
    { value: "pendente", label: "Pendentes", color: "text-orange-500" },
    { value: "aprovada", label: "Aprovadas", color: "text-green-600" },
    { value: "recusada", label: "Recusadas", color: "text-red-500" },
  ].map((item) => ({
    ...item,
    total: doPeriodo.filter((trial) => statusOf(trial) === item.value).length,
  }));

  function changePeriod(value) {
    setPeriodo(value);
    setPagina(1);
  }

  return (
    <PageLayout>

      <PageHeader
        title="Histórico"
        description="Todas as triagens realizadas no banco de leite."
      >
        <button
          onClick={() => exportCSV(filtradas)}
          disabled={loading || filtradas.length === 0}
          className="flex items-center gap-2 rounded-lg border border-blue-500 px-5 py-3 text-sm font-semibold text-blue-500 transition duration-200 hover:-translate-y-0.5 hover:bg-blue-50 active:translate-y-0 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
        >
          <Download size={17} />
          Exportar CSV
        </button>
      </PageHeader>


      {/* Resumo */}
      <section className="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
        {resumo.map((item, index) => (
          <button
            key={item.label}
            onClick={() => {
              setStatus(status === item.value ? "todos" : item.value);
              setPagina(1);
            }}
            className={`animate-fade-up rounded-2xl border bg-white p-6 text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md ${
              status === item.value ? "border-blue-400 ring-4 ring-blue-50" : "border-slate-200"
            }`}
            style={{ "--i": index + 1 }}
          >
            <p className="text-sm text-slate-500">{item.label} no período</p>

            {loading ? (
              <SkeletonBlock className="mt-2 h-8 w-12" />
            ) : (
              <p className={`mt-2 text-3xl font-bold ${item.color}`}>
                {error ? "—" : item.total}
              </p>
            )}
          </button>
        ))}
      </section>


      {/* Lista */}
      <section
        className="animate-fade-up overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
        style={{ "--i": 4 }}
      >

        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 px-7 py-5">

          <div className="flex flex-wrap gap-2">
            {periodos.map((item) => (
              <button
                key={item.value}
                onClick={() => changePeriod(item.value)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  periodo === item.value
                    ? "bg-blue-50 text-blue-600"
                    : "text-slate-500 hover:bg-slate-50 hover:text-blue-600"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex w-full flex-wrap gap-3 sm:w-auto">
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPagina(1);
              }}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-600 outline-none transition focus:border-blue-500"
            >
              {statusFiltros.map((item) => (
                <option key={item.value} value={item.value}>{item.label}</option>
              ))}
            </select>

            <div className="relative w-full sm:w-64">
              <Search
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="search"
                value={busca}
                onChange={(e) => {
                  setBusca(e.target.value);
                  setPagina(1);
                }}
                placeholder="Buscar por nome ou CPF"
                className="w-full rounded-lg border border-slate-200 py-2.5 pl-9 pr-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
              />
            </div>
          </div>
        </div>

        <TrialTable
          trials={visiveis}
          loading={loading}
          error={error}
          onRetry={reload}
          emptyTitle="Nenhuma triagem encontrada"
          emptyDescription="Tente outro período ou termo de busca."
        />

        {!loading && !error && filtradas.length > POR_PAGINA && (
          <div className="flex items-center justify-between border-t border-slate-200 px-7 py-4 text-sm text-slate-500">
            <span>
              Página {paginaAtual} de {totalPaginas}
            </span>

            <div className="flex gap-2">
              <button
                onClick={() => setPagina(paginaAtual - 1)}
                disabled={paginaAtual === 1}
                className="rounded-lg border border-slate-200 p-2 transition hover:bg-slate-50 disabled:opacity-40"
                aria-label="Página anterior"
              >
                <ChevronLeft size={16} />
              </button>

              <button
                onClick={() => setPagina(paginaAtual + 1)}
                disabled={paginaAtual === totalPaginas}
                className="rounded-lg border border-slate-200 p-2 transition hover:bg-slate-50 disabled:opacity-40"
                aria-label="Próxima página"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

      </section>

    </PageLayout>
  );
}
